<?php

namespace App\Controller;

use App\AppHelper\Helper;
use App\Entity\Account;
use App\Entity\SystemSettings;
use App\Entity\User;
use App\Form\RegistrationFormType;
use App\Message\Command\SaveEmail;
use App\Security\EmailVerifier;
use App\Security\LoginFormAuthenticator;
use App\Settings\Settings;
use Doctrine\DBAL\Exception;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Authentication\UserAuthenticatorInterface;
use Symfony\Component\Uid\UuidV1;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use SymfonyCasts\Bundle\VerifyEmail\Exception\VerifyEmailExceptionInterface;
use Symfony\Component\Yaml\Yaml;

class RegistrationController extends AbstractController
{
    use Settings;

    private array $logSettings;
    private array $appSettings;
    private array $emailSettings;
    private array $register;

    public function __construct(
        private readonly EmailVerifier          $emailVerifier,
        private readonly TranslatorInterface    $translator,
        private readonly EntityManagerInterface $em,
        private readonly LoggerInterface        $queueLogger,
        private readonly LoggerInterface        $registerLogger,
        private readonly ValidatorInterface     $validator,
        private readonly MessageBusInterface    $bus,
        private readonly MailerInterface        $mailer,
        private readonly string                 $projectDir
    )
    {
        $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
        $this->logSettings = $settings->getLog();
        $this->appSettings = $settings->getApp();
        $this->emailSettings = $settings->getEmail();
        $this->register = $settings->getRegister();
    }

    /**
     * @throws TransportExceptionInterface
     * @throws Exception
     */
    #[Route('/register', name: 'app_register')]
    public function register(Request $request, UserPasswordHasherInterface $userPasswordHasher, TranslatorInterface $translator, UserAuthenticatorInterface $userAuthenticator, LoginFormAuthenticator $authenticator, EntityManagerInterface $entityManager): Response
    {
        /* $user = new User();
         $form = $this->createForm(RegistrationFormType::class, $user);
         $form->handleRequest($request);
         $error = [];
         if ($form->isSubmitted() && $form->isValid()) {
             $isUser = $entityManager->getRepository(User::class)->findOneBy(['email' => $form->get('email')->getData()]);
             // encode the plain password
             $user->setPassword(
                 $userPasswordHasher->hashPassword(
                     $user,
                     $form->get('plainPassword')->getData()
                 )
             );
             $uuid = new UuidV1();
             $user->setUuid($uuid);
             $user->setIsVerified(false);
             $entityManager->persist($user);
             $entityManager->flush();

             $clientId = $uuid->toBase32();
             $publicVoter = $this->user_voter(null, 1);
             $voter = [];
             foreach ($publicVoter as $tmp) {
                 $voter[] = $tmp['role'];
             }

             $userAccount = new Account();
             $userAccount->setAccountHolder($user);
             $userAccount->setVoter($voter);
             $userAccount->setMustValidated(false);
             $userAccount->setChangePw(true);
             $userAccount->setRegisterIp($request->getClientIp());
             $this->em->persist($userAccount);
             $this->em->flush();

             $helper = Helper::instance();
             $redirectUris = 'http://localhost:8080/callback';
             $grantTypes = ['authorization_code', 'refresh_token', 'client_credentials'];
             $clientSecret = $helper->generate_callback_pw(128, 0, 64);
             $oauthConf = $this->projectDir . '/config/packages/league_oauth2_server.yaml';
             $parsed = Yaml::parse(file_get_contents($oauthConf));
             $defScopes = $parsed['league_oauth2_server']['scopes']['default'];
             $conn = $this->em->getConnection();
             $conn->insert('oauth2_client', [
                 'identifier' => $clientId,
                 'secret' => $clientSecret,
                 'name' => 'App client',
                 'redirect_uris' => $redirectUris,
                 'grants' => implode(' ', $grantTypes),
                 'scopes' => implode(' ', $defScopes),
                 'active' => 1,
                 'allow_plain_text_pkce' => 0,
             ]);

             // generate a signed url and email it to the user
             $this->emailVerifier->sendEmailConfirmation('app_verify_email', $user,
                 (new TemplatedEmail())
                     ->from(new Address($this->appSettings['admin_email'], $this->appSettings['site_name']))
                     ->to($user->getEmail())
                     ->subject($this->translator->trans('register.Please Confirm your Email'))
                     ->htmlTemplate('registration/confirmation_email.html.twig')
             );

             if ($this->logSettings['register']) {
                 $this->queueLogger->info($user->getEmail() . ' - ' . $this->translator->trans('log.New registration'), [
                     'type' => 'register',
                     'account' => $user->getEmail(),
                     'ip' => $request->getClientIp()
                 ]);
             }
             // do anything else you need here, like send an email
             if (!$user->isVerified()) {
                 return $userAuthenticator->authenticateUser(
                     $user,
                     $authenticator,
                     $request
                 );
             } else {
                return $this->redirectToRoute('app_after_email');
             }

         }*/

        $regform = $this->createFormBuilder()
            ->add('email', EmailType::class, [
                'constraints' => [new NotBlank(), new Email(
                    [
                        'message' => $this->translator->trans('register.The email {{ value }} is not a valid email address.'),
                        'mode' => 'strict',
                    ]
                )],
                'label_attr' => [
                    'class' => 'ms-1'
                ],
                'label' => $this->translator->trans('login.Email'),
                'label_html' => true,
                'row_attr' => [
                    'class' => 'form-floating col-12'
                ],
                'attr' => [
                    'autocomplete' => 'email',
                    'autofocus' => false,
                    'class' => 'no-blur',
                    'placeholder' => $this->translator->trans('login.Email'),
                ]
            ])
            ->add('plainPassword', RepeatedType::class, [
                'type' => PasswordType::class,
                'mapped' => false,
                'required' => true,
                'constraints' => [new NotBlank(),
                    new Length([
                            'min' => 8,
                            'max' => 4096,
                            'minMessage' => $this->translator->trans('register.The password must be at least {{ limit }} characters long'),
                        ]
                    )],
                'first_options' => [
                    'label' => $this->translator->trans('login.Password') . ' <sup class="small-lg">(min 8)</sup>',
                    'label_html' => true,
                    'label_attr' => [
                        'class' => 'ms-1'
                    ],
                    'row_attr' => [
                        'class' => 'form-floating col-xl-6 col-12'
                    ],
                    'attr' => [
                        'class' => 'no-blur',
                        'placeholder' => $this->translator->trans('login.Password'),
                        'min' => 8,
                        'max' => 4096,
                        'autocomplete' => 'new-password'
                    ],
                ],
                'second_options' => [
                    'label' => $this->translator->trans('register.Repeat password') . ' <sup class="small-lg">(min 8)</sup>',
                    'label_html' => true,
                    'label_attr' => [
                        'class' => 'ms-1'
                    ],
                    'row_attr' => [
                        'class' => 'form-floating col-xl-6 col-12 mb-3'
                    ],
                    'attr' => [
                        'class' => 'no-blur',
                        'placeholder' => $this->translator->trans('register.Repeat password'),
                        'autocomplete' => 'new-password'
                    ],
                ],
            ])
            ->add('register_btn', SubmitType::class, [
                'label' => '<i class="bi bi-person-add me-2"></i>' . $this->translator->trans('register.Register'),
                'label_html' => true,
                'attr' => [
                    'class' => 'btn-secondary dark no-blur'
                ]
            ])
            ->getForm();

        if ($this->register['show_company']) {
            $this->register['show_company'] == 1 ? $required = false : $required = true;
            $regform->add('company', TextType::class, [
                'required' => $required,
                'label_attr' => [
                    'class' => 'ms-1'
                ],
                'label' => $this->translator->trans('reg.Company/Organisation'),
                'label_html' => true,
                'row_attr' => [
                    'class' => 'form-floating col-xl-6 col-12'
                ],
                'attr' => [
                    'autocomplete' => 'organization',
                    'class' => 'no-blur',
                    'placeholder' => $this->translator->trans('reg.Company/Organisation'),
                ]
            ]);
        }
        if ($this->register['show_title']) {
            $this->register['show_title'] == 1 ? $required = false : $required = true;

            $regform->add('title', TextType::class, [
                'required' => $required,
                'label_attr' => [
                    'class' => 'ms-1'
                ],
                'label' => $this->translator->trans('reg.Title'),
                'label_html' => true,
                'row_attr' => [
                    'class' => 'form-floating col-xl-6 col-12'
                ],
                'attr' => [
                    'autocomplete' => 'honorific-prefix',
                    'class' => 'no-blur',
                    'placeholder' => $this->translator->trans('reg.Title'),
                ]
            ]);
        }
        if ($this->register['show_name']) {
            $this->register['show_name'] == 1 ? $required = false : $required = true;
            $regform->add('first_name', TextType::class, [
                'required' => $required,
                'label_attr' => [
                    'class' => 'ms-1'
                ],
                'label' => $this->translator->trans('reg.First name'),
                'label_html' => true,
                'row_attr' => [
                    'class' => 'form-floating col-xl-6 col-12'
                ],
                'attr' => [
                    'autocomplete' => 'given-name',
                    'class' => 'no-blur',
                    'placeholder' => $this->translator->trans('reg.First name'),
                ]
            ])
                ->add('last_name', TextType::class, [
                    'required' => $required,
                    'label_attr' => [
                        'class' => 'ms-1'
                    ],
                    'label' => $this->translator->trans('reg.Last name'),
                    'label_html' => true,
                    'row_attr' => [
                        'class' => 'form-floating col-xl-6 col-12'
                    ],
                    'attr' => [
                        'autocomplete' => 'given-name',
                        'class' => 'no-blur',
                        'placeholder' => $this->translator->trans('reg.Last name'),
                    ]
                ]);
        }
        if ($this->register['show_street']) {
            $this->register['show_street'] == 1 ? $required = false : $required = true;
            $regform->add('street', TextType::class, [
                'required' => $required,
                'label_attr' => [
                    'class' => 'ms-1'
                ],
                'label' => $this->translator->trans('reg.Street'),
                'label_html' => true,
                'row_attr' => [
                    'class' => 'form-floating col-xl-9 col-lg-6 col-12'
                ],
                'attr' => [
                    'autocomplete' => 'street-address',
                    'class' => 'no-blur',
                    'placeholder' => $this->translator->trans('reg.Street'),
                ]
            ])
                ->add('hnr', TextType::class, [
                    'required' => $required,
                    'label_attr' => [
                        'class' => 'ms-1'
                    ],
                    'label' => $this->translator->trans('reg.House number'),
                    'label_html' => true,
                    'row_attr' => [
                        'class' => 'form-floating col-xl-3 col-lg-9 col-12'
                    ],
                    'attr' => [
                        'autocomplete' => 'address-level4',
                        'class' => 'no-blur',
                        'placeholder' => $this->translator->trans('reg.House number'),
                    ]
                ]);
        }
        if ($this->register['show_city']) {
            $this->register['show_city'] == 1 ? $required = false : $required = true;
            $regform->add('zip', TextType::class, [
                'required' => $required,
                'label_attr' => [
                    'class' => 'ms-1'
                ],
                'label' => $this->translator->trans('reg.ZIP'),
                'label_html' => true,
                'row_attr' => [
                    'class' => 'form-floating col-xl-3 col-lg-6 col-12'
                ],
                'attr' => [
                    'autocomplete' => 'postal-code',
                    'class' => 'no-blur',
                    'placeholder' => $this->translator->trans('reg.ZIP'),
                ]
            ])
                ->add('country', TextType::class, [
                    'required' => $required,
                    'label_attr' => [
                        'class' => 'ms-1'
                    ],
                    'label' => $this->translator->trans('reg.City'),
                    'label_html' => true,
                    'row_attr' => [
                        'class' => 'form-floating col-xl-9 col-lg-6 col-12'
                    ],
                    'attr' => [
                        'autocomplete' => 'address-line1',
                        'class' => 'no-blur',
                        'placeholder' => $this->translator->trans('reg.City'),
                    ]
                ]);

            if ($this->register['show_phone']) {
                $this->register['show_phone'] == 1 ? $required = false : $required = true;
                $regform->add('phone', TextType::class, [
                    'required' => $required,
                    'label_attr' => [
                        'class' => 'ms-1'
                    ],
                    'label' => $this->translator->trans('reg.Telephone number'),
                    'label_html' => true,
                    'row_attr' => [
                        'class' => 'form-floating col-xl-6 col-12'
                    ],
                    'attr' => [
                        'autocomplete' => 'tel-local',
                        'class' => 'no-blur',
                        'placeholder' => $this->translator->trans('reg.Telephone number'),
                    ]
                ]);
            }
            if ($this->register['show_mobile']) {
                $this->register['show_mobile'] == 1 ? $required = false : $required = true;
                $regform->add('mobile', TextType::class, [
                    'required' => $required,
                    'label_attr' => [
                        'class' => 'ms-1'
                    ],
                    'label' => $this->translator->trans('reg.Mobile'),
                    'label_html' => true,
                    'row_attr' => [
                        'class' => 'form-floating col-xl-6 col-12'
                    ],
                    'attr' => [
                        'autocomplete' => 'tel',
                        'class' => 'no-blur',
                        'placeholder' => $this->translator->trans('reg.Mobile'),
                    ]
                ]);
            }
        }
        $regform->handleRequest($request);
        if ($regform->isSubmitted() && $regform->isValid()) {
            $form = $regform->getData();
            $checkEmail = $this->em->getRepository(User::class)->findOneBy(['email' => $form['email']]);
            if ($checkEmail) {
                $this->addFlash('verify_email_error', sprintf($this->translator->trans('reg.Email address cannot be used!'), $form['email']));
                return $this->render('registration/register.html.twig', [
                    'title' => $this->translator->trans('Registration'),
                    'registrationForm' => $regform->createView(),
                ]);
            }

            $user = new User();
            if ($this->register['leak_checker']) {
                $user->setRawPassword($regform->get('plainPassword')->getData());
                $errors = $this->validator->validate($user);
                if (count($errors) > 0) {
                    foreach ($errors as $err) {
                        $this->addFlash('verify_email_error', $err->getMessage());
                    }
                    return $this->render('registration/register.html.twig', [
                        'title' => $this->translator->trans('Registration'),
                        'registrationForm' => $regform->createView(),
                    ]);
                }
            }
            $user->setPassword(
                $userPasswordHasher->hashPassword(
                    $user,
                    $regform->get('plainPassword')->getData()
                )
            );
            if ($this->register['registration_method'] == 3) {
                $isVerified = true;
            } else {
                $isVerified = false;
            }
            $uuid = new UuidV1();
            $user->setUuid($uuid);
            $user->setEmail($form['email']);
            $user->setIsVerified($isVerified);
            $entityManager->persist($user);
            $entityManager->flush();

            $clientId = $uuid->toBase32();
            $publicVoter = $this->user_voter(null, 1);
            $voter = [];
            foreach ($publicVoter as $tmp) {
                $voter[] = $tmp['role'];
            }
            $userAccount = new Account();
            $userAccount->setAccountHolder($user);
            $userAccount->setVoter($voter);

            if ($this->register['show_company']) {
                $userAccount->setCompany($form['company']);
            }
            if ($this->register['show_title']) {
                $userAccount->setTitle($form['title']);
            }
            if ($this->register['show_name']) {
                $userAccount->setFirstName($form['first_name']);
                $userAccount->setLastName($form['last_name']);
            }
            if ($this->register['show_street']) {
                $userAccount->setStreet($form['street']);
                $userAccount->setHnr($form['hnr']);
            }
            if ($this->register['show_city']) {
                $userAccount->setZip($form['zip']);
                $userAccount->setCountry($form['country']);
            }
            if ($this->register['show_phone']) {
                $userAccount->setPhone($form['phone']);
            }
            if ($this->register['show_mobile']) {
                $userAccount->setMobil($form['mobile']);
            }

            if ($this->register['registration_method'] == 2) {
                $mustValidated = true;
            } else {
                $mustValidated = false;
            }
            $userAccount->setMustValidated($mustValidated);
            $userAccount->setChangePw(true);
            $userAccount->setRegisterIp($request->getClientIp());

            $this->em->persist($userAccount);
            $this->em->flush();

            $helper = Helper::instance();
            $redirectUris = 'http://localhost:8080/callback';
            $grantTypes = ['authorization_code', 'refresh_token', 'client_credentials'];
            $clientSecret = $helper->generate_callback_pw(128, 0, 64);
            $oauthConf = $this->projectDir . '/config/packages/league_oauth2_server.yaml';
            $parsed = Yaml::parse(file_get_contents($oauthConf));
            $defScopes = $parsed['league_oauth2_server']['scopes']['default'];
            $conn = $this->em->getConnection();
            $conn->insert('oauth2_client', [
                'identifier' => $clientId,
                'secret' => $clientSecret,
                'name' => 'App client',
                'redirect_uris' => $redirectUris,
                'grants' => implode(' ', $grantTypes),
                'scopes' => implode(' ', $defScopes),
                'active' => 1,
                'allow_plain_text_pkce' => 0,
            ]);

            // generate a signed url and email it to the user
            if ($this->register['registration_method'] == 1) {
                $verEmail = (new TemplatedEmail())
                    ->from(new Address($this->appSettings['admin_email'], $this->appSettings['site_name']))
                    ->to($user->getEmail())
                    ->subject($this->translator->trans('register.Please Confirm your Email'))
                    ->htmlTemplate('registration/confirmation_email.html.twig');

                if (filter_var($this->emailSettings['reply_to'], FILTER_VALIDATE_EMAIL)) {
                    $verEmail->replyTo($this->emailSettings['reply_to']);
                }

                $this->emailVerifier->sendEmailConfirmation('app_verify_email', $user, $verEmail);
            }

            if ($this->logSettings['register']) {
                $this->registerLogger->info($user->getEmail() . ' - ' . $this->translator->trans('log.New registration'), [
                    'type' => 'register',
                    'account' => $user->getEmail(),
                    'ip' => $request->getClientIp()
                ]);
            }

            if ($this->register['send_notification'] && filter_var($this->register['email_notification'], FILTER_VALIDATE_EMAIL)) {
                $email = (new TemplatedEmail())
                    ->from(new Address($this->appSettings['admin_email'], $this->appSettings['site_name']))
                    ->to($this->register['email_notification'])
                    ->subject($this->translator->trans('log.New registration'))
                    ->htmlTemplate('email_template/send-system-email.html.twig')
                    ->context(['content' => $this->translator->trans('log.New registration')]);
                if (filter_var($this->emailSettings['reply_to'], FILTER_VALIDATE_EMAIL)) {
                    $email->replyTo($this->emailSettings['reply_to']);
                }
                $this->mailer->send($email);
            }


            // do anything else you need here, like send an email
            if (!$user->isVerified()) {
                if ($this->register['registration_method'] == 1) {
                    $this->addFlash('sendemail-message', $translator->trans('After confirming the email, your account will be activated.'));
                }
                if ($this->register['registration_method'] == 2) {
                    $this->addFlash('sendemail-message', $translator->trans('Your account will be activated after verification.'));
                    return $this->render('public/account-not-activated.html.twig', [
                        'title' => $this->appSettings['site_name'],
                    ]);
                }
                //Nach der Bestätigung der E-Mail, wird Ihr Konto aktiviert.
                return $userAuthenticator->authenticateUser(
                    $user,
                    $authenticator,
                    $request
                );
            } else {
                return $this->redirectToRoute('app_after_register');
            }
        }

        return $this->render('registration/register.html.twig', [
            'registrationForm' => $regform->createView(),
        ]);
    }

    #[Route('/registered', name: 'app_after_register')]
    public function after_email_send(): Response
    {
        return $this->render('registration/konto-verified.html.twig', [
            'title' => 'Konto aktiviert',
        ]);
    }

    #[Route('/verify/email', name: 'app_verify_email')]
    public function verifyUserEmail(Request $request, TranslatorInterface $translator): Response
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');
        // validate email confirmation link, sets User::isVerified=true and persists
        /** @var User $user */
        $user = $this->getUser();
        try {
            $this->emailVerifier->handleEmailConfirmation($request, $this->getUser());

        } catch (VerifyEmailExceptionInterface $exception) {
            $this->addFlash('verify_email_error', $translator->trans($exception->getReason(), [], 'VerifyEmailBundle'));
            if ($this->logSettings['account_activated']) {
                $this->queueLogger->info($user->getEmail() . ' - ' . $translator->trans($exception->getReason(), [], 'VerifyEmailBundle'), [
                    'type' => 'account_activated_error',
                    'account' => $user->getEmail(),
                    'ip' => $request->getClientIp()
                ]);
            }
            return $this->redirectToRoute('app_register');
        }

        if ($this->logSettings['account_activated']) {
            $this->queueLogger->info($user->getEmail() . ' - ' . $this->translator->trans('log.Account was activated by e-mail'), [
                'type' => 'account_activated',
                'account' => $user->getEmail(),
                'ip' => $request->getClientIp()
            ]);
        }

        // @TODO Change the redirect on success and handle or remove the flash message in your templates
        $this->addFlash('activated-message', $translator->trans('register.Your email address has been verified.'));

        return $this->redirectToRoute('app_dashboard');
    }
}

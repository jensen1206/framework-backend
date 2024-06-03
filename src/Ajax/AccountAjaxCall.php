<?php

namespace App\Ajax;

use App\AppHelper\EmHelper;
use App\AppHelper\Helper;
use App\Entity\Account;
use App\Entity\Log;
use App\Entity\Media;
use App\Entity\MediaCategory;
use App\Entity\OAuth2UserConsent;
use App\Entity\SystemSettings;
use App\Entity\User;
use App\Message\Command\SaveEmail;
use App\Service\UploaderHelper;
use App\Settings\Settings;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Query\Expr\Join;
use Exception;
use League\Bundle\OAuth2ServerBundle\Model\Client as clientModel;
use League\Flysystem\FilesystemException;
use Psr\Log\LoggerInterface;
use Pyrrah\GravatarBundle\GravatarApi;
use Scheb\TwoFactorBundle\Security\TwoFactor\Provider\Totp\TotpAuthenticatorInterface;
use stdClass;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Uid\UuidV1;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class AccountAjaxCall
{
    protected object $responseJson;
    private bool $account_show;
    private bool $account_delete;
    private bool $account_edit;
    private bool $edit_roles;
    private bool $manage_api;
    private bool $edit_grants;
    private bool $manage_account;
    private bool $add_account;
    private bool $manage_authorisation;
    private Account $account;
    protected Request $data;
    use Settings;


    public function __construct(
        private readonly EntityManagerInterface      $em,
        private readonly TokenStorageInterface       $tokenStorage,
        private readonly TotpAuthenticatorInterface  $totpAuthenticator,
        private readonly TranslatorInterface         $translator,
        private readonly Security                    $security,
        private readonly UploaderHelper              $uploaderHelper,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly ValidatorInterface          $validator,
        private readonly UrlGeneratorInterface       $urlGenerator,
        private readonly MailerInterface             $mailer,
        private readonly MessageBusInterface         $bus,
        private readonly LoggerInterface             $queueLogger,
        private readonly EmHelper                    $emHelper,
        private readonly string                      $siteName
    )
    {
    }

    /**
     * @throws Exception
     */
    public
    function ajaxAccountHandle(Request $request)
    {
        $this->data = $request;
        $this->responseJson = (object)['status' => false, 'msg' => date('H:i:s'), 'type' => $request->get('method')];
        if (!method_exists($this, $request->get('method'))) {
            throw new Exception("Method not found!#Not Found");
        }

        $this->account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->tokenStorage->getToken()->getUser()]);
        $this->account_show = $this->security->isGranted('ACCOUNT_SHOW', $this->account);
        $this->account_edit = $this->security->isGranted('ACCOUNT_EDIT', $this->account);
        $this->account_delete = $this->security->isGranted('ACCOUNT_DELETE', $this->account);
        $this->edit_roles = $this->security->isGranted('EDIT_ROLES', $this->account);
        $this->manage_api = $this->security->isGranted('MANAGE_API', $this->account);
        $this->manage_account = $this->security->isGranted('MANAGE_ACCOUNT', $this->account);
        $this->add_account = $this->security->isGranted('ADD_ACCOUNT', $this->account);
        $this->manage_authorisation = $this->security->isGranted('MANAGE_AUTHORISATION', $this->account);
        $this->edit_grants = $this->security->isGranted('EDIT_GRANTS', $this->account);

        return call_user_func_array(self::class . '::' . $request->get('method'), []);
    }

    /**
     * @throws ExceptionInterface
     */
    private
    function get_account(): object
    {
        $this->responseJson->title = $this->translator->trans('Error');
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $handle = filter_var($this->data->get('handle'), FILTER_UNSAFE_RAW);
        if (!$handle) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }
        if ($handle == 'update' && !$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }

        if ($handle == 'update') {
            $account = $this->em->getRepository(Account::class)->find($id);

            if (!$account) {
                $this->responseJson->msg = $this->translator->trans('No data found') . ' (AC-Ajx-' . __LINE__ . ')';
                return $this->responseJson;
            }
            if (!$this->account_show && !$this->manage_account) {
                $this->responseJson->msg = $this->translator->trans('Missing authorisation') . ' (AC-Ajx-' . __LINE__ . ')';
                return $this->responseJson;
            }

            $this->responseJson->record = $this->get_account_data($account);
            $this->responseJson->status = true;

            unset($this->responseJson->title);
            return $this->responseJson;
        }

        if ($handle == 'insert') {
            $helper = Helper::instance();
            $allRoles = [];
            $roleArray = [];
            foreach ($this->default_roles() as $tmp) {
                if ($tmp['value'] == 'ROLE_USER' || $tmp['value'] == 'ROLE_SUPER_ADMIN') {
                    continue;
                }
                $allRoles[] = $tmp;
                $roleArray[] = $tmp['value'];
            }

            $defaultRoles = $helper->order_by_args($allRoles, 'position', 2);
            //
            $accountRoles = $this->account_authorisations();
            $form = $this->default_account_form();
            $form['accountHolder']['roles_array'] = $roleArray;
            $form['selects']['roles'] = $defaultRoles;
            foreach ($accountRoles as $key => $val) {
                $form[$key] = $val;
            }

            $this->responseJson->status = true;
            $this->responseJson->record = $form;
        }
        return $this->responseJson;
    }

    private function account_authorisations(): array
    {
        return [
            'account_show' => $this->account_show,
            'account_edit' => $this->account_edit,
            'account_delete' => $this->account_delete,
            'edit_roles' => $this->edit_roles,
            'manage_api' => $this->manage_api,
            'edit_grants' => $this->edit_grants,
            'manage_account' => $this->manage_account,
            'add_account' => $this->add_account,
            'manage_authorisation' => $this->manage_authorisation
        ];
    }


    /**
     * @throws ExceptionInterface
     */
    private function get_account_data($account): array
    {
        $oAuth = $this->em->getRepository(Account::class)->getByAccount($account);
        $grands = explode(' ', $oAuth['grants']);
        $redirectUris = explode(' ', $oAuth['redirectUris']);
        $scopes = explode(' ', $oAuth['scopes']);


        $grandArr = [];
        $grandValues = [];
        $grandSelect = [];
        $voter = [];
        foreach ($grands as $tmp) {
            if (!$tmp) {
                continue;
            }
            $item = [
                'id' => uniqid(),
                'label' => ucwords(str_replace('_', ' ', $tmp)),
                'value' => $tmp
            ];
            $grandValues[] = $tmp;
            $grandArr[] = $item;
        }
        foreach ($this->grant_types() as $tmp) {
            if (!in_array($tmp['value'], $grandValues)) {
                $grandSelect[] = $tmp;
            }
        }
        $redirectArr = [];
        foreach ($redirectUris as $tmp) {
            if (!$tmp) {
                continue;
            }
            $item = [
                'id' => uniqid(),
                'label' => $tmp,
                'value' => $tmp
            ];
            $redirectArr[] = $item;
        }

        $scopesArr = [];
        $scopesValue = [];

        foreach ($scopes as $tmp) {
            if (!$tmp) {
                continue;
            }
            $item = [
                'id' => uniqid(),
                'label' => ucwords(strtolower(str_replace('_', ' ', $tmp))),
                'value' => $tmp
            ];
            $scopesValue[] = $tmp;
            $scopesArr[] = $item;
        }
        $scopeSelects = [];
        foreach ($this->default_scopes() as $tmp) {
            if (!in_array($tmp['value'], $scopesValue)) {
                $scopeSelects[] = $tmp;
            }
        }


        $serializer = new Serializer([new ObjectNormalizer()]);
        $data = $serializer->normalize($account, null, [AbstractNormalizer::ATTRIBUTES =>
            [
                'id',
                'imageFilename',
                'title',
                'firstName',
                'lastName',
                'company',
                'zip',
                'country',
                'street',
                'hnr',
                'phone',
                'mobil',
                'notiz',
                'changePw',
                'mustValidated',
                'registerIp',
                'consentCreated',
                'gravatar',
                'voter',
                'accountHolder' => [
                    'id',
                    'verified',
                    'totpSecret',
                    'email',
                    'roles',
                ]
            ]
        ]);
        //dd($data);
        $helper = Helper::instance();
        $roleArr = [];
        $roleActive = [];
        foreach ($data['accountHolder']['roles'] as $tmp) {
            if ($tmp == 'ROLE_USER') {
                continue;
            }
            $roleArr[] = $tmp;
            $roleActive[] = $this->default_roles($tmp);
        }

        $isAdmin = $account->getAccountHolder()->isAdmin();
        $voterSelect = [];
        $newVoter = [];
        if ($isAdmin) {
            foreach ($this->admin_voter() as $tmp) {
                in_array($tmp['role'], $data['voter']) ? $aktiv = true : $aktiv = false;
                $item = [
                    'id' => $tmp['id'],
                    'label' => $tmp['label'],
                    'role' => $tmp['role'],
                    'section' => $tmp['section'],
                    'aktiv' => $aktiv
                ];
                $newVoter[] = $item;
            }
        } else {
            foreach ($this->user_voter() as $tmp) {
                in_array($tmp['role'], $data['voter']) ? $aktiv = true : $aktiv = false;
                $item = [
                    'id' => $tmp['id'],
                    'label' => $tmp['label'],
                    'role' => $tmp['role'],
                    'section' => $tmp['section'],
                    'aktiv' => $aktiv
                ];
                $newVoter[] = $item;
            }
        }


        $roleActive = $helper->order_by_args($roleActive, 'position', 2);
        $data['accountHolder']['roles'] = $roleActive;
        $data['accountHolder']['roles_array'] = $roleArr;
        $data['accountHolder']['password'] = '';
        $data['accountHolder']['repeatPassword'] = '';
        $data['uuid'] = $account->getAccountHolder()->getUuid()->toRfc4122();
        $data['createdAt'] = $account->getCreatedAt()->format('d.m.Y H:i');
        $data['voter'] = $newVoter;
        $accountHolder = $data['accountHolder'];

        unset($oAuth['redirectUris']);
        unset($oAuth['grants']);
        unset($oAuth['scopes']);
        unset($data['accountHolder']);


        $allRoles = [];
        foreach ($this->default_roles() as $tmp) {
            if ($tmp['value'] == 'ROLE_USER') {
                continue;
            }
            $allRoles[] = $tmp['value'];
        }

        $diff = array_diff($allRoles, $roleArr);
        $selectRoles = [];
        foreach ($diff as $tmp) {
            if ($tmp == 'ROLE_SUPER_ADMIN' || $tmp == 'ROLE_USER') {
                continue;
            }
            $selectRoles[] = $this->default_roles($tmp);
        }

        $defaultRoles = $helper->order_by_args($selectRoles, 'position', 2);

        $selects = [
            'grand' => $grandSelect,
            'scopes' => $scopeSelects,
            'roles' => $defaultRoles,
            'gravatar' => $this->getGravatar(),
        ];
        $expConsent = strtotime($oAuth['expires']);
        $oAuth['consentExpired'] = $expConsent <= time();
        if ($oAuth['expires']) {
            $oAuth['expires'] = date('d.m.Y H:i:s', $expConsent);
            $oAuth['consentCreated'] = date('d.m.Y H:i:s', strtotime($oAuth['consentCreated']));
        }
        $user = (bool)$this->em->getRepository(User::class)->getRoleByUser('ADMIN', $account->getAccountHolder()->getId());

        $return = [
            'account' => $data,
            'accountHolder' => $accountHolder,
            'grands' => $grandArr,
            'redirectUris' => $redirectArr,
            'oAuth' => $oAuth,
            'scopes' => $scopesArr,
            'selects' => $selects,
            'user' => $this->account->getAccountHolder()->getId(),
            'su' => $this->account->getAccountHolder()->isSuAdmin(),
            'admin' => $this->account->getAccountHolder()->isAdmin(),
            'isNotUser' => $user
        ];

        foreach ($this->account_authorisations() as $key => $val) {
            $return[$key] = $val;
        }

        return $return;
    }

    /**
     * @throws \Doctrine\DBAL\Exception
     * @throws ExceptionInterface
     * @throws Exception
     */
    private
    function account_handle(): object
    {
        if (!$this->manage_account) {
            $this->responseJson->title = $this->translator->trans('Error');
            $this->responseJson->msg = $this->translator->trans('Missing authorisation') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $helper = Helper::instance();
        $handle = filter_var($this->data->get('handle'), FILTER_UNSAFE_RAW);
        $this->responseJson->title = $this->translator->trans('Error');
        $this->responseJson->handle = $handle;
        $this->responseJson->pw_error = false;
        $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);

        $accountData = filter_var($this->data->get('account'), FILTER_UNSAFE_RAW);
        $holderData = filter_var($this->data->get('account_holder'), FILTER_UNSAFE_RAW);
        if (!$accountData || !$holderData || !$handle) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $accountData = json_decode($accountData, true);

        $holderData = json_decode($holderData, true);
        unset($holderData['roles_array']);
        $title = filter_var($accountData['title'], FILTER_UNSAFE_RAW);
        $firstName = filter_var($accountData['firstName'], FILTER_UNSAFE_RAW);
        $lastName = filter_var($accountData['lastName'], FILTER_UNSAFE_RAW);
        $company = filter_var($accountData['company'], FILTER_UNSAFE_RAW);
        $zip = filter_var($accountData['zip'], FILTER_UNSAFE_RAW);
        $country = filter_var($accountData['country'], FILTER_UNSAFE_RAW);
        $street = filter_var($accountData['street'], FILTER_UNSAFE_RAW);
        $hnr = filter_var($accountData['hnr'], FILTER_UNSAFE_RAW);
        $phone = filter_var($accountData['phone'], FILTER_UNSAFE_RAW);
        $mobil = filter_var($accountData['mobil'], FILTER_UNSAFE_RAW);
        $notiz = filter_var($accountData['notiz'], FILTER_UNSAFE_RAW);
        $changePw = filter_var($accountData['changePw'], FILTER_VALIDATE_BOOLEAN);
        $sendPwLink = filter_var($accountData['sendPwLink'] ?? false, FILTER_VALIDATE_BOOLEAN);

        $email = filter_var($holderData['email'], FILTER_VALIDATE_EMAIL);
        $verified = filter_var($holderData['verified'], FILTER_VALIDATE_BOOLEAN);
        $password = filter_var($holderData['password'], FILTER_UNSAFE_RAW);
        $repeatPassword = filter_var($holderData['repeatPassword'], FILTER_UNSAFE_RAW);
        $rolesArr = [];
        foreach ($holderData['roles'] as $role) {
            $rolesArr[] = $role['value'];
        }
        if ($handle == 'insert') {
            $userHandle = new User();
            $accountHandle = new Account();
            $checkPw = $this->check_password($password, $repeatPassword);
            if (!$checkPw->status) {

                $this->responseJson->msg = $checkPw->msg;
                return $this->responseJson;
            }
            $userHandle->setRawPassword($password);
            $errors = $this->validator->validate($userHandle);
            if (count($errors) > 0) {
                $this->responseJson->title = $this->translator->trans('profil.Password not secure') . '!';
                foreach ($errors as $err) {
                    $this->responseJson->pw_error = true;
                    $this->responseJson->msg = $err->getMessage();
                }
                return $this->responseJson;
            } else {
                $this->responseJson->title = $this->translator->trans('Error');
            }

            $userHandle->setPassword(
                $this->passwordHasher->hashPassword($userHandle, $password)
            );
            $userHandle->setIsVerified($verified);
            $userHandle->setRoles($rolesArr);

            $checkEmail = $this->check_email($email);
            $uuid = new UuidV1();
            $userHandle->setUuid($uuid);

            $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
            $voterRoles = [];
            if (in_array('ROLE_ADMIN', $rolesArr)) {
                $data = $settings->getApp()['default_admin_voter'];
                /* foreach ($this->admin_voter(null, 1) as $tmp) {
                     $voterRoles[] = $tmp['role'];
                 }*/
                foreach ($data as $tmp) {
                   if($tmp['default']) {
                       $voterRoles[] = $tmp['role'];
                   }
                }
            } else {
                $data = $settings->getApp()['default_user_voter'];
                /*foreach ($this->user_voter(null, 1) as $tmp) {
                    $voterRoles[] = $tmp['role'];
                }*/
                foreach ($data as $tmp) {
                    if($tmp['default']) {
                        $voterRoles[] = $tmp['role'];
                    }
                }
            }
            $accountHandle->setVoter($voterRoles);
            $accountHandle->setMustValidated(false);
            $accountHandle->setChangePw($changePw);
            $accountHandle->setRegisterIp($this->data->getClientIp());
        } else {
            $userId = filter_var($holderData['id'], FILTER_VALIDATE_INT);
            $accountId = filter_var($accountData['id'], FILTER_VALIDATE_INT);


            if (!$userId || !$accountId) {
                $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
                return $this->responseJson;
            }
            $accountHandle = $this->em->getRepository(Account::class)->find($accountId);
            if (!$accountHandle) {
                $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
                return $this->responseJson;
            }
            $isChangeRole = filter_var($this->data->get('isChangeRole'), FILTER_VALIDATE_BOOLEAN);
            $isAdmin = filter_var($this->data->get('isAdmin'), FILTER_VALIDATE_BOOLEAN);
            if ($isChangeRole) {
                $voterRoles = [];
                if ($isAdmin) {
                    foreach ($this->admin_voter(null, 1) as $tmp) {
                        $voterRoles[] = $tmp['role'];
                    }
                } else {
                    foreach ($this->user_voter(null, 1) as $tmp) {
                        $voterRoles[] = $tmp['role'];
                    }
                }

                $accountHandle->setVoter($voterRoles);
            }

            $userHandle = $accountHandle->getAccountHolder();
            if ($password) {
                $checkPw = $this->check_password($password, $repeatPassword);
                if (!$checkPw->status) {
                    $this->responseJson->msg = $checkPw->msg;
                    return $this->responseJson;
                }
                $userHandle->setRawPassword($password);
                $errors = $this->validator->validate($userHandle);
                if (count($errors) > 0) {
                    $this->responseJson->title = $this->translator->trans('profil.Password not secure') . '!';
                    foreach ($errors as $err) {
                        $this->responseJson->pw_error = true;
                        $this->responseJson->msg = $err->getMessage();
                    }
                    return $this->responseJson;
                } else {
                    $this->responseJson->title = $this->translator->trans('Error');
                }
                $userHandle->setPassword(
                    $this->passwordHasher->hashPassword($userHandle, $password)
                );
            }
            $checkEmail = $this->check_email($email, $userId);
            $isSu = $this->em->getRepository(User::class)->getRoleByUser('SUPER_ADMIN', $userHandle->getId());
            if (!$isSu) {
                $isVerified = $accountHandle->getAccountHolder()->isVerified();
                if ($isVerified && !$verified) {
                    if ($settings->getLog()['account_deactivated']) {
                        $this->queueLogger->info($this->account->getAccountHolder()->getEmail() . ' - ' . $this->translator->trans('log.Account deactivated'), [
                            'type' => 'account_activated',
                            'account' => $userHandle->getEmail(),
                            'ip' => $this->data->getClientIp()
                        ]);
                    }
                }
                if (!$isVerified && $verified) {
                    if ($settings->getLog()['account_activated']) {
                        $this->queueLogger->info($this->account->getAccountHolder()->getEmail() . ' - ' . $this->translator->trans('log.Account has been activated'), [
                            'type' => 'account_activated',
                            'account' => $userHandle->getEmail(),
                            'ip' => $this->data->getClientIp()
                        ]);
                    }
                }
                $accountHandle->setChangePw($changePw);
                $userHandle->setIsVerified($verified);
                $userHandle->setRoles($rolesArr);
            }
        }
        if (!$checkEmail->status) {
            $this->responseJson->msg = $checkEmail->msg;
            return $this->responseJson;
        }

        $userHandle->setEmail($email);

        $this->em->persist($userHandle);
        $accountHandle->setTitle($helper->preg_escape($title));
        $accountHandle->setFirstName($helper->preg_escape($firstName));
        $accountHandle->setLastName($helper->preg_escape($lastName));
        $accountHandle->setCompany($helper->preg_escape($company));
        $accountHandle->setZip($helper->preg_escape($zip));
        $accountHandle->setCountry($helper->preg_escape($country));
        $accountHandle->setStreet($helper->preg_escape($street));
        $accountHandle->setHnr($helper->preg_escape($hnr));
        $accountHandle->setPhone($helper->preg_escape($phone));
        $accountHandle->setMobil($helper->preg_escape($mobil));
        $accountHandle->setNotiz($helper->preg_escape($notiz));

        if ($verified) {
            $accountHandle->setMustValidated(false);
        }

        $accountHandle->setAccountHolder($userHandle);
        $this->em->persist($accountHandle);
        $this->em->flush();

        if ($handle == 'insert') {
            $selfUrl = $this->data->getSchemeAndHttpHost();
            $clientId = $userHandle->getUuid()->toBase32();
            $clientSecret = $helper->generate_callback_pw(128, 0, 64);
            $scopes = ['BLOCK_READ'];
            $grantTypes = ['authorization_code', 'refresh_token', 'client_credentials'];
            $redirectUris = ["http://localhost:8080/callback"];
            $conn = $this->em->getConnection();
            $conn->insert('oauth2_client', [
                'identifier' => $clientId,
                'secret' => $clientSecret,
                'name' => 'App client',
                'redirect_uris' => implode(' ', $redirectUris),
                'grants' => implode(' ', $grantTypes),
                'scopes' => implode(' ', $scopes),
                'active' => 1,
                'allow_plain_text_pkce' => 0,
            ]);

            $this->responseJson->record = $this->get_account_data($accountHandle);
        }

        $this->responseJson->status = true;
        $this->responseJson->title = $this->translator->trans('Data saved');
        if ($handle == 'insert') {
            $this->responseJson->msg = $this->translator->trans('profil.Profile saved successfully.');
        }
        return $this->responseJson;
    }

    /**
     * @throws Exception
     */
    private function send_pw_link(): object
    {
        $userId = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$userId) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $user = $this->em->getRepository(User::class)->find($userId);
        if (!$user) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
        $resetUrl = $this->urlGenerator->generate('app_forgot_password_request', [], $this->urlGenerator::ABSOLUTE_URL);
        $args = [
            'async' => true,
            'type' => 'system',
            'subject' => $this->translator->trans('email.Link to reset the password'),
            'from' => $settings->getApp()['admin_email'],
            'from_name' => $settings->getApp()['site_name'],
            'template' => 'reset-password-link.html.twig',
            'to' => $user->getEmail(),
            'context' => [
                'link' => $resetUrl,
                'site_name' => $settings->getApp()['site_name'],
                //'expiration_date' => date('d.m.Y H:i:s'),
            ],
            //'attachments' => ['public/uploads/mediathek/b9c61b00-4a0c-4013-a598-6a57f7b2cb36.png', 'public/uploads/mediathek/c266e89a-ece6-48d9-92f8-6d7d93b5269c.jpg', 'public/uploads/mediathek/Auftrag_2102171_PrintAtHome.pdf'],
            //'cc' => ['wiecker@hummelt.com', 'email@jenswiecker.de', 'j.wiecker@gmx.de'],
            //'bcc' => ['jens@harz-web.com'],
        ];


        $this->bus->dispatch(new SaveEmail($args));
        $this->responseJson->status = true;
        $this->responseJson->title = $this->translator->trans('system.E-mail sent');
        $this->responseJson->msg = $this->translator->trans('system.The e-mail was sent successfully.');
        return $this->responseJson;
        //$this->bus->dispatch(new RunCommandMessage('messenger:consume async --limit=1'));
        //new StopWorkerException();
    }

    private
    function oauth_handle(): object
    {
        if (!$this->manage_api) {
            $this->responseJson->title = $this->translator->trans('Error');
            $this->responseJson->msg = $this->translator->trans('Missing authorisation') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $this->responseJson->title = $this->translator->trans('Error');
        $userId = filter_var($this->data->get('user'), FILTER_VALIDATE_INT);
        if (!$userId) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $user = $this->em->getRepository(User::class)->find($userId);
        if (!$user) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $clientId = $user->getUuid()->toBase32();
        $client = $this->em->getRepository(clientModel::class)->find($clientId);
        if (!$client) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $grands = filter_var($this->data->get('grands'), FILTER_UNSAFE_RAW);
        $oAuth = filter_var($this->data->get('oAuth'), FILTER_UNSAFE_RAW);
        $redirectUris = filter_var($this->data->get('redirectUris'), FILTER_UNSAFE_RAW);
        $scopes = filter_var($this->data->get('scopes'), FILTER_UNSAFE_RAW);

        $grands = json_decode($grands, true);
        $oAuth = json_decode($oAuth, true);
        $redirectUris = json_decode($redirectUris, true);

        $scopes = json_decode($scopes, true);

        if (!$redirectUris) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $grandArr = [];
        $redirectArr = [];
        $scopeArr = [];
        foreach ($grands as $grand) {
            $grandArr[] = $grand['value'];
        }
        foreach ($redirectUris as $redirect) {
            $redirectArr[] = $redirect['value'];
        }
        foreach ($scopes as $scope) {
            $scopeArr[] = $scope['value'];
        }

        $consentScope = implode(' ', $scopeArr);
        $helper = Helper::instance();
        $active = filter_var($oAuth['active'], FILTER_VALIDATE_INT);
        if (!$active) {
            $active = 0;
        }
        $name = filter_var($oAuth['name'], FILTER_UNSAFE_RAW);
        $secret = filter_var($oAuth['secret'], FILTER_UNSAFE_RAW);
        if (!$secret) {
            $this->responseJson->msg = $this->translator->trans('system.Client Secret must not be empty');
            return $this->responseJson;
        }
        if (!$name) {
            $this->responseJson->msg = $this->translator->trans('system.The name must not be empty.');
            return $this->responseJson;
        }
        $ru = [];
        foreach ($redirectArr as $tmp) {
            if (filter_var($tmp, FILTER_VALIDATE_URL)) {
                $ru[] = $tmp;
            }
        }
        $reUris = implode(' ', $ru);

        if (!$reUris) {
            $reUris = 'http://localhost:8080/callback';
        }

        $conn = $this->em->getConnection();
        try {
            $conn->update('oauth2_client', [
                'name' => $helper->preg_escape($name),
                'redirect_uris' => $reUris,
                'grants' => implode(' ', $grandArr),
                'scopes' => implode(' ', $scopeArr),
                'active' => $active,
            ], ['identifier' => $client->getIdentifier()]);
        } catch (Exception $e) {
            $this->responseJson->msg = $e->getMessage();
            return $this->responseJson;
        }

        $consent = $this->em->getRepository(OAuth2UserConsent::class)->findOneBy(['user' => $user->getId()]);
        if ($consent) {
            $consent->setScopes(explode(' ', $consentScope));
            $this->em->persist($consent);
            $this->em->flush();
        }

        $this->responseJson->title = $this->translator->trans('Changes saved');
        //$this->responseJson->msg = $this->translator->trans('The changes have been saved successfully.');
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private
    function check_email($email, $id = null): object
    {
        $return = new stdClass();
        $return->status = false;
        $errValidEmail = str_replace('{{ value }}', $email, $this->translator->trans('register.The email {{ value }} is not a valid email address.'));;
        if (!$email) {
            $return->msg = $errValidEmail;
            return $return;
        }
        if ($id) {
            $user = $this->em->getRepository(User::class)->find($id);
            if (!$user) {
                $return->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            }
            if ($user->getEmail() == $email) {
                $return->status = true;
                return $return;
            }
        }
        $checkEmail = $this->em->getRepository(User::class)->findBy(['email' => $email]);
        if ($checkEmail) {
            $return->msg = $this->translator->trans('register.This e-mail address cannot be used.');
            return $return;
        }
        $return->status = true;
        return $return;
    }

    private
    function check_password($password, $repeatPassword): object
    {
        $return = new stdClass();
        $return->status = false;
        if (strlen($password) < 8) {
            $return->msg = str_replace('{{ limit }}', 8, $this->translator->trans('register.The password must be at least {{ limit }} characters long'));
            return $return;
        }
        if (!$repeatPassword) {
            $return->msg = $this->translator->trans('register.The password fields must match.');
            return $return;
        }
        if ($password != $repeatPassword) {
            $return->msg = $this->translator->trans('register.The password fields must match.');
            return $return;
        }


        $return->status = true;
        return $return;
    }

    private
    function login_2fa_handle(): object
    {
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $handle = filter_var($this->data->get('handle'), FILTER_UNSAFE_RAW);
        if (!$id || !$handle) {
            $this->responseJson->title = $this->translator->trans('Error');
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $user = $this->em->getRepository(User::class)->find((int)$id);
        if (!$user) {
            $this->responseJson->title = $this->translator->trans('Error');
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $helper = Helper::instance();
        switch ($handle) {
            case 'activate':
                $user->setTotpSecret($this->totpAuthenticator->generateSecret());
                $this->responseJson->msg = $this->translator->trans('profil.2FA Login has been activated.');
                break;
            case 'deactivate':
                $user->setTotpSecret('');
                $this->responseJson->msg = $this->translator->trans('profil.2FA Login has been deactivated.');
                break;
        }

        $this->em->persist($user);
        $this->em->flush();
        $this->responseJson->handle = $handle;
        $this->responseJson->title = $this->translator->trans('profil.2FA Login');
        $this->responseJson->totpSecret = $user->getTotpSecret();
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function get_2fa_Data(): object
    {
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->title = $this->translator->trans('Error');
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $user = $this->em->getRepository(User::class)->find((int)$id);
        if (!$user) {
            $this->responseJson->title = $this->translator->trans('Error');
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $helper = Helper::instance();
        if ($user->isTotpAuthenticationEnabled()) {
            $qrCodeContent = $this->totpAuthenticator->getQRContent($user);
            // dd($qrCodeContent);
            $qrcode = $helper->make_qrcode($qrCodeContent);


            $record = [
                'qrcode' => $qrcode,
                'totp_secret_enabled' => $user->isTotpAuthenticationEnabled(),
                'qrCodeContent' => $qrCodeContent,
                'konto' => $user->getUserIdentifier(),
                'totpSecret' => $user->getTotpSecret(),
            ];
            $this->responseJson->status = true;
            $this->responseJson->record = $record;
        }
        return $this->responseJson;
    }

    private
    function get_api_Data(): object
    {
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->title = $this->translator->trans('Error');
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $account = $this->em->getRepository(Account::class)->find($id);

        if (!$account) {
            $this->responseJson->title = $this->translator->trans('Error');
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $accountApi = $this->em->getRepository(Account::class)->getByAccount($account);
        if (!$accountApi) {
            $this->responseJson->msg = $this->translator->trans('No data found') . ' (AC-Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $identifier = Uuid::fromString($accountApi['identifier']);
        $identifier = $identifier->toRfc4122();
        $accountApi['uuid'] = $identifier;
        $accountApi['grants_array'] = explode(' ', $accountApi['grants']);
        $accountApi['redirectUris_array'] = explode(' ', $accountApi['redirectUris']);
        $accountApi['scopes_array'] = explode(' ', $accountApi['scopes']);
        $this->responseJson->status = true;
        $this->responseJson->record = $accountApi;
        return $this->responseJson;
    }


    /**
     * @throws FilesystemException
     */
    private
    function delete_account_image(): object
    {
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->title = $this->translator->trans('Error');
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $account = $this->em->getRepository(Account::class)->find($id);

        if (!$account) {
            $this->responseJson->title = $this->translator->trans('Error');
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        /* if (!$this->account_role_edit) {
             $this->responseJson->title = $this->translator->trans('Error');
             $this->responseJson->msg = $this->translator->trans('Missing authorisation') . ' (Ajx-PR ' . __LINE__ . ')';
             return $this->responseJson;
         }*/

        $this->uploaderHelper->deleteFile($account->getImageFilename(), $this->uploaderHelper::ACCOUNT, true);
        $account->setImageFilename('');
        $this->em->persist($account);
        $this->em->flush();
        $this->responseJson->status = true;
        $this->responseJson->msg = $this->translator->trans('profil.Image successfully deleted.');
        return $this->responseJson;
    }

    /**
     * @throws FilesystemException
     */
    private function delete_user(): object
    {
        if (!$this->account_delete) {
            $this->responseJson->title = $this->translator->trans('Error');
            $this->responseJson->msg = $this->translator->trans('Missing authorisation') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $logout = filter_var($this->data->get('logout'), FILTER_VALIDATE_BOOLEAN);
        if (!$id) {
            $this->responseJson->title = $this->translator->trans('Error');
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }


        $account = $this->em->getRepository(Account::class)->find($id);
        if (!$account) {
            $this->responseJson->title = $this->translator->trans('Error');
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }

        if ($account->getImageFilename()) {
            $this->uploaderHelper->deleteFile($account->getImageFilename(), $this->uploaderHelper::ACCOUNT, true);
        }

        $media = $this->em->getRepository(Media::class)->findBy(['user' => $account->getAccountHolder()]);
        if ($media) {
            foreach ($media as $tmp) {
                $this->uploaderHelper->deleteFile($tmp->getFileName(), $this->uploaderHelper::MEDIATHEK, true);
            }
        }
        $mediaCat = $this->em->getRepository(MediaCategory::class)->findBy(['user' => $account->getAccountHolder()]);
        if ($mediaCat) {
            foreach ($mediaCat as $tmp) {
                $this->em->remove($tmp);
                $this->em->flush();
            }
        }

        $log = $this->em->getRepository(Log::class)->findBy(['user' => $account->getAccountHolder()]);
        if ($log) {
            foreach ($log as $tmp) {
                $this->em->remove($tmp);
                $this->em->flush();
            }
        }

        $consent = $this->em->getRepository(OAuth2UserConsent::class)->findOneBy(['user' => $account->getAccountHolder()]);
        if ($consent) {
            $this->em->remove($consent);
            $this->em->flush();
        }

        $client = $this->em->getRepository(clientModel::class)->find($account->getAccountHolder()->getUuid()->toBase32());
        if ($client) {
            $this->em->remove($client);
            $this->em->flush();
        }
        $this->em->remove($account->getAccountHolder());
        $this->em->remove($account);
        $this->em->flush();
        $this->responseJson->logout = false;
        $this->responseJson->title = $this->translator->trans('profil.Account deleted');
        if ($logout) {
            $this->responseJson->msg = $this->translator->trans('profil.Account has been deleted, you will be logged out.');
            $this->responseJson->logout = $this->urlGenerator->generate('app_logout');
        } else {
            $this->responseJson->msg = $this->translator->trans('profil.Account has been successfully deleted.');
        }
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function delete_consent(): object
    {
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->title = $this->translator->trans('Error');
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $consent = $this->em->getRepository(OAuth2UserConsent::class)->find($id);
        if (!$consent) {
            $this->responseJson->title = $this->translator->trans('Error');
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }

        //$consent->setExpires(new DateTimeImmutable());
        //$this->em->persist($consent);
        $this->em->remove($consent);
        $this->em->flush();
        $this->responseJson->status = true;
        $this->responseJson->title = $this->translator->trans('swal.Consent deleted');
        $this->responseJson->msg = $this->translator->trans('swal.User consent successfully deleted.');
        return $this->responseJson;
    }

    private function gravatar_update(): object
    {
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $gravatar = filter_var($this->data->get('gravatar'), FILTER_UNSAFE_RAW);
        if (!$id) {
            $this->responseJson->title = $this->translator->trans('Error');
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $account = $this->em->getRepository(Account::class)->find($id);
        if (!$account) {
            $this->responseJson->title = $this->translator->trans('Error');
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $account->setGravatar($gravatar);
        $this->em->persist($account);
        $this->em->flush();
        $this->responseJson->status = true;
        // $this->responseJson->msg = $this->translator->trans('Data saved');
        return $this->responseJson;
    }

    private function update_voter(): object
    {
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $voter = filter_var($this->data->get('voter'), FILTER_UNSAFE_RAW);
        if (!$id || !$voter) {
            $this->responseJson->title = $this->translator->trans('Error');
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $account = $this->em->getRepository(Account::class)->find($id);
        if (!$account) {
            $this->responseJson->title = $this->translator->trans('Error');
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $voter = json_decode($voter, true);
        $voterArr = [];
        foreach ($voter as $tmp) {
            if ($tmp['aktiv']) {
                $voterArr[] = strtoupper(trim($tmp['role']));
            }
        }
        $account->setVoter($voterArr);
        $this->em->persist($account);
        $this->em->flush();
        $this->responseJson->status = true;
        //$this->responseJson->msg = $this->translator->trans('Data saved');
        return $this->responseJson;
    }

    private function get_voter(): object
    {
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->title = $this->translator->trans('Error');
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $account = $this->em->getRepository(Account::class)->find($id);

        if (!$account) {
            $this->responseJson->title = $this->translator->trans('Error');
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $isAdmin = $this->em->getRepository(User::class)->getRoleByUser('ADMIN', $account->getAccountHolder()->getId());
        $currentSuperAdmin = $this->em->getRepository(User::class)->getRoleByUser('SUPER_ADMIN', $this->account->getAccountHolder()->getId());

        $selectRoles = [];
        if ($isAdmin) {
            foreach ($this->admin_voter() as $tmp) {
                in_array($tmp['role'], $account->getVoter()) ? $aktiv = true : $aktiv = false;
                if (!$currentSuperAdmin) {
                    if (!in_array($tmp['role'], $account->getVoter())) {
                        continue;
                    }
                }
                $item = [
                    'aktiv' => $aktiv,
                    'id' => $tmp['id'],
                    'label' => $tmp['label'],
                    'role' => $tmp['role'],
                    'section' => $tmp['section']
                ];
                $selectRoles[] = $item;
            }
        } else {
            foreach ($this->user_voter() as $tmp) {
                in_array($tmp['role'], $account->getVoter()) ? $aktiv = true : $aktiv = false;

                $item = [
                    'aktiv' => $aktiv,
                    'id' => $tmp['id'],
                    'label' => $tmp['label'],
                    'role' => $tmp['role'],
                    'section' => $tmp['section']
                ];
                $selectRoles[] = $item;
            }
        }

        $this->responseJson->status = true;
        $this->responseJson->voter = $selectRoles;
        return $this->responseJson;
    }

    private function validate_register_user(): object
    {
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->title = $this->translator->trans('Error');
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $account = $this->em->getRepository(Account::class)->find($id);

        if (!$account) {
            $this->responseJson->title = $this->translator->trans('Error');
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $account->getAccountHolder()->setIsVerified(true);
        $account->setMustValidated(false);
        $this->em->persist($account);
        $this->em->flush();
        $this->responseJson->status = true;
        $this->responseJson->msg = $this->translator->trans('reg.User has been successfully activated.');
        $this->responseJson->title = $this->translator->trans('reg.User activated');
        $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
        if ($settings->getRegister()['send_after_validate']) {
            $args = [
                'async' => true,
                'type' => 'system',
                'subject' => $this->translator->trans('log.Account activated'),
                'from' => $settings->getApp()['admin_email'],
                'from_name' => $settings->getApp()['site_name'],
                'template' => 'send-system-email.html.twig',
                'to' => $account->getAccountHolder()->getEmail(),
                'context' => [
                    'content' => 'Konto aktiviert',
                    'site_name' => $this->siteName,
                ],
            ];
            $this->bus->dispatch(new SaveEmail($args));
        }

        if ($settings->getLog()['account_activated']) {
            /** @var User $user */
            $user = $this->tokenStorage->getToken()->getUser();
            $this->queueLogger->info($account->getAccountHolder()->getEmail() . ' - ' . $this->translator->trans('log.Account has been activated'), [
                'type' => 'account_activated',
                'account' => $user->getEmail(),
                'ip' => $this->data->getClientIp()
            ]);
        }

        return $this->responseJson;
    }

    private function validate_user_table(): object
    {
        $columns = array(
            'u.email',
            'a.createdAt',
            'a.lastName',
            'a.company',
            'a.phone',
            'a.mobil',
            '',
            '',
            ''
        );

        $request = $this->data->request->all();
        $search = (string)$request['search']['value'];
        $query = $this->em->createQueryBuilder();
        $query
            ->from(Account::class, 'a')
            ->select('a, u')
            ->leftJoin('a.accountHolder', 'u')
            ->andWhere('a.mustValidated=1')
            ->andWhere('u.isVerified=0');

        if (isset($request['search']['value'])) {
            $query->andWhere(
                'a.street LIKE :searchTerm OR
                 a.mobil LIKE :searchTerm OR
                 a.phone LIKE :searchTerm OR
                 a.country LIKE :searchTerm OR
                 a.company LIKE :searchTerm OR
                 u.email LIKE :searchTerm OR
                 a.lastName LIKE :searchTerm OR
                 a.firstName LIKE :searchTerm OR
                 a.createdAt LIKE :searchTerm')
                ->setParameter('searchTerm', '%' . $search . '%');
        }
        if (isset($request['order'])) {
            $query->orderBy($columns[$request['order']['0']['column']], $request['order']['0']['dir']);
        } else {
            $query->orderBy('a.createdAt', 'ASC');
        }
        if ($request['length'] != -1) {
            $query->setFirstResult($request['start']);
            $query->setMaxResults($request['length']);
        }

        $table = $query->getQuery()->getArrayResult();

        $data_arr = array();
        if (!$table) {
            $this->responseJson->draw = $request['draw'];
            $this->responseJson->recordsTotal = 0;
            $this->responseJson->recordsFiltered = 0;
            $this->responseJson->data = $data_arr;
            return $this->responseJson;
        }
        foreach ($table as $tmp) {
            $data_item = array();
            $data_item[] = $tmp['accountHolder']['email'];
            $data_item[] = '<span class="d-block lh-1">' . $tmp['createdAt']->format('d.m.Y') . '<small class="d-block small-lg mt-1"> ' . $tmp['createdAt']->format('H:i:s') . '</small></span>';
            $data_item[] = $tmp['firstName'] . ' ' . $tmp['lastName'];
            $data_item[] = $tmp['company'];
            $data_item[] = $tmp['phone'];
            $data_item[] = $tmp['mobil'];
            $data_item[] = $tmp['id'];
            $data_item[] = $tmp['id'];
            $data_arr[] = $data_item;
        }


        $allCount = $this->em->getRepository(Account::class)->count(['mustValidated' => true]);

        $this->responseJson->draw = $request['draw'];
        $this->responseJson->recordsTotal = $allCount;
        if ($search) {
            $this->responseJson->recordsFiltered = count($table);
        } else {
            $this->responseJson->recordsFiltered = $allCount;
        }

        $this->responseJson->data = $data_arr;
        return $this->responseJson;
    }

    private function accounts_table(): object
    {
        $columns = array(
            'a.id',
            'a.lastName',
            'a.company',
            'u.email',
            'a.phone',
            'a.mobil',
            'u.roles',
            '',
            'u.isVerified',
            'u.totpSecret',
            '',
            'uc.id',
            '',
            '',
            ''
        );

        $this->responseJson->roles = $this->account_authorisations();
        /** @var User $user */
        $user = $this->tokenStorage->getToken()->getUser();

        $request = $this->data->request->all();
        $search = (string)$request['search']['value'];
        $uuidQuery = $this->em->createQueryBuilder();
        $uuidQuery->from(User::class, 'u')->select('u.uuid');
        $idsData = $uuidQuery->getQuery()->getArrayResult();
        $ids = [];
        foreach ($idsData as $tmp) {
            $id = $tmp['uuid']->toBase32();
        }

        $query = $this->em->createQueryBuilder();
        $query
            ->from(Account::class, 'a')
            ->select(
                'a.id as accountId,
                a.imageFilename,
                a.firstName,
                a.lastName,
                a.company,
                a.phone,
                a.mobil,
                a.gravatar,
                a.mustValidated,
                u.id as userId,
                u.email,
                u.totpSecret,
                u.roles,
                u.isVerified,
                u.uuid,
                uc.id as consent_id,
                uc.expires'
            )
            ->leftJoin(
                User::class,
                'u',
                Join::WITH,
                'u.id = a.accountHolder'
            )
            ->leftJoin(
                OAuth2UserConsent::class,
                'uc',
                Join::WITH,
                'u.id = uc.user'
            )
            ->andWhere('JSON_CONTAINS(u.roles, :role) = 0')
            ->andWhere("u.id !=:userId")
            ->setParameter('role', '"ROLE_SUPER_ADMIN"')
            ->setParameter('userId', $user->getId());

        if (isset($request['order'])) {
            $query->orderBy($columns[$request['order']['0']['column']], $request['order']['0']['dir']);
        } else {
            $query->orderBy('u.roles', 'ASC');
            $query->addOrderBy('a.lastName', 'ASC');
        }

        if ($request['length'] != -1) {
            $query->setFirstResult($request['start']);
            $query->setMaxResults($request['length']);
        }

        $tableAccount = $query->getQuery()->getArrayResult();

        $data_arr = array();
        if (!$tableAccount) {
            $this->responseJson->draw = $request['draw'];
            $this->responseJson->recordsTotal = 0;
            $this->responseJson->recordsFiltered = 0;
            $this->responseJson->data = $data_arr;
            return $this->responseJson;
        }

        $table = [];

        foreach ($tableAccount as $tmp) {
            $clientId = $tmp['uuid']->toBase32();
            $client = $this->em->getRepository(clientModel::class)->find($clientId);
            $item = [
                'name' => $client->getName(),
                'client_active' => $client->isActive(),
                'scopes' => $client->getScopes()
            ];
            $tmp['client'] = $item;
            $table[] = $tmp;
        }

        foreach ($table as $tmp) {

            $userRolesArr = [];
            foreach ($tmp['roles'] as $role) {
                $role = str_replace(['ROLE_', '_'], ['', ' '], $role);
                $role = ucfirst(strtolower($role));
                $userRolesArr[] = $role;
            }
            $userRoles = implode(' • ', $userRolesArr);
            if (!$userRoles) {
                $userRoles = 'User';
            }

            $scopes = $tmp['client']['scopes'];
            $scopes = implode(' ', $scopes);
            $scopes = explode(' ', $scopes);
            $scopeArr = [];
            foreach ($scopes as $scope) {
                $type = $this->default_scopes($scope);
                $scopeArr[] = $type['label'];
            }
            $color = '';
            $border = '';
            if ($tmp['mustValidated']) {
                $color = ' text-danger';
                $border = 'border-danger';
            }
            if ($tmp['imageFilename']) {
                $thumb = $this->uploaderHelper->getThumbnailPath($this->uploaderHelper::ACCOUNT . '/' . $tmp['imageFilename']);
                $large = $this->uploaderHelper->getLargePath($this->uploaderHelper::ACCOUNT . '/' . $tmp['imageFilename']);

                $img = '<div class="table-img-wrapper"><a class="img-link" data-control="single" href="' . $large . '"><img class="table-image ' . $border . '" src="' . $thumb . '" alt="' . $tmp['email'] . '"></a></div>';
            } else {
                $gravatar = new GravatarApi();
                if ($gravatar->exists($tmp['email'])) {
                    //$img = '<div class="table-img-wrapper"><a class="img-link" data-control="single" href="' . $gravatar->getUrl($tmp['email'], '600', '', '') . '"><img class="table-image" src="' . $gravatar->getUrl($tmp['email'], '', '', '') . '" alt="' . $tmp['email'] . '"></a></div>';
                    $img = '<div class="table-img-wrapper"><img class="table-image ' . $border . '" src="' . $gravatar->getUrl($tmp['email'], '', '', $tmp['gravatar']) . '" alt="' . $tmp['email'] . '"></div>';
                } else {
                    $img = '<div class="placeholder-table-img"><i class="bi bi-image"></i></div>';
                }
            }

            $name = $tmp['lastName'] . ' ' . $tmp['firstName'];
            if (!$tmp['lastName'] && !$tmp['firstName']) {
                $name = '<span class="text-muted">' . $this->translator->trans('not specified') . '</span>';
            }

            $tmp['phone'] ?: $tmp['phone'] = '<span class="text-muted">' . $this->translator->trans('not specified') . '</span>';
            $tmp['mobil'] ?: $tmp['mobil'] = '<span class="text-muted">' . $this->translator->trans('not specified') . '</span>';
            $tmp['company'] ?: $tmp['company'] = '<span class="text-muted">' . $this->translator->trans('not specified') . '</span>';
            $expColor = '';
            if ($tmp['expires']) {
                $expTime = strtotime($tmp['expires']->format('Y-m-d H:i:s'));
                if ($expTime <= time()) {
                    $expColor = 'text-warning';
                }
            }

            $data_item = array();
            $data_item[] = $img;
            $data_item[] = '<small class="' . $color . '">' . $name . '</small>';
            $data_item[] = '<small class="' . $color . '">' . $tmp['company'] . '</small>';
            $data_item[] = '<small class="' . $color . '">' . $tmp['email'] . '</small>';
            $data_item[] = '<small class="' . $color . '">' . $tmp['phone'] . '</small>';
            $data_item[] = '<small class="' . $color . '">' . $tmp['mobil'] . '</small>';
            $data_item[] = '<small class="' . $color . '">' . $userRoles . '</small>';
            $data_item[] = '<small class="d-inline-block lh-12 ' . $color . '">' . implode(' • ', $scopeArr) . '</small>';
            $data_item[] = $this->get_bi_item('bi bi-check2-circle', $tmp['isVerified']);
            $data_item[] = $this->get_bi_item('bi bi bi-key', (bool)$tmp['totpSecret'], true);
            $data_item[] = $this->get_bi_item('bi bi-server', $tmp['client']['client_active'], true);
            $data_item[] = $this->get_bi_item('bi bi-shield-lock', (bool)$tmp['consent_id'], true, true, $expColor);
            $data_item[] = $tmp['accountId'];
            $data_item[] = $tmp['email'];
            $data_item[] = $this->account_delete ? $tmp['accountId'] : '';
            $data_arr[] = $data_item;
        }
        $query = $this->em->createQueryBuilder();
        $query
            ->from(User::class, 'u')
            ->select('u.id')
            ->andWhere('JSON_CONTAINS(u.roles, :role) = 0')
            ->andWhere("u.id !=:userId")
            ->setParameter('role', '"ROLE_SUPER_ADMIN"')
            ->setParameter('userId', $user->getId());

        $usersAll = $query->getQuery()->getArrayResult();
        $this->responseJson->draw = $request['draw'];
        $this->responseJson->recordsTotal = count($usersAll);
        if ($search) {
            $this->responseJson->recordsFiltered = count($table);
        } else {
            $this->responseJson->recordsFiltered = count($usersAll);
        }

        $this->responseJson->data = $data_arr;
        return $this->responseJson;
    }

    private function get_bi_item($icon, $status, $selfIcon = false, $selfTxt = false, $expColor = ''): string
    {
        $selfIcon ? $delIcon = $icon : $delIcon = 'bi-x-circle';
        $status ? $txt = $this->translator->trans('yes') : $txt = $this->translator->trans('no');
        $status ? $title = $this->translator->trans('active') : $title = $this->translator->trans('Not active');
        $selfTxt ? $selfTitle = $txt : $selfTitle = $title;
        $expColor ? $c = $expColor : $c = 'text-green';
        $status ? $color = $c . ' bi ' . $icon : $color = 'text-danger ' . $delIcon;
        $expColor ? $selfTitle = $this->translator->trans('profil.expired') : $selfTitle = $txt;

        return sprintf('<span title="%s" class="text-center d-inline-block lh-1"><i class="%s d-block"></i><span class="d-none">%s</span></span>', $selfTitle, $color, $txt);
    }
}
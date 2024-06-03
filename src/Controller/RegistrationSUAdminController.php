<?php

namespace App\Controller;

use App\AppHelper\Helper;
use App\Entity\Account;
use App\Entity\SystemSettings;
use App\Entity\User;
use App\Form\RegistrationSUAdminFormType;
use App\Security\LoginFormAuthenticator;
use App\Settings\Settings;
use Doctrine\DBAL\Exception;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Authentication\UserAuthenticatorInterface;
use Symfony\Component\Uid\UuidV1;
use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\Component\Console\Messenger\RunCommandMessage;
use Symfony\Component\Filesystem\Exception\IOExceptionInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Filesystem\Path;

class RegistrationSUAdminController extends AbstractController
{
    use Settings;

    public function __construct(
        private readonly TranslatorInterface $translator,
        private readonly MessageBusInterface $bus,
    )
    {
    }

    /**
     * @throws Exception
     */
    #[Route('/registration/su/admin', name: 'app_registration_su_admin')]
    public function register(Request $request, UserPasswordHasherInterface $userPasswordHasher, TranslatorInterface $translator, UserAuthenticatorInterface $userAuthenticator, LoginFormAuthenticator $authenticator, EntityManagerInterface $entityManager): Response
    {
        $helper = Helper::instance();
        $user = new User();
        $form = $this->createForm(RegistrationSUAdminFormType::class, $user);
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $user->setPassword(
                $userPasswordHasher->hashPassword(
                    $user,
                    $form->get('plainPassword')->getData()
                )
            );
            $adminVoter = $this->admin_voter();
            $voter = [];
            foreach ($adminVoter as $tmp) {
                $voter[] = $tmp['role'];
            }
            $uuid = new UuidV1();
            $id = $uuid->toBase32();
            $clientId = $uuid->toBase32();
            $user->setRoles(['ROLE_ADMIN', 'ROLE_SUPER_ADMIN']);
            $user->setUuid($uuid);
            $user->setIsVerified(true);
            $entityManager->persist($user);
            $entityManager->flush();

            $adminAccount = new Account();
            $adminAccount->setAccountHolder($user);
            $adminAccount->setVoter($voter);
            $adminAccount->setMustValidated(false);
            $adminAccount->setChangePw(true);
            $adminAccount->setRegisterIp($request->getClientIp());
            $entityManager->persist($adminAccount);
            $entityManager->flush();

            $selfUrl = $request->getSchemeAndHttpHost();
            $clientSecret = $helper->generate_callback_pw(128, 0, 64);
            $scopes = ['PROFILE', 'MEDIA', 'BLOCK_READ', 'BLOCK_WRITE'];
            $grantTypes = ['authorization_code', 'refresh_token', 'client_credentials'];
            $redirectUris = ["http://localhost:8080/callback"];

            $conn = $entityManager->getConnection();
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

            $settings = $entityManager->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
            if (!$settings) {
                $app = $this->default_settings('app');
                $app['default_admin_voter'] = $this->admin_voter();
                $app['default_user_voter'] = $this->user_voter();
                $settings = new SystemSettings();
                $settings->setApp($app);
                $settings->setEmail($this->default_settings('email'));
                $settings->setLog($this->default_settings('log'));
                $settings->setOauth($this->default_settings('oauth'));
                $settings->setRegister($this->default_settings('register'));
                $settings->setDesign($this->default_settings('design'));
                $entityManager->persist($settings);
                $entityManager->flush();
            }

            $filesystem = new Filesystem();
            try {
                $filesystem->mkdir(
                    Path::normalize($this->getParameter('uploadsDir')),0777
                );
            } catch (IOExceptionInterface $exception) {
                echo "An error occurred while creating your directory at " . $exception->getPath();
            }
            try {
                $filesystem->mkdir(
                    Path::normalize($this->getParameter('uploads_chunks')), 0777
                );
            } catch (IOExceptionInterface $exception) {
                echo "An error occurred while creating your directory at " . $exception->getPath();
            }

            $this->bus->dispatch(new RunCommandMessage('app:first-install'));

            $this->addFlash('success', $translator->trans('register.SU-Admin successfully registered.'));
            return $this->redirect($this->generateUrl('app_login'));
        }

        return $this->render('registration_su_admin/index.html.twig', [
            'registrationSUAdminForm' => $form->createView(),
        ]);
    }
}

<?php

namespace App\Controller;

use App\Entity\SystemSettings;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Scheb\TwoFactorBundle\Security\TwoFactor\Provider\Totp\TotpAuthenticatorInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\Component\HttpFoundation\Request;

class AuthController extends AbstractController
{
    private array $logSettings;


    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly LoggerInterface        $queueLogger,
        private readonly TranslatorInterface    $translator,


    )
    {
        $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
        $this->logSettings = $settings->getLog();
    }

    #[Route(path: '/login', name: 'app_login')]
    public function login(AuthenticationUtils $authenticationUtils, Request $request): Response
    {

        if($this->getUser()){
            return $this->redirect($this->generateUrl('app_dashboard'));
        }
        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();
       // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();

        if ($error) {
            if ($this->logSettings['login_error']) {
                $msg = sprintf('Login error - %s - %s', $lastUsername, $this->translator->trans('log.Incorrect access data.'));
                $this->queueLogger->info($msg, [
                    'type' => 'login_error',
                    'account' => $lastUsername,
                    'ip' => $request->getClientIp()
                ]);
            }
        }

        return $this->render('security/login.html.twig', ['last_username' => $lastUsername, 'error' => $error]);
    }

    #[Route(path: '/logout', name: 'app_logout')]
    public function logout(): void
    {

        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }

}

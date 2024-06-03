<?php

namespace App\EventListener;

use App\Entity\SystemSettings;
use App\Entity\User;
use App\Settings\Settings;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Http\Event\LogoutEvent;
use Symfony\Contracts\Translation\TranslatorInterface;

class LogoutSubscriber implements EventSubscriberInterface
{
    use Settings;

    public function __construct(
        private readonly UrlGeneratorInterface  $urlGenerator,
        private readonly EntityManagerInterface $em,
        private readonly TranslatorInterface    $translator,
        private readonly LoggerInterface        $queueLogger,
    )
    {
    }

    public function onLogout(LogoutEvent $event): void
    {
        // get the security token of the session that is about to be logged out
        $token = $event->getToken();
        // get the current request
        $request = $event->getRequest();

        // get the current response, if it is already set by another listener
        $response = $event->getResponse();
        if ($token) {
            /** @var User $user */
            $user = $token->getUser();
            $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
            if ($settings->getLog()['logout'] && $user->isSuAdmin() === false) {
                $this->queueLogger->info($user->getEmail() . ' - ' . $this->translator->trans('log.User has logged out'), [
                    'type' => 'logout',
                    'account' => $user->getEmail(),
                    'ip' => $request->getClientIp()
                ]);
            }

            // configure a custom logout response to the homepage
            $response = new RedirectResponse(
                $this->urlGenerator->generate('app_logged_out', ['id' => $this->logout_token]),
                Response::HTTP_SEE_OTHER
            );
            $event->setResponse($response);
        }
    }

    public static function getSubscribedEvents(): array
    {
        return [LogoutEvent::class => 'onLogout'];
    }
}
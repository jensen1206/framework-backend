<?php

namespace App\EventSubscriber;

use League\Bundle\OAuth2ServerBundle\Event\AuthorizationRequestResolveEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
//use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\FirewallMapInterface;
use Symfony\Component\Security\Http\Util\TargetPathTrait;

class AuthorizationCodeSubscriber implements EventSubscriberInterface
{
    use TargetPathTrait;


    private $firewallName;

    public function __construct(
        private readonly TokenStorageInterface $tokenStorage,
        private readonly UrlGeneratorInterface $urlGenerator,
        private readonly RequestStack          $requestStack,
        private readonly FirewallMapInterface  $firewallMap)
    {

        $this->firewallName = $firewallMap->getFirewallConfig($requestStack->getCurrentRequest())->getName();
    }

    public function onLeagueOauth2ServerEventAuthorizationRequestResolve(AuthorizationRequestResolveEvent $event): void
    {
        $request = $this->requestStack->getCurrentRequest();
        $user = $this->tokenStorage->getToken()->getUser();

        $this->saveTargetPath($request->getSession(), $this->firewallName, $request->getUri());
        $response = new RedirectResponse($this->urlGenerator->generate('app_login'), 307);
        if ($user instanceof UserInterface) {
            if ($request->getSession()->get('consent_granted') !== null) {
                $event->resolveAuthorization($request->getSession()->get('consent_granted'));
                $request->getSession()->remove('consent_granted');
                return;
            }
            $response = new RedirectResponse($this->urlGenerator->generate('app_consent', $request->query->all()), 307);
        }

        $event->setResponse($response);
    }

    public static function getSubscribedEvents(): array
    {
        return [
            'league.oauth2_server.event.authorization_request_resolve' => 'onLeagueOauth2ServerEventAuthorizationRequestResolve',
        ];
    }
}

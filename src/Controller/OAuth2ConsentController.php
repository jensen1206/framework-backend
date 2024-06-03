<?php

namespace App\Controller;


use App\Entity\OAuth2UserConsent;
use App\Entity\User;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use League\Bundle\OAuth2ServerBundle\Model\Client;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Uid\Uuid;

class OAuth2ConsentController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $em,
    )
    {

    }
    #[Route('/consent', name: 'app_consent', methods: ['GET', 'POST'])]
    public function consent(Request $request): Response
    {
        $clientId = $request->query->get('client_id');
        if (!$clientId || !$this->getUser()) {
            return $this->redirectToRoute('admin_index');
        }
        $appClient = $this->em->getRepository(Client::class)->findOneBy(['identifier' => $clientId]);
        $uuid = Uuid::fromBase32($clientId);
        $appUser = $this->em->getRepository(User::class)->findOneBy(['uuid' => $uuid]);

        if (!$appClient) {
            return $this->redirectToRoute('app_public_index');
        }

        // Get the client scopes
        $requestedScopes = explode(' ', $request->query->get('scope'));
        // Get the client scopes in the database
        $clientScopes = $appClient->getScopes();

        // Check all requested scopes are in the client scopes
        if (count(array_diff($requestedScopes, $clientScopes)) > 0) {
            return $this->redirectToRoute('admin_index');
        }

        // Check if the user has already consented to the scopes
        /** @var User $user */
        //$user = $this->em->getRepository(User::class)->findOneBy(['email' => $appClient->getName()]);
        $user = $this->getUser();
        $userData = $this->em->getRepository(User::class)->find($this->getUser());
       // $appName = $userData->getUserdetails()->getFirstName() . ' ' . $userData->getUserdetails()->getLastName();

        $userConsents = $user->getOAuth2UserConsents()->filter(
            fn (OAuth2UserConsent $consent) => $consent->getClient() === $appClient
        )->first() ?: null;
        $userScopes = $userConsents?->getScopes() ?? [];
        $hasExistingScopes = count($userScopes) > 0;

        // If user has already consented to the scopes, give consent
        if (count(array_diff($requestedScopes, $userScopes)) === 0) {
            $request->getSession()->set('consent_granted', true);
            return $this->redirectToRoute('oauth2_authorize', $request->query->all());
        }

        // Remove the scopes to which the user has already consented
        $requestedScopes = array_diff($requestedScopes, $userScopes);

        // Map the requested scopes to scope names

        $scopeNames = [
            'PROFILE' => 'Profile',
            'MEDIA' => 'Media',
            'BLOCK_READ' => 'Block read',
            'BLOCK_WRITE' => 'Block write'
        ];

        // Get all the scope names in the requested scopes.
        $requestedScopeNames = array_map(fn($scope) => $scopeNames[$scope], $requestedScopes);
        $existingScopes = array_map(fn($scope) => $scopeNames[$scope], $userScopes);

        if ($request->isMethod('POST')) {
            if ($request->request->get('consent') === 'yes') {
                $request->getSession()->set('consent_granted', true);
                // Add the requested scopes to the user's scopes
                $consents = $userConsents ?? new OAuth2UserConsent();
                $consents->setScopes(array_merge($requestedScopes, $userScopes));
                $consents->setClient($appClient);
                $consents->setCreated(new DateTimeImmutable());
                $consents->setExpires(new DateTimeImmutable('+30 days'));
                $consents->setIpAddress($request->getClientIp());
                $user->addOAuth2UserConsent($consents);
                $this->em->persist($consents);
                $this->em->flush();
            }
            if ($request->request->get('consent') === 'no') {
                $request->getSession()->set('consent_granted', false);
            }
            return $this->redirectToRoute('oauth2_authorize', $request->query->all());
        }
        return $this->render('o_auth2_consent/consent.html.twig', [
           // 'app_name' => $appClient->getName(),
            'email' => $user->getEmail(),
            'scopes' => $requestedScopeNames,
            'has_existing_scopes' => $hasExistingScopes,
            'existing_scopes' => $existingScopes,
            'request_uri' => $request->getRequestUri().'&_switch_user='.$appUser->getEmail()
        ]);
    }
}

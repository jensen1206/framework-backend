<?php

namespace App\Controller;

use App\Entity\SystemSettings;
use App\Settings\Settings;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class JwksController extends AbstractController
{
    use Settings;

    public function __construct(
        private readonly EntityManagerInterface $em
    )
    {
    }

    #[Route('.well-known/jwks.json', name: 'app_jwks', methods: ['GET'])]
    public function jwks(): Response
    {
        // Load the public key from the filesystem and use OpenSSL to parse it.
        $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
        $kernelDirectory = $this->getParameter('projectDir');
        $publicKey = openssl_pkey_get_public(file_get_contents($kernelDirectory . '/var/keys/public.key'));
        $details = openssl_pkey_get_details($publicKey);
        $jwks = [
            'keys' => [
                [
                    'kty' => 'RSA',
                    'alg' => 'RS256',
                    'use' => 'sig',
                    'kid' => $this->jwt_kid,
                    'n' => strtr(rtrim(base64_encode($details['rsa']['n']), '='), '+/', '-_'),
                    'e' => strtr(rtrim(base64_encode($details['rsa']['e']), '='), '+/', '-_'),
                ],
            ],
        ];
        return $this->json($jwks);
    }
}

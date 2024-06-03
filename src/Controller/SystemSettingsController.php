<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Contracts\Translation\TranslatorInterface;

#[Route('/admin/dashboard', name: 'dashboard')]
class SystemSettingsController extends AbstractController
{
    public function __construct(
        private readonly TranslatorInterface    $translator,
    )
    {
    }

    #[Route('/system-settings', name: '_basic_settings_system')]
    #[IsGranted('ROLE_ADMIN')]
    public function index(): Response
    {
        return $this->render('system_settings/index.html.twig', [
            'title' =>$this->translator->trans('System settings'),
        ]);
    }
}

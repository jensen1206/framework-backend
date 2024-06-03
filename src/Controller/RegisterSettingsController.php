<?php

namespace App\Controller;

use App\Entity\Account;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Translation\TranslatorInterface;

#[Route('/admin/dashboard', name: 'dashboard')]
class RegisterSettingsController extends AbstractController
{
    public function __construct(
        private readonly TranslatorInterface    $translator,
        private readonly EntityManagerInterface $em,
    )
    {
    }
    #[Route('/register-settings', name: '_register_settings_system')]
    public function index(): Response
    {
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->getUser()]);
        $this->denyAccessUnlessGranted('MANAGE_REGISTRATION', $account);
        //Registration settings
        return $this->render('register_settings/index.html.twig', [
            'title' =>$this->translator->trans('reg.Registration settings'),
        ]);
    }
}

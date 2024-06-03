<?php

namespace App\Controller;

use App\Entity\Account;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Translation\TranslatorInterface;

#[Route('/admin/dashboard', name: 'dashboard')]
class DesignController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly TranslatorInterface    $translator,
    )
    {
    }
    #[Route('/fonts', name: '_overview_fonts_design')]
    public function index(): Response
    {
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->getUser()]);
        $this->denyAccessUnlessGranted('MANAGE_FONTS', $account);
        return $this->render('design/index.html.twig', [
            'title' => $this->translator->trans('system.Manage Fonts'),
        ]);
    }

    #[Route('/design', name: '_overview_design')]
    public function design(): Response
    {
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->getUser()]);
        $this->denyAccessUnlessGranted('MANAGE_DESIGN_SETTINGS', $account);
        return $this->render('design/design.html.twig', [
            'title' => $this->translator->trans('design.Design settings'),
        ]);
    }
}

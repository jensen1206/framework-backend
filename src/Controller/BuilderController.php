<?php

namespace App\Controller;

use App\Entity\Account;
use App\Settings\Settings;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Translation\TranslatorInterface;

#[Route('/admin/dashboard', name: 'dashboard')]
class BuilderController extends AbstractController
{
    use Settings;
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly TranslatorInterface    $translator,
    )
    {
    }

    #[Route('/page-builder', name: '_overview_builder')]
    public function index(): Response
    {
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->getUser()]);
        $this->denyAccessUnlessGranted('MANAGE_SITE_BUILDER', $account);
        return $this->render('builder/index.html.twig', [
            'title' => $this->translator->trans('builder.Page-Builder'),
            'account' => $account
        ]);
    }

    #[Route('/builder-plugins', name: '_plugins_builder')]
    public function plugins(): Response
    {
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->getUser()]);
        $this->denyAccessUnlessGranted('MANAGE_BUILDER_PLUGINS', $account);
        return $this->render('builder/plugins.html.twig', [
            'title' => $this->translator->trans('builder.Plugins'),
            'account' => $account
        ]);
    }
}

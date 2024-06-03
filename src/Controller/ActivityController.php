<?php

namespace App\Controller;

use App\Entity\Account;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\Component\HttpFoundation\Request;

#[Route('/admin/dashboard', name: 'dashboard')]
class ActivityController extends AbstractController
{
    public function __construct(
        private readonly TranslatorInterface    $translator,
        private readonly EntityManagerInterface $em,
    )
    {
    }

    #[Route('/activity/{channel}', name: '_activity')]
    #[IsGranted('ROLE_ADMIN')]
    public function index(Request $request): Response
    {
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->getUser()]);
        $this->denyAccessUnlessGranted('MANAGE_ACTIVITY', $account);
        return $this->render('activity/index.html.twig', [
            'title' => $this->translator->trans('activity.Activity'),
            'account' => $account,
            'id' => '',
            'channel' => $request->get('channel')
        ]);
    }
    #[Route('/{id}/{channel}/activity', name: '_show_activity')]
    #[IsGranted('ROLE_ADMIN')]
    public function show_activity(Request $request): Response
    {
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->getUser()]);
        $this->denyAccessUnlessGranted('MANAGE_ACTIVITY', $account);
        return $this->render('activity/index.html.twig', [
            'title' => $this->translator->trans('activity.Activity'),
            'account' => $account,
            'id' => $request->get('id'),
            'channel' => $request->get('channel'),
        ]);
    }
}

<?php

namespace App\Controller;

use App\Entity\Account;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/admin/dashboard', name: 'dashboard')]
class BackupController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly TranslatorInterface    $translator,
    )
    {
    }

    #[Route('/backup', name: '_backup_system')]
    public function index(): Response
    {
       // dd(hash_file('sha384', $this->getParameter('projectDir').'/composer-setup.php'));

        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->getUser()]);
        $this->denyAccessUnlessGranted('MANAGE_BACKUP', $account);
        return $this->render('backup/index.html.twig', [
            'title' => $this->translator->trans('system.System backups'),
            'account' => $account
        ]);
    }
}

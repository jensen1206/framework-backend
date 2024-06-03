<?php

namespace App\Controller;

use App\AppHelper\Helper;
use App\Entity\Account;
use App\Entity\User;
use App\Service\ImageExif;
use App\Service\UploaderHelper;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Console\Messenger\RunCommandMessage;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Uid\Uuid;
use Symfony\Contracts\Translation\TranslatorInterface;

#[Route('/admin/dashboard', name: 'dashboard')]
class AccountsController extends AbstractController
{

    public function __construct(
        private readonly EntityManagerInterface $em,

        private readonly UploaderHelper         $uploaderHelper,
        private readonly string                 $uploadsPath,
        private readonly TranslatorInterface    $translator,
        private readonly ImageExif              $exif,
        private readonly Security               $security,
        private readonly MessageBusInterface    $bus,
    )
    {
    }

    /**
     * @throws Exception
     */
    #[Route('/accounts', name: '_accounts')]
    public function overview(): Response
    {

        if ($this->isGranted('ROLE_ADMIN')) {
            return $this->render('accounts/index.html.twig', [
                'title' => $this->translator->trans('profil.Registered users')
            ]);
        }
        return $this->redirect($this->generateUrl('app_dashboard'));
    }

    #[Route('/account/validate', name: '_validate_user', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function validate_user(): Response
    {
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->getUser()]);
        $this->denyAccessUnlessGranted('MANAGE_ACTIVATION', $account);
        return $this->render('accounts/validate-register-user.html.twig',
            [
                'account' => $account,
                'title' => $this->translator->trans('system.manual activation')
            ]);
    }

    #[Route('/account/{id}', name: '_show_account', methods: ['GET'])]
    public function show(Account $account): Response
    {
        if (!$this->isGranted('ROLE_SUPER_ADMIN', $this->getUser())) {
            $getUser = $this->em->getRepository(User::class)->getRoleByUser('SUPER_ADMIN', $account->getAccountHolder()->getId());
            if ($getUser) {
                return $this->redirect($this->generateUrl('app_dashboard'));
            }
        }
        if ($this->isGranted('ACCOUNT_SHOW', $account)) {
            return $this->render('accounts/show.html.twig',
                [
                    'account' => $account,
                ]);
        }
        return $this->redirect($this->generateUrl('app_dashboard'));
    }

    #[Route('/{id}/delete', name: '_delete', methods: ['GET'])]
    //  #[IsGranted('ACCOUNT_DELETE', subject: 'account',)]
    public function delete(Account $account): Response
    {
        return $this->render('accounts/show.html.twig',
            [
                'account' => $account,
            ]);
    }
}

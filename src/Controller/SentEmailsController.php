<?php

namespace App\Controller;

use App\Entity\Account;
use App\Entity\EmailsSent;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;
use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\Component\HttpFoundation\Request;
#[Route('/admin/dashboard', name: 'dashboard')]
class SentEmailsController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly TranslatorInterface    $translator,
    )
    {
    }

    #[Route('/sent-emails', name: '_sent_email')]
    public function index(): Response
    {
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->getUser()]);
        $this->denyAccessUnlessGranted('MANAGE_EMAIL', $account);
        return $this->render('sent_emails/index.html.twig', [
            'title' => $this->translator->trans('system.Sent emails'),
            'id' => ''
        ]);
    }

    #[Route('/send-email', name: '_send_email')]
    public function send_email(): Response
    {
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->getUser()]);
        $this->denyAccessUnlessGranted('SEND_EMAIL', $account);
        return $this->render('sent_emails/send-email.html.twig', [
            'title' => $this->translator->trans('email.Send e-mail'),
        ]);
    }
    #[Route('/{id}/sent-email', name: '_show_email_sent')]
    public function sent_email(Request $request): Response
    {
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->getUser()]);
        $this->denyAccessUnlessGranted('MANAGE_EMAIL', $account);
        return $this->render('sent_emails/index.html.twig', [
            'title' => $this->translator->trans('system.Sent emails'),
            'id' => $request->get('id')
        ]);
    }

    /**
     * @throws ExceptionInterface
     */
    #[Route('/{id}/iframe/sent-email', name: '_iframe_email_sent')]
    public function iframe_email(Request $request): Response
    {
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->getUser()]);
        $this->denyAccessUnlessGranted('MANAGE_EMAIL', $account);
        $sentEmail = $this->em->getRepository(EmailsSent::class)->find($request->get('id'));
        $serializer = new Serializer([new ObjectNormalizer()]);
        $sentEmailArr = $serializer->normalize($sentEmail);
        if($sentEmailArr['type'] == 'ds-email'){

            $sentEmailArr['content'] = $sentEmailArr['emailContext']['content'];
            $sentEmailArr['site_name'] = $sentEmailArr['emailContext']['site_name'];
        }
        if($sentEmailArr['type'] == 'public-email'){

            $sentEmailArr['content'] = $sentEmailArr['emailContext']['content'];
           // $sentEmailArr['site_name'] = $sentEmailArr['emailContext']['site_name'];
        }
        if($sentEmailArr['type'] == 'bu-email') {
            $sentEmailArr['content'] = $sentEmailArr['emailContext']['content'];
            $sentEmailArr['site_name'] = $sentEmailArr['emailContext']['site_name'];
            $sentEmailArr['version'] = $sentEmailArr['emailContext']['version'];
            $sentEmailArr['file_name'] = $sentEmailArr['emailContext']['file_name'];
            $sentEmailArr['file_size'] = $sentEmailArr['emailContext']['file_size'];
        }
        $sentEmailArr['preview'] = true;

        //dd($sentEmailArr);
        return $this->render('email_template/'.$sentEmail->getEmailTemplate(),$sentEmailArr);
    }
}

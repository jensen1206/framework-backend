<?php

namespace App\MessageHandler\Command;

use App\Entity\EmailsSent;
use App\Entity\SystemSettings;
use App\Entity\User;
use App\Message\Command\SaveEmail;
use App\Message\Command\SavePublicEmail;
use App\Message\Event\EmailPublicSentEvent;
use App\Message\Event\EmailSentEvent;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Console\Messenger\RunCommandMessage;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\Part\DataPart;
use Symfony\Component\Mime\Part\File;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\Component\HttpFoundation\Request;

#[AsMessageHandler]
class SavePublicEmailHandler
{

   // private int $savedId;
    private array $logSettings;
    private array $appSettings;
    private array $emailSettings;
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly TokenStorageInterface  $tokenStorage,
        private readonly MessageBusInterface    $bus,
        private readonly MailerInterface        $mailer,
        private readonly TranslatorInterface    $translator,
        private readonly LoggerInterface        $queueLogger,
        private readonly string                 $projectDir
    )
    {
        $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
        $this->appSettings = $settings->getApp();
        $this->emailSettings = $settings->getEmail()['forms'];
        $this->logSettings = $settings->getLog();
    }

    public function __invoke(SavePublicEmail $event): void
    {

        $suAdmin = $this->em->getRepository(User::class)->getRoleUser('SUPER_ADMIN');
        //TODO E-MAIL Speichern
        if($this->emailSettings['email_save_active']) {
            $sentEmail = new EmailsSent();
            $sentEmail->setAbsUser($event->getFormular());
            $sentEmail->setType($event->getType());
            $sentEmail->setSentFrom($event->getFrom());
            $sentEmail->setFromName($event->getFromName());
            $sentEmail->setSentTo($event->getTo());
            $sentEmail->setEmailCc($event->getCc());
            $sentEmail->setEmailBcc($event->getBcc());
            $sentEmail->setEmailSubject($event->getSubject());
            $sentEmail->setEmailTemplate($event->getTemplate());
            $sentEmail->setEmailContext($event->getContext());
            $sentEmail->setEmailAttachments($event->getAttachments());
            $this->em->persist($sentEmail);
            $this->em->flush();
        }

        if ($event->getAsync()) {
            $this->bus->dispatch(new EmailPublicSentEvent($event));

        } else {
            $this->send_sync_email($event);
        }

        if($this->logSettings['email_send']) {
            $request = new Request();
            $this->queueLogger->info($suAdmin->getEmail() . ' - ' . $this->translator->trans('log.E-mail sent'), [
                'type' => 'email',
                'subject' => $event->getSubject(),
                'account' => $suAdmin->getEmail(),
                'ip' => $request->getClientIp()
            ]);
        }
    }

    public function send_sync_email($event): void
    {
        try {
            $email = (new TemplatedEmail())
                ->from(new Address($event->getFrom(), $event->getFromName()))
                ->to(new Address($event->getTo()))
                ->subject($event->getSubject())
                ->htmlTemplate('email_template/' . $event->getTemplate())
                ->context($event->getContext());

            if(filter_var($this->emailSettings['reply_to'], FILTER_VALIDATE_EMAIL)){
                $email->replyTo($this->emailSettings['reply_to']);
            }
            if ($event->getCc()) {
                foreach ($event->getCc() as $tmp) {
                    $email->addCc(new Address($tmp, $tmp));
                }
            }
            if ($event->getBcc()) {
                foreach ($event->getBcc() as $tmp) {
                    $email->addBcc(new Address($tmp, $tmp));
                }
            }
            if ($event->getAttachments()) {
                foreach ($event->getAttachments() as $tmp) {
                    if(is_file($tmp['file'])){
                        $email->addPart(new DataPart(new File($tmp['file'], $tmp['name'])));
                    }
                }
            }
            $this->mailer->send($email);

        } catch (TransportExceptionInterface $e) {

        }
    }
}
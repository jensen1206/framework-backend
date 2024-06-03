<?php

namespace App\MessageHandler\Event;

use App\Entity\SystemSettings;
use App\Message\Command\SaveEmail;
use App\Message\Event\EmailSentEvent;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Messenger\RunCommandMessage;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Mime\Part\File;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\Part\DataPart;


#[AsMessageHandler]
class EmailSentEventHandler
{
    public function __construct(
        private readonly MailerInterface       $mailer,
        private readonly EntityManagerInterface $em,
        private readonly string                $siteName,
        private readonly string                $projectDir
    )
    {
    }

    public function __invoke(EmailSentEvent $event): void
    {
        try {
            $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
            $event->getSentEmail()->getFromName() ? $name = $event->getSentEmail()->getFromName() : $name = $settings->getApp()['site_name'];
            $email = (new TemplatedEmail())
                ->from(new Address($event->getSentEmail()->getFrom(), $name))
                ->to(new Address($event->getSentEmail()->getTo()))
                ->subject($event->getSentEmail()->getSubject())
                ->htmlTemplate('email_template/' . $event->getSentEmail()->getTemplate())
                ->context($event->getSentEmail()->getContext());
            if(filter_var($settings->getEmail()['reply_to'], FILTER_VALIDATE_EMAIL)){
                $email->replyTo($settings->getEmail()['reply_to']);
            }
            if ($event->getSentEmail()->getCc()) {
                foreach ($event->getSentEmail()->getCc() as $tmp) {
                    $email->addCc(new Address($tmp, $tmp));
                }
            }
            if ($event->getSentEmail()->getBcc()) {
                foreach ($event->getSentEmail()->getBcc() as $tmp) {
                    $email->addBcc(new Address($tmp, $tmp));
                }
            }
            if ($event->getSentEmail()->getAttachments()) {
                foreach ($event->getSentEmail()->getAttachments() as  $tmp){
                    $file = $this->projectDir . DIRECTORY_SEPARATOR . $tmp;
                    if(is_file($file)){
                        $email->addPart(new DataPart(new File($file)));
                    }
                }
            }
            $this->mailer->send($email);

        } catch (TransportExceptionInterface $e) {

        }

        //  new StopWorkerException();
        // $this->bus->dispatch(new RunCommandMessage('app:consume_messanger'));

    }
}
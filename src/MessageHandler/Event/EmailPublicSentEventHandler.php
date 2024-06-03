<?php

namespace App\MessageHandler\Event;

use App\Entity\SystemSettings;
use App\Message\Command\SaveEmail;
use App\Message\Event\EmailPublicSentEvent;
use App\Message\Event\EmailSentEvent;
use Doctrine\ORM\EntityManagerInterface;
use SMTPValidateEmail\Exceptions\NoConnection;
use SMTPValidateEmail\Exceptions\NoHelo;
use SMTPValidateEmail\Exceptions\NoMailFrom;
use SMTPValidateEmail\Exceptions\NoTimeout;
use SMTPValidateEmail\Exceptions\SendFailed;
use SMTPValidateEmail\Validator as SmtpEmailValidator;
use Symfony\Component\Console\Messenger\RunCommandMessage;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Mime\Part\File;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\Part\DataPart;
use Symfony\Component\Scheduler\Attribute\AsCronTask;
use Symfony\Component\Scheduler\Attribute\AsPeriodicTask;

//Europe/Berlin
#[AsMessageHandler]
class EmailPublicSentEventHandler
{
    public function __construct(
        private readonly MailerInterface        $mailer,
        private readonly EntityManagerInterface $em,
        private readonly MessageBusInterface    $bus,
        private readonly string                 $siteName,
        private readonly string                 $projectDir
    )
    {
    }

    /**
     * @throws NoConnection
     * @throws SendFailed
     * @throws NoTimeout
     * @throws NoMailFrom
     * @throws NoHelo
     */
    public function __invoke(EmailPublicSentEvent $event): void
    {
        try {
            $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
            $emailSettings = $settings->getEmail()['forms'];

            $emails = [$event->getSentEmail()->getTo()];
            $sender = $event->getSentEmail()->getFrom();

            $validator = new SmtpEmailValidator($emails, $sender);
            $results = $validator->validate();
            $smtp = true;
            foreach ($results as $email => $result) {
                if (!$result) {
                    $smtp = false;
                    $context = $event->getSentEmail()->getContext()['content'];
                    $from = $event->getSentEmail()->getFrom();
                    $to = $event->getSentEmail()->getTo();
                    $subject = $event->getSentEmail()->getSubject();
                    $message = "<html><body>$context</body></html>";
                    $headers = "MIME-Version: 1.0" . "\r\n";
                    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
                    $headers .= "From: $from";
                    mail($to, $subject, $message, $headers);
                    break;
                }
            }
            if ($smtp) {
                $email = (new TemplatedEmail())
                    ->from(new Address($event->getSentEmail()->getFrom(), $event->getSentEmail()->getFromName()))
                    ->to(new Address($event->getSentEmail()->getTo()))
                    ->subject($event->getSentEmail()->getSubject())
                    ->htmlTemplate('email_template/' . $event->getSentEmail()->getTemplate())
                    ->context($event->getSentEmail()->getContext());
                if (filter_var($emailSettings['reply_to'], FILTER_VALIDATE_EMAIL)) {
                    $email->replyTo($emailSettings['reply_to']);
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
                    foreach ($event->getSentEmail()->getAttachments() as $tmp) {
                        if (is_file($tmp['file'])) {
                            $email->addPart(new DataPart(new File($tmp['file'], $tmp['name'])));
                        }
                    }
                }
                $this->mailer->send($email);
            }
            // $this->bus->dispatch(new RunCommandMessage('messenger:consume scheduler_send_mail'));
        } catch (TransportExceptionInterface $e) {

        }


        //  new StopWorkerException();
        // $this->bus->dispatch(new RunCommandMessage('app:consume_messanger'));

    }
}
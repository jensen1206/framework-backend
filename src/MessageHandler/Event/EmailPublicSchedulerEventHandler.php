<?php

namespace App\MessageHandler\Event;


use App\Message\Event\EmailPublicSchedulerEvent;
use Symfony\Component\Console\Messenger\RunCommandMessage;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Messenger\MessageBusInterface;

#[AsMessageHandler]
class EmailPublicSchedulerEventHandler
{
    public function __construct(
        private readonly MessageBusInterface $bus,
    )
    {
    }

    public function __invoke(EmailPublicSchedulerEvent $event): void
    {
        $this->bus->dispatch(new RunCommandMessage('messenger:consume async'));
        $this->bus->dispatch(new RunCommandMessage('messenger:consume liip_imagine --time-limit=3600 --memory-limit=256M'));
       // $this->bus->dispatch(new RunCommandMessage('messenger:stop-workers'));
        //$this->bus->dispatch(new RunCommandMessage('messenger:consume scheduler_send_mail'));
       //$this->bus->dispatch(new RunCommandMessage('okvpn:cron'));
    }
}
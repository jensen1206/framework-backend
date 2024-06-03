<?php

namespace App\Cron;
use Okvpn\Bundle\CronBundle\CronSubscriberInterface;
use Symfony\Component\Console\Messenger\RunCommandMessage;
use Symfony\Component\Messenger\MessageBusInterface;

class RocketsCron implements CronSubscriberInterface
{
    public function __construct(
        private readonly MessageBusInterface         $bus,
    )
    {
    }

    public function __invoke(array $arguments = []): void
    {
       // $this->bus->dispatch(new RunCommandMessage('messenger:consume async --limit=10'));
    }

    public static function getCronExpression(): string
    {
        return '*/5 * * * *';
    }
}
<?php

namespace App\Cron;
use Okvpn\Bundle\CronBundle\Attribute\AsCron;
use Symfony\Component\Console\Messenger\RunCommandMessage;
use Symfony\Component\Messenger\MessageBusInterface;

#[AsCron('* 0 * * *', lock: true, messenger: false, jitter: 3600)]
class DailyRocketsApp
{
    public function __construct(
        private readonly MessageBusInterface $bus,
    )
    {
    }
    public function __invoke(array $arguments = []): void
    {
        $this->bus->dispatch(new RunCommandMessage('app:clean_rockets_app'));
    }
}
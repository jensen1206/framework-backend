<?php

namespace App\Cron;

use Okvpn\Bundle\CronBundle\Attribute\AsCron;
use Symfony\Component\Console\Messenger\RunCommandMessage;
use Symfony\Component\Messenger\MessageBusInterface;

#[AsCron('*/1 * * * *', lock: true, messenger: false, jitter: 10)]
class SyncRocketsApp
{
    public function __construct(
        private readonly MessageBusInterface $bus,
    )
    {
    }

    public function __invoke(array $arguments = []): void
    {
        // --limit=5
        $this->bus->dispatch(new RunCommandMessage('messenger:stop-workers'));
        $this->bus->dispatch(new RunCommandMessage('messenger:consume async --limit=5'));
    }
}
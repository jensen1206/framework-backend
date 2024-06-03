<?php

namespace App\MessageHandler\Event;

use App\Message\Event\BackupEvent;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Console\Messenger\RunCommandMessage;
use Symfony\Component\Messenger\MessageBusInterface;

#[AsMessageHandler]
class BackupEventHandler
{
    public function __construct(
        private readonly string $backupPath,
        private readonly MessageBusInterface $bus
    )
    {
    }

    public function __invoke(BackupEvent $event): void
    {
        $gzFilePath = $this->backupPath . $event->getBackups()->getFileName();
        $dest = $this->backupPath . $event->getBackups()->getFileName().'.gz';
        $this->bus->dispatch(new RunCommandMessage('symandy:databases:backup'));
      //  sleep(5);
        if(is_file($gzFilePath)){
            $data = file_get_contents($gzFilePath);
            $gzdata = gzencode($data, 9);
            file_put_contents($dest, $gzdata);
        }
    }
}
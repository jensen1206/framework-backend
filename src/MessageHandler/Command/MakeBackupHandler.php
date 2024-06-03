<?php

namespace App\MessageHandler\Command;

use App\Entity\Backups;
use App\Message\Command\MakeBackup;
use App\Message\Event\BackupEvent;
use App\Message\Event\EmailSentEvent;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Messenger\RunCommandMessage;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

#[AsMessageHandler]
class MakeBackupHandler
{

    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly MessageBusInterface    $bus,
        private readonly string                 $backupPath,
    )
    {
    }

    public function __invoke(MakeBackup $makeBackup): void
    {
        $backup = new Backups();
        $backup->setFileName($makeBackup->zipFileName());
        $backup->setVersion($makeBackup->getVersion());
        $this->em->persist($backup);
        $this->em->flush();
        if ($makeBackup->isAsync()) {
            $this->bus->dispatch(new BackupEvent($backup));
        } else {
            $this->backupSync($backup->getId());
        }
    }

    public function backupSync($id): void
    {
        $backup = $this->em->getRepository(Backups::class)->find($id);
        $gzFilePath = $this->backupPath . $backup->getFileName();
        $this->bus->dispatch(new RunCommandMessage('symandy:databases:backup'));
        if(is_file($gzFilePath)){
            $dest = $this->backupPath . $backup->getFileName().'.gz';
            $data = file_get_contents($gzFilePath);
            $gzdata = gzencode($data, 1);
            file_put_contents($dest, $gzdata);
        }
        $cmd = sprintf('gzip %s', $gzFilePath);
        exec($cmd);
    }

}
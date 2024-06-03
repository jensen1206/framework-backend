<?php

namespace App\Message\Event;

use App\Entity\Backups;

class BackupEvent
{
    public function __construct(private readonly Backups $backups)
    {
    }

    public function getBackups(): Backups
    {
        return $this->backups;
    }
}
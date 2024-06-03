<?php

namespace App\Service;
use Symfony\Component\Console\Messenger\RunCommandMessage;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Console\Exception\RunCommandFailedException;
class CleanUpService
{
    public function __construct(private readonly MessageBusInterface $bus)
    {
    }

    public function cleanUp(): void
    {
        // Long task with some caching...
        // Once finished, dispatch some clean up commands
        //$this->bus->dispatch(new RunCommandMessage('app:my-cache:clean-up --dir=var/temp'));
       $this->bus->dispatch(new RunCommandMessage('cache:clear'));
    }
}
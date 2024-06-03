<?php

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Messenger\RunCommandMessage;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Messenger\MessageBusInterface;

#[AsCommand(
    name: 'app:consume_public_forms',
    description: 'Consume Public Forms',
)]
class ConsumePublicFormMessanger extends Command
{
    public function __construct(
        private readonly MessageBusInterface $bus,
    )
    {
        parent::__construct();
    }

    protected function configure(): void
    {

    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {

        $this->bus->dispatch(new RunCommandMessage('messenger:stop-workers'));
        $this->bus->dispatch(new RunCommandMessage('app:consume_messanger'));
      //  $this->bus->dispatch(new RunCommandMessage('messenger:consume scheduler_send_mail'));
        return Command::SUCCESS;
    }
}
<?php

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Messenger\RunCommandMessage;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Messenger\MessageBusInterface;

#[AsCommand(
    name: 'app:install_database',
    description: 'First Install the database',
)]
class InstallDatabase extends Command
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
        $io = new SymfonyStyle($input, $output);
        $this->bus->dispatch(new RunCommandMessage('doctrine:database:create'));


        $io->success('Install complete.');
        return Command::SUCCESS;
    }
}
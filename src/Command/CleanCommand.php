<?php

namespace App\Command;

use App\AppHelper\Helper;
use App\Service\UploaderHelper;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Messenger\RunCommandMessage;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Messenger\MessageBusInterface;

#[AsCommand(
    name: 'app:clean_rockets_app',
    description: 'Clean App',
)]
class CleanCommand extends Command
{
    public function __construct(
        private readonly MessageBusInterface $bus,
        private readonly UploaderHelper      $uploaderHelper,
        private readonly string              $uploadsPath
    )
    {
        parent::__construct();
    }

    protected function configure(): void
    {

    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {

        $helper = Helper::instance();
        $dir = $this->uploadsPath . $this->uploaderHelper::CONVERT;
        $helper->recursive_destroy_dir($dir);
        $this->bus->dispatch(new RunCommandMessage('league:oauth2-server:clear-expired-tokens'));
        $this->bus->dispatch(new RunCommandMessage('cache:clear'));
        return Command::SUCCESS;
    }
}
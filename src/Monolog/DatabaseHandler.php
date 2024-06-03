<?php

namespace App\Monolog;
use App\Entity\Account;
use App\Entity\Client;
use App\Entity\Log;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Exception\ORMException;
use Monolog\Handler\AbstractProcessingHandler;
use Monolog\LogRecord;
use Symfony\Bundle\SecurityBundle\Security;
class DatabaseHandler  extends AbstractProcessingHandler
{
    private $entityManager;

    /**
     * @var Security
     */
    private $security;

    public function __construct(
        EntityManagerInterface $entityManager,
        Security $security
    ) {
        parent::__construct();
        $this->entityManager = $entityManager;
        $this->security = $security;
    }

    /**
     */
    protected function write(LogRecord $record): void
    {
        $log = new Log();
        $log->setMessage($record['message']);
        $log->setContext($record['context']);
        $log->setLevel($record['level']);
        $log->setLevelName($record['level_name']);
        $log->setChannel($record['channel']);
        $log->setExtra($record['extra']);
        $log->setFormatted($record['formatted']);

        $user = $this->security->getUser();

        if ($user instanceof User) {
            $log->setUser($user);
        }

        /*if (isset($record['context']['clientId']) && is_int($record['context']['clientId'])) {
            $clientReference = $this
                ->entityManager
                ->getReference(\League\Bundle\OAuth2ServerBundle\Model\Client::class, $record['context']['clientId']);

            $log->setClient($clientReference);
        }*/

        $this->entityManager->persist($log);
        $this->entityManager->flush();
    }
}
<?php

namespace App\Command;

use App\AppHelper\Helper;
use App\Entity\Account;
use App\Entity\SystemSettings;
use App\Entity\User;
use App\Settings\Settings;
use Doctrine\DBAL\Exception;
use Doctrine\ORM\EntityManagerInterface;
use League\Bundle\OAuth2ServerBundle\Model\Client;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Uid\UuidV1;
use Symfony\Contracts\Translation\TranslatorInterface;

#[AsCommand(
    name: 'app:first-install',
    description: 'First Install the application',
)]
class InstallCommand extends Command
{
    use Settings;

    public function __construct(
        private readonly EntityManagerInterface      $em,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly TranslatorInterface         $translator
    )
    {
        parent::__construct();

    }

    protected function configure(): void
    {
        $this
            ->addOption('admin-email', null, InputOption::VALUE_REQUIRED, 'Admin email address', 'admin@app.de')
            ->addOption('admin-password', null, InputOption::VALUE_REQUIRED, 'Admin password', 'admin')
            ->addOption('user-email', null, InputOption::VALUE_REQUIRED, 'User email address', 'user@app.de')
            ->addOption('user-password', null, InputOption::VALUE_REQUIRED, 'user password', 'user')
            ->addOption('redirect-uris', null, InputOption::VALUE_REQUIRED, 'Redirect URIs', 'http://localhost:8080/callback');
    }

    /**
     * @throws Exception
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $helper = Helper::instance();
        $adminEmail = $input->getOption('admin-email');
        $adminPassword = $input->getOption('admin-password');

        $userEmail = $input->getOption('user-email');
        $userPassword = $input->getOption('user-password');
        $redirectUris = explode(',', $input->getOption('redirect-uris'));

        $grantTypes = ['authorization_code', 'refresh_token', 'client_credentials'];

        $clientSecret = $helper->generate_callback_pw(128, 0, 64);
        //TODO ADD ADMIN
        $newAdmin = new User();
        $uuid = new UuidV1();
        $clientId = $uuid->toBase32();
        $newAdmin->setRoles(['ROLE_ADMIN']);
        $newAdmin->setUuid($uuid);
        $newAdmin->setEmail($adminEmail);
        $newAdmin->setIsVerified(true);
        $newAdmin->setPassword(
            $this->passwordHasher->hashPassword($newAdmin, $adminPassword)
        );
        $this->em->persist($newAdmin);
        $this->em->flush();

        $adminVoter = $this->admin_voter(null, 1);
        $voter = [];
        foreach ($adminVoter as $tmp) {
            $voter[] = $tmp['role'];
        }
        $account = new Account();
        $account->setVoter($voter);
        $account->setAccountHolder($newAdmin);
        $account->setMustValidated(false);
        $account->setChangePw(true);
        $account->setRegisterIp('127.0.0.1');
        $this->em->persist($account);
        $this->em->flush();

        $scopes = ['PROFILE', 'MEDIA', 'BLOCK_READ', 'BLOCK_WRITE'];
        $conn = $this->em->getConnection();
        $conn->insert('oauth2_client', [
            'identifier' => $clientId,
            'secret' => $clientSecret,
            'name' => $newAdmin->getEmail(),
            'redirect_uris' => implode(' ', $redirectUris),
            'grants' => implode(' ', $grantTypes),
            'scopes' => implode(' ', $scopes),
            'active' => 1,
            'allow_plain_text_pkce' => 0,
        ]);

        //TODO ADD USER
        $newUser = new User();
        $uuid = new UuidV1();
        $clientId = $uuid->toBase32();
        $newUser->setUuid($uuid);
        $newUser->setEmail($userEmail);
        $newUser->setIsVerified(true);
        $newUser->setPassword(
            $this->passwordHasher->hashPassword($newUser, $userPassword)
        );
        $this->em->persist($newUser);
        $this->em->flush();

        $publicVoter = $this->user_voter(null, 1);
        $voter = [];
        foreach ($publicVoter as $tmp) {
            $voter[] = $tmp['role'];
        }
        $userAccount = new Account();
        $userAccount->setAccountHolder($newUser);
        $userAccount->setVoter($voter);
        $userAccount->setMustValidated(false);
        $userAccount->setChangePw(true);
        $userAccount->setRegisterIp('127.0.0.1');
        $this->em->persist($userAccount);
        $this->em->flush();

        $clientSecret = $helper->generate_callback_pw(128, 0, 64);
        $scopes = ['BLOCK_READ'];
        $conn->insert('oauth2_client', [
            'identifier' => $clientId,
            'secret' => $clientSecret,
            'name' => 'App client',
            'redirect_uris' => implode(' ', $redirectUris),
            'grants' => implode(' ', $grantTypes),
            'scopes' => implode(' ', $scopes),
            'active' => 1,
            'allow_plain_text_pkce' => 0,
        ]);

        $io->success('Install complete.');

        return Command::SUCCESS;
    }
}

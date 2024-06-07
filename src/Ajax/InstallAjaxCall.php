<?php

namespace App\Ajax;


use App\AppHelper\Helper;
use App\Entity\Account;
use App\Entity\SystemSettings;
use App\Entity\User;
use App\Kernel;
use App\Settings\Settings;
use Defuse\Crypto\Exception\EnvironmentIsBrokenException;
use Defuse\Crypto\Key;
use Doctrine\DBAL\Exception\ConnectionException;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use SMTPValidateEmail\Exceptions\NoConnection;
use SMTPValidateEmail\Exceptions\NoHelo;
use SMTPValidateEmail\Exceptions\NoMailFrom;
use SMTPValidateEmail\Exceptions\NoTimeout;
use SMTPValidateEmail\Exceptions\SendFailed;
use Symfony\Component\Filesystem\Exception\IOExceptionInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Filesystem\Path;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mailer\Transport\Dsn;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Uid\UuidV1;
use Symfony\Contracts\Translation\TranslatorInterface;
use Gedmo\Sluggable\Util\Urlizer;
use Symfony\Component\Console\Messenger\RunCommandMessage;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Yaml\Yaml;
use Symfony\Component\Dotenv\Dotenv;

class InstallAjaxCall
{
    use Settings;

    protected object $responseJson;
    protected Request $data;

    public function __construct(
        private readonly EntityManagerInterface      $em,
        private readonly TranslatorInterface         $translator,
        private readonly Kernel                      $kernel,
        private readonly MailerInterface             $mailer,
        private readonly UserPasswordHasherInterface $userPasswordHasher,
        private readonly MessageBusInterface         $bus,
        private readonly UrlGeneratorInterface       $urlGenerator,
        private readonly string                      $projectDir,
        private readonly string                      $envVarDir,
        private readonly string                      $configDir,
        private readonly string                      $uploadsPath,
        private readonly string                      $uploads_chunks

    )
    {
    }

    /**
     * @throws Exception
     */
    public function ajaxInstallHandle(Request $request)
    {
        $this->data = $request;
        $this->responseJson = (object)['status' => false, 'msg' => date('H:i:s'), 'type' => $request->get('method')];
        if (!method_exists($this, $request->get('method'))) {
            throw new Exception("Method not found!#Not Found");
        }

        return call_user_func_array(self::class . '::' . $request->get('method'), []);
    }


    private function get_install_data(): object
    {

        $srv = $this->data->server;
        $this->responseJson->php_version_error = false;


        if (version_compare(PHP_VERSION, $srv->get('PHP_MIN'), '<')) {
            $this->responseJson->php_version_error = true;
            $this->responseJson->msg = sprintf($this->translator->trans('install.Installation not possible. Your PHP version %s is not compatible. A PHP version %s is required.'), PHP_VERSION, $srv->get('PHP_MIN'));
            return $this->responseJson;
        }

        $re = '~\d.*~';
        preg_match($re, PHP_DATADIR, $matches);
        $matches ? $v = $matches[0] : $v = '';
        $phpVersion = 'php' . $v;
        $conn = $this->em->getConnection('doctrine');
        $dbData = $conn->getParams();
        $appSecret = md5(time());
        $installUrl = $this->data->getSchemeAndHttpHost();
        $timeZone = $srv->get('APP_TIMEZONE');
        $categoryName = $srv->get('APP_CATEGORY_NAME');
        $postCatName = $srv->get('APP_POST_CATEGORY_NAME');


        try {
            $key = Key::createNewRandomKey();
            $key = $key->saveToAsciiSafeString();
        } catch (EnvironmentIsBrokenException $e) {
            $this->responseJson->msg = $e->getMessage();
            return $this->responseJson;
        }

        //$regDsn = '%(.+?)://(.*):(.+)@(.+)?:(\d{1,5})%';
        //preg_match($regDsn, $srv->get('MAILER_DSN'), $matches);
        $emailDsn = Dsn::fromString($srv->get('MAILER_DSN'));
        $email = [
            'type' => $emailDsn->getScheme(),
            'username' => $emailDsn->getUser(),
            'pw' => $emailDsn->getPassword(),
            'host' => $emailDsn->getHost(),
            'port' => $emailDsn->getPort()
        ];

        $record = [
            'email' => $email,
            'db' => $dbData,
            'env' => [
                'install_url' => $installUrl,
                'php_data_path' => $phpVersion,
                'timeZone' => $timeZone,
                'categoryName' => $categoryName,
                'postCatName' => $postCatName,
                'app_secret' => $appSecret,
                'defuse_key' => $key,
                'php_version' => $srv->get('PHP_VERSION'),
                'php_ini_path' => $srv->get('PHP_INI_DIR') ?? '',
                'site_name' => $srv->get('APP_SITE_NAME')
            ]
        ];


        $this->responseJson->status = true;
        $this->responseJson->record = $record;
        return $this->responseJson;
    }

    private function generate_secret(): object
    {
        $this->responseJson->status = true;
        $this->responseJson->secret = md5(time());
        return $this->responseJson;
    }

    private function make_defuse_key(): object
    {
        try {
            $key = Key::createNewRandomKey();
            $this->responseJson->key = $key->saveToAsciiSafeString();
        } catch (EnvironmentIsBrokenException $e) {
            $this->responseJson->msg = $e->getMessage();
            return $this->responseJson;
        }
        $this->responseJson->status = true;
        $this->responseJson->msg = $this->translator->trans('system.Crypto Key successfully created.');
        return $this->responseJson;
    }

    private function generate_password(): object
    {
        $helper = Helper::instance();
        $this->responseJson->status = true;
        $this->responseJson->pw = $helper->generate_callback_pw(16, 2, 6);
        return $this->responseJson;
    }

    /**
     * @throws SendFailed
     * @throws NoConnection
     * @throws NoTimeout
     * @throws NoMailFrom
     * @throws NoHelo
     */
    private function app_install(): object
    {
        $db = filter_var($this->data->get('db'), FILTER_UNSAFE_RAW);
        $email = filter_var($this->data->get('email'), FILTER_UNSAFE_RAW);
        $env = filter_var($this->data->get('env'), FILTER_UNSAFE_RAW);
        $user = filter_var($this->data->get('user'), FILTER_UNSAFE_RAW);
        if (!$db || !$email || !$env || !$user) {
            $this->responseJson->msg = $this->translator->trans('install.Please check your entries.') . ' (Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $re = '~\d.*~';
        preg_match($re, PHP_DATADIR, $matches);
        $matches ? $v = $matches[0] : $v = '';
        $phpVersion = 'php' . $v;

        $helper = Helper::instance();
        $db = json_decode($db, true);
        $email = json_decode($email, true);
        $env = json_decode($env, true);
        $user = json_decode($user, true);


        if (str_ends_with($env['install_url'], '/')) {
            $env['install_url'] = preg_replace('%/$%', '', $env['install_url']);
        }

        $env['install_url'] = filter_var($env['install_url'], FILTER_VALIDATE_URL);
        if (!$env['install_url']) {
            $this->responseJson->msg = $this->translator->trans('install.Please check your entries.') . ' (Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }

        $timeZone = $helper->trim_string($env['timeZone']);
        $categoryName = Urlizer::urlize($helper->trim_string($env['categoryName']), '-');
        $postCatName = Urlizer::urlize($helper->trim_string($env['postCatName']), '-');
        $app_secret = $env['app_secret'];
        $defuse_key = $env['defuse_key'];
        $site_name = $helper->trim_string($env['site_name']);
        if (!$timeZone || !$categoryName || !$postCatName || !$app_secret || !$defuse_key || !$site_name) {
            $this->responseJson->msg = $this->translator->trans('install.Please check your entries.') . ' (Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }

        if (!is_file($this->envVarDir . 'env.json')) {
            $envArr = $this->data->server;
            $vars = [
                'APP_VERSION' => $envArr->get('APP_VERSION'),
                'PHP_MIN' => '8.1',
                'SITE_BASE_URL' => $envArr->get('DATABASE_URL'),
                'APP_SITE_NAME' => $envArr->get('APP_SITE_NAME'),
                'APP_CATEGORY_NAME' => $envArr->get('APP_CATEGORY_NAME'),
                'APP_TIMEZONE' => $envArr->get('APP_TIMEZONE'),
                'APP_SECRET' => $app_secret,
                'DATABASE_URL' => $envArr->get('DATABASE_URL'),
                'MESSENGER_TRANSPORT_DSN' => $envArr->get('MESSENGER_TRANSPORT_DSN'),
                'MAILER_DSN' => $envArr->get('MAILER_DSN'),
                'OAUTH_PRIVATE_KEY' => $envArr->get('OAUTH_PRIVATE_KEY'),
                'OAUTH_PUBLIC_KEY' => $envArr->get('OAUTH_PUBLIC_KEY'),
                'OAUTH_PASSPHRASE' => $envArr->get('OAUTH_PASSPHRASE'),
                'OAUTH_ENCRYPTION_KEY' => $envArr->get('OAUTH_ENCRYPTION_KEY'),
                'LOCK_DSN' => $envArr->get('LOCK_DSN'),
                'PHP_VERSION_DATA' => $phpVersion

            ];
            $vars = json_encode($vars, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_HEX_QUOT | JSON_HEX_TAG | JSON_UNESCAPED_SLASHES);
            file_put_contents($this->envVarDir . 'env.json', $vars);

            //$this->responseJson->msg = $this->translator->trans('install.Configuration file not found.') . ' (Ajx-' . __LINE__ . ')';
            //return $this->responseJson;
        }


        $createDb = $db['create_database'] ?? null;

        $host = $helper->trim_string($db['host']);
        $port = (int)$db['port'];
        $dbUser = $helper->trim_string($db['user']);
        $dbPassword = $db['password'];
        $dbname = $helper->trim_string($db['dbname']);
        $serverVersion = $helper->trim_string($db['serverVersion']);
        $charset = $helper->trim_string($db['charset']);
        if (!$dbUser || !$port || !$host || !$dbPassword || !$dbname || !$serverVersion || !$charset) {
            $this->responseJson->msg = $this->translator->trans('install.Please check your entries.') . ' (Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $databaseDsn = sprintf('mysql://%s:%s@%s:%d/%s?serverVersion=%s&charset=%s', $dbUser, $dbPassword, $host, $port, $dbname, $serverVersion, $charset);

        $emailType = $helper->trim_string($email['type']);
        $emailUser = $helper->trim_string($email['username']);
        $emailPw = $email['pw'];
        $emailHost = $helper->trim_string($email['host']);
        $emailPort = (int)$email['port'];
        $emailAbs = filter_var($helper->trim_string($email['abs_email']), FILTER_VALIDATE_EMAIL);
        $emailAbsName = trim($email['abs_name'] ?? '');
        if (!$emailType || !$emailUser || !$emailPw || !$emailHost || !$emailPort || !$emailAbs) {
            $this->responseJson->msg = $this->translator->trans('install.Please check your entries.') . ' (Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $emailDsn = sprintf('%s://%s:%s@%s:%d', $emailType, $emailUser, $emailPw, $emailHost, $emailPort);


        $benutzerEmail = filter_var($helper->trim_string($user['email']), FILTER_VALIDATE_EMAIL);
        if (!$benutzerEmail) {
            $this->responseJson->msg = $this->translator->trans('install.Please check your entries.') . ' (Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }

        $bnPw = $user['pw'];
        $bnPwRepeat = $user['repeat_pw'];
        if ($bnPw != $bnPwRepeat) {
            $this->responseJson->msg = $this->translator->trans('register.The password fields must match.');
            return $this->responseJson;
        }
        if (strlen($bnPw) < 8) {
            $this->responseJson->msg = sprintf($this->translator->trans('install.The password must be at least %d characters long'), 8);
            return $this->responseJson;
        }

        $envJson = json_decode(file_get_contents($this->envVarDir . 'env.json'), true);
        $envJson['DATABASE_URL'] = $databaseDsn;
        $envJson['MAILER_DSN'] = $emailDsn;
        $envJson['APP_SECRET'] = $app_secret;
        $envJson['SITE_BASE_URL'] = $env['install_url'];
        $envJson['APP_SITE_NAME'] = $site_name;
        $envJson['APP_CATEGORY_NAME'] = $categoryName;
        $envJson['APP_POST_CATEGORY_NAME'] = $postCatName;
        $envJson['APP_TIMEZONE'] = $timeZone;
        $envJson['PHP_VERSION_DATA'] = $phpVersion;

        $envFile = $this->projectDir . DIRECTORY_SEPARATOR . '.env';
        if (is_file($envFile)) {
            $fileArr = file($envFile);
            $envFileArr = [];
            foreach ($fileArr as $file) {
                $searchFile = $helper->pregWhitespace($file);
                if(str_starts_with($searchFile, 'DATABASE_URL')) {
                    $addFile = sprintf('DATABASE_URL="%s"',$envJson['DATABASE_URL'])."\r\n";
                } else if (str_starts_with($searchFile, 'SITE_BASE_URL')) {
                    $addFile = sprintf('SITE_BASE_URL="%s"', $envJson['SITE_BASE_URL'])."\r\n";
                } else if (str_starts_with($searchFile, 'APP_SITE_NAME')) {
                    $addFile = sprintf('APP_SITE_NAME="%s"', $envJson['APP_SITE_NAME'])."\r\n";
                } else if (str_starts_with($searchFile, 'MAILER_DSN')) {
                    $addFile = sprintf('MAILER_DSN=%s', $envJson['MAILER_DSN'])."\r\n";
                } else if (str_starts_with($searchFile, 'APP_SECRET')) {
                    $addFile = sprintf('APP_SECRET=%s', $envJson['APP_SECRET'])."\r\n";
                } else if (str_starts_with($searchFile, 'APP_CATEGORY_NAME')) {
                    $addFile = sprintf('APP_CATEGORY_NAME="%s"', $envJson['APP_CATEGORY_NAME'])."\r\n";
                } else if (str_starts_with($searchFile, 'APP_POST_CATEGORY_NAME')) {
                    $addFile = sprintf('APP_POST_CATEGORY_NAME="%s"', $envJson['APP_POST_CATEGORY_NAME'])."\r\n";
                } else if (str_starts_with($searchFile, 'PHP_VERSION_DATA')) {
                    $addFile = sprintf('PHP_VERSION_DATA="%s"', $envJson['PHP_VERSION_DATA'])."\r\n";
                } else {
                    $addFile = $file;
                }
                $envFileArr[] = $addFile;
            }

            file_put_contents($envFile, '');
            foreach ($envFileArr as $val) {
               file_put_contents($envFile, $val, FILE_APPEND | LOCK_EX);
            }
        }

        $envJson = json_encode($envJson);
        $envJson = json_encode(json_decode($envJson), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_HEX_QUOT | JSON_HEX_TAG | JSON_UNESCAPED_SLASHES);

        $oAuthConfig = $this->configDir . 'packages' . DIRECTORY_SEPARATOR . 'league_oauth2_server.yaml';
        if ($oAuthConfig) {
            $oAuthConf = Yaml::parseFile($oAuthConfig);
            $oAuthConf['league_oauth2_server']['authorization_server']['encryption_key'] = $defuse_key;
            $yamlDump = Yaml::dump($oAuthConf, 6);
            file_put_contents($oAuthConfig, $yamlDump);
        }

        file_put_contents($this->envVarDir . 'env.json', $envJson);

        $conn = $this->em->getConnection();
        if ($createDb) {
            try {
                $conn->getDatabase();
            } catch (ConnectionException|\Doctrine\DBAL\Exception $e) {
               // @$this->bus->dispatch(new RunCommandMessage('app:install_database'));
                $this->bus->dispatch(new RunCommandMessage('doctrine:database:create'));
            }
        }

        @$this->bus->dispatch(new RunCommandMessage('doctrine:schema:update --force'));

        $dir = $this->projectDir . DIRECTORY_SEPARATOR . 'var' . DIRECTORY_SEPARATOR . 'keys';
        $filesystem = new Filesystem();
        try {
            $filesystem->mkdir(
                Path::normalize($dir),
            );
        } catch (IOExceptionInterface $exception) {
            $this->responseJson->msg = "An error occurred while creating your directory at " . $exception->getPath();
            return $this->responseJson;
        }
        $bit = 2048;
        $command = sprintf('openssl genrsa -out %s/private.key %d', $dir, (int) $bit);
        exec($command);
        $command = sprintf('openssl rsa -in %s/private.key -pubout -out %s/public.key', $dir, $dir);
        exec($command);

        $user = $this->em->getRepository(User::class)->findByRole('SUPER_ADMIN');
        if (!$user) {
            $suAdmin = new User();
            $suAdmin->setPassword(
                $this->userPasswordHasher->hashPassword(
                    $suAdmin,
                    $bnPw
                )
            );
            $adminVoter = $this->admin_voter();
            $voter = [];
            foreach ($adminVoter as $tmp) {
                $voter[] = $tmp['role'];
            }
            $uuid = new UuidV1();
            $clientId = $uuid->toBase32();
            $suAdmin->setRoles(['ROLE_ADMIN', 'ROLE_SUPER_ADMIN']);
            $suAdmin->setEmail($benutzerEmail);
            $suAdmin->setUuid($uuid);
            $suAdmin->setIsVerified(true);
            $this->em->persist($suAdmin);
            $this->em->flush();

            $adminAccount = new Account();
            $adminAccount->setAccountHolder($suAdmin);
            $adminAccount->setVoter($voter);
            $adminAccount->setMustValidated(false);
            $adminAccount->setChangePw(true);
            $adminAccount->setRegisterIp($this->data->getClientIp());
            $this->em->persist($adminAccount);
            $this->em->flush();

            $clientSecret = $helper->generate_callback_pw(128, 0, 64);
            $scopes = ['PROFILE', 'MEDIA', 'BLOCK_READ', 'BLOCK_WRITE'];
            $grantTypes = ['authorization_code', 'refresh_token', 'client_credentials'];
            $redirectUris = ["http://localhost:8080/callback"];

            $conn = $this->em->getConnection();
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

            $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
            if (!$settings) {
                $defApp = $this->default_settings('app');
                $defApp['site_name'] = $site_name;
                $defApp['admin_email'] = $benutzerEmail;
                $app = $defApp;
                $app['default_admin_voter'] = $this->admin_voter();
                $app['default_user_voter'] = $this->user_voter();

                $defEmail = $this->default_settings('email');
                $defEmail['forms']['abs_email'] = $emailAbs;
                $defEmail['abs_email'] = $emailAbs;
                $defEmail['abs_name'] = $emailAbsName;

                $settings = new SystemSettings();
                $settings->setApp($app);
                $settings->setEmail($defEmail);
                $settings->setLog($this->default_settings('log'));
                $settings->setOauth($this->default_settings('oauth'));
                $settings->setRegister($this->default_settings('register'));
                $settings->setDesign($this->default_settings('design'));
                $this->em->persist($settings);
                $this->em->flush();
            }

            $filesystem = new Filesystem();
            try {
                $filesystem->mkdir(
                    Path::normalize($this->uploadsPath), 0777
                );
            } catch (IOExceptionInterface $exception) {
                echo "An error occurred while creating your directory at " . $exception->getPath();
            }
            try {
                $filesystem->mkdir(
                    Path::normalize($this->uploads_chunks), 0777
                );
            } catch (IOExceptionInterface $exception) {
                echo "An error occurred while creating your directory at " . $exception->getPath();
            }
            try {
                $filesystem->mkdir(
                    Path::normalize($this->uploadsPath . 'media'), 0777
                );
            } catch (IOExceptionInterface $exception) {
                echo "An error occurred while creating your directory at " . $exception->getPath();
            }
            try {
                $filesystem->mkdir(
                    Path::normalize($this->uploadsPath . 'mediathek'), 0777
                );
            } catch (IOExceptionInterface $exception) {
                echo "An error occurred while creating your directory at " . $exception->getPath();
            }
            try {
                $filesystem->mkdir(
                    Path::normalize($this->uploadsPath . 'account'), 0777
                );
            } catch (IOExceptionInterface $exception) {
                echo "An error occurred while creating your directory at " . $exception->getPath();
            }

            @$this->bus->dispatch(new RunCommandMessage('app:first-install'));
        }


        $this->responseJson->login_url = $this->urlGenerator->generate('app_login');
        $this->responseJson->status = true;
        return $this->responseJson;
    }

}
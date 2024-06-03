<?php

namespace App\Ajax;

use App\AppHelper\Helper;
use App\Entity\Account;
use App\Entity\AppSites;
use App\Entity\SystemSettings;
use App\Service\UploaderHelper;
use App\Settings\Settings;
use Defuse\Crypto\Exception\EnvironmentIsBrokenException;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Filesystem\Exception\IOExceptionInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Filesystem\Path;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\Transport\Dsn;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Yaml\Yaml;
use Defuse\Crypto\Key;

class SystemSettingsAjaxCall
{
    protected object $responseJson;
    protected Request $data;
    private Account $account;
    use Settings;

    public function __construct(
        private readonly EntityManagerInterface      $em,
        private readonly TranslatorInterface         $translator,
        private readonly Security                    $security,
        private readonly TokenStorageInterface       $tokenStorage,
        private readonly UploaderHelper              $uploaderHelper,
        private readonly UrlGeneratorInterface       $urlGenerator,
        private readonly MessageBusInterface         $bus,
        private readonly LoggerInterface             $queueLogger,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly string                      $projectDir,
        private readonly string                      $envVarDir
    )
    {
    }

    /**
     * @throws Exception
     */
    public function ajaxSystemSettingsHandle(Request $request)
    {
        $this->data = $request;
        $this->responseJson = (object)['status' => false, 'msg' => date('H:i:s'), 'type' => $request->get('method')];
        if (!method_exists($this, $request->get('method'))) {
            throw new Exception("Method not found!#Not Found");
        }
        $this->account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->tokenStorage->getToken()->getUser()]);
        if (!$this->security->isGranted('ROLE_ADMIN')) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        return call_user_func_array(self::class . '::' . $request->get('method'), []);
    }

    /**
     * @throws ExceptionInterface
     */
    private function get_system_settings(): object
    {

        $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
        $manage = $this->security->isGranted('MANAGE_OAUTH', $this->account);
        $oauth_config = [];
        $emailDsn = Dsn::fromString($this->data->server->get('MAILER_DSN'));
        $email = [
            'schema' => $emailDsn->getScheme(),
            'host' => $emailDsn->getHost(),
            'user' => $emailDsn->getUser(),
            'password' => $emailDsn->getPassword(),
            'port' => $emailDsn->getPort()
        ];
        $serializer = new Serializer([new ObjectNormalizer()]);
        $record = $serializer->normalize($settings);
        if ($manage) {
            $oauthConf = $this->projectDir . '/config/packages/league_oauth2_server.yaml';
            $parsed = Yaml::parse(file_get_contents($oauthConf));
            $oauth_config = [
                'encryption_key' => $parsed['league_oauth2_server']['authorization_server']['encryption_key'],
                'scopes' => implode(', ', $parsed['league_oauth2_server']['scopes']['available']),
                'def_scopes' => implode(', ', $parsed['league_oauth2_server']['scopes']['default']),
            ];
        } else {
            unset($record['oauth']);
        }

        $su = false;
        if ($this->security->isGranted('ROLE_SUPER_ADMIN')) {
            $su = true;
        }

        $pages = $this->em->getRepository(AppSites::class)->findBy(['siteType' => 'page'], ['position' => 'asc']);
        $pageArr = [];
        foreach ($pages as $tmp) {
            $url = '';
            if($tmp->getRouteName()) {
                $url = $this->urlGenerator->generate($tmp->getRouteName());
            }
            if($tmp->getSiteSlug()) {
                $url = $this->urlGenerator->generate('app_public_slug', ['slug' => $tmp->getSiteSlug()]);
            }
            $item = [
                'label' => $tmp->getSiteSeo()->getSeoTitle(),
                'url' => $url
            ];
            $pageArr[] = $item;
        }
        $this->responseJson->email_dsn = $email;
        $this->responseJson->page_select = $pageArr;
        $this->responseJson->oauth_config = $oauth_config;
        $this->responseJson->record = $record;
        $this->responseJson->status = true;
        $this->responseJson->su = $su;
        return $this->responseJson;
    }

    private function email_dsn_handle(): object
    {
        $manage = $this->security->isGranted('MANAGE_EMAIL_SETTINGS', $this->account);
        if (!$manage) {
            $this->responseJson->msg = $this->translator->trans('Missing authorisation') . ' (Sys-Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $email = filter_var($this->data->get('email'), FILTER_UNSAFE_RAW);
        if (!$email) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Sys-Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $email = json_decode($email, true);

        if (!is_file($this->envVarDir . 'env.json')) {
            $this->responseJson->msg = $this->translator->trans('install.Configuration file not found.') . ' (Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $helper = Helper::instance();
        $schema = $helper->pregWhitespace($email['schema']);
        $user = $helper->pregWhitespace($email['user']);
        $password = $helper->pregWhitespace($email['password']);
        $port = $helper->pregWhitespace($email['port']);
        $host = $helper->pregWhitespace($email['host']);
        $emailDsn = sprintf('%s://%s:%s@%s:%d', $schema, $user, $password, $host, $port);

        $envJson = json_decode(file_get_contents($this->envVarDir . 'env.json'), true);
        $envJson['MAILER_DSN'] = $emailDsn;
        $fileArr = [];
        $envFile = $this->projectDir . DIRECTORY_SEPARATOR . '.env';
        if (is_file($envFile)) {
            $files = file($envFile);
            foreach ($files as $file) {
                $searchFile = $helper->pregWhitespace($file);
                if(str_starts_with($searchFile, 'MAILER_DSN')) {
                    $addFile = sprintf('MAILER_DSN=%s',$envJson['MAILER_DSN'])."\r\n";
                } else {
                    $addFile = $file;
                }
                $fileArr[] = $addFile;
            }
        }
        if(!$fileArr) {
            return $this->responseJson;
        }
        file_put_contents($envFile, '');
        foreach ($fileArr as $val) {
            file_put_contents($envFile, $val, FILE_APPEND | LOCK_EX);
        }

        $envJson = json_encode($envJson, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_HEX_QUOT | JSON_HEX_TAG | JSON_UNESCAPED_SLASHES);
        file_put_contents($this->envVarDir . 'env.json', $envJson);

        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function log_settings_handle(): object
    {
        $manage = $this->security->isGranted('MANAGE_LOG', $this->account);
        if (!$manage) {
            $this->responseJson->msg = $this->translator->trans('Missing authorisation') . ' (Sys-Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }

        $log = filter_var($this->data->get('log'), FILTER_UNSAFE_RAW);
        if (!$log) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Sys-Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
        if (!$settings) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Sys-Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $log = json_decode($log, true);

        $log = array_map(function ($element) {
            return filter_var($element, FILTER_VALIDATE_BOOLEAN);
        }, $log);

        $settings->setLog($log);
        $this->em->persist($settings);
        $this->em->flush();

        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function app_settings_handle(): object
    {
        $manage = $this->security->isGranted('MANAGE_APP_SETTINGS', $this->account);
        if (!$manage) {
            $this->responseJson->msg = $this->translator->trans('Missing authorisation') . ' (Sys-Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $app = filter_var($this->data->get('app'), FILTER_UNSAFE_RAW);
        if (!$app) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Sys-Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
        if (!$settings) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Sys-Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $app = json_decode($app, true);

        if($app['upload_types']) {
            $types = str_replace(['.',' ',';',','], ['','','#','#'], $app['upload_types']);
            $types = explode('#', $types);
            $types = implode(',', $types);
            $app['upload_types'] = $types;
        }
        if(!$this->security->isGranted('ROLE_SUPER_ADMIN')) {
            $app['default_admin_voter'] = $settings->getApp()['default_admin_voter'];
            $app['default_user_voter'] = $settings->getApp()['default_user_voter'];
        }
        $helper = Helper::instance();
        $app = array_map(function ($element) use ($helper) {
            return $helper->escape($element);
        }, $app);

        $settings->setApp($app);
        $this->em->persist($settings);
        $this->em->flush();
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function oauth_settings_handle(): object
    {
        $manage = $this->security->isGranted('MANAGE_OAUTH', $this->account);
        if (!$manage) {
            $this->responseJson->msg = $this->translator->trans('Missing authorisation') . ' (Sys-Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $oauth = filter_var($this->data->get('oauth'), FILTER_UNSAFE_RAW);
        if (!$oauth) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Sys-Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
        if (!$settings) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Sys-Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $oauth = json_decode($oauth, true);
        $helper = Helper::instance();
        $oauth = array_map(function ($element) use ($helper) {
            return $helper->escape($element);
        }, $oauth);

        $settings->setOauth($oauth);
        $this->em->persist($settings);
        $this->em->flush();
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function email_settings_handle():object
    {
        $manage = $this->security->isGranted('MANAGE_EMAIL_SETTINGS', $this->account);
        if (!$manage) {
            $this->responseJson->msg = $this->translator->trans('Missing authorisation') . ' (Sys-Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $email = filter_var($this->data->get('email'), FILTER_UNSAFE_RAW);
        if (!$email) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Sys-Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
        if (!$settings) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Sys-Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $email = json_decode($email, true);
        $helper = Helper::instance();
        $email = array_map(function ($element) use ($helper) {
            return $helper->escape($element);
        }, $email);

        $settings->setEmail($email);
        $this->em->persist($settings);
        $this->em->flush();
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function generate_rsa(): object
    {
        $manage = $this->security->isGranted('MANAGE_OAUTH', $this->account);
        if (!$manage) {
            $this->responseJson->msg = $this->translator->trans('Missing authorisation') . ' (Sys-Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $pw = filter_var($this->data->get('pw'), FILTER_UNSAFE_RAW);
        $bit = filter_var($this->data->get('bit'), FILTER_VALIDATE_INT);
        if (!$pw || !$bit) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Sys-Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }
         if(!$this->passwordHasher->isPasswordValid($this->account->getAccountHolder(), $pw)){
             $this->responseJson->msg = $this->translator->trans('system.The password entered is incorrect!');
             return $this->responseJson;
         }
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

        $command = sprintf('openssl genrsa -out %s/private.key %d', $dir, (int) $bit);
        exec($command);
        $command = sprintf('openssl rsa -in %s/private.key -pubout -out %s/public.key', $dir, $dir);
        exec($command);


        $this->responseJson->msg = $this->translator->trans('system.The action was successfully executed.');
        $this->responseJson->title = $this->translator->trans('system.Executed');
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function make_defuse_key():object
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

    private function make_kid_key():object
    {
        $helper = Helper::instance();
        $key = $helper->generate_callback_pw(54,0, 30);
        $key .= $helper->generate_callback_pw(54,0, 27);
        $this->responseJson->key =strtolower( substr($key, 0, 32));
        $this->responseJson->msg = $this->translator->trans('system.Key successfully created.');
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function worker_handle():object
    {
        $handle = filter_var($this->data->get('handle'), FILTER_UNSAFE_RAW);
        $selfUrl = $this->data->getHost();
        /*if($selfUrl == 'localhost') {
            $path = 'php';
        } else {
            $path = PHP_BINARY;
            $re = '/\d(.+)/m';
            preg_match($re, $path, $matches);
            $version = $matches[0] ?? '';
            $path = 'php'.$version;
            $path = str_replace('-fpm','', $path);
            //dd($path);
            //$path = 'php' . substr(PHP_VERSION, 0, 3);
        }*/
        $path = $this->data->server->get('PHP_VERSION_DATA');
        $cmd = sprintf('%s %s/bin/console messenger:stop-workers', $path, $this->projectDir);
        exec($cmd);
        $this->responseJson->msg = date('H:i:s') . ' - '. $this->translator->trans('app.worker stopped');
        if($handle == 'restart') {
            $cmd = sprintf('%s %s/bin/console messenger:consume scheduler_send_mail > /dev/null 2>&1 &', $path, $this->projectDir);
            exec($cmd);
            $this->responseJson->msg = date('H:i:s') . ' - '. $this->translator->trans('app.Restart worker');
        }

        $this->responseJson->status =true;
        return $this->responseJson;
    }
}
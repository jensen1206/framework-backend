<?php

namespace App\Ajax;

use App\AppHelper\Helper;
use App\Entity\Account;
use App\Entity\Backups;
use App\Entity\SystemSettings;
use App\Entity\User;
use App\Message\Command\SaveEmail;
use App\Message\Event\MakeAppBackupEvent;
use App\Service\UploaderHelper;
use App\Settings\Settings;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Query\Parameter;
use Exception;
use League\Flysystem\FilesystemException;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Console\Exception\RunCommandFailedException;
use Symfony\Component\Console\Messenger\RunCommandMessage;
use Symfony\Component\Filesystem\Exception\IOExceptionInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Filesystem\Path;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Messenger\Exception\HandlerFailedException;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;
use Psr\Log\LoggerInterface;
use Ifsnop\Mysqldump as IMysqldump;

class BackupAjaxCall
{
    protected object $responseJson;
    private array $logSettings;
    private array $appSettings;
    private array $emailSettings;

    protected Request $data;
    use Settings;

    public function __construct(

        private readonly EntityManagerInterface $em,
        private readonly TranslatorInterface    $translator,
        private readonly Security               $security,
        private readonly TokenStorageInterface  $tokenStorage,
        private readonly UploaderHelper         $uploaderHelper,
        private readonly UrlGeneratorInterface  $urlGenerator,
        private readonly MessageBusInterface    $bus,
        private readonly LoggerInterface        $queueLogger,
        private readonly string                 $emailTemplatePath,
        private readonly string                 $projectDir,
        private readonly string                 $app_version,
        private readonly string                 $backupPath,
        private readonly string                 $archiveDir,
        private readonly string                 $envVarDir
    )
    {
        $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
        $this->logSettings = $settings->getLog();
        $this->appSettings = $settings->getApp();
        $this->emailSettings = $settings->getEmail();
    }

    /**
     * @throws Exception
     */
    public function ajaxBackupHandle(Request $request)
    {
        $this->data = $request;
        $this->responseJson = (object)['status' => false, 'msg' => date('H:i:s'), 'type' => $request->get('method')];
        if (!method_exists($this, $request->get('method'))) {
            throw new Exception("Method not found!#Not Found");
        }
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->tokenStorage->getToken()->getUser()]);
        if (!$this->security->isGranted('MANAGE_BACKUP', $account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        return call_user_func_array(self::class . '::' . $request->get('method'), []);
    }


    /**
     * @throws FilesystemException
     * @throws Exception
     */
    private function make_backup(): object
    {
        /** @var User $user */
        $user = $this->tokenStorage->getToken()->getUser();
        $this->uploaderHelper->makePrivateDirectory($this->uploaderHelper::BACKUP);


        try {

            $db = $this->em->getConnection()->getParams();
            if(isset($this->appSettings['db_version'])) {
                $dbVersion = str_replace('.','', $this->appSettings['db_version']);
            } else {
                $dbVersion = '100';
            }
            $file = $db['dbname'] . '_' .$dbVersion .'_'.time().'.sql';


            $dsn = sprintf('mysql:host=%s;dbname=%s', $db['host'], $db['dbname']);
            $dump = new IMysqldump\Mysqldump($dsn, $db['user'], $db['password']);
            $dump->start($this->backupPath.$file);
            if(!is_file($this->backupPath . $file)){
                $this->responseJson->msg = 'Fehlgeschlagen - (Ajx-' . __LINE__ . ')';
                return $this->responseJson;
            }

            $data = file_get_contents($this->backupPath . $file);
            $regEx = '@(/\*!.*)@s';
            preg_match($regEx, $data, $matches);
            $dumpFile = $matches[0] ?? null;
            if($dumpFile){
                file_put_contents($this->backupPath . $file, $dumpFile);
            }
            $dumpFile ? $sql = $dumpFile : $sql = $data;
            $fileName = $file . '.gz';
            $gzdata = gzencode($sql, 9);
            file_put_contents($this->backupPath . $fileName, $gzdata);
            unlink($this->backupPath . $file);
        } catch (\Exception $e) {
            $this->responseJson->msg = 'Fehlgeschlagen - (Ajx-' . __LINE__ . ')  '.$e->getMessage();
            return $this->responseJson;
        }


        if ($fileName) {
            $fileSize = $this->uploaderHelper->getFileSize($fileName, $this->uploaderHelper::BACKUP, false);
            $backup = new Backups();
            $backup->setFileName($fileName);
            $backup->setVersion($this->app_version);
            $backup->setFileSize($fileSize);
            $backup->setFileCreated(true);
            $this->em->persist($backup);
            $this->em->flush();
            $this->responseJson->title = $this->translator->trans('backup.Backup created');
            $this->responseJson->msg = $this->translator->trans('backup.Backup was successfully created and saved.');
            $this->responseJson->status = true;
            if ($this->logSettings['backup_created']) {
                $this->queueLogger->info($this->translator->trans('log.Database backup created'), [
                    'type' => 'backup',
                    'account' => $user->getEmail(),
                    'ip' => $this->data->getClientIp()
                ]);
            }
        }

        return $this->responseJson;
    }

    /**
     * @throws ExceptionInterface
     */
    private function get_send_modal(): object
    {
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);

        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (BAC-Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $backup = $this->em->getRepository(Backups::class)->find($id);
        if (!$backup) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (BAC-Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $helper = Helper::instance();
        $serializer = new Serializer([new ObjectNormalizer()]);
        $normalize = $serializer->normalize($backup);
        $normalize['fileSize'] = $helper->FileSizeConvert((float)$normalize['fileSize']);
        $this->responseJson->record = $normalize;
        $this->responseJson->recipient = $this->appSettings['admin_email'];
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function send_backup_email(): object
    {
        /** @var User $user */
        $user = $this->tokenStorage->getToken()->getUser();
        $this->responseJson->title = $this->translator->trans('Error');
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $recipient = filter_var($this->data->get('recipient'), FILTER_VALIDATE_EMAIL);
        $description = filter_var($this->data->get('description'), FILTER_UNSAFE_RAW);
        if (!$id || !$recipient) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (E-Mail Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $backup = $this->em->getRepository(Backups::class)->find($id);
        if (!$backup) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (BAC Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $helper = Helper::instance();
        $attach[] = sprintf('var/uploads/%s/%s', $this->uploaderHelper::BACKUP, $backup->getFileName());
        $args = [
            'async' => $this->emailSettings['async_active'],
            'type' => 'bu-email',
            'subject' => $this->translator->trans('backup.Database backup'),
            'from' => $this->appSettings['admin_email'],
            'from_name' => $this->appSettings['site_name'],
            'template' => 'send-database-backup-email.html.twig',
            'to' => $recipient,
            'context' => [
                'site_name' => $this->appSettings['site_name'],
                'file_name' => $backup->getFileName(),
                'file_size' => $helper->FileSizeConvert((float)$backup->getFileSize()),
                'version' => $backup->getVersion(),
                'content' => $description
            ],
            'attachments' => $attach,
        ];
        $this->bus->dispatch(new SaveEmail($args));
        $this->responseJson->status = true;
        if ($this->emailSettings['async_active']) {
            $this->responseJson->title = $this->translator->trans('email.E-mail is being sent');
            $this->responseJson->msg = $this->translator->trans('email.The e-mail will be sent shortly.');
        } else {
            $this->responseJson->title = $this->translator->trans('system.E-mail sent');
            $this->responseJson->msg = $this->translator->trans('system.The e-mail was sent successfully.');
        }
        return $this->responseJson;
    }

    /**
     * @throws FilesystemException
     */
    private function delete_backup(): object
    {
        /** @var User $user */
        $user = $this->tokenStorage->getToken()->getUser();
        $this->responseJson->title = $this->translator->trans('Error');
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $type = filter_var($this->data->get('type'), FILTER_UNSAFE_RAW);
        if (!$id || !$type) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (E-Mail Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $backup = $this->em->getRepository(Backups::class)->find($id);
        if (!$backup) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (BAC Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }
        switch ($type) {
            case 'db-backup':
                $this->uploaderHelper->deleteFile($backup->getFileName(), $this->uploaderHelper::BACKUP, false);
                break;
            case 'app-backup':
                $archivId = filter_var($this->data->get('archiv'), FILTER_UNSAFE_RAW);
                $filesystem = new Filesystem();
                if (!$archivId) {
                    $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (E-Mail Ajx-' . __LINE__ . ')';
                    return $this->responseJson;
                }
                if (is_file($this->archiveDir . $archivId . '.json')) {
                    $filesystem->remove($this->archiveDir . $archivId . '.json');
                }
                if(is_dir($this->archiveDir . $archivId)) {
                    $filesystem->remove($this->archiveDir . $archivId);
                }
                $this->uploaderHelper->deleteFile($backup->getFileName(), $this->uploaderHelper::BACKUP, false);
                break;
        }

        $this->em->remove($backup);
        $this->em->flush();

        $this->responseJson->status = true;
        $this->responseJson->title = $this->translator->trans('swal.Backup deleted');
        $this->responseJson->msg = $this->translator->trans('swal.Backup was successfully deleted.');
        if ($this->logSettings['backup_deleted']) {
            $this->queueLogger->info($this->translator->trans('log.Database backup deleted'), [
                'type' => 'backup',
                'account' => $user->getEmail(),
                'ip' => $this->data->getClientIp()
            ]);
        }


        return $this->responseJson;
    }

    private function make_duplicate(): object
    {


        $this->responseJson->title = $this->translator->trans('Error');
        $fileTime = time();
        $fileId = md5($fileTime);
        $prDir = $this->projectDir . DIRECTORY_SEPARATOR;
        $dest = $this->archiveDir . $fileId . DIRECTORY_SEPARATOR;

        $filesystem = new Filesystem();
        try {
            $filesystem->mkdir(
                Path::normalize($this->archiveDir . $fileId), 0777
            );
        } catch (IOExceptionInterface $exception) {
            // echo "An error occurred while creating your directory at " . $exception->getPath();
            $this->responseJson->msg = "An error occurred while creating your directory at " . $exception->getPath();
            return $this->responseJson;
        }

        $phpVersion = $this->data->server->get('PHP_VERSION_DATA');
        $db = $this->em->getConnection()->getParams();
        $dsn = sprintf('mysql:host=%s;dbname=%s', $db['host'], $db['dbname']);

        try {
            $dump = new IMysqldump\Mysqldump($dsn, $db['user'], $db['password']);
            $dump->start($dest . 'database.sql');
            if(!is_file($dest . 'database.sql')){
                $this->responseJson->msg = 'Fehlgeschlagen - (ajx-' . __LINE__ . ')';
                return $this->responseJson;
            }
        } catch (Exception $e) {
            $this->responseJson->msg = 'Fehlgeschlagen - (ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }


        $data = file_get_contents($dest . 'database.sql');
        $regEx = '@(/\*!.*)@s';
        preg_match($regEx, $data, $matches);
        $dumpFile = $matches[0] ?? null;
        if($dumpFile){
            file_put_contents($dest . 'database.sql', $dumpFile);
        }

        $envFile = $this->envVarDir . 'env.json';
        if (!is_file($envFile)) {
            $this->responseJson->msg = $this->translator->trans('install.Configuration not found.');
            return $this->responseJson;
        }
        $envJson = json_decode(file_get_contents($envFile), true);
        $envJson['APP_SITE_NAME'] = $this->appSettings['site_name'];
        $envJson['APP_VERSION'] = $this->appSettings['version'];

        $data = [
            'id' => $fileId,
            'php_version' => $this->data->server->get('PHP_MIN'),
            'export_vendor' => $this->appSettings['export_vendor'],
            'created' => false,
            'type' => 'app-backup',
            'status_msg' => $this->translator->trans('backup.in progress'),
            'site_url' => $this->data->server->get('SITE_BASE_URL'),
            'env' => $envJson
        ];

        $prettyJson = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_HEX_QUOT | JSON_HEX_TAG | JSON_UNESCAPED_SLASHES);
        file_put_contents($dest . 'config.json', $prettyJson);

        $backup = new Backups();
        $backup->setFileName('archiv-' . $fileId . '.zip');
        $backup->setVersion($this->app_version);
        $backup->setType('app-backup');
        $backup->setArchiveId($fileId);
        $backup->setFileCreated(false);
        $this->em->persist($backup);
        $this->em->flush();

        $this->bus->dispatch(new MakeAppBackupEvent($data));
        $cmd = sprintf('%s %s/bin/console messenger:stop-workers', $phpVersion, $this->projectDir);
        exec($cmd);
        $cmd = sprintf('%s %s/bin/console messenger:consume scheduler_send_mail > /dev/null 2>&1 &', $phpVersion, $this->projectDir);
        exec($cmd);
        $this->responseJson->title = $this->translator->trans('backup.in progress');
        $this->responseJson->msg = $this->translator->trans('backup.Archive is being created and will be available shortly.');
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function backup_table(): object
    {
        $filesystem = new Filesystem();
        $helper = Helper::instance();
        if (is_dir($this->archiveDir)) {
            $scannedBackups = array_diff(scandir($this->archiveDir), array('..', '.'));
            foreach ($scannedBackups as $tmp) {

                if (is_file($this->archiveDir . $tmp)) {
                    $file = $this->archiveDir . $tmp;
                    $fileInfo = pathinfo($file);

                    if ($fileInfo['extension'] == 'json') {
                        $json = json_decode(file_get_contents($file), true);
                        $buRepo = $this->em->getRepository(Backups::class)->findOneBy(['archiveId' => $json['id']]);
                        if ($buRepo) {
                            if (isset($json['file_size']) && $json['file_size']) {
                                $fileSize = $json['file_size'];
                            } else {
                                try {
                                    $fileSize = $this->uploaderHelper->getFileSize($buRepo->getFileName(), $this->uploaderHelper::BACKUP, 0);
                                } catch (Exception $e) {
                                    $fileSize = 0;
                                }
                            }

                            $buRepo->setFileSize($fileSize);
                            $buRepo->setFileCreated($json['created']);
                            $buRepo->setStatusMsg($json['status_msg']);
                            $this->em->persist($buRepo);
                            $this->em->flush();
                            $filesystem->remove($file);
                        }
                    }
                }
            }
        }
        $columns = array(
            'b.fileName',
            '',
            'b.createdAt',
            'b.fileSize',
            'b.type',
            'b.version',
            'b.version',
            '',
            '',
            '',
            ''
        );

        $request = $this->data->request->all();
        $search = (string)$request['search']['value'];

        $query = $this->em->createQueryBuilder();
        $query
            ->from(Backups::class, 'b')
            ->select('b');

        if (isset($request['search']['value'])) {
            $query->andWhere(
                'b.createdAt LIKE :searchTerm OR
                 b.fileName LIKE :searchTerm OR
                 b.type LIKE :searchTerm OR
                 b.archiveId LIKE :searchTerm OR
                 b.statusMsg LIKE :searchTerm OR
                 b.version LIKE :searchTerm');
            $query->setParameters(new ArrayCollection([
                new Parameter('searchTerm', '%' . $search . '%'),
            ]));
        }
        if (isset($request['order'])) {
            $query->orderBy($columns[$request['order']['0']['column']], $request['order']['0']['dir']);
        } else {
            $query->orderBy('b.createdAt', 'DESC');
        }
        if ($request['length'] != -1) {
            $query->setFirstResult($request['start']);
            $query->setMaxResults($request['length']);
        }

        $table = $query->getQuery()->getArrayResult();
        $data_arr = array();
        if (!$table) {
            $this->responseJson->draw = $request['draw'];
            $this->responseJson->recordsTotal = 0;
            $this->responseJson->recordsFiltered = 0;
            $this->responseJson->data = $data_arr;
            return $this->responseJson;
        }
        $helper = Helper::instance();
        foreach ($table as $tmp) {

            if ($tmp['type'] == 'db-backup') {

                $btn = 'btn-email btn btn-switch-blue dark';
                $instBtn = '<button class="btn btn-outline-secondary pe-none disabled dark text-nowrap btn-sm"><i class="bi bi-download me-2"></i>' . $this->translator->trans('backup.Installer') . '</button>';
            } else {
                $file = sprintf('installer-%s',  $tmp['fileName']);
                $instUrl = $this->urlGenerator->generate('download_media', ['is_public' => 0, 'directory' => 'backups', 'file' => $file]);
                $btn = 'btn btn-outline-secondary pe-none disabled dark';
                $instBtn = '<button data-url="' . $instUrl . '" class="btn-download btn btn-warning-custom dark text-nowrap btn-sm"><i class="bi bi-download me-2"></i>' . $this->translator->trans('backup.Installer') . '</button>';
            }

            if ($tmp['fileCreated']) {
                $status = '<span class="text-success">' . $this->translator->trans('backup.created') . '</span>';
                if ($tmp['type'] == 'app-backup') {
                    $status = '<span class="text-success">' . $tmp['statusMsg'] . '</span>';
                }
                $downUrl = $this->urlGenerator->generate('download_media', ['is_public' => 0, 'directory' => 'backups', 'file' => $tmp['fileName']]);

                $dlBtn = '<button data-url="' . $downUrl . '" class="btn-download btn btn-success-custom dark text-nowrap btn-sm"><i class="bi bi-download me-2"></i>' . $this->translator->trans('system.Download') . '</button>';
            } else {
                $status = '<span class="text-danger">' . $this->translator->trans('backup.in progress') . '</span>';
                $dlBtn = '<button class="btn btn-outline-secondary pe-none disabled dark text-nowrap btn-sm"><i class="bi bi-download me-2"></i>' . $this->translator->trans('system.Download') . '</button>';
            }
            $delBtn = [
                'id' => $tmp['id'],
                'type' => $tmp['type'],
                'archiv' => $tmp['archiveId']
            ];



            $data_item = array();
            $data_item[] = $tmp['fileName'];
            $data_item[] = $status;
            $data_item[] = '<span class="d-block lh-1">' . $tmp['createdAt']->format('d.m.Y') . ' <small class="d-block mt-1 small-lg">' . $tmp['createdAt']->format('H:i:s') . '</small></span>';
            $data_item[] = $helper->FileSizeConvert((float)$tmp['fileSize']);
            $data_item[] = $tmp['type'];
            $data_item[] = $tmp['version'];
            $data_item[] = $instBtn;
            $data_item[] = $dlBtn;
            $data_item[] = '<button data-id="' . $tmp['id'] . '" class="' . $btn . ' text-nowrap btn-sm"><i class="bi bi-envelope me-2"></i>' . $this->translator->trans('backup.Email') . '</button>';
            $data_item[] = $delBtn;
            $data_arr[] = $data_item;
        }

        $allCount = $this->em->getRepository(Backups::class)->count([]);
        $this->responseJson->draw = $request['draw'];
        $this->responseJson->recordsTotal = $allCount;
        if ($search) {
            $this->responseJson->recordsFiltered = count($table);
        } else {
            $this->responseJson->recordsFiltered = $allCount;
        }
        $this->responseJson->data = $data_arr;
        return $this->responseJson;
    }
}
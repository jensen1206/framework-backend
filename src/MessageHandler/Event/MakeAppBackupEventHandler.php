<?php

namespace App\MessageHandler\Event;

use App\AppHelper\Helper;
use App\Message\Event\MakeAppBackupEvent;
use App\Service\BackupHelper;
use App\Service\BackupZip;
use App\Service\FlxZip;
use App\Service\UploaderHelper;
use Exception;
use Symfony\Component\Filesystem\Exception\IOExceptionInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Filesystem\Path;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Contracts\Translation\TranslatorInterface;
use ZipArchive;

#[AsMessageHandler]
class MakeAppBackupEventHandler
{
    public function __construct(
        private readonly TranslatorInterface $translator,
        private readonly UploaderHelper      $uploaderHelper,
        private readonly string              $envVarDir,
        private readonly string              $projectDir,
        private readonly string              $backupPath,
        private readonly string              $appInstallSource,
        private readonly string              $archiveDir
    )
    {
    }

    public function __invoke(MakeAppBackupEvent $event): void
    {
        $jsonFile = $this->archiveDir . $event->get_id() . DIRECTORY_SEPARATOR . 'config.json';
        $destFile = $this->archiveDir . $event->get_id() . DIRECTORY_SEPARATOR . 'archiv.zip';
        $destSql = $this->archiveDir . $event->get_id() . DIRECTORY_SEPARATOR . 'database.sql';
        $destEnv = $this->archiveDir . $event->get_id() . DIRECTORY_SEPARATOR . 'env.json';
        $installDest = $this->archiveDir . $event->get_id() . DIRECTORY_SEPARATOR;
        $installFinaleDir = $this->archiveDir . $event->get_id() . DIRECTORY_SEPARATOR . 'install' . DIRECTORY_SEPARATOR . 'archive' . DIRECTORY_SEPARATOR;
        $filesystem = new Filesystem();
        $phar = $this->projectDir . DIRECTORY_SEPARATOR;

        if (!is_file($jsonFile)) {
            return;
        }

        $json = json_decode(file_get_contents($jsonFile), true);
        if (!is_file($phar . 'composer.phar')) {
            if (!copy('https://getcomposer.org/download/latest-stable/composer.phar', $phar . 'composer.phar')) {
                $json['status_msg'] = $this->translator->trans('backup.failed') . ' ( copy composer.phar ' . __LINE__ . ')';
                $this->copy_config_to_archiv($json, $event, true);
                return;
            }
            $filesystem->chmod($phar . 'composer.phar', 0755);
        }

        $notCopy = ['node_modules', 'cache', 'backups', 'migrations', 'archive', 'log'];
        if(!$event->is_export_vendor()){
            $notCopy[] = 'vendor';
        }


        $za = new FlxZip($notCopy);
        $res = $za->open($destFile, ZipArchive::CREATE);
        if ($res === TRUE) {
            $za->addDir($this->projectDir, 'archiv');
            $za->close();
        } else {
            $json['status_msg'] = $this->translator->trans('backup.failed') . ' (' . __LINE__ . ')';
            $this->copy_config_to_archiv($json, $event, true);
            return;
        }


        $zip = new ZipArchive;
        if ($zip->open($this->appInstallSource) === TRUE) {
            $zip->extractTo($installDest);
            $zip->close();
        } else {
            $json['status_msg'] = $this->translator->trans('backup.failed') . ' (' . __LINE__ . ')';
            $this->copy_config_to_archiv($json, $event, true);
            return;
        }
        $json['created_date'] = time();

        if (is_dir($installDest . 'install')) {

            $filesystem->copy(
                $destFile, $installFinaleDir . 'archiv.zip'
            );
            $filesystem->copy(
                $destSql, $installFinaleDir . 'database.sql'
            );
            $filesystem->copy(
                $jsonFile, $installFinaleDir . 'config.json'
            );

            $helper = Helper::instance();
            $json['archiv_created'] = true;
            $json['file_size'] = $helper->get_file_size($installFinaleDir . 'archiv.zip');
            $json['sql_size'] = $helper->get_file_size($installFinaleDir . 'database.sql');
            $jsonUpd = json_encode($json, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_HEX_QUOT | JSON_HEX_TAG | JSON_UNESCAPED_SLASHES);
            file_put_contents($installFinaleDir . 'config.json', $jsonUpd);

            try {
                $filesystem->mirror($installDest . 'install', $this->backupPath . $event->get_id());

            } catch (IOExceptionInterface $e) {
                $json['status_msg'] = $this->translator->trans('backup.failed') . ' (' . __LINE__ . ')';
                $this->copy_config_to_archiv($json, $event, true);
                return;
            }

            try {
                $filesystem->remove($installDest . 'install');
            } catch (IOExceptionInterface $e) {
                $json['status_msg'] = $this->translator->trans('backup.failed') . ' (' . __LINE__ . ')';
                $this->copy_config_to_archiv($json, $event, true);
                return;
            }

            $zipFile = $this->backupPath . 'archiv-' . $event->get_id() . '.zip';
            $zaf = new BackupZip();
            $res = $zaf->open($zipFile, ZipArchive::CREATE);
            if ($res === TRUE) {
                $zaf->addDir($this->backupPath . $event->get_id(), 'install');
                $zaf->close();
            } else {
                $json['status_msg'] = $this->translator->trans('backup.failed') . ' (' . __LINE__ . ')';
                $this->copy_config_to_archiv($json, $event, true);
                return;
            }

            $filesystem->copy(
                $jsonFile, $this->archiveDir . $event->get_id() . '.json'
            );
            try {
                $filesystem->remove($this->backupPath . $event->get_id());
                $filesystem->remove($this->archiveDir . $event->get_id());
            } catch (IOExceptionInterface $e) {
                $json['status_msg'] = $this->translator->trans('backup.failed') . ' (' . __LINE__ . ')';
                $this->copy_config_to_archiv($json, $event, true);
                return;
            }

            try {
                $fileSize = $this->uploaderHelper->getFileSize('archiv-' . $event->get_id() . '.zip', $this->uploaderHelper::BACKUP, false);
                $jsonArchiv = $this->archiveDir . $event->get_id() . '.json';
                $archivJson = json_decode(file_get_contents($jsonArchiv), true);
                $archivJson['created'] = true;
                $archivJson['created_date'] = time();
                $archivJson['file_size'] = (float)$fileSize;
                $archivJson['status_msg'] = $this->translator->trans('backup.created');
                $this->set_finale_json($archivJson, $event);
            } catch (Exception $e) {
                $archivJson['status_msg'] = $this->translator->trans('backup.failed') . ' (- ' . $e->getMessage() . ' - ' . __LINE__ . ')';
                $this->set_finale_json($archivJson, $event);
                return;
            }
        }
    }

    private function copy_config_to_archiv($config, $event, $delete_folder = false): void
    {
        $filesystem = new Filesystem();
        $jsonFile = $this->archiveDir . $event->get_id() . DIRECTORY_SEPARATOR . 'config.json';
        $jsonUpd = json_encode($config, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_HEX_QUOT | JSON_HEX_TAG | JSON_UNESCAPED_SLASHES);
        file_put_contents($jsonFile, $jsonUpd);
        try {
            $filesystem->copy(
                $jsonFile, $this->archiveDir . $event->get_id() . DIRECTORY_SEPARATOR . $event->get_id() . '.json'
            );

        } catch (IOExceptionInterface $e) {

        }

        if ($delete_folder) {
            try {
                $filesystem->remove($this->archiveDir . $event->get_id());
            } catch (IOExceptionInterface $e) {

            }
        }
    }

    private function set_finale_json($json, $event): void
    {
        $jsonUpd = json_encode($json, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_HEX_QUOT | JSON_HEX_TAG | JSON_UNESCAPED_SLASHES);
        $jsonArchivFile = $this->archiveDir . $event->get_id() . '.json';
        file_put_contents($jsonArchivFile, $jsonUpd);
    }

}
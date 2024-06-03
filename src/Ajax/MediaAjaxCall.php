<?php

namespace App\Ajax;

use App\AppHelper\Helper;
use App\Entity\Account;
use App\Entity\Media;
use App\Entity\MediaCategory;
use App\Entity\MediaExif;
use App\Entity\OAuth2UserConsent;
use App\Entity\SystemSettings;
use App\Entity\User;
use App\Service\Fonts\ImportFonts;
use App\Service\ImageExif;
use App\Service\UploaderHelper;
use App\Settings\Settings;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Query\Expr\Join;
use Exception;
use League\Flysystem\Filesystem;
use League\Flysystem\FilesystemException;
use Liip\ImagineBundle\Imagine\Cache\CacheManager;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Console\Messenger\RunCommandMessage;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use Liip\ImagineBundle\Message\WarmupCache;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Messenger\MessageBusInterface;

class MediaAjaxCall
{
    protected object $responseJson;

    protected Request $data;
    use Settings;

    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly TranslatorInterface    $translator,
        private readonly Security               $security,
        private readonly UploaderHelper         $uploaderHelper,
        private readonly TokenStorageInterface  $tokenStorage,
        private readonly ImageExif              $imageExif,
        private readonly MessageBusInterface    $messageBus,
        private readonly string                 $uploadsPath,
        private readonly Filesystem             $publicUploadsFilesystem,
        private readonly CacheManager           $imagineCacheManager,
        private readonly ImportFonts            $importFonts,
        private readonly string                 $baseUrl,
        private readonly string                 $projectDir

    )
    {
    }

    /**
     * @throws Exception
     */
    public
    function ajaxMediaHandle(Request $request)
    {
        $this->data = $request;
        $this->responseJson = (object)['status' => false, 'msg' => date('H:i:s'), 'type' => $request->get('method')];
        if (!method_exists($this, $request->get('method'))) {
            throw new Exception("Method not found!#Not Found");
        }

        return call_user_func_array(self::class . '::' . $request->get('method'), []);
    }


    /**
     * @throws FilesystemException
     */
    private
    function upload_account_image(): object
    {
        $account_id = filter_var($this->data->get('account_id'), FILTER_VALIDATE_INT);
        $chunkIndex = filter_var($this->data->get('dzchunkindex'), FILTER_VALIDATE_INT);
        $chunksCount = filter_var($this->data->get('dztotalchunkcount'), FILTER_VALIDATE_INT);
        $file_id = filter_var($this->data->get('dzuuid'), FILTER_UNSAFE_RAW);
        $file = $this->data->files->get('file');
        $account = $this->em->getRepository(Account::class)->find($account_id);
        if (!$account) {
            $this->responseJson->title = $this->translator->trans('Error');
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }

        if (!$this->security->isGranted('ACCOUNT_EDIT', $account)) {
            $this->responseJson->title = $this->translator->trans('Error');
            $this->responseJson->msg = $this->translator->trans('Missing authorisation') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }

        try {
            $upload = $this->uploaderHelper->upload($file, $file_id, $this->uploaderHelper::ACCOUNT, true, true, intval($chunkIndex) ?? 0, intval($chunksCount) ?? 0);
            $extension = strtolower($file->guessExtension());
            if ($extension == 'svg') {
                $dir = $this->uploadsPath . $this->uploaderHelper::ACCOUNT . DIRECTORY_SEPARATOR;
                $fileName = $file_id . '.' . $file->guessExtension();
                $src = $dir . $fileName;
                if (is_file($src)) {
                    $helper = Helper::instance();
                    $convert = $helper->convert_svg_to_image($dir, $src, $file_id, $out = 'png');
                    if ($convert->status) {
                        $helper->move_file($convert->file, $dir . $file_id . '.png', true);
                        $upload = $convert->file_name;
                        $this->uploaderHelper->deleteFile($fileName, $this->uploaderHelper::ACCOUNT, true);
                    }
                }
            }

        } catch (Exception $e) {
            $this->responseJson->msg = $e->getMessage();
            return $this->responseJson;
        }
        $oldImage = $account->getImageFilename();
        if ($oldImage) {
            $this->uploaderHelper->deleteFile($oldImage, $this->uploaderHelper::ACCOUNT, true);
        }

        if ($upload) {
            $account->setImageFilename($upload);
            $this->em->persist($account);
            $this->em->flush();
            $this->responseJson->status = true;
            $this->responseJson->filename = $upload;
            return $this->responseJson;
        }

        return $this->responseJson;
    }


    /**
     * @throws Exception
     */
    private function media_upload(): object
    {
        $account_id = filter_var($this->data->get('account_id'), FILTER_VALIDATE_INT);
        $chunkIndex = filter_var($this->data->get('dzchunkindex'), FILTER_VALIDATE_INT);
        $chunksCount = filter_var($this->data->get('dztotalchunkcount'), FILTER_VALIDATE_INT);
        $chunkAktiv = filter_var($this->data->get('chunkAktiv'), FILTER_VALIDATE_BOOLEAN);
        $file_id = filter_var($this->data->get('dzuuid'), FILTER_UNSAFE_RAW);
        $show_filemanager = filter_var($this->data->get('show_filemanager'), FILTER_VALIDATE_INT);
        $media_category = filter_var($this->data->get('media_category'), FILTER_VALIDATE_INT);
        $lastModified = filter_var($this->data->request->get('lastModified'), FILTER_VALIDATE_INT);
        $filesize = filter_var($this->data->request->get('filesize'), FILTER_VALIDATE_INT);
        $file = $this->data->files->get('file');
        $account = $this->em->getRepository(Account::class)->find($account_id);
        if (!$account || !$media_category) {
            $this->responseJson->title = $this->translator->trans('Error');
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }

        if (!$this->security->isGranted('ACCOUNT_UPLOAD', $account)) {
            $this->responseJson->title = $this->translator->trans('Error');
            $this->responseJson->msg = $this->translator->trans('Missing authorisation') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $category = $this->em->getRepository(MediaCategory::class)->find($media_category);
        if (!$category) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $lastModified = date('Y-m-d H:i:s', (int)substr($lastModified, 0, strlen($lastModified) - 3));
        $lastModified = new DateTimeImmutable($lastModified);

        try {
            $upload = $this->uploaderHelper->upload($file, $file_id, $this->uploaderHelper::MEDIATHEK, true, $chunkAktiv, intval($chunkIndex) ?? 0, intval($chunksCount) ?? 0);
        } catch (Exception $e) {
            $this->responseJson->msg = $e->getMessage();
            return $this->responseJson;
        }

        if ($upload) {
            $fileDir = $this->uploadsPath . $this->uploaderHelper::MEDIATHEK . DIRECTORY_SEPARATOR;
            $filePath = $fileDir . $upload;
            $fileInfo = pathinfo($filePath);
            $extension = $fileInfo['extension'];
            $extensionImg = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

            if (in_array($extension, $extensionImg)) {
                $type = 'image';
                $pf = '/' . $this->uploaderHelper::MEDIATHEK . '/' . $upload;
                $this->messageBus->dispatch(new WarmupCache($pf, []));
            } else {
                $type = 'data';
            }


            $selfUrl = $this->data->getHost();
          /*  if ($selfUrl == 'localhost') {
                $path = 'php';
            } else {
               // $path = PHP_BINARY;
                $path = PHP_BINARY;
                $re = '/\d(.+)/m';
                preg_match($re, $path, $matches);
                $version = $matches[0] ?? '';
                $path = 'php'.$version;
                $path = str_replace('-fpm','', $path);

            }*/
            $path = $this->data->server->get('PHP_VERSION_DATA');
            $cmd = sprintf('%s %s/bin/console messenger:stop-workers', $path, $this->projectDir);
            exec($cmd);
            $cmd = sprintf('%s %s/bin/console messenger:consume scheduler_send_mail > /dev/null 2>&1 &', $path, $this->projectDir);
            exec($cmd);

            $mimeType = $this->uploaderHelper->getMimeType($upload, $this->uploaderHelper::MEDIATHEK, true);
            $helper = Helper::instance();
            $addMedia = new Media();
            $addMedia->setUser($category->getUser());
            $addMedia->setCategory($category);
            $addMedia->setFileName($upload);
            $addMedia->setOriginal($originalFilename);
            $addMedia->setSize($filesize);
            $addMedia->setSizeData($helper->get_image_size($filePath));
            $addMedia->setType($type);
            $addMedia->setExtension($extension);
            $addMedia->setShowFilemanager($show_filemanager);
            $addMedia->setMime($mimeType);
            $addMedia->setLastModified($lastModified);

            $addExif = new MediaExif();
            $exif = $this->imageExif->get_exif_data($upload, $this->uploaderHelper::MEDIATHEK, true);
            if ($exif->status) {
                $exifGPS = [];
                if ($exif->exifGPS) {
                    $lat1 = $exif->exifGPS['GPSLatitude1'] ?? null;
                    $long1 = $exif->exifGPS['GPSLongitude1'] ?? null;
                    if ($lat1 && $long1) {
                        $exifGPS = $exif->exifGPS;
                        $gpsExtract = $helper->gps_map_extract($exif->exifGPS);
                        $lon = $gpsExtract['GPSLongGrad'];
                        $lat = $gpsExtract['GPSLatGrad'];
                        $gpsGeo = $helper->get_curl_json_data($lat, $lon);
                        if ($gpsGeo->status) {
                            $addExif->setGpsGeo($gpsGeo->geo_json);
                        }
                    }
                }

                $addExif->setExifFile($exif->exifFile);
                $addExif->setExifComputed($exif->exifComputed);
                $addExif->setExifIfdo($exif->exifIFDO);
                $addExif->setExifExif($exif->exifExif);
                $addExif->setExifGps($exifGPS);
                $this->em->persist($addExif);

                $addMedia->setExifData($addExif);
            }
            $this->em->persist($addMedia);
            $this->em->flush();

            $this->responseJson->status = true;
            $this->responseJson->id = $addMedia->getId();
            $this->responseJson->ext = $addMedia->getExtension();
            $this->responseJson->filename = $addMedia->getOriginal();
            $this->responseJson->owner = $addMedia->getCategory()->getUser()->getEmail();
            $this->responseJson->category = $addMedia->getCategory()->getDesignation();
            $this->responseJson->size = $helper->FileSizeConvert((float)$filesize);
            $this->responseJson->mime = $addMedia->getMime();
            $this->responseJson->file_id = $file_id;
            return $this->responseJson;
        }
        return $this->responseJson;
    }

    /**
     * @throws \ImagickException
     * @throws Exception
     */
    private function convert_media(): object
    {
        $account_id = filter_var($this->data->get('account_id'), FILTER_VALIDATE_INT);
        $chunkIndex = filter_var($this->data->get('dzchunkindex'), FILTER_VALIDATE_INT);
        $chunksCount = filter_var($this->data->get('dztotalchunkcount'), FILTER_VALIDATE_INT);
        $chunkAktiv = filter_var($this->data->get('chunkAktiv'), FILTER_VALIDATE_BOOLEAN);
        $file_id = filter_var($this->data->get('dzuuid'), FILTER_UNSAFE_RAW);

        $media_category = filter_var($this->data->get('media_category'), FILTER_VALIDATE_INT);
        $lastModified = filter_var($this->data->request->get('lastModified'), FILTER_VALIDATE_INT);
        $filesize = filter_var($this->data->request->get('filesize'), FILTER_VALIDATE_INT);


        $file = $this->data->files->get('file');
        $account = $this->em->getRepository(Account::class)->find($account_id);
        if (!$account || !$media_category) {
            $this->responseJson->title = $this->translator->trans('Error');
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }

        if (!$this->security->isGranted('MANAGE_MEDIEN', $account)) {
            $this->responseJson->title = $this->translator->trans('Error');
            $this->responseJson->msg = $this->translator->trans('Missing authorisation') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $convert = filter_var($this->data->request->get('convert'), FILTER_VALIDATE_INT);


        try {
            $upload = $this->uploaderHelper->upload($file, $file_id, $this->uploaderHelper::CONVERT, true, $chunkAktiv, intval($chunkIndex) ?? 0, intval($chunksCount) ?? 0);
        } catch (Exception $e) {
            $this->responseJson->msg = $e->getMessage();
            return $this->responseJson;
        }

        if ($upload) {
            $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $quality = filter_var($this->data->get('quality'), FILTER_VALIDATE_INT);
            if (!$quality) {
                $quality = 80;
            }
            $this->responseJson->title = $this->translator->trans('Error');
            $fileDir = $this->uploadsPath . $this->uploaderHelper::CONVERT . DIRECTORY_SEPARATOR;
            $filePath = $fileDir . $upload;
            $fileInfo = pathinfo($filePath);

            $extension = $fileInfo['extension'];
            $extensionImg = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
            if ($convert == 2 || $convert == 3) {
                if ($extension != 'svg') {
                    $this->responseJson->msg = $this->translator->trans('converter.The file is not an SVG file.');
                    $this->responseJson->upload_status = false;
                    $this->responseJson->status = true;
                    return $this->responseJson;
                }
            }


            if ($extension != 'svg' && !in_array($extension, $extensionImg)) {
                $this->responseJson->msg = $this->translator->trans('converter.The file format is not supported.');
                $this->responseJson->upload_status = false;
                $this->responseJson->status = true;
                return $this->responseJson;
            }
            $ext = '';
            $convertFile = null;
            $helper = Helper::instance();
            $src = $this->uploadsPath . DIRECTORY_SEPARATOR . $this->uploaderHelper::CONVERT . DIRECTORY_SEPARATOR . $upload;
            if ($extension == 'svg' && is_file($src)) {
                if ($convert == 2) {
                    $convertFile = $helper->convert_svg_to_image($this->uploadsPath, $src, $fileInfo['filename'], 'png', $quality, false);
                    $ext = 'png';
                }
                if ($convert == 3) {
                    $convertFile = $helper->convert_svg_to_image($this->uploadsPath, $src, $fileInfo['filename'], 'png', $quality, true);
                    $ext = 'webp';
                }
            }
            if ($convert == 4 || $convert == 5) {
                if ($extension != 'webp') {
                    $this->responseJson->msg = $this->translator->trans('converter.The file is not an webP file.');
                    $this->responseJson->upload_status = false;
                    $this->responseJson->status = true;
                    return $this->responseJson;
                }
                if ($convert == 4) {
                    $out = 'png';
                } else {
                    $out = 'jpeg';
                }
                $convertFile = $helper->convert_webp_to_image($this->uploadsPath, $src, $fileInfo['filename'], $quality, $out);
            }

            if ($convert == 1 && in_array($extension, $extensionImg)) {
                $extensionImg = ['jpg', 'jpeg', 'png', 'gif'];
                if (!in_array($extension, $extensionImg)) {
                    $this->responseJson->msg = $this->translator->trans('converter.The file format is not supported.');
                    $this->responseJson->upload_status = false;
                    $this->responseJson->status = true;
                    return $this->responseJson;
                }
                $convertFile = $helper->convert_image_to_webp($this->uploadsPath, $src, $fileInfo['filename'], $quality);
                $ext = 'webp';
            }

            filter_var($this->data->get('save_convert_img'), FILTER_UNSAFE_RAW) ? $save_convert_img = true : $save_convert_img = false;
            $this->responseJson->save_convert_img = $save_convert_img;
            $this->responseJson->filename = $convertFile->file_name;

            if ($convertFile && $convertFile->status) {
                if (!$save_convert_img) {
                    // dd($convertFile);
                    $this->responseJson->directory = $this->uploaderHelper::CONVERT;
                    $this->responseJson->status = true;
                    $this->responseJson->upload_status = true;
                    return $this->responseJson;
                }
            } else {
                return $this->responseJson;
            }

            $lastModified = date('Y-m-d H:i:s', (int)substr($lastModified, 0, strlen($lastModified) - 3));
            $lastModified = new DateTimeImmutable($lastModified);
            $this->responseJson->directory = $this->uploaderHelper::MEDIATHEK;

            $srcFile = $this->uploaderHelper::CONVERT . DIRECTORY_SEPARATOR . $convertFile->file_name;
            $destFile = $this->uploadsPath . $this->uploaderHelper::MEDIATHEK . DIRECTORY_SEPARATOR . $convertFile->file_name;
            $category = $this->em->getRepository(MediaCategory::class)->find($media_category);
            if (!$category) {
                if (is_file($srcFile)) {
                    unlink($srcFile);
                }
                $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
                return $this->responseJson;
            }
            $this->uploaderHelper->move_file($srcFile, $this->uploaderHelper::MEDIATHEK . DIRECTORY_SEPARATOR . $convertFile->file_name);
            $show_filemanager = filter_var($this->data->get('show_filemanager'), FILTER_VALIDATE_INT);
            $type = 'image';
            $pf = '/' . $this->uploaderHelper::MEDIATHEK . '/' . $convertFile->file_name;
            $this->messageBus->dispatch(new WarmupCache($pf, []));
            $mimeType = $this->uploaderHelper->getMimeType($convertFile->file_name, $this->uploaderHelper::MEDIATHEK, true);
            $helper = Helper::instance();
            $addMedia = new Media();
            $addMedia->setUser($category->getUser());
            $addMedia->setCategory($category);
            $addMedia->setFileName($convertFile->file_name);
            $addMedia->setOriginal($originalFilename);
            $addMedia->setSize($filesize);
            $addMedia->setSizeData($helper->get_image_size($destFile));
            $addMedia->setType($type);
            $addMedia->setExtension($ext);
            $addMedia->setShowFilemanager($show_filemanager);
            $addMedia->setMime($mimeType);
            $addMedia->setLastModified($lastModified);
            $this->em->persist($addMedia);
            $this->em->flush();

            $this->responseJson->upload_status = true;
            $this->responseJson->status = true;
        }


        return $this->responseJson;
    }

    private function get_category_selects(): object
    {
        /** @var User $user */
        $user = $this->tokenStorage->getToken()->getUser();
        $mediaCat = $this->em->getRepository(MediaCategory::class);
        if ($user->isSuAdmin()) {
            $categories = $mediaCat->findBy([], ['user' => 'asc', 'position' => 'asc']);
        } else {
            $categories = $mediaCat->findBy(['user' => $user], ['position' => 'asc']);
        }

        $record = [];
        if ($categories) {
            foreach ($categories as $category) {
                if ($user->isSuAdmin() && $category->getUser()->getId() != $user->getId()) {
                    $label = $category->getDesignation() . ' - ' . $this->translator->trans('system.Owner') . ' (' . $category->getUser()->getEmail() . ')';
                } elseif ($category->getUser()->getId() == $user->getId() && $user->isSuAdmin()) {
                    $label = $category->getDesignation();
                } else {
                    $label = $category->getDesignation();
                }
                $item = [
                    'id' => $category->getId(),
                    'label' => $label,
                    'type' => $category->getType()
                ];
                $record[] = $item;
            }
        }
        $this->responseJson->record = $record;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function media_change_category(): object
    {
        $this->responseJson->title = $this->translator->trans('Error');
        $ids = filter_var($this->data->get('ids'), FILTER_UNSAFE_RAW);
        $catId = filter_var($this->data->get('category'), FILTER_VALIDATE_INT);
        if (!$ids || !$catId) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $ids = json_decode($ids, true);
        $category = $this->em->getRepository(MediaCategory::class)->find($catId);
        if (!$category) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        foreach ($ids as $tmp) {
            $media = $this->em->getRepository(Media::class)->find($tmp['id']);
            if (!$media) {
                continue;
            }
            $media->setCategory($category);
            $media->setUser($category->getUser());
            $this->em->persist($media);
            $this->em->flush();
        }
        $this->responseJson->status = true;
        $this->responseJson->title = $this->translator->trans('Changes saved');
        $this->responseJson->msg = $this->translator->trans('The changes have been saved successfully.');
        return $this->responseJson;
    }

    /**
     * @throws FilesystemException
     */
    private function delete_media_selects(): object
    {
        $ids = filter_var($this->data->get('ids'), FILTER_UNSAFE_RAW);
        $ids = json_decode($ids, true);
        $fileDir = $this->uploadsPath . $this->uploaderHelper::MEDIATHEK . DIRECTORY_SEPARATOR;
        $extensionImg = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        foreach ($ids as $tmp) {
            $media = $this->em->getRepository(Media::class)->find($tmp['id']);
            if (!$media) {
                continue;
            }

            $filename = $media->getFileName();
            $file = $fileDir . $media->getFileName();
            if (!is_file($file)) {
                continue;
            }
            if (in_array($media->getExtension(), $extensionImg)) {

                $cmd = sprintf('liip:imagine:cache:remove /%s/%s', $this->uploaderHelper::MEDIATHEK, $filename);
                $this->messageBus->dispatch(new RunCommandMessage($cmd));
            }

            $this->uploaderHelper->deleteFile($filename, $this->uploaderHelper::MEDIATHEK, true);
            $this->em->remove($media);
            $this->em->flush();
        }
        $this->responseJson->status = true;
        $this->responseJson->title = $this->translator->trans('system.Deleted');
        $this->responseJson->msg = $this->translator->trans('system.All entries have been deleted.');
        return $this->responseJson;
    }

    /**
     * @throws FilesystemException
     */
    private function delete_media(): object
    {
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $this->responseJson->title = $this->translator->trans('Error');
        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $media = $this->em->getRepository(Media::class)->find($id);
        if (!$media) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $filename = $media->getFileName();
        $fileDir = $this->uploadsPath . $this->uploaderHelper::MEDIATHEK . DIRECTORY_SEPARATOR;
        $file = $fileDir . $media->getFileName();
        if (is_file($file)) {
            $extensionImg = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
            if (in_array($media->getExtension(), $extensionImg)) {
                $cmd = sprintf('liip:imagine:cache:remove /%s/%s', $this->uploaderHelper::MEDIATHEK, $filename);
                $this->messageBus->dispatch(new RunCommandMessage($cmd));
            }
            $this->uploaderHelper->deleteFile($filename, $this->uploaderHelper::MEDIATHEK, true);
        }
        $this->em->remove($media);
        $this->em->flush();

        $this->responseJson->status = true;
        $this->responseJson->title = $this->translator->trans('system.Deleted');
        $this->responseJson->msg = $this->translator->trans('system.The file was successfully deleted.');
        return $this->responseJson;
    }

    private function get_media_category(): object
    {
        /** @var User $user */
        $user = $this->tokenStorage->getToken()->getUser();
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $handle = filter_var($this->data->get('handle'), FILTER_UNSAFE_RAW);
        if (!$handle) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }

        if ($handle == 'update' && !$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $designation = '';
        $description = '';

        if ($handle == 'update') {
            $category = $this->em->getRepository(MediaCategory::class)->find($id);
            if (!$category) {
                $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
                return $this->responseJson;
            }

            $designation = $category->getDesignation();
            $description = $category->getDescription();
            $user_id = $category->getUser()->getId();
        } else {
            $user_id = $user->getId();
        }

        $ud = $this->em->getRepository(User::class);
        $userArr = [];
        if ($user->isSuAdmin()) {
            $userData = $ud->findAll();
            foreach ($userData as $tmp) {
                $item = [
                    'id' => $tmp->getId(),
                    'label' => $tmp->getEmail()
                ];
                $userArr[] = $item;
            }
        }
        $this->responseJson->id = $id;
        $this->responseJson->designation = $designation;
        $this->responseJson->description = $description;
        $this->responseJson->user_id = $user_id;
        $this->responseJson->status = true;
        $this->responseJson->user_selects = $userArr;
        return $this->responseJson;
    }

    private function media_category_handle(): object
    {
        /** @var User $user */
        $user = $this->tokenStorage->getToken()->getUser();
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $handle = filter_var($this->data->get('handle'), FILTER_UNSAFE_RAW);
        $designation = filter_var($this->data->get('designation'), FILTER_UNSAFE_RAW);
        $description = filter_var($this->data->get('description'), FILTER_UNSAFE_RAW);
        $user_id = filter_var($this->data->get('user_id'), FILTER_VALIDATE_INT);
        if (!$handle || !$designation) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }

        if ($handle == 'update' && !$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }

        if ($handle == 'update') {
            $category = $this->em->getRepository(MediaCategory::class)->find($id);
            if (!$category) {
                $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
                return $this->responseJson;
            }
        } else {
            $category = new MediaCategory();
        }

        $category->setDesignation($designation);
        $category->setDescription($description);
        if ($user->isSuAdmin()) {
            $catUser = $this->em->getRepository(User::class)->find($user_id);
            $category->setUser($catUser);
        } else {
            $category->setUser($user);
        }
        $this->em->persist($category);
        $this->em->flush();
        if ($user->isSuAdmin()) {
            if ($category->getUser()->getId() != $user->getId()) {
                $catName = $category->getDesignation() . ' (' . $category->getUser()->getEmail() . ')';
            } else {
                $catName = $category->getDesignation();
            }
        } else {
            $catName = $category->getDesignation();
        }

        $this->responseJson->label = $catName;
        $this->responseJson->id = $category->getId();
        $this->responseJson->msg = $this->translator->trans('medien.Category successfully created.');
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function media_category_sortable(): object
    {
        /** @var User $user */
        $user = $this->tokenStorage->getToken()->getUser();
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $user]);
        if (!$this->security->isGranted('MANAGE_MEDIEN', $account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $ids = filter_var($this->data->get('ids'), FILTER_UNSAFE_RAW);
        if ($ids) {
            $i = 1;
            $ids = json_decode($ids, true);
            foreach ($ids as $tmp) {
                $category = $this->em->getRepository(MediaCategory::class)->findOneBy(['user' => $tmp['owner'], 'id' => $tmp['id']]);
                $category->setPosition($i);
                $this->em->persist($category);
                $this->em->flush();
                $i++;
            }
        }
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function delete_media_category(): object
    {
        $this->responseJson->title = $this->translator->trans('Error');
        /** @var User $user */
        $user = $this->tokenStorage->getToken()->getUser();
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $user]);
        if (!$this->security->isGranted('MANAGE_MEDIEN', $account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $catRepo = $this->em->getRepository(MediaCategory::class);
        $mediaRepo = $this->em->getRepository(Media::class);
        $category = $catRepo->find($id);
        if (!$category) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $defCategory = $catRepo->findOneBy(['user' => $category->getUser(), 'type' => 'first_cat']);
        if (!$defCategory) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $medien = $mediaRepo->findBy(['category' => $category]);
        foreach ($medien as $tmp) {
            $tmp->setCategory($defCategory);
            $this->em->persist($tmp);
            $this->em->flush();
        }
        $this->em->remove($category);
        $this->em->flush();

        $this->responseJson->status = true;
        $this->responseJson->title = $this->translator->trans('swal.Category deleted');
        $this->responseJson->msg = $this->translator->trans('swal.Category was successfully deleted.');
        return $this->responseJson;
    }

    private function media_details(): object
    {

        /** @var User $user */
        $user = $this->tokenStorage->getToken()->getUser();
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $user]);
        if (!$this->security->isGranted('MANAGE_MEDIEN', $account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $mediaRepo = $this->em->getRepository(Media::class);
        $media = $mediaRepo->findMediaById($id);
        if (!$media) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $mediumUrl = $this->uploaderHelper->getMediumPath($this->uploaderHelper::MEDIATHEK);
        $largeUrl = $this->uploaderHelper->getLargePath($this->uploaderHelper::MEDIATHEK);
        $helper = Helper::instance();
        $media['fileSize'] = $helper->FileSizeConvert((float)$media['size']);
        $media['medium_url'] = $mediumUrl;
        $media['large_url'] = $largeUrl;
        $media['baseUrl'] = $this->baseUrl;
        $gpsItem = '';
        $exifComputed = false;
        $exifExif = false;
        $exifFile = false;
        $exifGps = false;
        $exifIfdo = false;
        $this->responseJson->exif_status = false;
        if ($media['exifData']) {
            if ($media['exifData']['exifGps'] && $media['exifData']['gpsGeo']) {
                $gpsItem = $this->get_geo_data($media['exifData']['exifGps'], $media['exifData']['gpsGeo']);
            }
            $exifComputed = $media['exifData']['exifComputed'] ?? false;
            $exifExif = $media['exifData']['exifExif'] ?? false;
            $exifFile = $media['exifData']['exifFile'] ?? false;
            $exifGps = $media['exifData']['exifGps'] ?? false;
            $exifIfdo = $media['exifData']['exifIfdo'] ?? false;
            $this->responseJson->exif_status = true;
            unset($media['exifData']);
        }
        $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
        $this->responseJson->gps_status = (bool)$gpsItem;
        $this->responseJson->gmaps_active = (bool)$settings->getApp()['gmaps_active'];
        $this->responseJson->gps_daten = $gpsItem;
        $this->responseJson->exifComputed = $exifComputed;
        $this->responseJson->exifExif = $exifExif;
        $this->responseJson->exifFile = $exifFile;
        $this->responseJson->exifGps = $exifGps;
        $this->responseJson->exifIfdo = $exifIfdo;
        $this->responseJson->status = true;
        $this->responseJson->record = $media;
        return $this->responseJson;
    }

    private function get_geo_data($exifGps, $gpsGeo): array
    {
        if (!$exifGps || !$gpsGeo) {
            return [];
        }

        $properties = $gpsGeo['properties'] ?? null;
        $bbox = $gpsGeo['bbox'] ?? null;
        if ($bbox) {
            $bbox = urlencode(implode(',', $bbox));
        }
        $address = $properties['address'] ?? null;
        $properties ? $display_name = $properties['display_name'] ?? null : $display_name = '';
        $lat = $exifGps['GPSLatitude'] ?? '';
        $lon = $exifGps['GPSLongitude'] ?? '';
        $alt = $exifGps['GPSAltitude'] ?? '';
        if ($alt) {
            $alt = round((float)$alt, 2);
        } else {
            $alt = $this->translator->trans('unknown');
        }
        $marker = urlencode($lat . ',' . $lon);
        $iframe_ops = sprintf('https://www.openstreetmap.org/export/embed.html?bbox=%s&amp;layer=mapnik&amp;marker=%s', $bbox, $marker);
        $iframe_google = sprintf('https://maps.google.com/maps?q=%s,%s&hl=de&z=13&output=embed', $lat, $lon);
        return [
            'display_name' => $display_name,
            'address' => $address,
            'lat' => $lat,
            'lon' => $lon,
            'alt' => $alt,
            'bbox' => $bbox,
            'marker' => $marker,
            'lat_short' => round((float)$lat, 4),
            'lon_short' => round((float)$lon, 4),
            'iframe_google' => $iframe_google,
            'iframe_ops' => $iframe_ops
        ];
    }

    private function update_media_file(): object
    {
        $this->responseJson->title = $this->translator->trans('Error');
        /** @var User $user */
        $user = $this->tokenStorage->getToken()->getUser();
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $user]);
        if (!$this->security->isGranted('MANAGE_MEDIEN', $account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $catId = filter_var($this->data->get('category'), FILTER_VALIDATE_INT);
        if (!$id || !$catId) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $category = $this->em->getRepository(MediaCategory::class)->find($catId);
        if (!$category) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $media = $this->em->getRepository(Media::class)->find($id);
        if (!$media) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $showFilemanager = filter_var($this->data->get('showFilemanager'), FILTER_VALIDATE_INT);
        $title = filter_var($this->data->get('title'), FILTER_UNSAFE_RAW);
        $alt = filter_var($this->data->get('alt'), FILTER_UNSAFE_RAW);
        $description = filter_var($this->data->get('description'), FILTER_UNSAFE_RAW);
        $customCss = filter_var($this->data->get('customCss'), FILTER_UNSAFE_RAW);

        $media->setCategory($category);
        $media->setUser($category->getUser());
        $media->setShowFilemanager($showFilemanager);
        $media->setTitle($title);
        $media->setAlt($alt);
        $media->setDescription($description);
        $media->setCustomCss($customCss);
        $this->em->persist($media);
        $this->em->flush();

        $this->responseJson->user_email = $category->getUser()->getEmail();
        $this->responseJson->title = $this->translator->trans('Changes saved');
        $this->responseJson->msg = $this->translator->trans('The changes have been saved successfully.');
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    /**
     * @throws Exception
     * @throws FilesystemException
     * @throws ExceptionInterface
     */
    private function font_upload(): object
    {
        $account_id = filter_var($this->data->get('account_id'), FILTER_VALIDATE_INT);
        $chunkIndex = filter_var($this->data->get('dzchunkindex'), FILTER_VALIDATE_INT);
        $chunksCount = filter_var($this->data->get('dztotalchunkcount'), FILTER_VALIDATE_INT);
        $chunkAktiv = filter_var($this->data->get('chunkAktiv'), FILTER_VALIDATE_BOOLEAN);
        $file_id = filter_var($this->data->get('dzuuid'), FILTER_UNSAFE_RAW);
        $lastModified = filter_var($this->data->request->get('lastModified'), FILTER_VALIDATE_INT);
        $filesize = filter_var($this->data->request->get('filesize'), FILTER_VALIDATE_INT);
        $file = $this->data->files->get('file');
        $account = $this->em->getRepository(Account::class)->find($account_id);
        if (!$this->security->isGranted('MANAGE_FONTS', $account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }

        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $lastModified = date('Y-m-d H:i:s', (int)substr($lastModified, 0, strlen($lastModified) - 3));
        $lastModified = new DateTimeImmutable($lastModified);

        try {
            $upload = $this->uploaderHelper->upload($file, $file_id, $this->uploaderHelper::FONT_DIR, true, $chunkAktiv, intval($chunkIndex) ?? 0, intval($chunksCount) ?? 0);
        } catch (Exception $e) {
            $this->responseJson->msg = $e->getMessage();
            return $this->responseJson;
        }
        if ($upload) {
            $fileDir = $this->uploadsPath . $this->uploaderHelper::FONT_DIR . DIRECTORY_SEPARATOR;
            $filePath = $fileDir . $upload;
            $fileInfo = pathinfo($filePath);
            $extension = $fileInfo['extension'];

            $record = [
                'file_id' => $file_id,
                'lastModified' => $lastModified->format('d.m.Y H:i:s'),
                'filename' => $upload,
                'original' => $originalFilename,
                'fileInfo' => $fileInfo
            ];

            if ($extension == 'ttf') {
                $import = $this->importFonts->import($record, true);

                if ($import->status) {
                    $item = [
                        'id' => $import->fontInfo->getId(),
                        'designation' => $import->fontInfo->getDesignation(),
                        'localName' => $import->fontInfo->getLocalName(),
                        'fontInfo' => $import->fontInfo->getFontInfo(),
                        'fontData' => $import->fontInfo->getFontData()
                    ];
                    $this->responseJson->record = $item;

                } else {
                    $this->responseJson->msg = $import->msg;
                }
                $this->responseJson->status = $import->status;
            }
        }
        $this->responseJson->file_id = $file_id;
        return $this->responseJson;
    }

    private function media_category_table(): object
    {
        $columns = array(
            'c.position',
            'u.email',
            'c.designation',
            'c.description',
            '',
            '',
            ''
        );

        $data_arr = array();
        $request = $this->data->request->all();

        $search = (string)$request['search']['value'];


        /** @var User $user */
        $user = $this->tokenStorage->getToken()->getUser();
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $user]);
        $helper = Helper::instance();
        $reg = [];

        foreach ($_POST['columns'] as $key => $val) {
            if ($val['search']['regex'] == 'true') {
                if ($val['search']['value']) {
                    if ($columns[$key] == 'u.email') {
                        $columns[$key] = 'u.email';
                        $regItem = [
                            'column' => $columns[$key],
                            'search' => $val['search']['value']
                        ];
                        $reg[] = $regItem;
                    }
                }
            }
        }

        $query = $this->em->createQueryBuilder()
            ->from(MediaCategory::class, 'c')
            ->select('c, u')
            ->leftJoin('c.user', 'u');

        if (!$user->isSuAdmin()) {
            $query->andWhere('c.user=:user')
                ->setParameter('user', $user);
        }
        if ($reg) {
            foreach ($reg as $tmp) {
                if ($tmp['column'] == 'u.email') {
                    $query
                        ->andWhere("REGEXP(" . $tmp['column'] . ", :regEmail) = 1")
                        ->setParameter('regEmail', $tmp['search']);
                }
            }
        }
        $usersAll = $query->getQuery()->getArrayResult();

        $this->responseJson->user_selects = [];
        $userSelects = [];
        if ($user->isSuAdmin()) {
            $firstCat = [
                '0' => [
                    'id' => '',
                    'label' => $this->translator->trans('All')
                ]
            ];
            $dbu = $this->em->getRepository(User::class)->findBy([], ['id' => 'asc']);
            foreach ($dbu as $tmp) {
                $item = [
                    'id' => $tmp->getEmail(),
                    'label' => $tmp->getEmail()
                ];
                $userSelects[] = $item;
            }

            $this->responseJson->user_selects = array_merge_recursive($firstCat, $userSelects);
        }

        if (!$this->security->isGranted('MANAGE_MEDIEN', $account)) {
            $this->responseJson->draw = $request['draw'];
            $this->responseJson->recordsTotal = 0;
            $this->responseJson->recordsFiltered = 0;
            $this->responseJson->data = $data_arr;
            return $this->responseJson;
        }

        $query = $this->em->createQueryBuilder()
            ->from(MediaCategory::class, 'c')
            ->select('c, u')
            ->leftJoin('c.user', 'u')
            // ->leftJoin('c.media', 'm')
            // ->addSelect("GROUP_CONCAT(DISTINCT c.media.categoryId SEPARATOR '; ') AS mediaId")
        ;

        if (!$user->isSuAdmin()) {
            $query->andWhere('c.user=:user')
                ->setParameter('user', $user);
        }

        if (isset($request['search']['value'])) {
            $query->andWhere(
                'c.designation LIKE :searchTerm OR
                 c.description LIKE :searchTerm OR
                 c.type LIKE :searchTerm OR
                 u.email LIKE :searchTerm OR
                 c.createdAt LIKE :searchTerm')
                ->setParameter('searchTerm', '%' . $search . '%');
        }
        if ($reg) {
            foreach ($reg as $tmp) {
                if ($tmp['column'] == 'u.email') {
                    $query
                        ->andWhere("REGEXP(" . $tmp['column'] . ", :regEmail) = 1")
                        ->setParameter('regEmail', $tmp['search']);
                }
            }
        }

        if (isset($request['order'])) {
            $query->orderBy($columns[$request['order']['0']['column']], $request['order']['0']['dir']);
        } else {
            $query->orderBy('c.position', 'ASC');
            // $query->addOrderBy('m.original', 'ASC');
            // $query->addOrderBy('m.createdAt', 'DESC');
        }
        if ($request['length'] != -1) {
            $query->setFirstResult($request['start']);
            $query->setMaxResults($request['length']);
        }

        $table = $query->getQuery()->getArrayResult();

        if (!$table) {
            $this->responseJson->draw = $request['draw'];
            $this->responseJson->recordsTotal = 0;
            $this->responseJson->recordsFiltered = 0;
            $this->responseJson->data = $data_arr;
            return $this->responseJson;
        }

        foreach ($table as $tmp) {
            if ($user->isSuAdmin() && $tmp['user']['id'] != $user->getId()) {
                $owner = '<span class="text-orange">' . $tmp['user']['email'] . '</span>';
            } else {
                $owner = $tmp['user']['email'];
            }
            if ($tmp['type'] == 'first_cat') {
                $btnDel = '<button disabled title="' . $this->translator->trans('Delete') . '" class="pe-none btn text-nowrap btn-sm btn-outline-secondary"><i class="bi bi-trash"></i></button>';
            } else {
                $btnDel = '<button data-id="' . $tmp['id'] . '" title="' . $this->translator->trans('Delete') . '" class=" btn-trash btn text-nowrap btn-sm btn-danger dark"><i class="bi bi-trash"></i></button>';
            }

            $mediaCount = $this->em->getRepository(Media::class)->count(['category' => $tmp['id']]);
            $data_item = array();
            $data_item[] = '<i data-owner="' . $tmp['user']['id'] . '" data-id="' . $tmp['id'] . '" class="arrow-sortable bi bi-arrows-move"></i>';
            $data_item[] = $owner;
            $data_item[] = $tmp['designation'];
            $data_item[] = $tmp['description'];
            $data_item[] = $mediaCount;
            $data_item[] = $tmp['id'];
            $data_item[] = $btnDel;
            $data_arr[] = $data_item;
        }

        $this->responseJson->draw = $request['draw'];
        $this->responseJson->recordsTotal = count($usersAll);
        if ($search) {
            $this->responseJson->recordsFiltered = count($table);
        } else {
            $this->responseJson->recordsFiltered = count($usersAll);
        }

        $this->responseJson->data = $data_arr;
        return $this->responseJson;
    }

    private function media_table(): object
    {
        $columns = array(
            '',
            'm.id',
            'm.fileName',
            'u.email',
            'mc.designation',
            'm.mime',
            'm.extension',
            'm.size',
            'm.createdAt',
            'm.lastModified',
            'm.showFilemanager',
            'm.exifData',
            '',
            ''
        );

        $data_arr = array();
        $request = $this->data->request->all();

        $search = (string)$request['search']['value'];
        $reg = [];

        foreach ($_POST['columns'] as $key => $val) {
            if ($val['search']['regex'] == 'true') {
                if ($val['search']['value']) {
                    if ($columns[$key] == 'mc.designation') {
                        $columns[$key] = 'mc.id';
                        $regItem = [
                            'column' => $columns[$key],
                            'search' => $val['search']['value']
                        ];
                        $reg[] = $regItem;
                    }
                    if ($columns[$key] == 'u.email') {
                        if (preg_match('/\d/', $val['search']['value'])) {
                            continue;
                        }
                        $columns[$key] = 'u.email';
                        $regItem = [
                            'column' => $columns[$key],
                            'search' => $val['search']['value']
                        ];
                        $reg[] = $regItem;
                    }
                    if ($columns[$key] == 'm.mime') {
                        if (preg_match('/\d/', $val['search']['value'])) {
                            continue;
                        }
                        $columns[$key] = 'm.mime';
                        $regItem = [
                            'column' => $columns[$key],
                            'search' => $val['search']['value']
                        ];
                        $reg[] = $regItem;
                    }
                }
            }
        }
        // dd($reg);
        /** @var User $user */
        $user = $this->tokenStorage->getToken()->getUser();
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $user]);
        $helper = Helper::instance();
        $query = $this->em->createQueryBuilder()
            ->from(Media::class, 'm')
            ->select('m', 'u', 'c')
            ->leftJoin('m.user', 'u')
            ->leftJoin('m.category', 'c');
        if (!$user->isSuAdmin()) {
            $query->andWhere('m.user=:user')
                ->setParameter('user', $user);
        }
        if ($reg) {
            foreach ($reg as $tmp) {
                if ($tmp['column'] == 'u.email') {
                    $query
                        ->andWhere("REGEXP(" . $tmp['column'] . ", :regEmail) = 1")
                        ->setParameter('regEmail', $tmp['search']);
                }
                if ($tmp['column'] == 'mc.id') {
                    $query
                        ->andWhere('c.id=:mc_id')
                        ->setParameter('mc_id', $tmp['search']);
                }
                if ($tmp['column'] == 'm.mime') {
                    $query
                        ->andWhere("REGEXP(" . $tmp['column'] . ", :regValue) = 1")
                        ->setParameter('regValue', $tmp['search']);
                }
            }
        }

        $usersAll = $query->getQuery()->getArrayResult();
        $catArr = [];
        $catSu = [];
        $mimeArr = [];
        $mimes = [];
        $query = $this->em->createQueryBuilder()
            ->from(Media::class, 'm')
            ->select('DISTINCT m.mime');
        if (!$user->isSuAdmin()) {
            $query->andWhere('m.user=:user')
                ->setParameter('user', $user);
        }
        $mimeItems = $query->getQuery()->getArrayResult();

        foreach ($mimeItems as $tmp) {
            $mimes[] = strstr($tmp['mime'], '/', true);
        }
        $mimes = array_merge(array_unique($mimes));

        foreach ($mimes as $tmp) {
            $item = [
                'id' => $tmp,
                'label' => ucfirst($tmp)
            ];
            $mimeArr[] = $item;
        }
        $cat = $this->em->getRepository(MediaCategory::class);
        if ($user->isSuAdmin()) {
            $category = $cat->findBy([], ['user' => 'asc', 'position' => 'asc']);
        } else {
            $category = $cat->findBy([], ['position' => 'asc']);
        }

        foreach ($category as $tmp) {

            if ($tmp->getUser()->getId() != $user->getId()) {
                $label = $tmp->getDesignation() . ' (' . $tmp->getUser()->getEmail() . ')';
            } else {
                $label = $tmp->getDesignation();
            }
            $suItem = [
                'id' => (int)$tmp->getId(),
                'label' => $label,
            ];


            if ($tmp->getUser()->getId() == $user->getId()) {
                $label = $tmp->getDesignation();
                $item = [
                    'id' => (int)$tmp->getId(),
                    'label' => $label,
                ];
                $catArr[] = $item;
            }

            if ($user->isSuAdmin()) {
                $catSu[] = $suItem;
            } else {
                $catSu = $catArr;
            }
        }
        $firstCat = [
            '0' => [
                'id' => 0,
                'label' => $this->translator->trans('All')
            ]
        ];

        $userSelect = [];
        if ($user->isSuAdmin()) {
            $au = $this->em->getRepository(User::class)->findBy([], ['id' => 'asc']);
            foreach ($au as $tmp) {
                $item = [
                    'id' => $tmp->getEmail(),
                    'label' => $tmp->getEmail()
                ];
                $userSelect[] = $item;
            }
        }
        $this->responseJson->user_selects = array_merge_recursive($firstCat, $userSelect);
        $this->responseJson->su_category_select = array_merge_recursive($firstCat, $catSu);
        $this->responseJson->category_select = array_merge_recursive($firstCat, $catArr);
        $this->responseJson->types_select = array_merge_recursive($firstCat, $mimeArr);
        $this->responseJson->multiple_selection = $this->multiple_selection();


        if (!$this->security->isGranted('MANAGE_MEDIEN', $account)) {
            $this->responseJson->draw = $request['draw'];
            $this->responseJson->recordsTotal = 0;
            $this->responseJson->recordsFiltered = 0;
            $this->responseJson->data = $data_arr;
            return $this->responseJson;
        }


        $query = $this->em->createQueryBuilder();
        $query
            ->from(Media::class, 'm')
            ->select('m', 'me', 'mc', 'u')
            ->leftJoin('m.exifData', 'me')
            ->leftJoin('m.category', 'mc')
            ->leftJoin('m.user', 'u');

        if (!$user->isSuAdmin()) {
            $query->andWhere('m.user=:user')
                ->setParameter('user', $user);
        }

        if (isset($request['search']['value'])) {
            $query->andWhere(
                'm.fileName LIKE :searchTerm OR
                 m.type LIKE :searchTerm OR
                 m.attr LIKE :searchTerm OR
                 m.title LIKE :searchTerm OR
                 m.alt LIKE :searchTerm OR
                 m.description LIKE :searchTerm OR
                 mc.designation LIKE :searchTerm OR
                 m.createdAt LIKE :searchTerm')
                ->setParameter('searchTerm', '%' . $search . '%');
        }

        if ($reg) {
            foreach ($reg as $tmp) {
                if ($tmp['column'] == 'u.email') {
                    $query
                        ->andWhere("REGEXP(" . $tmp['column'] . ", :emailValue) = 1")
                        ->setParameter('emailValue', $tmp['search']);
                }
                if ($tmp['column'] == 'mc.id') {
                    $query
                        ->andWhere('mc.id=:mc_id')
                        ->setParameter('mc_id', $tmp['search']);
                }
                if ($tmp['column'] == 'm.mime') {
                    $query
                        ->andWhere("REGEXP(" . $tmp['column'] . ", :regValue) = 1")
                        ->setParameter('regValue', $tmp['search']);
                }
            }
        }


        if (isset($request['order'])) {
            $query->orderBy($columns[$request['order']['0']['column']], $request['order']['0']['dir']);
        } else {
            $query->orderBy('m.createdAt', 'DESC');
            // $query->addOrderBy('m.original', 'ASC');
            // $query->addOrderBy('m.createdAt', 'DESC');
        }
        if ($request['length'] != -1) {
            $query->setFirstResult($request['start']);
            $query->setMaxResults($request['length']);
        }
        $table = $query->getQuery()->getArrayResult();

        //dd($table);
        if (!$table) {
            $this->responseJson->draw = $request['draw'];
            $this->responseJson->recordsTotal = 0;
            $this->responseJson->recordsFiltered = 0;
            $this->responseJson->data = $data_arr;
            return $this->responseJson;
        }

        // dd($table);
        foreach ($table as $tmp) {
            $icon = '';
            if ($tmp['user']['id'] == $user->getId()) {
                $successColor = 'text-green';
            } else {
                $successColor = 'text-orange';
            }
            if ($tmp['extension'] == 'svg') {
                $type = 'SVG';

            } else {
                $m = strstr($tmp['mime'], '/', true);
                $type = ucfirst($m);
            }

            $ext = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'webm'];
            if (in_array($tmp['extension'], $ext)) {
                $thumb = $this->uploaderHelper->getThumbnailPath($this->uploaderHelper::MEDIATHEK . '/' . $tmp['fileName']);
                $large = $this->uploaderHelper->getLargePath($this->uploaderHelper::MEDIATHEK . '/' . $tmp['fileName']);
                $img = '<div class="d-flex align-items-center justify-content-center"><div class="img-load-wait"></div> <a title="' . $tmp['original'] . '" class="img-link position-relative" data-control="slide" href="' . $large . '"><img data-file="' . $tmp['fileName'] . '" data-extension="' . $tmp['extension'] . '" data-id="' . $tmp['id'] . '" class="table-img" src="' . $thumb . '" alt="' . $tmp['id'] . '"></a></div>';
            } elseif ($tmp['extension'] == 'svg') {
                $img = '<div class="table-img-wrapper-"><a title="' . $tmp['original'] . '" class="img-link" data-control="slide" href="/uploads/mediathek/' . $tmp['fileName'] . '"><img data-file="' . $tmp['fileName'] . '" data-extension="' . $tmp['extension'] . '" data-id="' . $tmp['id'] . '" class="table-img" src="/uploads/mediathek/' . $tmp['fileName'] . '" alt="' . $tmp['id'] . '"></a></div>';
            } else {
                $img = '<span data-file="' . $tmp['fileName'] . '" data-extension="' . $tmp['extension'] . '" data-id="' . $tmp['id'] . '" title="' . $type . '-' . strtoupper($tmp['extension']) . '" class="table-img mx-auto border rounded d-flex align-items-center justify-content-center"><span class="bs-file-file text-muted fs-1 file ext_' . $tmp['extension'] . '"></span></span>';
            }

            if ($tmp['exifData']) {
                $gps = '';
                if ($tmp['exifData']['exifGps']) {
                    $gps = '<span class="d-none">' . $this->translator->trans('system.GPS') . ' - </span><i title="' . $this->translator->trans('system.GPS data') . '" class="text-green bi bi-geo-alt ms-2"></i>';
                }
                $exif = '<span class="d-none">' . $this->translator->trans('medien.Exif') . '</span><i title="' . $this->translator->trans('system.Exif data') . '" class="bi bi-camera2 text-blue"></i>' . $gps;
            } else {
                $exif = '<span class="d-none">' . $this->translator->trans('medien.No image data') . '</span><i title="' . $this->translator->trans('medien.No image data') . '" class="text-muted bi bi-x-circle"></i>';
            }

            if ($tmp['showFilemanager']) {
                $public = '<span class="d-none">' . $this->translator->trans('system.Public') . '</span><i title="' . $this->translator->trans('system.Public') . '" class="bi bi-globe-americas text-green"></i>';
            } else {
                $public = '<span class="d-none">' . $this->translator->trans('system.Private') . '</span><i title="' . $this->translator->trans('system.Private') . '" class="text-muted bi bi-incognito"></i>';
            }

            $data_item = array();
            $data_item[] = '<div class="form-check table-check" title=""><input data-id="' . $tmp['id'] . '" class="form-check-input select-media no-blur" type="checkbox"  aria-label="" id="' . $tmp['id'] . '"></div>';
            $data_item[] = $img;
            $data_item[] = $tmp['original'];
            $data_item[] = '<span class="' . $successColor . '">' . $tmp['user']['email'] . '</span>';
            $data_item[] = '<span class="' . $successColor . '">' . $tmp['category']['designation'] . '</span>';
            $data_item[] = $type;
            $data_item[] = $tmp['extension'];
            $data_item[] = $helper->FileSizeConvert((float)$tmp['size']);
            $data_item[] = '<small class="d-block lh-1">' . $tmp['createdAt']->format('d.m.Y') . '<small class="small mt-1 d-block"> ' . $tmp['createdAt']->format('H:i:s') . '</small></small>';
            $data_item[] = '<small class="d-block lh-1">' . $tmp['lastModified']->format('d.m.Y') . '<small class="small mt-1 d-block"> ' . $tmp['lastModified']->format('H:i:s') . '</small></small>';
            $data_item[] = $public;
            $data_item[] = $exif;
            $data_item[] = $tmp['id'];
            $data_item[] = $tmp['id'];
            $data_arr[] = $data_item;
        }

        $this->responseJson->draw = $request['draw'];
        $this->responseJson->recordsTotal = count($usersAll);
        if ($search) {
            $this->responseJson->recordsFiltered = count($table);
        } else {
            $this->responseJson->recordsFiltered = count($usersAll);
        }

        $this->responseJson->data = $data_arr;
        return $this->responseJson;
    }
}
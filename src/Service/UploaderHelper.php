<?php

namespace App\Service;

use App\Settings\Settings;
use Exception;

use Gedmo\Sluggable\Util\Urlizer;
use League\Flysystem\Filesystem;

use League\Flysystem\FilesystemException;
use League\Flysystem\UnableToMoveFile;
use League\Flysystem\UnableToReadFile;
use League\Flysystem\UnableToSetVisibility;
use League\Flysystem\UnableToWriteFile;
use stdClass;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Asset\Context\RequestStackContext;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Psr\Log\LoggerInterface;
use Symfony\Component\Filesystem\Exception\IOExceptionInterface;
use \Liip\ImagineBundle\Imagine\Cache\CacheManager;


class UploaderHelper
{
    use Settings;

    const ACCOUNT = 'account';
    const MEDIATHEK = 'mediathek';
    const BUILDER = 'builder';
    const BACKUP = 'backups';
    const CONVERT = 'convert';
    const ATTACHMENT = 'attachment';
    const CHUNK_DIR = 'chunks';
    const FONT_DIR = 'fonts';
    private $filesystem;
    private $privateFilesystem;
    private $publicAssetBaseUrl;


    public function __construct(
        private readonly Filesystem          $publicUploadsFilesystem,
        private readonly Filesystem          $privateUploadsFilesystem,
        private readonly RequestStackContext $requestStackContext,
        private readonly LoggerInterface     $logger,
        private readonly CacheManager        $imagineCacheManager,
        private readonly string              $uploadsPath,
        private readonly string              $uploadsPrivatePath,
        string                               $uploadedAssetsBaseUrl
    )
    {
        $this->filesystem = $publicUploadsFilesystem;
        $this->publicAssetBaseUrl = $uploadedAssetsBaseUrl;
        $this->privateFilesystem = $privateUploadsFilesystem;

    }

    /**
     * @throws Exception
     */
    public function upload(File $file, string $file_id, string $directory, bool $isPublic, bool $isChunk = true, int $chunk = null, int $chunks = null): string
    {
        if ($isChunk) {
            $fileName = $this->uploadChunkFile($file, $chunk, $chunks, $file_id, $directory, $isPublic);
        } else {
            $fileName = $this->uploadFile($file, $directory, $isPublic, $file_id);
        }

        return $fileName;
    }

    /**
     * @throws FilesystemException
     */
    public function deleteFile($existingFilename, string $directory, bool $isPublic): void
    {
        $filesystem = $isPublic ? $this->filesystem : $this->privateFilesystem;
        $filesystem->delete($directory . '/' . $existingFilename);
    }

    /**
     * @throws Exception
     */
    private function uploadFile(File $file, string $directory, bool $isPublic,string $file_id, string $existingFilename = null): string
    {
        if ($file instanceof UploadedFile) {
            $originalFilename = $file->getClientOriginalName();
        } else {
            $originalFilename = $file->getFilename();
        }
        $extension = strtolower($file->guessExtension());
       // $newFilename = Urlizer::urlize(pathinfo($originalFilename, PATHINFO_FILENAME)) . '-' . uniqid() . '.' . $file->guessExtension();
        $newFilename = $file_id .'.'.$extension;
        $filesystem = $isPublic ? $this->filesystem : $this->privateFilesystem;
        $stream = fopen($file->getPathname(), 'r');

        try {
            $filesystem->writeStream($directory . '/' . $newFilename, $stream);
        } catch (FilesystemException|UnableToWriteFile $exception) {
            // handle the error
            throw new Exception(sprintf('Could not write uploaded file "%s"', $newFilename));
        }


        if (is_resource($stream)) {
            fclose($stream);
        }

        if ($existingFilename) {
            try {
                $filesystem->delete($directory . '/' . $existingFilename);
            } catch (FilesystemException $e) {
                $this->logger->alert(sprintf('Old uploaded file "%s" was missing when trying to delete', $existingFilename));
            }
        }
        return $newFilename;
    }

    /**
     * @throws Exception
     */
    private function uploadChunkFile(File $file, int $chunk, int $chunks, string $file_id, string $directory, bool $isPublic): string
    {

        if ($file instanceof UploadedFile) {
            $originalFilename = $file->getClientOriginalName();
        } else {
            $originalFilename = $file->getFilename();
        }

        $filesystem = $isPublic ? $this->filesystem : $this->privateFilesystem;
        $chunkDir = $isPublic ? $this->uploadsPath . self::CHUNK_DIR . DIRECTORY_SEPARATOR : $this->uploadsPrivatePath . self::CHUNK_DIR . DIRECTORY_SEPARATOR;
       // $convertDir = $isPublic ? $this->uploadsPath . self::CONVERT . DIRECTORY_SEPARATOR : $this->uploadsPrivatePath . self::CONVERT . DIRECTORY_SEPARATOR;

        if (!is_dir($chunkDir)) {
            mkdir($chunkDir, 0755, true);
        }
        $extension =  strtolower(pathinfo($originalFilename, PATHINFO_EXTENSION));

        $newFilename = $file_id . '.' . $extension;
        $fileName = $file_id . '.' . $extension;
        $mimeType = ['svg'];
        if (in_array($extension, $mimeType)) {
            $stream = fopen($file->getPathname(), 'r');
            try {
                $filesystem->writeStream($directory . '/' . $newFilename, $stream);
            } catch (FilesystemException|UnableToWriteFile $exception) {
                // handle the error
                throw new Exception(sprintf('Could not write uploaded file "%s"', $newFilename));
            }
            if (is_resource($stream)) {
                fclose($stream);
            }
            return $newFilename;
        }


        $filePath = $chunkDir . $fileName;

        if (!$out = @fopen("{$filePath}.part", $chunks ? "ab" : "wb")) {
            throw new Exception(sprintf('Could not open uploaded file "%s" - %d', $newFilename, __LINE__));
        }

        if (!is_uploaded_file($file->getPathName())) {
            throw new Exception(sprintf('Could not open uploaded file "%s" - %d', $newFilename, __LINE__));
        }

        // Read binary input stream and append it to temp file
        if (!$in = @fopen($file->getPathName(), "rb")) {
            throw new Exception(sprintf('Could not write uploaded file "%s" %d', $newFilename, __LINE__));
        }

        while ($buff = fread($in, 4096)) {
            fwrite($out, $buff);
        }
        @fclose($out);
        @fclose($in);

        if (!$chunks || $chunk == $chunks - 1) {
            try {
                $filesystem->move(
                    self::CHUNK_DIR . '/' . $fileName . '.part',
                    $directory . '/' . $newFilename);

            } catch (UnableToMoveFile|FilesystemException  $e) {
                $this->logger->alert(sprintf('Old uploaded file "%s" was missing when trying to copy', $newFilename));
            }
            try {
                $filesystem->delete(self::CHUNK_DIR . '/' . $fileName . '.part');
            } catch (FilesystemException $e) {
                $this->logger->alert(sprintf('Old uploaded file "%s" was missing when trying to Delete', $newFilename));
            }
            try {
                $filesystem->delete($file->getPathName());
            } catch (FilesystemException $e) {
                $this->logger->alert(sprintf('Old uploaded file "%s" was missing when trying to Delete', $newFilename));
            }

            return $newFilename;
        }

        return '';
    }

    public function move_file($src, $dest, $isPublic = true): void
    {
        $filesystem = $isPublic ? $this->filesystem : $this->privateFilesystem;
        try {
            $filesystem->move(
                $src ,
                $dest);

        } catch (UnableToMoveFile|FilesystemException  $e) {
            $this->logger->alert(sprintf('Old uploaded file "%s" was missing when trying to copy', ''));
        }
    }

    /**
     * @throws Exception
     */
    public function readStream(string $path, bool $isPublic)
    {
        $filesystem = $isPublic ? $this->filesystem : $this->privateFilesystem;

        try {
            $resource = $filesystem->readStream($path);
        } catch (FilesystemException|UnableToReadFile $exception) {
            throw new Exception(sprintf('Error opening stream for "%s"', $path));
        }

        return $resource;
    }

    /**
     * @throws FilesystemException
     */
    public function makePrivateDirectory($directory): void
    {
        $this->privateFilesystem->createDirectory($directory);
    }

    /**
     * @throws FilesystemException
     */
    public function makePublicDirectory($directory): void
    {
        $this->filesystem->createDirectory($directory);
    }

    /**
     * @throws Exception
     */
    public function getMimeType($filename, string $directory, bool $isPublic): string
    {
        $filesystem = $isPublic ? $this->filesystem : $this->privateFilesystem;
        try {
            $mime = $filesystem->mimeType($directory . '/' . $filename);
        } catch (FilesystemException $e) {
            throw new Exception(sprintf('Error reading mimeTyp for "%s"', $filename) . ' ('.$e->getMessage().')');
        }
        return $mime;
    }

    /**
     * @throws Exception
     */
    public function getFileSize($filename, string $directory, bool $isPublic): string
    {
        $filesystem = $isPublic ? $this->filesystem : $this->privateFilesystem;
        try {
            $mime = $filesystem->fileSize($directory . '/' . $filename);
        } catch (FilesystemException $e) {
            throw new Exception(sprintf('Error reading fileSize for "%s"', $filename));
        }
        return $mime;
    }

    /**
     * @throws Exception
     */
    public function getSize($filename, string $directory, bool $isPublic): string
    {
        $filesystem = $isPublic ? $this->filesystem : $this->privateFilesystem;
        try {

            $size = $filesystem->fileSize($directory . '/' . $filename);
        } catch (FilesystemException $e) {
            throw new Exception(sprintf('Error reading fileSize for "%s"', $filename));
        }
        return $size;
    }

    public function getPublicPath(string $path): string
    {
        $fullPath = $this->publicAssetBaseUrl . '/' . $path;
        // if it's already absolute, just return
        if (str_contains($fullPath, '://')) {
          // return $fullPath;
            return $path;
        }
        // needed if you deploy under a subdirectory
        return $this->requestStackContext
                ->getBasePath() . $fullPath;

        // needed if you deploy under a subdirectory
        /*return $this->requestStackContext
                 ->getBasePath() . $this->publicAssetBaseUrl . '/' . $path;*/
    }

    public function getPublicDir(string $path):string
    {
        return $this->requestStackContext
                ->getBasePath() . $path;
    }

    public function getThumbnailPath($path): string
    {
        return $this->imagineCacheManager->getBrowserPath($path, 'squared_thumbnail_small');
    }

    public function getMediumPath($path): string
    {
        return $this->imagineCacheManager->getBrowserPath($path, 'medium_image_filter');
    }

    public function getLargePath($path): string
    {
        return $this->imagineCacheManager->getBrowserPath($path, 'large_image_filter');
    }

    public function getLargeXlFilterPath($path): string
    {
        return $this->imagineCacheManager->getBrowserPath($path, 'full_image_filter');
    }

    public function getFullPath($path): string
    {
        return $this->getPublicPath($path);
    }

}
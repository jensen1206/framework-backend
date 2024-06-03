<?php

namespace App\Controller;

use App\AppHelper\Helper;
use App\Entity\Account;
use App\Entity\FormBuilder;
use App\Entity\Forms;
use App\Entity\Media;
use App\Entity\PluginSections;
use App\Service\UploaderHelper;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Gedmo\Sluggable\Util\Urlizer;
use League\Flysystem\FilesystemException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\HeaderUtils;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_ADMIN')]
class DownloadController extends AbstractController
{

    public function __construct(
        private readonly UploaderHelper         $uploaderHelper,
        private readonly EntityManagerInterface $em,
        private readonly string                 $appInstallSourceDir,
        private readonly string                 $uploadsPrivatePath
    )
    {
    }

    /**
     * @throws Exception
     */
    #[Route('/stream-media/{directory}/{file}', name: 'stream_media')]
    public function stream_media(Request $request): Response
    {
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->getUser()]);
        $this->denyAccessUnlessGranted('MANAGE_MEDIEN', $account);
        $fileName = filter_var($request->get('file'), FILTER_UNSAFE_RAW);
        $directory = filter_var($request->get('directory'), FILTER_UNSAFE_RAW);
        $uploaderHelper = $this->uploaderHelper;

        return new StreamedResponse(function () use ($uploaderHelper, $fileName, $directory) {
            $outputStream = fopen('php://output', 'wb');
            $fileStream = $uploaderHelper->readStream($directory . '/' . $fileName, true);
            stream_copy_to_stream($fileStream, $outputStream);
        });
    }

    /**
     * @throws Exception
     */
    #[Route('/download-media/{is_public}/{directory}/{file}', name: 'download_media')]
    public function download_media(Request $request): Response
    {
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->getUser()]);
        $uploaderHelper = $this->uploaderHelper;
        $is_public = filter_var($request->get('is_public'), FILTER_VALIDATE_INT);
        $fileName = filter_var($request->get('file'), FILTER_UNSAFE_RAW);
        $directory = filter_var($request->get('directory'), FILTER_UNSAFE_RAW);

        if (str_starts_with($fileName, 'installer')) {
            $instFile = $this->appInstallSourceDir . 'archiv-installer.php';
            $filesystem = new Filesystem();
            if (!$filesystem->exists($instFile)) {
                dd('Archiv not found');
            }
            $arFilename = str_replace('installer-', '', $fileName);
            $phpFile = file_get_contents($instFile);
            $phpFile = str_replace('###ARCHIV_FILE###', $arFilename, $phpFile);
            $dest = $this->uploadsPrivatePath . 'backups' . DIRECTORY_SEPARATOR . 'archiv-installer.php';
            file_put_contents($dest, $phpFile);
            $fileName = 'archiv-installer.php';
        }

        if ($directory == 'mediathek') {
            $this->denyAccessUnlessGranted('MANAGE_MEDIEN', $account);
        }

        if ($directory == 'backups') {
            $this->denyAccessUnlessGranted('MANAGE_BACKUP', $account);
        }


        $media = $this->em->getRepository(Media::class)->findOneBy(['fileName' => $fileName]);
        if ($media) {
            $original = $media->getOriginal() . '.' . $media->getExtension();
        } else {
            $original = $fileName;
        }


        $file = $directory . '/' . $fileName;

        $response = new StreamedResponse(function () use ($file, $uploaderHelper, $is_public) {
            $outputStream = fopen('php://output', 'wb');
            $fileStream = $uploaderHelper->readStream($file, $is_public);
            stream_copy_to_stream($fileStream, $outputStream);
        });

        //dd($fileName, $directory, $is_public);

        try {
            $mimeType = $uploaderHelper->getMimeType($fileName, $directory, $is_public);
        } catch (Exception  $e) {
            dd($e->getMessage());
        }
        $response->headers->set('Content-Type', $mimeType);
        $disposition = HeaderUtils::makeDisposition(
            HeaderUtils::DISPOSITION_ATTACHMENT,
            $original
        );
        $response->headers->set('Content-Disposition', $disposition);
        return $response;
    }

    /**
     * @return BinaryFileResponse|void
     * @throws FilesystemException
     */
    #[Route('/download-form-builder/{formId}', name: 'download_form_builder')]
    public function download_form_builder(Request $request)
    {
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->getUser()]);
        $uploaderHelper = $this->uploaderHelper;
        $this->denyAccessUnlessGranted('MANAGE_BUILDER_SITES', $account);
        $uploaderHelper->makePublicDirectory($uploaderHelper::BUILDER);
        $destDir = $this->getParameter('uploadsDir') . $uploaderHelper::BUILDER . '/';
        if (!is_file($destDir . '.htaccess')) {
            $htaccess = 'Require all denied';
            file_put_contents($destDir . '.htaccess', $htaccess);
        }
        $formId = $request->get('formId');
        $builder = $this->em->getRepository(FormBuilder::class)->findOneBy(['formId' => $formId]);
        $original = $formId . '.json';

        $data = json_encode($builder->getForm());
        $prettyJson = json_encode(json_decode($data), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_HEX_QUOT | JSON_HEX_TAG | JSON_UNESCAPED_SLASHES);
        $dest = $destDir . $original;
        $name = 'form-builder-' . $formId . '.json';
        file_put_contents($dest, $prettyJson);

        if (is_file($dest)) {
            $response = new BinaryFileResponse($dest);
            $response->setContentDisposition(
                ResponseHeaderBag::DISPOSITION_ATTACHMENT,
                $name
            );
            return $response;
        }
    }

    /**
     * @return BinaryFileResponse|void
     * @throws FilesystemException
     */
    #[Route('/download-forms/{formId}', name: 'download_forms')]
    public function download_forms(Request $request)
    {
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->getUser()]);
        $uploaderHelper = $this->uploaderHelper;
        $this->denyAccessUnlessGranted('MANAGE_FORMS', $account);
        $uploaderHelper->makePublicDirectory($uploaderHelper::BUILDER);
        $destDir = $this->getParameter('uploadsDir') . $uploaderHelper::BUILDER . '/';
        if (!is_file($destDir . '.htaccess')) {
            $htaccess = 'Require all denied';
            file_put_contents($destDir . '.htaccess', $htaccess);
        }
        $formId = $request->get('formId');
        $builder = $this->em->getRepository(Forms::class)->findOneBy(['formId' => $formId]);
        $original = $formId . '.json';

        $data = json_encode($builder->getForm());
        $prettyJson = json_encode(json_decode($data), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_HEX_QUOT | JSON_HEX_TAG | JSON_UNESCAPED_SLASHES);
        $dest = $destDir . $original;
        $name = Urlizer::urlize($builder->getDesignation(), '-') . '-' . $formId . '.json';
        //$name = 'formular-'.$formId.'.json';
        file_put_contents($dest, $prettyJson);

        if (is_file($dest)) {
            $response = new BinaryFileResponse($dest);
            $response->setContentDisposition(
                ResponseHeaderBag::DISPOSITION_ATTACHMENT,
                $name
            );
            return $response;
        }
    }

    /**
     * @return BinaryFileResponse|void
     * @throws FilesystemException
     */
    #[Route('/download-form-builder-element/{id}', name: 'download_form_builder_element')]
    public function download_form_builder_element(Request $request)
    {
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->getUser()]);
        $uploaderHelper = $this->uploaderHelper;
        $this->denyAccessUnlessGranted('MANAGE_BUILDER_PLUGINS', $account);
        $uploaderHelper->makePublicDirectory($uploaderHelper::BUILDER);
        $destDir = $this->getParameter('uploadsDir') . $uploaderHelper::BUILDER . '/';
        if (!is_file($destDir . '.htaccess')) {
            $htaccess = 'Require all denied';
            file_put_contents($destDir . '.htaccess', $htaccess);
        }
        $id = $request->get('id');
        $element = $this->em->getRepository(PluginSections::class)->findOneBy(['id' => $id]);
        $original = Urlizer::urlize($element->getDesignation(), '-') . '.json';
        $e = $element->getPlugin();
        $e['name'] = $element->getDesignation();
        $e['section'] = $element->getHandle();
        $data = json_encode($e);
        $prettyJson = json_encode(json_decode($data), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_HEX_QUOT | JSON_HEX_TAG | JSON_UNESCAPED_SLASHES);
        $dest = $destDir . $original;
        $name = 'form-builder-' . $original;
        file_put_contents($dest, $prettyJson);

        if (is_file($dest)) {
            $response = new BinaryFileResponse($dest);
            $response->setContentDisposition(
                ResponseHeaderBag::DISPOSITION_ATTACHMENT,
                $name
            );
            return $response;
        }
    }
}

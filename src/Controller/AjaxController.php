<?php

namespace App\Controller;

use App\Ajax\AccountAjaxCall;
use App\Ajax\BackupAjaxCall;
use App\Ajax\EmailAjaxCall;
use App\Ajax\FileManagerAjaxCall;
use App\Ajax\DesignAjaxCall;
use App\Ajax\FormBuilderAjaxCall;
use App\Ajax\FormBuilderPluginsAjaxCall;
use App\Ajax\FormsAjaxCall;
use App\Ajax\LogAjaxCall;
use App\Ajax\MediaAjaxCall;
use App\Ajax\MediaGalleryAjaxCall;
use App\Ajax\MenuAjaxCall;
use App\Ajax\PostAjaxCall;
use App\Ajax\PublicAjaxCall;
use App\Ajax\PublicFormsCall;
use App\Ajax\RegisterSettingsAjaxCall;
use App\Ajax\SitesAjaxCall;
use App\Ajax\SystemSettingsAjaxCall;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class AjaxController extends AbstractController
{
    public function __construct(
        private readonly AccountAjaxCall            $accountAjaxCall,
        private readonly PublicAjaxCall             $publicAjaxCall,
        private readonly MediaAjaxCall              $mediaAjaxCall,
        private readonly EmailAjaxCall              $emailAjaxCall,
        private readonly FileManagerAjaxCall        $fileManagerAjaxCall,
        private readonly BackupAjaxCall             $backupAjaxCall,
        private readonly SystemSettingsAjaxCall     $systemSettingsAjaxCall,
        private readonly RegisterSettingsAjaxCall   $registerSettingsAjaxCall,
        private readonly LogAjaxCall                $logAjaxCall,
        private readonly SitesAjaxCall              $sitesAjaxCall,
        private readonly FormBuilderAjaxCall        $builderAjaxCall,
        private readonly FormBuilderPluginsAjaxCall $builderPluginsAjaxCall,
        private readonly MediaGalleryAjaxCall       $mediaGalleryAjaxCall,
        private readonly MenuAjaxCall               $menuAjaxCall,
        private readonly PostAjaxCall               $postAjaxCall,
        private readonly DesignAjaxCall             $designAjaxCall,
        private readonly FormsAjaxCall              $formsAjaxCall,
        private readonly PublicFormsCall            $publicFormsCall
    )
    {

    }

    #[
        Route('/account-ajax', name: 'account_ajax', methods: ['POST'])]
    public function settings_ajax_class(Request $request): JsonResponse
    {
        $token = $request->request->get('token');
        $method = $request->request->get('method');
        $handle = $request->request->get('_handle');

        if (!$this->isCsrfTokenValid('account_edit_token', $token) || !$method || !$handle) {
            return new JsonResponse(
                (object)[],
                403);
        }
        return new JsonResponse(
            $this->accountAjaxCall->$handle($request),
            200);
    }

    #[Route('/public-ajax', name: 'public_ajax', methods: ['POST'])]
    public function public_ajax_class(Request $request): JsonResponse
    {
        $token = $request->request->get('token');
        $method = $request->request->get('method');
        $handle = $request->request->get('_handle');

        if (!$this->isCsrfTokenValid('public_token', $token) || !$method || !$handle) {
            return new JsonResponse(
                (object)[],
                403);
        }
        return new JsonResponse(
            $this->publicAjaxCall->$handle($request),
            200);
    }

    #[Route('/media-ajax', name: 'media_ajax', methods: ['POST'])]
    public function media_ajax_class(Request $request): JsonResponse
    {
        $token = $request->request->get('token');
        $method = $request->request->get('method');
        $handle = $request->request->get('_handle');

        if (!$this->isCsrfTokenValid('media_token', $token) || !$method || !$handle) {
            return new JsonResponse(
                (object)[],
                403);
        }
        //$isUpload = filter_var($request->get('is_upload') ?? false, FILTER_VALIDATE_BOOLEAN);
        return new JsonResponse(
            $this->mediaAjaxCall->$handle($request),
            200);
    }

    #[Route('/email-ajax', name: 'email_ajax', methods: ['POST'])]
    public function email_ajax_class(Request $request): JsonResponse
    {
        $token = $request->request->get('token');
        $method = $request->request->get('method');
        $handle = $request->request->get('_handle');

        if (!$this->isCsrfTokenValid('email_token', $token) || !$method || !$handle) {
            return new JsonResponse(
                (object)[],
                403);
        }
        return new JsonResponse(
            $this->emailAjaxCall->$handle($request),
            200);
    }

    #[Route('/filemanager-ajax', name: 'filemanager_ajax', methods: ['POST'])]
    public function filemanager_ajax_class(Request $request): JsonResponse
    {
        $token = $request->request->get('token');
        $method = $request->request->get('method');
        $handle = $request->request->get('_handle');

        if (!$this->isCsrfTokenValid('filemanager_token', $token) || !$method || !$handle) {
            return new JsonResponse(
                (object)[],
                403);
        }
        return new JsonResponse(
            $this->fileManagerAjaxCall->$handle($request),
            200);
    }

    #[Route('/backup-ajax', name: 'backup_ajax', methods: ['POST'])]
    public function backup_ajax_class(Request $request): JsonResponse
    {
        $token = $request->request->get('token');
        $method = $request->request->get('method');
        $handle = $request->request->get('_handle');

        if (!$this->isCsrfTokenValid('backup_token', $token) || !$method || !$handle) {
            return new JsonResponse(
                (object)[],
                403);
        }
        return new JsonResponse(
            $this->backupAjaxCall->$handle($request),
            200);
    }

    #[Route('/system-settings-ajax', name: 'system_settings_ajax', methods: ['POST'])]
    public function system_settings_ajax_class(Request $request): JsonResponse
    {
        $token = $request->request->get('token');
        $method = $request->request->get('method');
        $handle = $request->request->get('_handle');

        if (!$this->isCsrfTokenValid('system_settings_token', $token) || !$method || !$handle) {
            return new JsonResponse(
                (object)[],
                403);
        }
        return new JsonResponse(
            $this->systemSettingsAjaxCall->$handle($request),
            200);
    }

    #[Route('/register-settings-ajax', name: 'register_settings_ajax', methods: ['POST'])]
    public function register_settings_ajax_class(Request $request): JsonResponse
    {
        $token = $request->request->get('token');
        $method = $request->request->get('method');
        $handle = $request->request->get('_handle');

        if (!$this->isCsrfTokenValid('register_settings_token', $token) || !$method || !$handle) {
            return new JsonResponse(
                (object)[],
                403);
        }
        return new JsonResponse(
            $this->registerSettingsAjaxCall->$handle($request),
            200);
    }

    #[Route('/log-ajax', name: 'log_ajax', methods: ['POST'])]
    public function log_ajax_class(Request $request): JsonResponse
    {
        $token = $request->request->get('token');
        $method = $request->request->get('method');
        $handle = $request->request->get('_handle');

        if (!$this->isCsrfTokenValid('log_token', $token) || !$method || !$handle) {
            return new JsonResponse(
                (object)[],
                403);
        }
        return new JsonResponse(
            $this->logAjaxCall->$handle($request),
            200);
    }

    #[Route('/sites-ajax', name: 'sites_ajax', methods: ['POST'])]
    public function sites_ajax_class(Request $request): JsonResponse
    {
        $token = $request->request->get('token');
        $method = $request->request->get('method');
        $handle = $request->request->get('_handle');

        if (!$this->isCsrfTokenValid('sites_token', $token) || !$method || !$handle) {
            return new JsonResponse(
                (object)[],
                403);
        }
        return new JsonResponse(
            $this->sitesAjaxCall->$handle($request),
            200);
    }

    #[Route('/form-builder-ajax', name: 'form_builder_ajax', methods: ['POST'])]
    public function form_builder_ajax_class(Request $request): JsonResponse
    {
        $token = $request->request->get('token');
        $method = $request->request->get('method');
        $handle = $request->request->get('_handle');

        if (!$this->isCsrfTokenValid('builder_token', $token) || !$method || !$handle) {
            return new JsonResponse(
                (object)[],
                403);
        }
        return new JsonResponse(
            $this->builderAjaxCall->$handle($request),
            200);
    }

    #[Route('/form-builder-plugin-ajax', name: 'form_builder_plugin_ajax', methods: ['POST'])]
    public function form_builder_plugin_ajax_class(Request $request): JsonResponse
    {
        $token = $request->request->get('token');
        $method = $request->request->get('method');
        $handle = $request->request->get('_handle');

        if (!$this->isCsrfTokenValid('builder_plugin_token', $token) || !$method || !$handle) {
            return new JsonResponse(
                (object)[],
                403);
        }
        return new JsonResponse(
            $this->builderPluginsAjaxCall->$handle($request),
            200);
    }

    #[Route('/media-gallery-ajax', name: 'media_gallery_ajax', methods: ['POST'])]
    public function media_gallery_ajax_class(Request $request): JsonResponse
    {
        $token = $request->request->get('token');
        $method = $request->request->get('method');
        $handle = $request->request->get('_handle');

        if (!$this->isCsrfTokenValid('media_gallery_token', $token) || !$method || !$handle) {
            return new JsonResponse(
                (object)[],
                403);
        }
        return new JsonResponse(
            $this->mediaGalleryAjaxCall->$handle($request),
            200);
    }

    #[Route('/menu-ajax', name: 'menu_ajax', methods: ['POST'])]
    public function menu_ajax_class(Request $request): JsonResponse
    {
        $token = $request->request->get('token');
        $method = $request->request->get('method');
        $handle = $request->request->get('_handle');

        if (!$this->isCsrfTokenValid('menu_token', $token) || !$method || !$handle) {
            return new JsonResponse(
                (object)[],
                403);
        }
        return new JsonResponse(
            $this->menuAjaxCall->$handle($request),
            200);
    }

    #[Route('/post-ajax', name: 'post_ajax', methods: ['POST'])]
    public function post_ajax_class(Request $request): JsonResponse
    {
        $token = $request->request->get('token');
        $method = $request->request->get('method');
        $handle = $request->request->get('_handle');

        if (!$this->isCsrfTokenValid('post_token', $token) || !$method || !$handle) {
            return new JsonResponse(
                (object)[],
                403);
        }
        return new JsonResponse(
            $this->postAjaxCall->$handle($request),
            200);
    }

    #[Route('/design-ajax', name: 'design_ajax', methods: ['POST'])]
    public function font_ajax_class(Request $request): JsonResponse
    {
        $token = $request->request->get('token');
        $method = $request->request->get('method');
        $handle = $request->request->get('_handle');

        if (!$this->isCsrfTokenValid('design_token', $token) || !$method || !$handle) {
            return new JsonResponse(
                (object)[],
                403);
        }
        return new JsonResponse(
            $this->designAjaxCall->$handle($request),
            200);
    }

    #[Route('/forms-ajax', name: 'forms_ajax', methods: ['POST'])]
    public function forms_ajax_class(Request $request): JsonResponse
    {
        $token = $request->request->get('token');
        $method = $request->request->get('method');
        $handle = $request->request->get('_handle');

        if (!$this->isCsrfTokenValid('forms_token', $token) || !$method || !$handle) {
            return new JsonResponse(
                (object)[],
                403);
        }
        return new JsonResponse(
            $this->formsAjaxCall->$handle($request),
            200);
    }

    #[Route('/forms-public-ajax', name: 'forms_public_ajax', methods: ['POST'])]
    public function forms_public_class(Request $request): JsonResponse
    {
        $token = $request->request->get('token');
        $method = $request->request->get('method');
        $handle = $request->request->get('_handle');

        if (!$this->isCsrfTokenValid('public_form_token', $token) || !$method || !$handle) {
            return new JsonResponse(
                (object)[],
                403);
        }
        return new JsonResponse(
            $this->publicFormsCall->$handle($request),
            200);
    }
}

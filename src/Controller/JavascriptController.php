<?php

namespace App\Controller;

use App\AppHelper\Helper;
use App\Entity\Account;
use App\Entity\AppFonts;
use App\Entity\MediaSlider;
use App\Entity\SystemSettings;
use App\Entity\User;
use App\Service\UploaderHelper;
use App\Settings\Settings;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Asset\Context\RequestStackContext;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;


class JavascriptController extends AbstractController
{
    use Settings;

    public function __construct(
        private readonly RequestStackContext    $requestStackContext,
        private readonly UploaderHelper         $uploaderHelper,
        private readonly EntityManagerInterface $em,
        private readonly string                 $siteName,
        private readonly string                 $projectDir,
        private readonly string                 $baseUrl,
        private readonly string                 $appInstallPath
    )
    {
    }

    /**
     * @throws NotFoundExceptionInterface
     * @throws ContainerExceptionInterface
     */
    #[Route('/account-settings.js', name: 'javascript_account_settings')]
    public function account_settings(): Response
    {
        $csrf = $this->container->get('security.csrf.token_manager');
        $token = $csrf->getToken('account_edit_token');
        $settings = [
            'token' => $token->getValue(),
            'ajax_url' => $this->generateUrl('account_ajax'),
            'handle' => 'ajaxAccountHandle',
            'switch_url' => $this->generateUrl('app_dashboard'),
            'thumb_account_url' => $this->uploaderHelper->getThumbnailPath($this->uploaderHelper::ACCOUNT),
            'medium_account_url' => $this->uploaderHelper->getMediumPath($this->uploaderHelper::ACCOUNT),
            'large_account_url' => $this->uploaderHelper->getLargePath($this->uploaderHelper::ACCOUNT),
            'full_account_url' => $this->uploaderHelper->getFullPath($this->uploaderHelper::ACCOUNT),
        ];

        $accountJs = $this->renderView(
            'javascript/account-settings.js.twig',
            array(
                'json' => json_encode($settings)
            )
        );
        return new Response($accountJs, 200,
            array('Content-Type' => 'text/javascript')
        );
    }

    /**
     * @throws NotFoundExceptionInterface
     * @throws ContainerExceptionInterface
     */
    #[Route('/public-settings.js', name: 'javascript_public_settings')]
    public function public_settings(): Response
    {
        $su = false;
        if ($this->isGranted('ROLE_SUPER_ADMIN')) {
            $su = true;
        }
        $sysSettings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
        $csrf = $this->container->get('security.csrf.token_manager');
        $token = $csrf->getToken('public_token');
        $formToken = $csrf->getToken('public_form_token');
        $uri_download = $this->generateUrl('download_media', ['is_public' => 1, 'directory' => $this->uploaderHelper::MEDIATHEK, 'file' => '#']);
        $uri_download = str_replace('/%23', '', $uri_download);
        $slideJs = $this->em->getRepository(MediaSlider::class)->findBy(['type' => 'slider']);
        $slideArr = [];
        foreach ($slideJs as $slide) {
            $s = $slide->getSlider();
            $s['id'] = $slide->getId();
            $slideArr[] = $s;
        }
        // $helper = Helper::instance();
        $splide = [];
        foreach ($slideArr as $tmp) {
            $itemBreakPoint = [];
            foreach ($tmp['breakpoints'] as $breakpoint) {
                $itemBreakPoint[$breakpoint['breakpoint']] = [
                    'perPage' => $breakpoint['perPage'] ?? '',
                    'perMove' => $breakpoint['perMove'] ?? '',
                    'gap' => $breakpoint['gap'] ?? '',
                    'height' => $breakpoint['height'] ?? '',
                    'width' => $breakpoint['width'] ?? '',
                    'fixedHeight' => $breakpoint['fixedHeight'] ?? '',
                    'fixedWidth' => $breakpoint['fixedWidth'] ?? '',
                    'padding' => $breakpoint['padding'] ?? []
                ];
            }

            $tmp['breakpoints'] = $itemBreakPoint;
            $splide[] = $tmp;
        }
        $install = false;
        $filesystem = new Filesystem();
        if($filesystem->exists($this->appInstallPath)) {
            $install = true;
        }
        $settings = [
            'token' => $token->getValue(),
            'form_token' => $formToken->getValue(),
            'ajax_url' => $this->generateUrl('public_ajax'),
            'ajax_form_url' => $this->generateUrl('forms_public_ajax'),
            'event_url' => $this->generateUrl('system_event'),
            'install' => $install,
            'handle' => 'ajaxPublicHandle',
            'form_handle' => 'ajaxFormsPublic',
            'public_upload' => $this->requestStackContext->getBasePath() . '/uploads/',
            'site_name' => $sysSettings->getApp()['site_name'],
            'su' => $su,
            'emailSettings' => $sysSettings->getEmail(),
            'extensions' => $this->liip_imagine_extensions,
            'download_media_uri' => $uri_download,
            'slideJs' => $splide,
            'base_url' => $this->baseUrl,
            'thumb_url' => $this->uploaderHelper->getThumbnailPath($this->uploaderHelper::MEDIATHEK),
            'medium_url' => $this->uploaderHelper->getMediumPath($this->uploaderHelper::MEDIATHEK),
            'large_url' => $this->uploaderHelper->getLargePath($this->uploaderHelper::MEDIATHEK),
            'large_xl_url' => $this->uploaderHelper->getLargeXlFilterPath($this->uploaderHelper::MEDIATHEK),
            'public_mediathek' => $this->requestStackContext->getBasePath() . '/uploads/' . $this->uploaderHelper::MEDIATHEK,
        ];

        $publicJs = $this->renderView(
            'javascript/public-settings.js.twig',
            array(
                'json' => json_encode($settings)
            )
        );
        return new Response($publicJs, 200,
            array('Content-Type' => 'text/javascript')
        );
    }

    /**
     * @throws NotFoundExceptionInterface
     * @throws ContainerExceptionInterface
     */
    #[Route('/upload-settings.js', name: 'javascript_upload_settings')]
    public function upload_settings(): Response
    {
        /** @var User $user */
        $user = $this->getUser();
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $user]);
        $user_upload = $this->isGranted('ACCOUNT_UPLOAD', $account);
        $csrf = $this->container->get('security.csrf.token_manager');
        $token = $csrf->getToken('media_token');
        $sysSettings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
        $app = $sysSettings->getApp();
        $upload_types = explode(',', $app['upload_types']);
        $upload_types = array_map(fn($value): string => '.' . $value, $upload_types);
        $upload_types = implode(',', $upload_types);

        $settings = [
            'token' => $token->getValue(),
            'handle' => 'ajaxMediaHandle',
            'user_upload' => $user_upload,
            'account_id' => $account->getId(),
            'upload_url' => $this->generateUrl('media_ajax'),
            'ajax_url' => $this->generateUrl('media_ajax'),
            'accept' => $upload_types,
            'extensions' => $this->liip_imagine_extensions,
            'thumb_url' => $this->uploaderHelper->getThumbnailPath($this->uploaderHelper::MEDIATHEK),
            'medium_url' => $this->uploaderHelper->getMediumPath($this->uploaderHelper::MEDIATHEK),
            'large_url' => $this->uploaderHelper->getLargePath($this->uploaderHelper::MEDIATHEK),
            'public_mediathek' => $this->requestStackContext->getBasePath() . '/uploads/' . $this->uploaderHelper::MEDIATHEK,
        ];

        $uploadJs = $this->renderView(
            'javascript/media-settings.js.twig',
            array(
                'json' => json_encode($settings)
            )
        );
        return new Response($uploadJs, 200,
            array('Content-Type' => 'text/javascript')
        );
    }

    /**
     * @throws NotFoundExceptionInterface
     * @throws ContainerExceptionInterface
     */
    #[Route('/email-settings.js', name: 'javascript_email_settings')]
    public function email_settings(): Response
    {
        /** @var User $user */
        $user = $this->getUser();
        $sysSettings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
        $csrf = $this->container->get('security.csrf.token_manager');
        $token = $csrf->getToken('email_token');
        $settings = [
            'token' => $token->getValue(),
            'ajax_url' => $this->generateUrl('email_ajax'),
            'handle' => 'ajaxEmailHandle',
            'site_name' => $sysSettings->getApp()['site_name'],
        ];
        $emailJs = $this->renderView(
            'javascript/email-settings.js.twig',
            array(
                'json' => json_encode($settings)
            )
        );
        return new Response($emailJs, 200,
            array('Content-Type' => 'text/javascript')
        );
    }

    /**
     * @throws NotFoundExceptionInterface
     * @throws ContainerExceptionInterface
     */
    #[Route('/filemanager-settings.js', name: 'javascript_filemanager_settings')]
    public function filemanager_settings(): Response
    {
        $su = false;
        if ($this->isGranted('ROLE_SUPER_ADMIN')) {
            $su = true;
        }
        $csrf = $this->container->get('security.csrf.token_manager');
        $token = $csrf->getToken('filemanager_token');
        $settings = [
            'token' => $token->getValue(),
            'ajax_url' => $this->generateUrl('filemanager_ajax'),
            'handle' => 'ajaxFileManager',
            'su' => $su,
            'site_name' => $this->siteName,
            'extensions' => $this->liip_imagine_extensions,
            'base_url' => $this->baseUrl,
            'thumb_url' => $this->uploaderHelper->getThumbnailPath($this->uploaderHelper::MEDIATHEK),
            'medium_url' => $this->uploaderHelper->getMediumPath($this->uploaderHelper::MEDIATHEK),
            'large_url' => $this->uploaderHelper->getLargePath($this->uploaderHelper::MEDIATHEK),
            'large_xl_url' => $this->uploaderHelper->getLargeXlFilterPath($this->uploaderHelper::MEDIATHEK),
            'public_mediathek' => $this->requestStackContext->getBasePath() . '/uploads/' . $this->uploaderHelper::MEDIATHEK,
        ];
        $emailJs = $this->renderView(
            'javascript/filemanager-settings.js.twig',
            array(
                'json' => json_encode($settings)
            )
        );
        return new Response($emailJs, 200,
            array('Content-Type' => 'text/javascript')
        );
    }

    /**
     * @throws NotFoundExceptionInterface
     * @throws ContainerExceptionInterface
     */
    #[Route('/backup-settings.js', name: 'javascript_backup_settings')]
    public function backup_settings(): Response
    {
        /** @var User $user */
        $user = $this->getUser();
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $user]);
        $add_backup = $this->isGranted('ADD_BACKUP', $account);
        $csrf = $this->container->get('security.csrf.token_manager');
        $token = $csrf->getToken('backup_token');
        $settings = [
            'token' => $token->getValue(),
            'ajax_url' => $this->generateUrl('backup_ajax'),
            'handle' => 'ajaxBackupHandle',
            'site_name' => $this->siteName,
            'add_backup' => $add_backup
        ];
        $backupJs = $this->renderView(
            'javascript/backup-settings.js.twig',
            array(
                'json' => json_encode($settings)
            )
        );
        return new Response($backupJs, 200,
            array('Content-Type' => 'text/javascript')
        );
    }

    /**
     * @throws NotFoundExceptionInterface
     * @throws ContainerExceptionInterface
     */
    #[Route('/system-settings.js', name: 'javascript_system_settings')]
    #[IsGranted('ROLE_ADMIN')]
    public function system_settings_settings(): Response
    {
        /** @var User $user */
        $user = $this->getUser();
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $user]);
        $manage_log = $this->isGranted('MANAGE_LOG', $account);
        $manage_app = $this->isGranted('MANAGE_APP_SETTINGS', $account);
        $manage_oauth = $this->isGranted('MANAGE_OAUTH', $account);
        $manage_email = $this->isGranted('MANAGE_EMAIL_SETTINGS', $account);
        $manage_scss = $this->isGranted('MANAGE_SCSS_COMPILER', $account);
        $manage_worker = $this->isGranted('MANAGE_CONSUMER', $account);
        $manage_backup = $this->isGranted('ADD_BACKUP', $account);
        //$settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);


        $csrf = $this->container->get('security.csrf.token_manager');
        $token = $csrf->getToken('system_settings_token');
        $settings = [
            'token' => $token->getValue(),
            'ajax_url' => $this->generateUrl('system_settings_ajax'),
            'handle' => 'ajaxSystemSettingsHandle',
            'site_name' => $this->siteName,
            'manage_log' => $manage_log,
            'manage_app' => $manage_app,
            'manage_oauth' => $manage_oauth,
            'manage_email' => $manage_email,
            'manage_scss' => $manage_scss,
            'manage_worker' => $manage_worker,
            'manage_backup' => $manage_backup
        ];
        $systemJs = $this->renderView(
            'javascript/system-settings.js.twig',
            array(
                'json' => json_encode($settings)
            )
        );
        return new Response($systemJs, 200,
            array('Content-Type' => 'text/javascript')
        );
    }

    /**
     * @throws NotFoundExceptionInterface
     * @throws ContainerExceptionInterface
     */
    #[Route('/register-settings.js', name: 'javascript_register_settings')]
    #[IsGranted('ROLE_ADMIN')]
    public function register_settings_settings(): Response
    {

        $csrf = $this->container->get('security.csrf.token_manager');
        $token = $csrf->getToken('register_settings_token');
        $settings = [
            'token' => $token->getValue(),
            'ajax_url' => $this->generateUrl('register_settings_ajax'),
            'handle' => 'ajaxRegisterHandle',
        ];
        $registerJs = $this->renderView(
            'javascript/register-settings.js.twig',
            array(
                'json' => json_encode($settings)
            )
        );
        return new Response($registerJs, 200,
            array('Content-Type' => 'text/javascript')
        );
    }

    /**
     * @throws NotFoundExceptionInterface
     * @throws ContainerExceptionInterface
     */
    #[Route('/log-settings.js', name: 'javascript_log_settings')]
    #[IsGranted('ROLE_ADMIN')]
    public function log_settings(): Response
    {

        $csrf = $this->container->get('security.csrf.token_manager');
        $token = $csrf->getToken('log_token');
        $settings = [
            'token' => $token->getValue(),
            'ajax_url' => $this->generateUrl('log_ajax'),
            'handle' => 'ajaxLogHandle',
        ];
        $logJs = $this->renderView(
            'javascript/log-settings.js.twig',
            array(
                'json' => json_encode($settings)
            )
        );
        return new Response($logJs, 200,
            array('Content-Type' => 'text/javascript')
        );
    }

    /**
     * @throws NotFoundExceptionInterface
     * @throws ContainerExceptionInterface
     */
    #[Route('/sites-settings.js', name: 'javascript_sites_settings')]
    #[IsGranted('ROLE_ADMIN')]
    public function sites_settings(): Response
    {
        /** @var User $user */
        $user = $this->getUser();
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $user]);
        $manage_page = $this->isGranted('MANAGE_PAGE', $account);
        $manage_page_seo = $this->isGranted('MANAGE_PAGE_SEO', $account);
        $manage_page_sites = $this->isGranted('MANAGE_PAGE_SITES', $account);
        $manage_page_category = $this->isGranted('MANAGE_PAGE_CATEGORY', $account);
        $csrf = $this->container->get('security.csrf.token_manager');
        $token = $csrf->getToken('sites_token');
        $settings = [
            'token' => $token->getValue(),
            'ajax_url' => $this->generateUrl('sites_ajax'),
            'handle' => 'ajaxSiteHandle',
            'manage_page' => $manage_page,
            'manage_page_seo' => $manage_page_seo,
            'manage_page_sites' => $manage_page_sites,
            'manage_page_category' => $manage_page_category
        ];
        $sitesJs = $this->renderView(
            'javascript/sites-settings.js.twig',
            array(
                'json' => json_encode($settings)
            )
        );
        return new Response($sitesJs, 200,
            array('Content-Type' => 'text/javascript')
        );
    }

    /**
     * @throws NotFoundExceptionInterface
     * @throws ContainerExceptionInterface
     */
    #[Route('/form-builder.js', name: 'javascript_form_builder_settings')]
    #[IsGranted('ROLE_ADMIN')]
    public function form_builder_settings(): Response
    {

        $csrf = $this->container->get('security.csrf.token_manager');
        $token = $csrf->getToken('builder_token');
        $settings = [
            'token' => $token->getValue(),
            'ajax_url' => $this->generateUrl('form_builder_ajax'),
            'handle' => 'ajaxFormBuilderHandle',

        ];
        $builderJs = $this->renderView(
            'javascript/form-builder-settings.js.twig',
            array(
                'json' => json_encode($settings)
            )
        );
        return new Response($builderJs, 200,
            array('Content-Type' => 'text/javascript')
        );
    }

    /**
     * @throws NotFoundExceptionInterface
     * @throws ContainerExceptionInterface
     */
    #[Route('/form-builder-plugin.js', name: 'javascript_form_builder_plugin_settings')]
    #[IsGranted('ROLE_ADMIN')]
    public function form_builder_plugin_settings(): Response
    {

        $csrf = $this->container->get('security.csrf.token_manager');
        $token = $csrf->getToken('builder_plugin_token');
        $settings = [
            'token' => $token->getValue(),
            'ajax_url' => $this->generateUrl('form_builder_plugin_ajax'),
            'handle' => 'ajaxPBPluginHandle',

        ];
        $builderPluginJs = $this->renderView(
            'javascript/form-builder-plugin-settings.js.twig',
            array(
                'json' => json_encode($settings)
            )
        );
        return new Response($builderPluginJs, 200,
            array('Content-Type' => 'text/javascript')
        );
    }

    /**
     * @throws NotFoundExceptionInterface
     * @throws ContainerExceptionInterface
     */
    #[Route('/media-gallery.js', name: 'javascript_media_gallery_settings')]
    #[IsGranted('ROLE_ADMIN')]
    public function media_gallery_settings(): Response
    {
        $csrf = $this->container->get('security.csrf.token_manager');
        $token = $csrf->getToken('media_gallery_token');
        $settings = [
            'token' => $token->getValue(),
            'ajax_url' => $this->generateUrl('media_gallery_ajax'),
            'handle' => 'ajaxMediaGallery',

        ];
        $mediaGalleryJs = $this->renderView(
            'javascript/media-gallery.js.twig',
            array(
                'json' => json_encode($settings)
            )
        );
        return new Response($mediaGalleryJs, 200,
            array('Content-Type' => 'text/javascript')
        );
    }

    /**
     * @throws NotFoundExceptionInterface
     * @throws ContainerExceptionInterface
     */
    #[Route('/menu.js', name: 'javascript_menu_settings')]
    #[IsGranted('ROLE_ADMIN')]
    public function menu_js_settings(): Response
    {
        /** @var User $user */
        $user = $this->getUser();
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $user]);
        $addMenu = $this->isGranted('ADD_MENU', $account);
        $csrf = $this->container->get('security.csrf.token_manager');
        $token = $csrf->getToken('menu_token');
        $settings = [
            'token' => $token->getValue(),
            'ajax_url' => $this->generateUrl('menu_ajax'),
            'handle' => 'ajaxMenuHandle',
            'add_menu' => $addMenu
        ];
        $menuJs = $this->renderView(
            'javascript/menu-settings.js.twig',
            array(
                'json' => json_encode($settings)
            )
        );
        return new Response($menuJs, 200,
            array('Content-Type' => 'text/javascript')
        );
    }

    /**
     * @throws NotFoundExceptionInterface
     * @throws ContainerExceptionInterface
     */
    #[Route('/post.js', name: 'javascript_post_settings')]
    #[IsGranted('ROLE_ADMIN')]
    public function post_js_settings(): Response
    {
        /** @var User $user */
        $user = $this->getUser();
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $user]);
        $addPost = $this->isGranted('ADD_POST', $account);
        $csrf = $this->container->get('security.csrf.token_manager');
        $token = $csrf->getToken('post_token');
        $settings = [
            'token' => $token->getValue(),
            'ajax_url' => $this->generateUrl('post_ajax'),
            'handle' => 'ajaxPostHandle',
            'add_post' => $addPost
        ];
        $postJs = $this->renderView(
            'javascript/post-settings.js.twig',
            array(
                'json' => json_encode($settings)
            )
        );
        return new Response($postJs, 200,
            array('Content-Type' => 'text/javascript')
        );
    }

    /**
     * @throws NotFoundExceptionInterface
     * @throws ContainerExceptionInterface
     */
    #[Route('/fonts.js', name: 'javascript_font_settings')]
    #[IsGranted('ROLE_ADMIN')]
    public function font_js_settings(): Response
    {
        /** @var User $user */
        $user = $this->getUser();
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $user]);
        $deleteFonts = $this->isGranted('DELETE_FONTS', $account);
        $csrf = $this->container->get('security.csrf.token_manager');
        $token = $csrf->getToken('design_token');
        $settings = [
            'token' => $token->getValue(),
            'ajax_url' => $this->generateUrl('design_ajax'),
            'handle' => 'ajaxDesignHandle',
            'delete_font' => $deleteFonts
        ];
        $js = $this->renderView(
            'javascript/font-settings.js.twig',
            array(
                'json' => json_encode($settings)
            )
        );
        return new Response($js, 200,
            array('Content-Type' => 'text/javascript')
        );
    }

    /**
     * @throws NotFoundExceptionInterface
     * @throws ContainerExceptionInterface
     */
    #[Route('/forms.js', name: 'javascript_forms_settings')]
    #[IsGranted('ROLE_ADMIN')]
    public function forms_js_settings(): Response
    {
        /** @var User $user */
        $user = $this->getUser();
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $user]);
        $deleteForms = $this->isGranted('DELETE_FORMS', $account);
        $addForms = $this->isGranted('ADD_FORMS', $account);
        $csrf = $this->container->get('security.csrf.token_manager');
        $token = $csrf->getToken('forms_token');
        $settings = [
            'token' => $token->getValue(),
            'ajax_url' => $this->generateUrl('forms_ajax'),
            'handle' => 'ajaxFormsHandle',
            'delete_forms' => $deleteForms,
            'add_forms' => $addForms,
        ];
        $js = $this->renderView(
            'javascript/forms-settings.js.twig',
            array(
                'json' => json_encode($settings)
            )
        );
        return new Response($js, 200,
            array('Content-Type' => 'text/javascript')
        );
    }

    #[Route('/public-css.css', name: 'public_css')]
    public function public_css(): Response
    {
        $helper = Helper::instance();
        $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
        $css = $settings->getDesign();
        $fontArr = [];
        $headArr = [];
        $menu_uppercase = '';
        $site_bg = '';
        $footer_bg = '';
        $footer_color = '';
        $menu_btn_bg_color = '';
        $menu_btn_color = '';
        $menu_btn_active_bg = '';
        $menu_btn_active_color = '';
        $menu_btn_hover_bg = '';
        $menu_btn_hover_color = '';
        $dropdown_bg = '';
        $menu_dropdown_bg = '';
        $menu_dropdown_color = '';
        $menu_dropdown_active_bg = '';
        $menu_dropdown_active_color = '';
        $menu_dropdown_hover_bg = '';
        $menu_dropdown_hover_color = '';
        $link_color = '';
        $link_aktiv_color = '';
        $link_hover_color = '';
        $scroll_btn_bg = '';
        $scroll_btn_color = '';


        if ($css['color']['site_bg']) {
            $site_bg = sprintf('rgba(%d,%d,%d,%d)', $css['color']['site_bg']['r'], $css['color']['site_bg']['g'], $css['color']['site_bg']['b'], $css['color']['site_bg']['a']);
        }
        if ($css['color']['menu_btn_bg_color']) {
            $menu_btn_bg_color = sprintf('rgba(%d,%d,%d,%d)', $css['color']['menu_btn_bg_color']['r'], $css['color']['menu_btn_bg_color']['g'], $css['color']['menu_btn_bg_color']['b'], $css['color']['menu_btn_bg_color']['a']);
        }
        if ($css['color']['menu_btn_color']) {
            $menu_btn_color = sprintf('rgba(%d,%d,%d,%d)', $css['color']['menu_btn_color']['r'], $css['color']['menu_btn_color']['g'], $css['color']['menu_btn_color']['b'], $css['color']['menu_btn_color']['a']);
        }
        if ($css['color']['menu_btn_active_bg']) {
            $menu_btn_active_bg = sprintf('rgba(%d,%d,%d,%d)', $css['color']['menu_btn_active_bg']['r'], $css['color']['menu_btn_active_bg']['g'], $css['color']['menu_btn_active_bg']['b'], $css['color']['menu_btn_active_bg']['a']);
        }
        if ($css['color']['menu_btn_active_color']) {
            $menu_btn_active_color = sprintf('rgba(%d,%d,%d,%d)', $css['color']['menu_btn_active_color']['r'], $css['color']['menu_btn_active_color']['g'], $css['color']['menu_btn_active_color']['b'], $css['color']['menu_btn_active_color']['a']);
        }
        if ($css['color']['menu_btn_hover_bg']) {
            $menu_btn_hover_bg = sprintf('rgba(%d,%d,%d,%d)', $css['color']['menu_btn_hover_bg']['r'], $css['color']['menu_btn_hover_bg']['g'], $css['color']['menu_btn_hover_bg']['b'], $css['color']['menu_btn_hover_bg']['a']);
        }
        if ($css['color']['menu_btn_hover_color']) {
            $menu_btn_hover_color = sprintf('rgba(%d,%d,%d,%d)', $css['color']['menu_btn_hover_color']['r'], $css['color']['menu_btn_hover_color']['g'], $css['color']['menu_btn_hover_color']['b'], $css['color']['menu_btn_hover_color']['a']);
        }
        if ($css['color']['dropdown_bg']) {
            $dropdown_bg = sprintf('rgba(%d,%d,%d,%d)', $css['color']['dropdown_bg']['r'], $css['color']['dropdown_bg']['g'], $css['color']['dropdown_bg']['b'], $css['color']['dropdown_bg']['a']);
        }
        if ($css['color']['menu_dropdown_bg']) {
            $menu_dropdown_bg = sprintf('rgba(%d,%d,%d,%d)', $css['color']['menu_dropdown_bg']['r'], $css['color']['menu_dropdown_bg']['g'], $css['color']['menu_dropdown_bg']['b'], $css['color']['menu_dropdown_bg']['a']);
        }
        if ($css['color']['menu_dropdown_color']) {
            $menu_dropdown_color = sprintf('rgba(%d,%d,%d,%d)', $css['color']['menu_dropdown_color']['r'], $css['color']['menu_dropdown_color']['g'], $css['color']['menu_dropdown_color']['b'], $css['color']['menu_dropdown_color']['a']);
        }
        if ($css['color']['menu_dropdown_active_bg']) {
            $menu_dropdown_active_bg = sprintf('rgba(%d,%d,%d,%d)', $css['color']['menu_dropdown_active_bg']['r'], $css['color']['menu_dropdown_active_bg']['g'], $css['color']['menu_dropdown_active_bg']['b'], $css['color']['menu_dropdown_active_bg']['a']);
        }
        if ($css['color']['menu_dropdown_active_color']) {
            $menu_dropdown_active_color = sprintf('rgba(%d,%d,%d,%d)', $css['color']['menu_dropdown_active_color']['r'], $css['color']['menu_dropdown_active_color']['g'], $css['color']['menu_dropdown_active_color']['b'], $css['color']['menu_dropdown_active_color']['a']);
        }
        if ($css['color']['menu_dropdown_hover_bg']) {
            $menu_dropdown_hover_bg = sprintf('rgba(%d,%d,%d,%d)', $css['color']['menu_dropdown_hover_bg']['r'], $css['color']['menu_dropdown_hover_bg']['g'], $css['color']['menu_dropdown_hover_bg']['b'], $css['color']['menu_dropdown_hover_bg']['a']);
        }
        if ($css['color']['menu_dropdown_hover_color']) {
            $menu_dropdown_hover_color = sprintf('rgba(%d,%d,%d,%d)', $css['color']['menu_dropdown_hover_color']['r'], $css['color']['menu_dropdown_hover_color']['g'], $css['color']['menu_dropdown_hover_color']['b'], $css['color']['menu_dropdown_hover_color']['a']);
        }
        if ($css['color']['link_color']) {
            $link_color = sprintf('rgba(%d,%d,%d,%d)', $css['color']['link_color']['r'], $css['color']['link_color']['g'], $css['color']['link_color']['b'], $css['color']['link_color']['a']);
        }
        if ($css['color']['link_aktiv_color']) {
            $link_aktiv_color = sprintf('rgba(%d,%d,%d,%d)', $css['color']['link_aktiv_color']['r'], $css['color']['link_aktiv_color']['g'], $css['color']['link_aktiv_color']['b'], $css['color']['link_aktiv_color']['a']);
        }
        if ($css['color']['link_hover_color']) {
            $link_hover_color = sprintf('rgba(%d,%d,%d,%d)', $css['color']['link_hover_color']['r'], $css['color']['link_hover_color']['g'], $css['color']['link_hover_color']['b'], $css['color']['link_hover_color']['a']);
        }
        if ($css['color']['scroll_btn_bg']) {
            $scroll_btn_bg = sprintf('rgba(%d,%d,%d,%d)', $css['color']['scroll_btn_bg']['r'], $css['color']['scroll_btn_bg']['g'], $css['color']['scroll_btn_bg']['b'], $css['color']['scroll_btn_bg']['a']);
        }
        if ($css['color']['scroll_btn_color']) {
            $scroll_btn_color = sprintf('rgba(%d,%d,%d,%d)', $css['color']['scroll_btn_color']['r'], $css['color']['scroll_btn_color']['g'], $css['color']['scroll_btn_color']['b'], $css['color']['scroll_btn_color']['a']);
        }
        if ($css['color']['footer_bg']) {
            $footer_bg = sprintf('rgba(%d,%d,%d,%d)', $css['color']['footer_bg']['r'], $css['color']['footer_bg']['g'], $css['color']['footer_bg']['b'], $css['color']['footer_bg']['a']);
        }
        if ($css['color']['footer_color']) {
            $footer_color = sprintf('rgba(%d,%d,%d,%d)', $css['color']['footer_color']['r'], $css['color']['footer_color']['g'], $css['color']['footer_color']['b'], $css['color']['footer_color']['a']);
        }

        $colors = [
            'site_bg' => $site_bg,
            'menu_btn_bg_color' => $menu_btn_bg_color,
            'menu_btn_color' => $menu_btn_color,
            'menu_btn_active_bg' => $menu_btn_active_bg,
            'menu_btn_active_color' => $menu_btn_active_color,
            'menu_btn_hover_bg' => $menu_btn_hover_bg,
            'menu_btn_hover_color' => $menu_btn_hover_color,
            'dropdown_bg' => $dropdown_bg,
            'menu_dropdown_bg' => $menu_dropdown_bg,
            'menu_dropdown_color' => $menu_dropdown_color,
            'menu_dropdown_active_bg' => $menu_dropdown_active_bg,
            'menu_dropdown_active_color' => $menu_dropdown_active_color,
            'menu_dropdown_hover_bg' => $menu_dropdown_hover_bg,
            'menu_dropdown_hover_color' => $menu_dropdown_hover_color,
            'link_color' => $link_color,
            'link_aktiv_color' => $link_aktiv_color,
            'link_hover_color' => $link_hover_color,
            'scroll_btn_bg' => $scroll_btn_bg,
            'scroll_btn_color' => $scroll_btn_color,
            'scroll_btn_active' => $css['color']['scroll_btn_active'],
            'footer_bg' => $footer_bg,
            'footer_color' => $footer_color
        ];

        if ($css) {
            foreach ($css['font'] as $font) {
                $fontWeight = '';
                $fontStyle = '';
                $fontFamily = '';
                $fontSize = '';
                $fontSizeSm = '';
                $color = '';
                $lineHeight = '';
                $uppercase = '';
                if ($font['font-family']) {
                    $family = $this->em->getRepository(AppFonts::class)->findOneBy(['designation' => $font['font-family']]);
                    if ($family) {
                        $fontFamily = $family->getDesignation() . ', sans-serif';
                        $fontData = $family->getFontData();
                        $sub = $helper->get_font_style($fontData, $font['font-style']);
                        if ($sub) {
                            $fontWeight = $sub['font_weight'];
                            $fontStyle = $sub['font_style'];
                        }
                    }
                }
                if ($font['size']) {
                    $fontSize = $font['size'];
                }
                if ($font['size_sm']) {
                    $fontSizeSm = $font['size_sm'];
                }
                if ($font['line-height']) {
                    $lineHeight = $font['line-height'];
                }
                if ($font['color']) {
                    $color = sprintf('rgba(%d,%d,%d,%d)', $font['color']['r'], $font['color']['g'], $font['color']['b'], $font['color']['a']);
                }
                if ($font['uppercase']) {
                    $uppercase = $font['uppercase'];
                }
                $item = [
                    'type' => $font['id'],
                    'fontWeight' => $fontWeight,
                    'fontStyle' => $fontStyle,
                    'fontFamily' => $fontFamily,
                    'fontSize' => $fontSize,
                    'fontSizeSm' => $fontSizeSm,
                    'color' => $color,
                    'lineHeight' => $lineHeight,
                    'uppercase' => $uppercase
                ];
                $fontArr[] = $item;
            }

            foreach ($css['font_headline'] as $headline) {
                $fontWeight = '';
                $fontStyle = '';
                $fontFamily = '';
                $fontSize = '';
                $fontSizeSm = '';
                $color = '';
                $lineHeight = '';
                if ($headline['font-family']) {
                    $family = $this->em->getRepository(AppFonts::class)->findOneBy(['designation' => $headline['font-family']]);
                    if ($family) {
                        $fontFamily = $family->getDesignation() . ', sans-serif';
                        $fontData = $family->getFontData();
                        $sub = $helper->get_font_style($fontData, $headline['font-style']);
                        if ($sub) {
                            $fontWeight = $sub['font_weight'];
                            $fontStyle = $sub['font_style'];
                        }
                    }
                }
                if ($headline['size']) {
                    $fontSize = $headline['size'];
                }
                if ($headline['size_sm']) {
                    $fontSizeSm = $headline['size_sm'];
                }
                if ($headline['color']) {
                    $color = sprintf('rgba(%d,%d,%d,%d)', $headline['color']['r'], $headline['color']['g'], $headline['color']['b'], $headline['color']['a']);
                }
                if ($headline['line-height']) {
                    $lineHeight = $headline['line-height'];
                }

                $item = [
                    'type' => $headline['id'],
                    'fontWeight' => $fontWeight,
                    'fontStyle' => $fontStyle,
                    'fontFamily' => $fontFamily,
                    'fontSize' => $fontSize,
                    'fontSizeSm' => $fontSizeSm,
                    'color' => $color,
                    'lineHeight' => $lineHeight,
                ];
                $headArr[] = $item;
            }
        }

        $data = [
            'font' => $fontArr,
            'headline' => $headArr,
            'color' => $colors
        ];

        $publicCss = $this->renderView(
            'public/css/public-style.css.twig',
            $data
        );
        return new Response($publicCss, 200,
            array('Content-Type' => 'text/css')
        );
    }
}

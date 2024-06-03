<?php

namespace App\Controller;

use App\Ajax\InstallAjaxCall;
use App\Entity\SystemSettings;
use App\Entity\User;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Yaml\Yaml;
use Symfony\Contracts\Translation\TranslatorInterface;

class InstallController extends AbstractController
{

    public function __construct(
        private readonly InstallAjaxCall $installAjaxCall,
        private readonly TranslatorInterface $translator
    )
    {
    }

    #[Route('/app/install', name: 'app_install')]
    public function index(): Response
    {
        return $this->render('install/index.html.twig', [
            'title' => $this->translator->trans('install.Installation'),
        ]);
    }

    /**
     * @throws NotFoundExceptionInterface
     * @throws ContainerExceptionInterface
     */
    #[Route('/install-settings.js', name: 'javascript_install_settings')]
    public function install_settings(): Response
    {

        $csrf = $this->container->get('security.csrf.token_manager');
        $token = $csrf->getToken('install_token');
        $settings = [
            'token' => $token->getValue(),
            'ajax_url' => $this->generateUrl('install_ajax'),
            'handle' => 'ajaxInstallHandle',
        ];
        $emailJs = $this->renderView(
            'javascript/install-settings.js.twig',
            array(
                'json' => json_encode($settings)
            )
        );
        return new Response($emailJs, 200,
            array('Content-Type' => 'text/javascript')
        );
    }

    #[Route('/install-ajax', name: 'install_ajax', methods: ['POST'])]
    public function install_ajax_class(Request $request): JsonResponse
    {
        $token = $request->request->get('token');
        $method = $request->request->get('method');
        $handle = $request->request->get('_handle');

        if (!$this->isCsrfTokenValid('install_token', $token) || !$method || !$handle) {
            return new JsonResponse(
                (object)[],
                403);
        }
        return new JsonResponse(
            $this->installAjaxCall->$handle($request),
            200);
    }

    #[Route('/install-translation', name: 'install_translation')]
    public function js_install_translation(Request $request): Response
    {
        $locale = $request->getLocale();
        $file = __DIR__ . '/../../translations/messages.' . $locale . '.yaml';
        $parsed = Yaml::parse(file_get_contents($file));
        $translations = $this->renderView(
            'translation/translation.js.twig',
            array(
                'json' => json_encode($parsed)
            )
        );
        return new Response($translations, 200,
            array('Content-Type' => 'text/javascript')
        );
    }
}

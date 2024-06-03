<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Yaml\Yaml;

#[Route('/dashboard/app', name: 'app')]
class TranslationController extends AbstractController
{
    #[Route('/translation', name: '_translation')]
    public function js_translation(Request $request): Response
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

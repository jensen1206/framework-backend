<?php

namespace App\Controller;

use App\AppHelper\EmHelper;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class SitemapController extends AbstractController
{
    public function __construct(
        private readonly EmHelper $emHelper
    )
    {
    }

    #[Route('/sitemap.xml', name: 'app_sitemap', defaults: ['_format' => 'xml'])]
    public function sitemap(): Response
    {
      //  $selfUrl = $request->getSchemeAndHttpHost();
        $data = [];
        $this->emHelper->generate_sitemap();
        $sitemap = $this->getParameter('publicPath') . 'sitemap.json';
        if(is_file($sitemap)){
            $data = json_decode(file_get_contents($sitemap), true);
        }
        return $this->render('sitemap/sitemap.xml.twig', [
           'data' => $data
        ]);
    }
}

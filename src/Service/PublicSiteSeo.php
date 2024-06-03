<?php

namespace App\Service;

use App\Entity\AppSites;
use App\Entity\Media;
use App\Entity\PostSites;
use App\Entity\SystemSettings;
use App\Settings\Settings;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Sonata\SeoBundle\Seo\SeoPageInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\Component\HttpFoundation\Request;

class PublicSiteSeo
{
    use Settings;

    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly TranslatorInterface    $translator,
        private readonly SeoPageInterface       $seo,
        private readonly UploaderHelper         $uploaderHelper,
        private readonly string                 $baseUrl
    )
    {
    }

    public function set_seo($request, $routeName = null, $category = null, $postSlug = null, $postCategory = null): void
    {

        $siteRepro = $this->em->getRepository(AppSites::class);
        $postRepro = $this->em->getRepository(PostSites::class);
        if ($category) {
            $site = $siteRepro->findOneBy(['siteSlug' => $category]);
        } elseif ($postSlug) {
            $site = $postRepro->findOneBy(['postSlug' => $postSlug]);
        } elseif ($postCategory) {
            $site = $postRepro->findOneBy(['postSlug' => $postCategory]);
        } else {
            if ($routeName) {
                $site = $siteRepro->findOneBy(['routeName' => $routeName]);
            } else {
                $uri = $request->getRequestUri();
                $site = $siteRepro->findOneBy(['siteSlug' => substr($uri, 1)]);
            }
        }

        if ($site) {
            //$globalRequest = Request::createFromGlobals();
            //$preferredLang = $globalRequest->getPreferredLanguage();
            $locale = $request->getLocale();
            $canonical = $request->getUri();

            $robots_follow = 'follow';
            $robots_index = 'index';

            $seoSite = $site->getSiteSeo();
            if ($seoSite->getNoIndex()) {
                $robots_index = 'noindex';
            }
            if ($seoSite->getNoFollow()) {
                $robots_follow = 'nofollow';
            }
            $robots = [$robots_index, $robots_follow];

            try {
                $description = $seoSite->getSeoContent() ?? '';
                $this->seo
                    ->setTitle($seoSite->getSeoTitle())
                    ->addMeta('name', 'description', $description)
                    ->setLinkCanonical($canonical)
                    ->setLangAlternates([$canonical => $locale])
                    ->addMeta('name', 'robots', implode(', ', $robots));

                if ($robots_index == 'index' && $robots_follow == 'follow') {
                    $this->seo->addMeta('name', 'googlebot', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
                    $this->seo->addMeta('name', 'bingbot', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
                }
                if ($seoSite->getTitlePrefix()) {
                    $this->seo->addTitlePrefix($seoSite->getTitlePrefix());
                }
                if ($seoSite->getTitleSuffix()) {
                    $this->seo->addTitleSuffix($seoSite->getTitleSuffix());
                }
                if ($seoSite->getTitleSeparator()) {
                    $this->seo->setSeparator($seoSite->getTitleSeparator());
                }
                if ($seoSite->getFbActive() || $seoSite->getXActive()) {
                    //$this->seo->addMeta('property', 'og:locale', $preferredLang);
                    $this->seo->addMeta('name', 'og:url', $canonical);
                    if ($seoSite->getOgTitle()) {
                        $this->seo->addMeta('property', 'og:title', $seoSite->getOgTitle());
                    }
                    if (!$seoSite->getOgType()) {
                        $ogType = 'website';
                    } else {
                        $ogType = $seoSite->getOgType();
                    }
                    $this->seo->addMeta('property', 'og:type', $ogType);
                    if ($seoSite->getOgContent()) {
                        $this->seo->addMeta('property', 'og:description', $seoSite->getOgContent());
                    }
                }
                if ($seoSite->getFbActive()) {
                    if ($seoSite->getFbAppId()) {
                        $this->seo->addMeta('name', 'fb:app_id', $seoSite->getFbAppId());
                    }
                    if ($seoSite->getFbAdmins()) {
                        $this->seo->addMeta('name', 'fb:admins', $seoSite->getFbAdmins());
                    }
                }
                if ($seoSite->getXActive()) {
                    $twCard = $seoSite->getXType() ?? 'summary';
                    $this->seo->addMeta('name', 'twitter:card', $twCard);
                    if ($seoSite->getXSite()) {
                        $this->seo->addMeta('name', 'twitter:site', $seoSite->getXSite());
                    }
                    if ($seoSite->getXCreator()) {
                        $this->seo->addMeta('name', 'twitter:creator', $seoSite->getXCreator());
                    }
                    if ($seoSite->getReadingTime()) {
                        if ($seoSite->getReadingTime() == 1) {
                            $minutes = $this->translator->trans('Minute');
                        } else {
                            $minutes = $this->translator->trans('Minutes');
                        }
                        $this->seo->addMeta('name', 'twitter:label1', $this->translator->trans('Estimated reading time'));
                        $this->seo->addMeta('name', 'twitter:data1', $seoSite->getReadingTime() . ' ' . $minutes);
                    }
                }
                if ($seoSite->getOgImage()) {

                    $this->set_og_image($seoSite->getOgImage(), $seoSite->getOgTitle());
                }
            } catch (Exception $e) {

            }
        }
    }

    private function set_og_image($fileName, $alt): void
    {
        $image = $this->em->getRepository(Media::class)->findOneBy(['fileName' => $fileName]);

        if ($image) {
            if ($image->getAlt()) {
                $altTag = $image->getAlt();
            } else {
                $altTag = $alt;
            }
            if ($image->getSizeData()) {
                $size = $image->getSizeData();
                $this->seo->addMeta('property', 'og:image:width', $size['width']);
                $this->seo->addMeta('property', 'og:image:height', $size['height']);
            }

            $imgPath = $this->uploaderHelper->getLargePath($this->uploaderHelper::MEDIATHEK);
            $this->seo->addMeta('property', 'og:image:type', $image->getMime());
            if ($altTag) {
                $this->seo->addMeta('property', 'og:image:alt', $altTag);
            }

            $this->seo->addMeta('property', 'og:image', $imgPath . '/' . $image->getFileName());
            if (str_starts_with($this->baseUrl, 'https')) {
                $this->seo->addMeta('property', 'og:image:secure_url', $imgPath . '/' . $image->getFileName());
            }
        }
    }
}
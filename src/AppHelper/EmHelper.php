<?php

namespace App\AppHelper;

use App\Entity\AppFonts;
use App\Entity\AppMenu;
use App\Entity\AppSites;
use App\Entity\Media;
use App\Entity\MenuCategory;
use App\Entity\PostSites;
use App\Entity\SystemSettings;
use App\Entity\User;
use App\Service\UploaderHelper;
use App\Settings\Settings;
use DateTimeImmutable;
use DateTimeInterface;
use Doctrine\DBAL\Exception\ConnectionException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Asset\Context\RequestStackContext;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;
use Symfony\Contracts\Translation\TranslatorInterface;

class EmHelper
{
    use Settings;

    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly TranslatorInterface    $translator,
        private readonly UploaderHelper         $uploaderHelper,
        private readonly KernelInterface        $kernel,
        private readonly UrlGeneratorInterface  $urlGenerator,
        private readonly RequestStackContext    $requestStackContext,
        private readonly string                 $uploadsPath,
        private readonly string                 $uploadsDirName,
        private readonly string                 $publicPath,
        private readonly string                 $fontsDir,
        private readonly string                 $uploadedAssetsBaseUrl
    )
    {
    }

    public function get_site_posts($type = null): array
    {
        $postQuery = $this->em->createQueryBuilder()
            ->from(PostSites::class, 'p')
            ->select('p, c, s')
            ->leftJoin('p.postCategory', 'c')
            ->leftJoin('p.siteSeo', 's')
            ->andWhere('p.postStatus =:status')
            ->setParameter('status', "publish")
            ->orderBy('p.position', 'ASC');

        $posts = $postQuery->getQuery()->getArrayResult();
        if ($type == 'post') {
            return $postQuery->getQuery()->getArrayResult();
        }
        $sitesQuery = $this->em->createQueryBuilder()
            ->from(AppSites::class, 'a')
            ->select('a, c, s')
            ->leftJoin('a.siteCategory', 'c')
            ->leftJoin('a.siteSeo', 's')
            ->andWhere('a.siteStatus =:status')
            ->setParameter('status', "publish")
            ->orderBy('a.position', 'ASC');

        if ($type == 'page') {
            return $sitesQuery->getQuery()->getArrayResult();
        }
        $sites = $sitesQuery->getQuery()->getArrayResult();
        return [
            'posts' => $posts,
            'sites' => $sites
        ];
    }

    public function get_post_site_selects(): array
    {
        $pageSelects = $this->get_site_posts();
        $postSites = [];
        $appSites = [];
        $sitePlaceholder = [
            '0' => [
                'selectId' => uniqid(),
                'postType' => 'page',
                'id' => '',
                'type' => 'disabled',
                'label' => '----' . $this->translator->trans('system.Pages') . '----'
            ]
        ];
        $postPlaceholder = [
            '0' => [
                'selectId' => uniqid(),
                'postType' => 'post',
                'id' => '',
                'type' => 'disabled',
                'label' => '----' . $this->translator->trans('posts.Posts') . '----'
            ]
        ];
        foreach ($pageSelects['posts'] as $tmp) {
            if ($tmp['siteType'] == 'category' && $tmp['siteSeo']) {
                $label = $tmp['siteSeo']['seoTitle'];
            } else {
                $label = $tmp['postCategory']['title'];
            }
            if ($tmp['siteType'] == 'post') {
                $label = $tmp['siteSeo']['seoTitle'];
            }
            $item = [
                'selectId' => uniqid(),
                'postType' => 'post',
                'id' => $tmp['id'],
                'type' => $tmp['siteType'],
                'label' => $label
            ];
            $postSites[] = $item;
        }
        foreach ($pageSelects['sites'] as $tmp) {
            if ($tmp['siteType'] == 'category' && $tmp['siteSeo']) {
                $label = $tmp['siteSeo']['seoTitle'];
            } else {
                $label = $tmp['siteCategory']['title'];
            }
            if ($tmp['siteType'] == 'page') {
                $label = $tmp['siteSeo']['seoTitle'];
            }
            $item = [
                'selectId' => uniqid(),
                'postType' => 'page',
                'id' => $tmp['id'],
                'type' => $tmp['siteType'],
                'label' => $label
            ];
            $appSites[] = $item;
        }

        return array_merge_recursive($sitePlaceholder, $appSites, $postPlaceholder, $postSites);
    }

    public function get_post_gallery($image): array
    {

        $thumbUrl = $this->uploaderHelper->getThumbnailPath($this->uploaderHelper::MEDIATHEK);
        $mediumUrl = $this->uploaderHelper->getMediumPath($this->uploaderHelper::MEDIATHEK);
        $largeUrl = $this->uploaderHelper->getLargePath($this->uploaderHelper::MEDIATHEK);
        $largeXlUrl = $this->uploaderHelper->getLargeXlFilterPath($this->uploaderHelper::MEDIATHEK);
        $fullUrl = $this->uploaderHelper->getLargeXlFilterPath($this->uploaderHelper::MEDIATHEK);

        $thumbPath = $this->uploadsPath . 'media/cache/squared_thumbnail_small/' . $this->uploaderHelper::MEDIATHEK . '/';
        $mediumPath = $this->uploadsPath . 'media/cache/medium_image_filter/' . $this->uploaderHelper::MEDIATHEK . '/';
        $largePath = $this->uploadsPath . 'media/cache/large_image_filter/' . $this->uploaderHelper::MEDIATHEK . '/';
        $largeXlPath = $this->uploadsPath . 'media/cache/full_image_filter/' . $this->uploaderHelper::MEDIATHEK . '/';

        $helper = Helper::instance();

        $arr = [];
        $img = $image;
        $urls = [];
        if ($img->getType() == 'image') {
            $regExMedia = '/\/media.+/';
            $thumbAttr = '';
            if (is_file($thumbPath . $img->getFileName())) {
                $thumbAttr = $helper->get_image_size($thumbPath . $img->getFileName());
                preg_match($regExMedia, $thumbUrl, $matches);
                $thumbUrl = $matches[0];
            }
            $mediumAttr = '';
            if (is_file($mediumPath . $img->getFileName())) {
                $mediumAttr = $helper->get_image_size($mediumPath . $img->getFileName());
                preg_match($regExMedia, $mediumUrl, $matches);
                $mediumUrl = $matches[0];
            }
            $largeAttr = '';
            if (is_file($largePath . $img->getFileName())) {
                $largeAttr = $helper->get_image_size($largePath . $img->getFileName());
                preg_match($regExMedia, $largeUrl, $matches);
                $largeUrl = $matches[0];
            }
            $largeXlAttr = '';
            if (is_file($largeXlPath . $img->getFileName())) {
                $largeXlAttr = $helper->get_image_size($largeXlPath . $img->getFileName());
                preg_match($regExMedia, $largeXlUrl, $matches);
                $largeXlUrl = $matches[0];
            }
            $urls = [
                'thumbnail' => [
                    'attr' => $thumbAttr,
                    'url' => $thumbUrl . '/' . $img->getFileName(),
                ],
                'medium' => [
                    'attr' => $mediumAttr,
                    'url' => $mediumUrl . '/' . $img->getFileName(),
                ],
                'large' => [
                    'attr' => $largeAttr,
                    'url' => $largeUrl . '/' . $img->getFileName(),
                ],
                'xl-large' => [
                    'attr' => $largeXlAttr,
                    'url' => $largeXlUrl . '/' . $img->getFileName(),
                ],
                'full' => [
                    'attr' => $img->getSizeData(),
                    'url' => '/' . $this->uploadsDirName . '/' . $this->uploaderHelper::MEDIATHEK . '/' . $img->getFileName(),
                ],
            ];
        }
        $item = [
            'imgId' => $img->getId(),
            'action' => 'lightbox',
            'external_url' => '',
            'show_designation' => false,
            'show_description' => false,
            'blank' => false,
            'id' => uniqid(),
            'file_size' => $helper->FileSizeConvert((float)$img->getSize()),
            'alt' => $img->getAlt(),
            'attr' => $img->getAttr(),
            'type' => $img->getType(),
            'fileName' => $img->getFileName(),
            'original' => $img->getOriginal(),
            'customCss' => $img->getCustomCss(),
            'title' => $img->getTitle(),
            'description' => $img->getDescription(),
            'labelling' => $img->getLabelling(),
            'owner' => $img->getUser()->getEmail(),
            'urls' => $urls,
        ];

        $links = [
            'liip_extensions' => $this->liip_imagine_extensions,
            'thumb_url' => $thumbUrl,
            'medium_url' => $mediumUrl,
            'large_url' => $largeUrl,
            'large_xl_url' => $largeXlUrl,
            'media_url' => $fullUrl,
        ];
        return [
            'record' => $item,
            'links' => $links
        ];
    }

    public function get_default_berechtigungen($type, $vote): bool
    {
        $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
        $data = [];
        if ($type == 'admin') {
            $data = $settings->getApp()['default_admin_voter'];
        }
        if ($type == 'user') {
            $data = $settings->getApp()['default_user_voter'];
        }
        if ($data) {
            foreach ($data as $tmp) {
                if ($tmp['role'] == $vote) {
                    return $tmp['default'];
                }
            }
        }
        return false;
    }

    public function generate_font_face(): bool
    {
        $dest = $this->publicPath . 'scss' . DIRECTORY_SEPARATOR . '_font-face.scss';
        $loop = $this->fontsDir . 'default.css.txt';
        $font = $this->em->getRepository(AppFonts::class)->findAll();
        if (is_file($dest)) {
            unlink($dest);
        }
        if (!$font) {
            file_put_contents($dest, '');
            return false;
        }

        foreach ($font as $f) {
            $fontData = $f->getFontData();
            $isWoff2 = $f->isWoff2();
            foreach ($fontData as $tmp) {
                if ($isWoff2) {
                    $loopUrl = sprintf(" url('../fonts/%s/%s') format('truetype'),\n\t  url('../fonts/%s/%s') format('woff'),\n\t  url('../fonts/%s/%s') format('woff2');", $tmp['family'], $tmp['local_name'] . '.ttf', $tmp['family'], $tmp['local_name'] . '.woff', $tmp['family'], $tmp['local_name'] . '.woff2');
                } else {
                    $loopUrl = sprintf(" url('../fonts/%s/%s') format('truetype'),\n\t  url('../fonts/%s/%s') format('woff');", $tmp['family'], $tmp['local_name'] . '.ttf', $tmp['family'], $tmp['local_name'] . '.woff');
                }
                $defCss = file_get_contents($loop);
                $defCss = str_replace('###FAMILY###', $tmp['family'], $defCss);
                $defCss = str_replace('###FULL_NAME###', $tmp['full_name'], $defCss);
                $defCss = str_replace('###LOCAL_NAME###', $tmp['local_name'], $defCss);
                $defCss = str_replace('###URL_LOOP###', $loopUrl, $defCss);
                $defCss = str_replace('###FONT_WEIGHT###', $tmp['font_weight'], $defCss);
                $defCss = str_replace('###FONT_STYLE###', $tmp['font_style'], $defCss) . "\r\n";

                file_put_contents($dest, $defCss, FILE_APPEND | LOCK_EX);
            }
        }
        return true;
    }

    public function generate_sitemap(): void
    {

        $mediathekRepo = $this->em->getRepository(Media::class);
        $self = $this->kernel->getContainer()->get('router')->getContext();
        $selfUrl = $self->getScheme() . '://' . $self->getHost();

        $siteMapUri = $this->urlGenerator->generate('app_sitemap');
        $siteMapUrl = $selfUrl . $siteMapUri;

        $assetsUrl = $selfUrl . '/' . $this->uploadsDirName . '/'. $this->uploaderHelper::MEDIATHEK ;
        $robots = 'User-agent: *' . "\r\n";
        $robots .= 'Sitemap: ' . $selfUrl . '/sitemap.xxl' . "\r\n";
        $robotsFile = $this->publicPath . 'robots.txt';
        file_put_contents($robotsFile, $robots);

        $postQuery = $this->em->createQueryBuilder()
            ->from(PostSites::class, 'p')
            ->select('p, c, s')
            ->leftJoin('p.postCategory', 'c')
            ->leftJoin('p.siteSeo', 's')
            ->andWhere('p.postStatus =:status')
            ->setParameter('status', "publish")
            ->orderBy('p.position', 'ASC');

        $posts = $postQuery->getQuery()->getArrayResult();

        $sitesQuery = $this->em->createQueryBuilder()
            ->from(AppSites::class, 'a')
            ->select('a, c, s')
            ->leftJoin('a.siteCategory', 'c')
            ->leftJoin('a.siteSeo', 's')
            ->andWhere('a.siteStatus =:status')
            ->setParameter('status', "publish")
            ->andWhere('a.siteType =:siteType')
            ->setParameter('siteType', 'page')
            ->orderBy('a.position', 'ASC');
        $sites = $sitesQuery->getQuery()->getArrayResult();

        $postArr = [];
        foreach ($posts as $post) {
            $uri = $this->urlGenerator->generate('public_post', ['postCategory' => $post['postCategory']['slug'], 'slug' => $post['postSlug']]);

            $imgTitle = '';
            $img = '';
            if($post['siteImg']) {
                $mediathek = $mediathekRepo->findOneBy(['fileName' => $post['siteImg']]);
                if($mediathek) {
                    $imgTitle = $mediathek->getTitle();
                    if($mediathek->getType() == 'image') {
                        $uriI = $this->uploaderHelper->getLargeXlFilterPath($this->uploaderHelper::MEDIATHEK);
                        $img = $uriI . '/' . $post['siteImg'];
                    } else {
                        $img = $assetsUrl . '/' .$post['siteImg'];
                    }
                }
            }
            if(!$imgTitle) {
                $imgTitle = $post['siteSeo']['seoTitle'];
            }

            $gallery = [];
            if($post['postGallery']) {
                foreach ($post['postGallery'] as $tmp) {
                    if($tmp['type'] == 'image') {
                        $imgUri = $tmp['urls']['xl-large']['url'];
                    } else {
                        $imgUri = $tmp['urls']['full']['url'];
                    }
                    $galleryItem = [
                        'image_title' => $tmp['title'],
                        'image' => $assetsUrl . $imgUri
                    ];
                    $gallery[] = $galleryItem;
                }
            }

            $item = [
                'loc' => $selfUrl . $uri,
                'lastmod' => $post['siteSeo']['lastUpdate']->format(DateTimeInterface::W3C),
                'changefreq' => 'monthly',
                'image' => $img,
                'image_title' => $imgTitle,
                'priority' => '',
                'gallery' => $gallery
            ];
            $postArr[] = $item;
        }

        $siteArr = [];
        foreach ($sites as $site) {
            $uri = '';
            if($site['routeName']) {
                $uri = $this->urlGenerator->generate($site['routeName']);
            } else {
                if($site['siteSlug']) {
                    $uri = $this->urlGenerator->generate('app_public_slug', ['slug' => $site['siteSlug']]);
                }
            }
            $imgTitle = '';
            $img = '';
            if($site['siteImg']) {
                $mediathek = $mediathekRepo->findOneBy(['fileName' => $site['siteImg']]);
                if($mediathek) {
                    $imgTitle = $mediathek->getTitle();
                    if($mediathek->getType() == 'image') {
                        $uriI = $this->uploaderHelper->getLargeXlFilterPath($this->uploaderHelper::MEDIATHEK);
                        $img = $uriI . '/' . $site['siteImg'];
                    } else {
                        $img = $assetsUrl . '/' .$site['siteImg'];
                    }
                }
            }
            if(!$imgTitle){
                $imgTitle = $site['siteSeo']['seoTitle'];
            }
            $item = [
                'loc' => $selfUrl . $uri,
                'lastmod' => $site['siteSeo']['lastUpdate']->format(DateTimeInterface::W3C),
                'changefreq' => 'monthly',
                'image' => $img,
                'image_title' => $imgTitle,
                'priority' => '',
                'gallery' => []
            ];
            $siteArr[] = $item;
        }

        $siteMap = array_merge_recursive($siteArr, $postArr);
        $fileName = $this->publicPath . 'sitemap.json';
        file_put_contents($fileName, json_encode($siteMap));
    }

    public function system_is_installed($role): bool
    {

        $conn = $this->em->getConnection();
        try {
            $conn->getDatabase();
        } catch (ConnectionException|\Doctrine\DBAL\Exception $e) {
            return false;
        }
        $conn = $this->em->getConnection();
        $sql = "SELECT app FROM system_settings WHERE designation = ?";
        try {
            $stmt = $conn->prepare($sql);
            $stmt->bindValue(1, "system");
            $resultSet = $stmt->executeQuery();
            $result = $resultSet->fetchOne();

        } catch (\Exception $e) {
            return false;
        }
        return true;
    }



}
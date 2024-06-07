<?php

namespace App\Twig;

use ApiPlatform\Metadata\Post;
use App\AppHelper\EmHelper;
use App\AppHelper\Helper;
use App\AppHelper\NavHelper;
use App\Entity\Account;
use App\Entity\AppMaps;
use App\Entity\AppMenu;
use App\Entity\AppSites;
use App\Entity\EmailsSent;
use App\Entity\FormBuilder;
use App\Entity\Log;
use App\Entity\Media;
use App\Entity\MediaSlider;
use App\Entity\PostCategory;
use App\Entity\PostSites;
use App\Entity\SystemSettings;
use App\Entity\Tag;
use App\Entity\User;
use App\Service\UploaderHelper;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\NoResultException;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\ContainerInterface;
use Psr\Container\NotFoundExceptionInterface;
use Pyrrah\GravatarBundle\GravatarApi;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Contracts\Service\ServiceSubscriberInterface;
use Twig\Extension\AbstractExtension;
use Twig\Extension\StringLoaderExtension;
use Twig\TwigFilter;
use Twig\TwigFunction;
use Twig\Environment;
use Twig\Extra\String\StringExtension;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class AppExtension extends AbstractExtension implements ServiceSubscriberInterface
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly TokenStorageInterface  $tokenStorage,
        private readonly ContainerInterface     $container,
        private readonly UrlGeneratorInterface  $urlGenerator,
        private readonly NavHelper              $navHelper,
        private readonly Security               $security,
        private readonly EmHelper               $emHelper,

    )
    {

    }

    public function getFunctions(): array
    {
        return [
            new TwigFunction('uploaded_asset', [$this, 'getUploadedAssetPath'])
        ];
    }

    public function getFilters(): array
    {
        return [
            new TwigFilter('systemInstalled', [$this, 'systemIsInstalled']),
            new TwigFilter('userAccount', [$this, 'getAccountData']),
            new TwigFilter('getGravatar', [$this, 'getGravatar']),
            new TwigFilter('emailCount', [$this, 'getSentEmailsCount']),
            new TwigFilter('sentEmails', [$this, 'getSentEmails']),
            new TwigFilter('appSettings', [$this, 'getAppSettings']),
            new TwigFilter('registerSettings', [$this, 'getRegisterSettings']),
            new TwigFilter('mustValidated', [$this, 'getValidateUser']),
            new TwigFilter('mustValidatedCount', [$this, 'getValidateUserCount']),
            new TwigFilter('activityCount', [$this, 'getActivityCount']),
            new TwigFilter('activityLog', [$this, 'getActivityLog']),
            new TwigFilter('html_encode', [$this, 'setHtmlEncode']),
            //builder
            new TwigFilter('getCarousel', [$this, 'getBuilderCarousel']),
            new TwigFilter('pageById', [$this, 'getPageById']),
            new TwigFilter('postById', [$this, 'getPostById']),
            new TwigFilter('postGallery', [$this, 'getPostGallery']),
            new TwigFilter('getSlider', [$this, 'getBuilderSlider']),
            new TwigFilter('featureImage', [$this, 'getFeatureImage']),
            new TwigFilter('builderDesign', [$this, 'getBuilderDesign']),
            new TwigFilter('categoryLoop', [$this, 'getCategoryLoop']),
            new TwigFilter('categoryPostLoop', [$this, 'getCategoryPostLoop']),
            new TwigFilter('postCategory', [$this, 'getPostCategory']),
            new TwigFilter('categoryImage', [$this, 'getCategoryImage']),
            new TwigFilter('appMenu', [$this, 'getAppMenu']),
            new TwigFilter('gmapsApi', [$this, 'getGmapsApi']),
            new TwigFilter('gmapsIframe', [$this, 'getGmapsIframe']),
            new TwigFilter('osmIframe', [$this, 'getOsmIframe']),
            new TwigFilter('osmLeaflet', [$this, 'getOsmLeaflet']),
            new TwigFilter('customFields', [$this, 'getCustomFields']),
            new TwigFilter('base64Array', [$this, 'getBase64Array']),
            //AppNavigation
            new TwigFilter('mainNav', [$this, 'getAppNavigation']),
        ];
    }

    public function setHtmlEncode($html): string
    {
        return html_entity_decode($html);
    }

    public function systemIsInstalled($role): bool
    {

        $user = $this->em->getRepository(User::class)->findByRole($role);
        return (bool)$user;
    }



    /**
     * @throws ExceptionInterface
     */
    public function getAppNavigation(): array
    {
        return $this->navHelper->get_navigation('main');
    }

    public function getPageById($id): string
    {
        $page = $this->em->getRepository(AppSites::class)->find($id);
        if ($page->getSiteSlug()) {
            return $this->urlGenerator->generate('app_public_slug', ['slug' => $page->getSiteSlug()]);
        } else {
            return $this->urlGenerator->generate($page->getRouteName());
        }
    }

    public function getBase64Array($array):string
    {
        return base64_encode(json_encode($array));

    }

    public function getAppMenu($config): array
    {
        if (!$config) {
            return [];
        }
        $repo = $this->em->getRepository(AppMenu::class);

        $appMenu = $this->em->getRepository(AppMenu::class)->findOneBy(['id' => $config['menu']], ['position' => 'asc']);
        if (!$appMenu) {
            return [];
        }
        if (!$appMenu->getMenuCategory()->getActive()) {
            return [];
        }
        $helper = Helper::instance();
        $arrayGroups = $repo->childrenHierarchy($appMenu, false);
        $arrayGroups = $helper->order_by_args($arrayGroups, 'position', 2);
        return $helper->array_values_recursive($arrayGroups);
    }

    public function getCustomFields($fields):array
    {
        $ids = [];
        $arr = [];
        if($fields) {
            foreach ($fields as $tmp) {
                $ids[] = $tmp['id'];
            }
            $custom = $this->em->getRepository(MediaSlider::class)->findOneBy(['type' => 'custom_fields']);
            foreach ($custom->getSlider() as $tmp) {
                if(in_array($tmp['id'], $ids)) {
                    if($tmp['link_type'] == 'tel') {
                        $plus = '';
                        if(preg_match('~\+~', $tmp['value'])) {
                            $plus = '+';
                        }
                        $tmp['tel_link'] = $plus . preg_replace('~\W~','', $tmp['value']);
                        //$tel = str_replace(['(',')',' ','-','/','|'], '', $tmp['value']);
                    }
                    $arr[] = $tmp;
                }
            }
        }

        return $arr;
    }

    public function getGmapsApi($config, $pins)
    {
        $custom_colour_scheme = json_decode($config['custom_colour_scheme']);
        $config['custom_colour_scheme'] = base64_encode(json_encode($custom_colour_scheme));
        $config['api_key'] = base64_encode($config['api_key']);
         $d = '';
        if ($config['privacy_policy']) {
            $ds = $this->em->getRepository(AppMaps::class)->find($config['privacy_policy']);
            if ($ds) {
                $d = $ds->getMapData();
                if (strpos($d['accept_txt'], '{{LINK}}')) {
                    $d['accept_txt'] = str_replace('{{LINK}}', $d['page'], $d['accept_txt']);
                } else {
                    $d['accept_txt'] = $d['accept_txt'] . ' <a target="_blank" href="' . $d['page'] . '">' . $d['page'] . '</a>';
                }
            }
        }
        if ($config['default_pin']) {
            $default_pin = '/uploads/mediathek/' . $config['default_pin'];
        } else {
            $default_pin = '';
        }


        $pinArr = [];
        if ($pins) {
            foreach ($pins as $tmp) {
                $pin = $default_pin;
                if ($tmp['custom_pin_active']) {
                    if ($tmp['custom_pin']) {
                        $pin = '/uploads/mediathek/' . $tmp['custom_pin'];
                    }
                    $height = $tmp['pin_height'];
                    $width = $tmp['pin_width'];
                } else {
                    $height = $config['pin_height'];
                    $width = $config['pin_width'];
                }

                $item = [
                    'pin' => $pin,
                    'height' => $height,
                    'width' => $width,
                    'coordinates' => $tmp['coordinates'],
                    'info_txt' => nl2br($tmp['info_txt']),
                ];
                $pinArr[] = $item;
            }
        }
        $pinsArr = json_encode($pinArr);
        $config['pins'] = base64_encode($pinsArr);
        $config['ds'] = $d;

        return $config;
    }

    public function getOsmLeaflet($config)
    {
        $d = '';
        if ($config['privacy_policy']) {
            $ds = $this->em->getRepository(AppMaps::class)->find($config['privacy_policy']);
            if ($ds) {
                $d = $ds->getMapData();
                if (strpos($d['accept_txt'], '{{LINK}}')) {
                    $d['accept_txt'] = str_replace('{{LINK}}', $d['page'], $d['accept_txt']);
                } else {
                    $d['accept_txt'] = $d['accept_txt'] . ' <a target="_blank" href="' . $d['page'] . '">' . $d['page'] . '</a>';
                }
            }
        }
        $config['ds'] = $d;
        return $config;
    }

    public function getGmapsIframe($config)
    {
        $d = '';
        if ($config['privacy_policy']) {
            $ds = $this->em->getRepository(AppMaps::class)->find($config['privacy_policy']);
            if ($ds) {
                $d = $ds->getMapData();
                if (strpos($d['accept_txt'], '{{LINK}}')) {
                    $d['accept_txt'] = str_replace('{{LINK}}', $d['page'], $d['accept_txt']);
                } else {
                    $d['accept_txt'] = $d['accept_txt'] . ' <a target="_blank" href="' . $d['page'] . '">' . $d['page'] . '</a>';
                }
            }
        }
        $regEx = '/(http(s?):\/\/)([a-z0-9]+\.)+[a-z]{2,4}(\.[a-z]{2,4})*(\/[^ |"]+)/m';
        preg_match($regEx, $config['iframe'], $matches);
        $config['ds'] = $d;
        $config['url'] = base64_encode($matches[0] ?? '');
        return $config;
    }

    public function getOsmIframe($config)
    {
        $d = '';
        if ($config['privacy_policy']) {
            $ds = $this->em->getRepository(AppMaps::class)->find($config['privacy_policy']);
            if ($ds) {
                $d = $ds->getMapData();
                if (strpos($d['accept_txt'], '{{LINK}}')) {
                    $d['accept_txt'] = str_replace('{{LINK}}', $d['page'], $d['accept_txt']);
                } else {
                    $d['accept_txt'] = $d['accept_txt'] . ' <a target="_blank" href="' . $d['page'] . '">' . $d['page'] . '</a>';
                }
            }
        }
        $regEx = '/(http(s?):\/\/)([a-z0-9]+\.)+[a-z]{2,4}(\.[a-z]{2,4})*(\/[^ |"]+)/m';
        preg_match($regEx, $config['iframe'], $matches);
        $config['ds'] = $d;
        $config['url'] = base64_encode($matches[0] ?? '');

        $re = '/(\d{1,2})\/(.+?)\/(.+?)"/m';
        preg_match($re, $config['iframe'], $match);
        $map = [
            'active' => $config['link_show_larger_map'],
            'zoom' => $match[1] ?? '',
            'lat' => $match[2] ?? '',
            'lon' => $match[3] ?? ''
        ];
        $map = base64_encode(json_encode($map));
        $config['map'] = $map;
        return $config;
    }

    public function getBuilderDesign($id): array
    {
        $builder = $this->em->getRepository(FormBuilder::class)->find($id);
        if (!$builder) {
            return [];
        }
        $builder = $builder->getForm();
        return [
            'builder' => $builder['builder'],
            'settings' => $builder['settings'],
            'type' => $builder['type'],
        ];
    }

    public function getCategoryLoop($ids, $config): array
    {
        if (!$ids) {
            return [];
        }
        $catLoads = [];
        foreach ($ids as $tmp) {
            $catLoads[] = $tmp['id'];
        }

        $query = $this->em->createQueryBuilder()
            ->from(PostSites::class, 'p')
            ->select('p, c, ca, s')
            ->andWhere('p.siteType=:type')
            ->setParameter('type', 'post')
            ->leftJoin('p.postCategory', 'c')
            ->leftJoin('p.categories', 'ca')
            ->leftJoin('p.siteSeo', 's')
            ->andWhere('c.id IN (:cats)')
            ->setParameter('cats', $catLoads);

        if (isset($config['load_limit']) && $config['load_limit'] > 0) {
            $query->setMaxResults($config['load_limit']);
        }

        if ($config['order_by'] == 'date') {
            $query->orderBy('p.postDate', $config['order']);
        }
        if ($config['order_by'] == 'position') {
            $query->orderBy('p.position', $config['order']);
        }
        if ($config['order_by'] == 'name') {
            $query->orderBy('s.seoTitle', $config['order']);
        }
        if ($config['order_by'] == 'category_position') {
            $query->orderBy('c.position', $config['order']);
            $query->addOrderBy('p.postDate', 'DESC');
        }
        if ($config['order_by'] == 'category_name') {
            $query->orderBy('c.title', $config['order']);
            $query->addOrderBy('p.postDate', 'DESC');
        }

        return $query->getQuery()->getArrayResult();
    }


    public function getCategoryPostLoop($config, $id, $type, $slug): array
    {

        $ids = [];
        if($type == 'category') {
            $cat = $this->em->getRepository(PostCategory::class)->find($id);
            foreach ($cat->getPost() as $p) {
                $ids[] = $p->getId();
            }
        }
        if($type == 'tag') {
            $query = $this->em->createQueryBuilder()
                ->from(Tag::class, 't')
                ->select('t, p')
                ->leftJoin('t.posts', 'p')
                ->andWhere('t.slug=:slug')
                ->setParameter('slug', $slug);
            $result = $query->getQuery()->getArrayResult();
            $tags = $result[0] ?? [];
            if($tags){
                foreach ($tags['posts'] as $tmp) {
                    $ids[] = $tmp['id'];
                }
            }
        }

        if (isset($config['load_limit']) && $config['load_limit'] > 0) {
            // $query->setMaxResults($config['load_limit']);
            array_splice($ids, $config['load_limit']);
        }
        $query = $this->em->createQueryBuilder()
            ->from(PostSites::class, 'p')
            ->select('p, c, ca,t, s')
            ->andWhere('p.siteType=:type')
            ->setParameter('type', 'post')
            ->leftJoin('p.postCategory', 'c')
            ->leftJoin('p.tags', 't')
            ->leftJoin('p.categories', 'ca')
            ->leftJoin('p.siteSeo', 's')
            ->andWhere('p.id IN (:posts)')
            ->setParameter('posts',$ids)
            ;


        if ($config['order_by'] == 'date') {
            $query->orderBy('p.postDate', $config['order']);
        }
        if ($config['order_by'] == 'position') {
            $query->orderBy('p.position', $config['order']);
        }
        if ($config['order_by'] == 'name') {
            $query->orderBy('s.seoTitle', $config['order']);
        }
        if ($config['order_by'] == 'category_position') {
            $query->orderBy('c.position', $config['order']);
            $query->addOrderBy('p.postDate', 'DESC');
        }
        if ($config['order_by'] == 'category_name') {
            $query->orderBy('c.title', $config['order']);
            $query->addOrderBy('p.postDate', 'DESC');
        }

        return $query->getQuery()->getArrayResult();

    }

    public function getPostGallery($id, $form): array
    {
        $post = $this->em->getRepository(PostSites::class)->find($id);
        $config = $form['config'];
        $gallery = [];
        $galleryId = '';
        $thumbnail = false;
        if ($config['output_type'] == 'gallery') {
            $galleryId = $config['gallery_id'];
        }
        if ($config['output_type'] == 'slider') {
            $galleryId = $config['slider'];
        }
        $form['images'] = $post->getPostGallery();
        $gallery = $this->em->getRepository(MediaSlider::class)->find($galleryId);
        if ($gallery) {
            $gallery = $gallery->getSlider();
        }
        $type = $config['output_type'];
        if ($config['output_type'] == 'slider' && $gallery) {
            if ($gallery['thumbnail']) {
                $type = 'thumbnail';
            }
        }

        return [
            'form' => $form,
            'gallery' => $gallery,
            'type' => $type,
        ];
    }

    public function getPostCategory($id)
    {
        return $this->em->getRepository(PostCategory::class)->find($id);
    }

    public function getFeatureImage($fileName, $form): array
    {
        $media = $this->em->getRepository(Media::class)->findOneBy(['fileName' => $fileName, 'showFilemanager' => true]);
        if ($media) {
            $file = $this->emHelper->get_post_gallery($media);
            $form['images'] = [$file['record']];
        }
        return $form;
    }

    public function getCategoryImage($form, $type, $file = null): array
    {
        $catRepo = $this->em->getRepository(PostCategory::class);
        $fileName = '';
        $form['images'] = [];
        if ($type == 'page') {
            if (!isset($form['config']['category']) && !$form['config']['category']) {
                return $form;
            }
            $category = $catRepo->find($form['config']['category']);
            if (!$category) {
                return $form;
            }
            $form['config']['category'] = $category;
            $fileName = $category->getCatImg();
        } else {
            $fileName = $file;
        }
        if ($fileName) {
            return $this->getFeatureImage($fileName, $form);
        }
        return $form;
    }

    public function getPostById($id): string
    {
        $page = $this->em->getRepository(PostSites::class)->find($id);
        if ($page->getPostSlug()) {
            return $this->urlGenerator->generate('app_public_slug', ['slug' => $page->getPostSlug()]);
        }
        return '';
    }

    public function getBuilderCarousel($id): array
    {
        $carousel = $this->em->getRepository(MediaSlider::class)->find($id);
        if (!$carousel->getSlider()) {
            return [];
        }
        $c = $carousel->getSlider();
        $newData = [];
        foreach ($c['slider'] as $slider) {
            if (!$slider['active'] || !$slider['image']) {
                continue;
            }
            $newData[] = $slider;
        }
        $c['slider'] = $newData;
        return $c;
    }

    public function getBuilderSlider($id): array
    {
        $slider = $this->em->getRepository(MediaSlider::class)->find($id);
        if ($slider) {
            return $slider->getSlider();
        }
        return [];
    }

    public function getAccountData(): Account|null
    {
        /** @var User $user */
        $user = $this->tokenStorage->getToken()->getUser();
        return $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $user]);
    }

    public function getGravatar(): string
    {
        $gravatar = new GravatarApi();
        $account = $this->getAccountData();
        $email = strtolower(trim($account->getAccountHolder()->getEmail()));
        if ($gravatar->exists($email)) {
            return $gravatar->getUrlForHash(md5($email)) . 'd=' . $account->getGravatar();
        }
        return '';
    }

    public function getSentEmailsCount($type = 'all'): int
    {
        if ($type == 'all') {
            return $this->em->getRepository(EmailsSent::class)->count([]);
        } else {
            return $this->em->getRepository(EmailsSent::class)->count(['ifShow' => 0]);
        }
    }

    public function getRegisterSettings(): array
    {
        $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
        return $settings->getRegister();
    }

    public function getSentEmails($limit = '9'): array
    {
        return $this->em->getRepository(EmailsSent::class)->getSentMailsByLimit((int)$limit);
    }

    public function getValidateUser($limit = '5')
    {
        return $this->em->getRepository(Account::class)->get_validate_user($limit);
    }

    public function getValidateUserCount(): int
    {
        return $this->em->getRepository(Account::class)->get_validate_user('', true);
    }

    public function getActivityCount($channel)
    {
        return $this->em->getRepository(Log::class)->get_activity_log(null, $channel, true);
    }

    public function getActivityLog($channel)
    {
        $limit = '5';
        return $this->em->getRepository(Log::class)->get_activity_log($limit, $channel);
    }

    public function getAppSettings(): array
    {
        $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
        if($settings){
            return $settings->getApp();
        } else {
            return ['site_name' => ''];
        }
    }

    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function getUploadedAssetPath(string $path, string $image): string
    {

        return $this->container
                ->get(UploaderHelper::class)
                ->getPublicPath($path) . '/' . $image;
    }

    public static function getSubscribedServices(): array
    {
        // TODO: Implement getSubscribedServices() method.
        return [
            UploaderHelper::class,
        ];
    }
}
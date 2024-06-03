<?php

namespace App\Ajax;

use App\AppHelper\Helper;
use App\Entity\Account;
use App\Entity\AppMenu;
use App\Entity\AppSites;
use App\Entity\MenuCategory;
use App\Entity\PostCategory;
use App\Entity\PostSites;
use App\Entity\SiteCategory;
use App\Entity\SystemSettings;
use App\Settings\Settings;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Query\Parameter;
use Exception;
use stdClass;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Exception\RouteNotFoundException;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Contracts\Translation\TranslatorInterface;
use Gedmo\Sluggable\Util\Urlizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class MenuAjaxCall
{
    protected object $responseJson;
    protected Request $data;
    private Account $account;
    use Settings;

    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly TranslatorInterface    $translator,
        private readonly Security               $security,
        private readonly TokenStorageInterface  $tokenStorage,
        private readonly UrlGeneratorInterface  $urlGenerator,
        private readonly string                 $category_name,
        private readonly string                 $post_category_name

    )
    {
    }


    /**
     * @throws Exception
     */
    public function ajaxMenuHandle(Request $request)
    {
        $this->data = $request;
        $this->responseJson = (object)['status' => false, 'msg' => date('H:i:s'), 'type' => $request->get('method')];
        if (!method_exists($this, $request->get('method'))) {
            throw new Exception("Method not found!#Not Found");
        }
        $this->account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->tokenStorage->getToken()->getUser()]);
        if (!$this->security->isGranted('MANAGE_MENU', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        return call_user_func_array(self::class . '::' . $request->get('method'), []);
    }

    private function get_modal_menu(): object
    {
        if (!$this->security->isGranted('ADD_MENU', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }

        $record = [
            'id' => '',
            'title' => '',
            'slug' => '',
            'type' => ''
        ];
        $select = $this->select_menu_type();

        $isMain = $this->em->getRepository(MenuCategory::class)->findBy(['type' => 'main']);
        if ($isMain) {
            $sel = [];
            foreach ($select as $tmp) {
                if ($tmp['id'] == 'main') {
                    continue;
                }
                $sel[] = $tmp;
            }
            $select = $sel;
        }

        $this->responseJson->status = true;
        $this->responseJson->record = $record;
        $this->responseJson->select = $select;
        return $this->responseJson;
    }

    private function make_slug(): object
    {
        $title = filter_var($this->data->get('title'), FILTER_UNSAFE_RAW);
        $this->responseJson->slug = Urlizer::urlize($title, '-');
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function add_menu(): object
    {
        $menu = filter_var($this->data->get('menu'), FILTER_UNSAFE_RAW);
        if (!$menu) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $menu = json_decode($menu, true);
        $repo = $this->em->getRepository(MenuCategory::class);
        if ($repo->findBy(['slug' => $menu['slug']])) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }
        if ($menu['type'] == 'main') {
            if ($repo->findBy(['type' => 'main'])) {
                $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
                return $this->responseJson;
            }
        }

        $add = new MenuCategory();
        $add->setMenuSettings($this->default_main_menu_settings());
        $add->setType($menu['type']);
        $add->setTitle($menu['title']);
        $add->setSlug(Urlizer::urlize($menu['slug'], '-'));
        $add->setDescription($menu['description']);
        $this->em->persist($add);
        $this->em->flush();

        $addMenu = new AppMenu();
        $addMenu->setTitle($add->getTitle());
        $addMenu->setType('menu');
        $addMenu->setUrl('#');
        $addMenu->setMenuCategory($add);
        $this->em->persist($addMenu);
        $this->em->flush();
        $this->responseJson->status = true;
        $this->responseJson->msg = $this->translator->trans('system.Menu created');
        $this->responseJson->title = $this->translator->trans('system.Menu was successfully created.');
        return $this->responseJson;
    }

    private function set_menu_position(): object
    {
        if (!$this->security->isGranted('MANAGE_MENU', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $ids = filter_var($this->data->get('ids'), FILTER_UNSAFE_RAW);
        if ($ids) {
            $ids = json_decode($ids, true);
            $i = 1;
            foreach ($ids as $tmp) {
                $menu = $this->em->getRepository(MenuCategory::class)->find($tmp['id']);
                if ($menu) {
                    $menu->setPosition($i);
                    $this->em->persist($menu);
                    $i++;
                }
            }
            $this->em->flush();
            $this->responseJson->status = true;
        }
        return $this->responseJson;
    }

    private function update_menu(): object
    {
        if (!$this->security->isGranted('MANAGE_MENU', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $menu = filter_var($this->data->get('menu'), FILTER_UNSAFE_RAW);
        $settings = filter_var($this->data->get('settings'), FILTER_UNSAFE_RAW);
        if (!$menu || !$settings) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $menu = json_decode($menu, true);
        $getMenu = $this->em->getRepository(MenuCategory::class)->find($menu['id']);
        if (!$getMenu) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $slug = Urlizer::urlize($menu['slug'], '-');
        if ($getMenu->getSlug() != $slug) {
            $checkSlug = $this->em->getRepository(MenuCategory::class)->findBy(['slug' => $slug]);
            if ($checkSlug) {
                $this->responseJson->msg = $this->translator->trans('Slug is already available') . ' (Ajx-FB ' . __LINE__ . ')';
                return $this->responseJson;
            }
        }

        $settings = json_decode($settings, true);
        $getMenu->setTitle($menu['title']);
        $getMenu->setMenuSettings($settings);
        $getMenu->setActive($menu['active']);
        $getMenu->setSlug($slug);
        $getMenu->setDescription($menu['description']);
        $this->em->persist($getMenu);
        $this->em->flush();

        $this->responseJson->msg = $this->translator->trans('Changes saved');
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    /**
     * @throws ExceptionInterface
     */
    private function get_edit_group(): object
    {
        if (!$this->security->isGranted('MANAGE_MENU', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }

        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $menu = $this->em->getRepository(AppMenu::class)->find($id);
        if (!$menu) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $serializer = new Serializer([new ObjectNormalizer()]);
        $data = $serializer->normalize($menu, null, [AbstractNormalizer::ATTRIBUTES => ['description', 'title', 'url', 'type', 'cssClass', 'id', 'attr', 'newTab', 'xfn', 'active']]);

        $this->responseJson->record = $data;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function update_group(): object
    {
        if (!$this->security->isGranted('MANAGE_MENU', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $group = filter_var($this->data->get('group'), FILTER_UNSAFE_RAW);
        if (!$group) {
            return $this->responseJson;
        }
        $group = json_decode($group, true);
        $appMenu = $this->em->getRepository(AppMenu::class)->find($group['id']);
        if (!$appMenu) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $appMenu->setTitle($group['title']);
        $appMenu->setNewTab($group['newTab']);
        $appMenu->setAttr($group['attr']);
        $appMenu->setCssClass($group['cssClass']);
        $appMenu->setXfn($group['xfn']);
        $appMenu->setShowNotLogin($group['showNotLogin']);
        $appMenu->setDescription($group['description']);
        $appMenu->setActive($group['active']);
        $appMenu->setShowLogin($group['showLogin']);
        $this->em->persist($appMenu);
        $this->em->flush();

        $this->responseJson->id = $group['id'];
        $this->responseJson->title = $group['title'];
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function delete_menu(): object
    {
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $delete = $this->em->getRepository(MenuCategory::class)->find($id);
        if (!$delete) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $menu = $this->em->getRepository(AppMenu::class)->findBy(['menuCategory' => $delete]);
        if ($menu) {
            foreach ($menu as $tmp) {
                $this->em->remove($tmp);
                $this->em->flush();
            }
        }
        $this->em->remove($delete);
        $this->em->flush();
        $this->responseJson->status = true;
        $this->responseJson->msg = $this->translator->trans('swal.The menu has been successfully deleted.');
        $this->responseJson->title = $this->translator->trans('swal.Menu deleted');
        return $this->responseJson;
    }

    /**
     * @throws ExceptionInterface
     */
    private function get_menu_details($menuCategory = null): object
    {
        if ($menuCategory) {
            $id = $menuCategory;
        } else {
            $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        }

        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $menuCat = $this->em->getRepository(MenuCategory::class)->find($id);
        if (!$menuCat) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $helper = Helper::instance();

        $pages = $this->em->getRepository(AppSites::class)->findBy(['siteType' => 'page'], ['position' => 'asc']);
        $cats = $this->em->getRepository(SiteCategory::class)->findAll();

        $posts = $this->em->getRepository(PostSites::class)->findBy(['siteType' => 'post'], ['postDate' => 'desc']);
        $postCat = $this->em->getRepository(PostCategory::class)->findBy([], ['position' => 'asc']);

        $repo = $this->em->getRepository(AppMenu::class);
        $catNode = $this->em->getRepository(AppMenu::class)->findOneBy(['menuCategory' => $menuCat, 'lvl' => 0]);
        $arrayGroups = $repo->childrenHierarchy($catNode, false);
        $arrayGroups = $helper->order_by_args($arrayGroups, 'position', 2);


        $postSelects = [];
        foreach ($posts as $tmp) {
            $item = [
                'id' => uniqid(),
                'ids' => $tmp->getId(),
                'type' => 'post',
                'label' => $tmp->getSiteSeo()->getSeoTitle()
            ];
            $postSelects[] = $item;
        }

        $postCats = [];
        foreach ($postCat as $tmp) {
            $item = [
                'id' => uniqid(),
                'type' => 'post-category',
                'ids' => $tmp->getId(),
                'label' => $tmp->getTitle()
            ];
            $postCats[] = $item;
        }

        $pageSelect = [];
        foreach ($pages as $tmp) {
            if ($tmp->getSiteType() != 'page') {
                continue;
            }
            $item = [
                'id' => uniqid(),
                'type' => 'site',
                'ids' => $tmp->getId(),
                'label' => $tmp->getSiteSeo()->getSeoTitle(),
            ];
            $pageSelect[] = $item;
        }
        $catArr = [];
        foreach ($cats as $tmp) {
            $item = [
                'id' => uniqid(),
                'type' => 'category',
                'ids' => $tmp->getId(),
                'label' => $tmp->getTitle()
            ];
            $catArr[] = $item;
        }
        $selectTypes = $this->select_menu_type();
        $selects = [
            'pages' => $pageSelect,
            'categories' => $catArr,
            'posts' => $postSelects,
            'post-categories' => $postCats,
            'menu_types' => $selectTypes,
            'align_select' => $this->select_align_item(),
            'select_breakpoint' => $this->select_menu_breakpoint()
        ];

        $serializer = new Serializer([new ObjectNormalizer()]);
        $data = $serializer->normalize($menuCat, null, [AbstractNormalizer::ATTRIBUTES => ['slug', 'title', 'type', 'active', 'description', 'id', 'menuSettings']]);
        $settings = $data['menuSettings'];

        unset($data['menuSettings']);
        $recursive = $this->array_values_recursive($arrayGroups);
        if ($menuCategory) {
            return (object)$recursive;
        }
        $this->responseJson->status = true;
        $this->responseJson->selects = $selects;
        $this->responseJson->record = $recursive;
        $this->responseJson->menu = $data;
        $this->responseJson->settings = $settings;
        return $this->responseJson;
    }

    private function array_values_recursive($array): array
    {
        $arr = [];
        $helper = Helper::instance();

        foreach ($array as $tmp) {
            if ($tmp['__children']) {
                if (count($tmp['__children'])) {
                    $tmp['__children'] = $helper->order_by_args($tmp['__children'], 'position', 2);
                }
                $child = $this->array_children($tmp['__children']);
                $tmp['__children'] = $child;
            }

            $arr[] = $tmp;
        }

        /*   foreach ($array as $value) {
               if (is_array($value)) {
                   if (is_array($value['__children'])) {
                       $value['__children'] = $helper->order_by_args($value['__children'], 'position', 2);
                   }
                   $arr[] = $value;
               }
           }*/
        return $arr;
    }

    private function array_children($array): array
    {
        $helper = Helper::instance();
        $child = [];

        foreach ($array as $tmp) {

            if ($tmp['__children'] && count($tmp['__children'])) {
                $tmp['__children'] = $helper->order_by_args($tmp['__children'], 'position', 2);
                $this->array_children($tmp['__children']);
            }

            $child[] = $tmp;
        }
        return $child;

    }

    /**
     * @throws ExceptionInterface
     */
    private function add_app_menu(): object
    {
        $menu_id = filter_var($this->data->get('menu_id'), FILTER_VALIDATE_INT);
        $menu_data = filter_var($this->data->get('menu_data'), FILTER_UNSAFE_RAW);
        $type = filter_var($this->data->get('type'), FILTER_UNSAFE_RAW);

        if (!$menu_id || !$menu_data || !$type) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $menu_data = json_decode($menu_data, true);

        $menuCategory = $this->em->getRepository(MenuCategory::class)->find($menu_id);

        if (!$menuCategory) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $parent = $this->em->getRepository(AppMenu::class)->findOneBy(['menuCategory' => $menuCategory]);
        $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
        $appSettings = $settings->getApp();
        // dd($settings->getApp());
        foreach ($menu_data as $tmp) {
            $menu = new AppMenu();
            $menu->setParent($parent);
            $menu->setMenuCategory($menuCategory);
            $menu->setType($type);
            if ($type == 'site') {
                $sites = $this->em->getRepository(AppSites::class)->find($tmp['ids']);
                if (!$sites) {
                    continue;
                }
                $url = '#';
                if ($sites->getRouteName()) {
                    $url = $this->urlGenerator->generate($sites->getRouteName());
                }
                if ($sites->getSiteSlug()) {
                    $url = $this->urlGenerator->generate('app_public_slug', ['slug' => $sites->getSiteSlug()]);
                }
                $title = $sites->getSiteSeo()->getSeoTitle();
                $menu->setSite($sites->getId());
                $menu->setTitle($title);
                $menu->setOriginalTitle($title);
                $menu->setUrl($url);
            }
            if ($type == 'category') {
                $cat = $this->em->getRepository(SiteCategory::class)->find($tmp['ids']);
                if (!$cat) {
                    continue;
                }

                $menu->setTitle($cat->getTitle());
                $menu->setOriginalTitle($cat->getTitle());
                $menu->setCategory($cat->getId());
                //  $url = $this->urlGenerator->generate('public_category_page', ['siteSlug' => Urlizer::urlize($this->category_name, '-'), 'category' => Urlizer::urlize($this->category_slug, '-'), 'slug' => $cat->getSlug()]);
                $url = $this->urlGenerator->generate('public_post', ['postCategory' => $this->category_name, 'slug' => $cat->getSlug()]);
                $menu->setUrl($url);
            }
            if ($type == 'post') {
                $sites = $this->em->getRepository(PostSites::class)->find($tmp['ids']);
                if (!$sites) {
                    continue;
                }
                $url = '#';
                if ($sites->getPostSlug()) {
                    $url = $this->urlGenerator->generate('public_post', ['postCategory' => $sites->getPostCategory()->getSlug(), 'slug' => $sites->getPostSlug()]);
                    $menu->setSite($sites->getId());
                    $menu->setTitle($sites->getSiteSeo()->getSeoTitle());
                    $menu->setOriginalTitle($sites->getSiteSeo()->getSeoTitle());
                    $menu->setUrl($url);
                }
            }
            if ($type == 'post-category') {
                $cat = $this->em->getRepository(PostCategory::class)->find($tmp['ids']);
                if (!$cat) {
                    continue;
                }
                $url = $this->urlGenerator->generate('public_post', ['postCategory' => $this->post_category_name, 'slug' => $cat->getSlug()]);
                $menu->setTitle($cat->getTitle());
                $menu->setOriginalTitle($cat->getTitle());
                $menu->setCategory($cat->getId());
                $menu->setUrl($url);
            }
            $this->em->persist($menu);
            $this->em->flush();

        }

        $this->responseJson->record = (array)$this->get_menu_details($menu_id);
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    /**
     * @throws ExceptionInterface
     */
    private function delete_app_menu(): object
    {
        if (!$this->security->isGranted('MANAGE_MENU', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $cat = filter_var($this->data->get('cat'), FILTER_VALIDATE_INT);
        if (!$id || !$cat) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $repo = $this->em->getRepository(AppMenu::class);
        $menu = $repo->find($id);
        if (!$menu) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $child = $repo->children($menu);
        $parentLvl = $menu->getParent()->getLvl();
        $parent = null;
        if ($parentLvl != 0) {
            $parent = $repo->find($menu->getParent()->getId());

        }
        if ($parent) {
            foreach ($child as $tmp) {
                $tmp->setParent($parent);
                $this->em->persist($tmp);
                $this->em->flush();
            }
        }

        $this->em->remove($menu);
        $this->em->flush();
        $this->responseJson->title = $this->translator->trans('menu.Menu entry deleted');
        $this->responseJson->msg = $this->translator->trans('menu.The menu entry has been successfully deleted.');
        $this->responseJson->status = true;
        $this->responseJson->record = (array)$this->get_menu_details($cat);
        return $this->responseJson;
    }

    /**
     * @throws ExceptionInterface
     */
    private function sortable_menu(): object
    {
        $elements = filter_var($this->data->get('elements'), FILTER_UNSAFE_RAW);
        $category = filter_var($this->data->get('category'), FILTER_VALIDATE_INT);
        $return = filter_var($this->data->get('return'), FILTER_VALIDATE_BOOLEAN);
        if (!$category) {
            return $this->responseJson;
        }
        $first = $this->em->getRepository(AppMenu::class)->findOneBy(['menuCategory' => $category, 'lvl' => 0]);
        if (!$first) {
            return $this->responseJson;
        }
        if ($elements) {
            $elements = json_decode($elements, true);
            $i = 1;

            foreach ($elements as $tmp) {
                $menu = $this->em->getRepository(AppMenu::class)->find($tmp['id']);
                if ($tmp['parent']) {
                    $parent = $this->em->getRepository(AppMenu::class)->find($tmp['parent']);
                } else {
                    {
                        $parent = $first;
                    }
                }

                $menu->setPosition($i);
                $menu->setParent($parent);
                $this->em->persist($menu);
                $this->em->flush();
                $i++;
            }
        }
        if ($return) {
            $this->responseJson->record = (array)$this->get_menu_details($category);
        }

        $this->responseJson->status = true;
        return $this->responseJson;
    }

    /**
     * @throws ExceptionInterface
     */
    private function add_individuell_menu(): object
    {
        if (!$this->security->isGranted('MANAGE_MENU', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $menu_id = filter_var($this->data->get('menu_id'), FILTER_VALIDATE_INT);
        $menu_data = filter_var($this->data->get('menu_data'), FILTER_UNSAFE_RAW);
        if (!$menu_id || !$menu_data) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $menuCategory = $this->em->getRepository(MenuCategory::class)->find($menu_id);

        if (!$menuCategory) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $parent = $this->em->getRepository(AppMenu::class)->findOneBy(['menuCategory' => $menu_id, 'lvl' => 0]);
        if (!$parent) {
            return $this->responseJson;
        }
        $helper = Helper::instance();
        $data = json_decode($menu_data, true);
        $dataTitle = $data['title'] ?? null;
        if (!$dataTitle) {
            $this->responseJson->msg = $this->translator->trans('plugins.No designation found');
            return $this->responseJson;
        }
        $url = '#';
        $dataUrl = $data['url'] ?? null;
        $dataRoute = $data['route'] ?? null;
        $dataSlug = $data['slug'] ?? null;
        if ($dataUrl) {
            $url = $dataUrl;
        }
        if ($dataRoute) {
            try {
                $url = $this->urlGenerator->generate($dataRoute);
            } catch (RouteNotFoundException $e) {
                $this->responseJson->msg = $e->getMessage();
                return $this->responseJson;
            }
        }
        if ($dataSlug) {
            $dataSlug = str_replace('/', '', $dataSlug);
            $url = $this->urlGenerator->generate('app_public_slug', ['slug' => $dataSlug]);
        }
        $menu = new AppMenu();
        $menu->setParent($parent);
        $menu->setMenuCategory($menuCategory);
        $menu->setTitle($helper->pregWhitespace($dataTitle));
        $menu->setOriginalTitle($this->translator->trans('menu.individual'));
        $menu->setType('individual');
        $menu->setUrl($url);
        $this->em->persist($menu);
        $this->em->flush();
        $this->responseJson->record = (array)$this->get_menu_details($menu_id);
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    /**
     * @throws ExceptionInterface
     */
    private function update_permalinks(): object
    {
        if (!$this->security->isGranted('MANAGE_MENU', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $category = $this->em->getRepository(MenuCategory::class)->find($id);
        $menu = $this->em->getRepository(AppMenu::class)->findBy(['menuCategory' => $category, 'type' => 'category']);
        if ($menu) {
            foreach ($menu as $tmp) {
                $siteCat = $this->em->getRepository(SiteCategory::class)->find($tmp->getCategory());
                if (!$siteCat) {
                    continue;
                }
                $url = $this->urlGenerator->generate('public_post', ['postCategory' => Urlizer::urlize($this->category_name, '-'), 'slug' => $siteCat->getSlug()]);
                $tmp->setUrl($url);
                $this->em->persist($tmp);
                $this->em->flush();
                $postCat = $this->em->getRepository(PostCategory::class)->find($tmp->getCategory());
                if (!$postCat) {
                    continue;
                }
                $url = $this->urlGenerator->generate('public_post', ['postCategory' => Urlizer::urlize($this->post_category_name, '-'), 'slug' => $postCat->getSlug()]);
                $tmp->setUrl($url);
                $this->em->persist($tmp);
                $this->em->flush();
            }
        }
        $this->responseJson->record = (array)$this->get_menu_details($id);
        $this->responseJson->msg = $this->translator->trans('menu.Permalinks updated');
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function menu_table(): object
    {
        $columns = array(
            'm.position',
            'm.title',
            'm.description',
            'm.slug',
            'm.type',
            '',
            ''
        );

        $request = $this->data->request->all();
        $search = (string)$request['search']['value'];

        $query = $this->em->createQueryBuilder();
        $query
            ->from(MenuCategory::class, 'm')
            ->select('m');
        if (isset($request['search']['value'])) {
            $query->andWhere(
                'm.type LIKE :searchTerm OR
                 m.title LIKE :searchTerm OR
                 m.slug LIKE :searchTerm OR
                 m.description LIKE :searchTerm');
            $query->setParameters(new ArrayCollection([
                new Parameter('searchTerm', '%' . $search . '%'),
            ]));
        }
        if (isset($request['order'])) {
            $query->orderBy($columns[$request['order']['0']['column']], $request['order']['0']['dir']);
        } else {
            $query->orderBy('m.position', 'ASC');
        }
        if ($request['length'] != -1) {
            $query->setFirstResult($request['start']);
            $query->setMaxResults($request['length']);
        }

        $table = $query->getQuery()->getArrayResult();

        $data_arr = array();
        if (!$table) {
            $this->responseJson->draw = $request['draw'];
            $this->responseJson->recordsTotal = 0;
            $this->responseJson->recordsFiltered = 0;
            $this->responseJson->data = $data_arr;
            return $this->responseJson;
        }

        foreach ($table as $tmp) {
            $data_item = array();
            $data_item[] = '<i data-owner="" data-id="' . $tmp['id'] . '" class="arrow-sortable bi bi-arrows-move"></i>';
            $data_item[] = $tmp['title'];
            $data_item[] = $tmp['description'];
            $data_item[] = $tmp['slug'];
            $data_item[] = $tmp['type'];
            $data_item[] = $tmp['id'];
            $data_item[] = $tmp['id'];
            $data_arr[] = $data_item;
        }

        $allCount = $this->em->getRepository(MenuCategory::class)->count([]);
        $this->responseJson->draw = $request['draw'];
        $this->responseJson->recordsTotal = $allCount;
        if ($search) {
            $this->responseJson->recordsFiltered = count($table);
        } else {
            $this->responseJson->recordsFiltered = $allCount;
        }
        $this->responseJson->data = $data_arr;
        return $this->responseJson;

    }
}
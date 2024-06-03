<?php

namespace App\Ajax;

use App\Entity\Account;
use App\Entity\AppMenu;
use App\Entity\AppSites;
use App\Entity\FormBuilder;
use App\Entity\PostCategory;
use App\Entity\PostSites;
use App\Entity\SiteCategory;
use App\Entity\SiteSeo;
use App\Settings\Settings;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Gedmo\Sluggable\Util\Urlizer;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class PostAjaxCall
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
        private readonly string                 $post_category_name
    )
    {
    }

    /**
     * @throws Exception
     */
    public function ajaxPostHandle(Request $request)
    {
        $this->data = $request;
        $this->responseJson = (object)['status' => false, 'msg' => date('H:i:s'), 'type' => $request->get('method')];
        if (!method_exists($this, $request->get('method'))) {
            throw new Exception("Method not found!#Not Found");
        }
        $this->account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->tokenStorage->getToken()->getUser()]);
        if (!$this->security->isGranted('MANAGE_POST', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        return call_user_func_array(self::class . '::' . $request->get('method'), []);
    }

    /**
     * @throws ExceptionInterface
     */
    private function get_site(): object
    {
        if (!$this->security->isGranted('MANAGE_POST', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }

        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $handle = filter_var($this->data->get('handle'), FILTER_UNSAFE_RAW);
        if (!$id || !$handle) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $query = $this->em->createQueryBuilder()
            ->from(PostSites::class, 'p')
            ->select('p, c, s')
            ->leftJoin('p.postCategory', 'c')
            ->leftJoin('p.siteSeo', 's')
            ->andWhere('p.id=:id')
            ->setParameter('id', $id);

        $site = $query->getQuery()->getArrayResult();


        if (!$site) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $designs = $this->em->getRepository(FormBuilder::class)->findBy(['type' => 'post']);
        $designArr = [];
        foreach ($designs as $tmp) {
            $item = [
                'id' => $tmp->getId(),
                'label' => $tmp->getForm()['designation']
            ];
            $designArr[] = $item;
        }

        $headerDb = $this->em->getRepository(AppSites::class)->findBy(['siteType' => 'header']);
        $headerSelects = [];
        foreach ($headerDb as $tmp) {
            $item = [
                'id' => $tmp->getId(),
                'label' => $tmp->getCustom()
            ];
            $headerSelects[] = $item;
        }

        $footerDb = $this->em->getRepository(AppSites::class)->findBy(['siteType' => 'footer']);
        $footerSelects = [];
        foreach ($footerDb as $tmp) {
            $item = [
                'id' => $tmp->getId(),
                'label' => $tmp->getCustom()
            ];
            $footerSelects[] = $item;
        }

        $loop = $this->em->getRepository(FormBuilder::class)->findBy(['type' => 'loop']);
        $loopArr = [];
        foreach ($loop as $tmp) {
            $item = [
                'id' => $tmp->getId(),
                'label' => $tmp->getForm()['designation']
            ];
            $loopArr[] = $item;
        }



        $category = $this->em->getRepository(FormBuilder::class)->findBy(['type' => 'category']);
        $catArr = [];
        foreach ($category as $tmp) {
            $item = [
                'id' => $tmp->getId(),
                'label' => $tmp->getForm()['designation']
            ];
            $catArr[] = $item;
        }
        $record = $site[0];
        $record['siteCategory'] = $record['postCategory']['id'];
        $record['siteDate'] = $record['postDate']->format('d.m.Y H:i:s');
        $seo = $record['siteSeo'];
        $seo['createdAt'] = $seo['createdAt']->format('d.m.Y H:i:s');
        unset($record['siteSeo']);

        // $this->responseJson->builder_select = $builderArr;
        $this->responseJson->select_post_design = $designArr;
        $this->responseJson->select_loop_design = $loopArr;
        $this->responseJson->select_category_design = $catArr;
        $this->responseJson->select_header = $headerSelects;
        $this->responseJson->select_footer = $footerSelects;
        $this->responseJson->site = $record;
        $this->responseJson->seo = $seo;
        $this->responseJson->category_selects = $this->get_cat_selects();
        $this->responseJson->xCardTypesSelect = $this->xCardTypes;
        $this->responseJson->ogTypesSelect = $this->ogTypes;
        $this->responseJson->selectSiteStatus = $this->select_site_status();
        $this->responseJson->status = true;
        $this->responseJson->handle = $handle;
        return $this->responseJson;
    }

    private function update_seo(): object
    {
        if (!$this->security->isGranted('MANAGE_PAGE_SEO', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $data = filter_var($this->data->get('seo'), FILTER_UNSAFE_RAW);
        if (!$data) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = json_decode($data, true);
        $seo = $this->em->getRepository(SiteSeo::class)->find($data['id']);
        if (!$seo) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $seo->setSeoTitle($data['seoTitle']);
        $seo->setSeoContent($data['seoContent']);
        $seo->setNoIndex($data['noIndex']);
        $seo->setNoFollow($data['noFollow']);
        $seo->setFbActive($data['fbActive']);
        $seo->setOgType($data['ogType']);
        $seo->setOgTitle($data['ogTitle']);
        $seo->setOgContent($data['ogContent']);
        $seo->setOgImage($data['ogImage']);
        $seo->setXActive($data['xActive']);
        $seo->setXType($data['xType']);
        $seo->setXCreator($data['xCreator']);
        $seo->setFbAppId($data['fbAppId']);
        $seo->setFbAdmins($data['fbAdmins']);
        $seo->setTitlePrefix($data['titlePrefix']);
        $seo->setTitleSuffix($data['titleSuffix']);
        $seo->setTitleSeparator($data['titleSeparator']);
        $seo->setReadingTime($data['readingTime']);

        $this->em->persist($seo);
        $this->em->flush();
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function add_post(): object
    {
        if (!$this->security->isGranted('ADD_POST', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $title = filter_var($this->data->get('title'), FILTER_UNSAFE_RAW);
        $slug = filter_var($this->data->get('slug'), FILTER_UNSAFE_RAW);
        $category = filter_var($this->data->get('category'), FILTER_VALIDATE_INT);
        if (!$title || !$slug || !$category) {
            $this->responseJson->msg = $this->translator->trans('system.Please check your entry.');
            return $this->responseJson;
        }
        $cat = $this->em->getRepository(PostCategory::class)->find($category);
        if (!$cat) {
            $this->responseJson->msg = $this->translator->trans('system.Please check your entry.');
            return $this->responseJson;
        }

        $slug = Urlizer::urlize($slug, '-');
        $postSlug = $this->em->getRepository(PostSites::class)->findBy(['postSlug' => $slug]);

        if (count($postSlug) != 0) {
            $addCount = '-' . uniqid();
            $slug = $slug . $addCount;
        }

        $siteSeo = new SiteSeo();
        $siteSeo->setSeoTitle($title);
        $siteSeo->setOgTitle($title);
        $siteSeo->setOgType('article');
        $this->em->persist($siteSeo);

        $post = new PostSites();
        $post->setPostSlug($slug);
        $post->setSiteSeo($siteSeo);
        $post->setPostCategory($cat);
        $post->setSiteType('post');
        $post->setPostStatus('publish');
        $this->em->persist($post);
        $this->em->flush();
        $this->responseJson->status = true;
        $this->responseJson->title = $this->translator->trans('system.Page created');
        $this->responseJson->msg = $this->translator->trans('system.Page was successfully created.');
        return $this->responseJson;
    }

    private function delete_post(): object
    {
        $this->responseJson->title = $this->translator->trans('Error');
        if (!$this->security->isGranted('MANAGE_POST', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);

        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SC ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $site = $this->em->getRepository(PostSites::class)->find($id);
        if (!$site) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SC ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $this->em->remove($site);
        $this->em->flush();

        $this->responseJson->title = $this->translator->trans('swal.Post deleted');
        $this->responseJson->msg = $this->translator->trans('swal.The post has been successfully deleted.');
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function urlizer_slug(): object
    {
        $post = filter_var($this->data->get('post'), FILTER_UNSAFE_RAW);
        if ($post) {
            $this->responseJson->slug = Urlizer::urlize($post, '-');
            $this->responseJson->status = true;
        }
        return $this->responseJson;
    }

    private function update_post(): object
    {
        if (!$this->security->isGranted('MANAGE_POST', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $data = filter_var($this->data->get('site'), FILTER_UNSAFE_RAW);
        if (!$data) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = json_decode($data, true);
        $site = $this->em->getRepository(PostSites::class)->find($data['id']);
        if (!$site) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $slug = $data['postSlug'];
        $slug = Urlizer::urlize($slug, '-');
        if ($site->getPostSlug() != $slug) {
            $findSlug = $this->em->getRepository(PostSites::class)->findBy(['postSlug' => $slug]);
            if ($findSlug) {
                $this->responseJson->msg = $this->translator->trans('Slug is already available') . ' (Ajx-SE ' . __LINE__ . ')';
                return $this->responseJson;
            }
        }

        $category = $this->em->getRepository(PostCategory::class)->find((int)$data['siteCategory']);
        if ($category->getSlug() != $site->getPostCategory()->getSlug()) {

            $search = sprintf('^\/%s\/', $site->getPostCategory()->getSlug());
            $query = $this->em->createQueryBuilder()
                ->from(AppMenu::class, 'm')
                ->select('m.url, m.id, m.site')
                ->andWhere("REGEXP(m.url, :regType) = 1")
                ->setParameter('regType', $search);
            $menu = $query->getQuery()->getArrayResult();

            if ($menu) {
                $menuRepo = $this->em->getRepository(AppMenu::class);
                foreach ($menu as $tmp) {
                    if ($tmp['site']) {
                        $appPost = $this->em->getRepository(PostSites::class)->find($tmp['site']);
                        $url = $this->urlGenerator->generate('public_post', ['postCategory' => Urlizer::urlize($category->getSlug(), '-'), 'slug' => $appPost->getPostSlug()]);
                        $updMenu = $menuRepo->find($tmp['id']);
                        $updMenu->setUrl($url);
                        $this->em->persist($updMenu);
                        $this->em->flush();
                    }
                }
            }
        }
        //dd($data);
        $site->setPostCategory($category);
        $site->setPostStatus($data['postStatus']);
        $site->setPostSlug($slug);
        $site->setCommentStatus($data['commentStatus']);
        $site->setExcerptLimit((int)$data['excerptLimit']);
        $site->setExtraCss($data['extraCss']);
        $site->setPostExcerpt($data['postExcerpt'] ?? '');
        $site->setSiteImg($data['siteImg']);
        $site->setBuilder((int)$data['builder']);
        $site->setPostGallery($data['postGallery']);
        $site->setPostContent($data['postContent']);
        $site->getSiteSeo()->setLastUpdate(new DateTimeImmutable());
       // $site->setHeader($data['header']);
       // $site->setFooter($data['footer']);
        $this->em->persist($site);
        $this->em->flush();

        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function set_site_position(): object
    {
        if (!$this->security->isGranted('MANAGE_POST', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $ids = filter_var($this->data->get('ids'), FILTER_UNSAFE_RAW);
        if ($ids) {
            $ids = json_decode($ids, true);
            $i = 1;
            foreach ($ids as $tmp) {
                $site = $this->em->getRepository(PostSites::class)->find($tmp['id']);
                if ($site) {
                    $site->setPosition($i);
                    $this->em->persist($site);
                    $i++;
                }
            }
            $this->em->flush();
            $this->responseJson->status = true;
        }
        return $this->responseJson;
    }

    private function add_post_category(): object
    {
        if (!$this->security->isGranted('MANAGE_POST', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $title = filter_var($this->data->get('title'), FILTER_UNSAFE_RAW);
        $slug = filter_var($this->data->get('slug'), FILTER_UNSAFE_RAW);
        $description = filter_var($this->data->get('description'), FILTER_UNSAFE_RAW);
        if (!$title || !$slug) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $slug = Urlizer::urlize($slug, '-');
        $findSlug = $this->em->getRepository(PostCategory::class)->count(['slug' => $slug]);
        if ($findSlug) {
            $slug = $slug . '-' . uniqid();
        }

        $postCat = new PostCategory();
        $postCat->setTitle($title);
        $postCat->setSlug($slug);
        $postCat->setDescription($description);
        $this->em->persist($postCat);
        $this->em->flush();


        $this->responseJson->status = true;
        $this->responseJson->msg = $this->translator->trans('medien.Category successfully created.');
        return $this->responseJson;
    }

    private function set_category_position(): object
    {
        if (!$this->security->isGranted('MANAGE_POST', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $ids = filter_var($this->data->get('ids'), FILTER_UNSAFE_RAW);
        if ($ids) {
            $ids = json_decode($ids, true);
            $i = 1;
            foreach ($ids as $tmp) {
                $cat = $this->em->getRepository(PostCategory::class)->find($tmp['id']);
                $cat->setPosition($i);
                $this->em->persist($cat);
                $i++;
            }
            $this->em->flush();
            $this->responseJson->status = true;
        }

        return $this->responseJson;
    }

    private function get_post_category(): object
    {
        if (!$this->security->isGranted('MANAGE_POST', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);

        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SC ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $category = $this->em->getRepository(PostCategory::class)->find($id);
        if (!$category) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SC ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $query = $this->em->createQueryBuilder()
            ->from(PostCategory::class, 'c')
            ->select('c')
            ->andWhere('c.id=:id')
            ->setParameter('id', $id);
        $record = $query->getQuery()->getArrayResult();
        if ($record) {
            $record = $record[0];
            $searchSlug = $this->post_category_name . '-' . $record['id'];
            $sites = $this->em->getRepository(PostSites::class)->findOneBy(['postSlug' => $searchSlug, 'siteType' => 'category']);
            if ($sites) {
                $record['seo'] = true;
            } else {
                $record['seo'] = false;
            }
            $record['createdAt'] = $record['createdAt']->format('d.m.Y H:i:s');
            $this->responseJson->record = $record;
            $this->responseJson->status = true;
        }
        return $this->responseJson;
    }

    private function delete_post_category(): object
    {
        if (!$this->security->isGranted('MANAGE_POST', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);

        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SC ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $category = $this->em->getRepository(PostCategory::class)->find($id);
        if (!$category) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SC ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $default = $this->em->getRepository(PostCategory::class)->findOneBy(['type' => 'first']);
        if (!$default) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SC ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $pages = $this->em->getRepository(PostSites::class)->findBy(['postCategory' => $category]);
        if ($pages) {
            foreach ($pages as $tmp) {
                $tmp->setSiteCategory($default);
                $this->em->persist($tmp);
                $this->em->flush();
            }
        }
        $this->em->remove($category);
        $this->em->flush();
        $this->responseJson->title = $this->translator->trans('swal.Category deleted');
        $this->responseJson->msg = $this->translator->trans('swal.Category was successfully deleted.');
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function update_post_category(): object
    {
        if (!$this->security->isGranted('MANAGE_POST', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $cat = filter_var($this->data->get('category'), FILTER_UNSAFE_RAW);
        if (!$cat) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SC ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $cat = json_decode($cat, true);
        $category = $this->em->getRepository(PostCategory::class)->find($cat['id']);
        if (!$category) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SC ' . __LINE__ . ')';
            return $this->responseJson;
        }
        if (!$cat['title']) {
            $this->responseJson->msg = $this->translator->trans('system.Category Title is a required field.') . ' (Ajx-SC ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $slug = Urlizer::urlize($cat['slug'], '-');
        if ($category->getSlug() != $slug) {
            $findSlug = $this->em->getRepository(PostCategory::class)->count(['slug' => $slug]);
            if ($findSlug) {
                $slug = $slug . '-' . uniqid();
            }
        }
        $category->setTitle($cat['title']);
        $category->setSlug($slug);
        $category->setDescription($cat['description']);
        $category->setCatImg($cat['catImg']);
        $this->em->persist($category);
        $this->em->flush();
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function set_header_footer_builder():object
    {
        if (!$this->security->isGranted('MANAGE_POST', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $cat = filter_var($this->data->get('category'), FILTER_UNSAFE_RAW);
        if (!$cat || !$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SC ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $cat = json_decode($cat, true);
        $category = $this->em->getRepository(PostCategory::class)->find($id);
        if(!$category){
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SC ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $category->setCategoryHeader($cat['categoryHeader'] ?: 0);
        $category->setCategoryFooter($cat['categoryFooter'] ?: 0);
        $category->setPostHeader($cat['postHeader'] ?: 0);
        $category->setPostFooter($cat['postFooter'] ?: 0);
        $this->em->persist($category);
        $this->em->flush();
        $this->responseJson->status = true;

        return $this->responseJson;
    }

    private function add_category_seo(): object
    {
        if (!$this->security->isGranted('MANAGE_POST', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);


        $slug = $this->post_category_name . '-' . $id;
        $ifSeo = $this->em->getRepository(PostSites::class)->count(['siteType' => 'category', 'postSlug' => $slug]);
        if ($ifSeo) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $category = $this->em->getRepository(PostCategory::class)->find($id);
        if (!$category) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $siteSeo = new SiteSeo();
        $siteSeo->setSeoTitle($category->getTitle());
        $this->em->persist($siteSeo);
        $appSite = new PostSites();
        $appSite->setSiteType('category');
        $appSite->setPostStatus('publish');
        $appSite->setPostSlug($slug);
        $appSite->setSiteSeo($siteSeo);
        $appSite->setPostCategory($category);

        $this->em->persist($appSite);
        $this->em->flush();
        $this->responseJson->status = true;
        $this->responseJson->msg = $this->translator->trans('menu.Seo page successfully created.');
        return $this->responseJson;
    }

    private function get_category_design(): object
    {
        if (!$this->security->isGranted('MANAGE_POST', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $type = filter_var($this->data->get('type'), FILTER_UNSAFE_RAW);
        if (!$type) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $category = $this->em->getRepository(PostCategory::class)->find($id);
        if (!$category) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        if ($type == 'category') {
            $this->responseJson->builder = $category->getCategoryDesign();
        }
        if ($type == 'post') {
            $this->responseJson->builder = $category->getPostDesign();
        }
        if ($type == 'loop') {
            $this->responseJson->builder = $category->getPostLoop();
        }
        $builder = $this->em->getRepository(FormBuilder::class)->findBy(['type' => $type]);
        $builderArr = [];
        foreach ($builder as $tmp) {
            $form = $tmp->getForm();
            $item = [
                'id' => $tmp->getId(),
                'label' => $form['designation']
            ];

            $builderArr[] = $item;
        }

        $headerDb = $this->em->getRepository(AppSites::class)->findBy(['siteType' => 'header']);
        $headerSelects = [];
        foreach ($headerDb as $tmp) {
            $item = [
                'id' => $tmp->getId(),
                'label' => $tmp->getCustom()
            ];
            $headerSelects[] = $item;
        }

        $footerDb = $this->em->getRepository(AppSites::class)->findBy(['siteType' => 'footer']);
        $footerSelects = [];
        foreach ($footerDb as $tmp) {
            $item = [
                'id' => $tmp->getId(),
                'label' => $tmp->getCustom()
            ];
            $footerSelects[] = $item;
        }

        if ($type == 'category') {
            $arr = [];
            if (!$category->getCategoryDesign()) {
                foreach ($builderArr as $tmp) {
                    $cd = $this->em->getRepository(PostCategory::class)->findBy(['categoryDesign' => $tmp['id']]);
                    if ($cd) {
                        continue;
                    }
                    $arr[] = $tmp;
                }
                $builderArr = $arr;
            }
        }

        $categoryEdit = [
            'categoryHeader' => $category->getCategoryHeader(),
            'categoryFooter' => $category->getCategoryFooter(),
            'postFooter' => $category->getPostFooter(),
            'postHeader' => $category->getPostHeader()
        ];
        $this->responseJson->builder_type = $type;
        $this->responseJson->id = $id;
        $this->responseJson->status = true;
        $this->responseJson->builder_select = $builderArr;
        $this->responseJson->select_header = $headerSelects;
        $this->responseJson->select_footer = $footerSelects;
        $this->responseJson->category = $categoryEdit;
        return $this->responseJson;
    }

    private function update_category_builder(): object
    {
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $cat_id = filter_var($this->data->get('cat_id'), FILTER_VALIDATE_INT);
        $type = filter_var($this->data->get('type'), FILTER_UNSAFE_RAW);
        if (!$type || !$cat_id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $category = $this->em->getRepository(PostCategory::class)->find($cat_id);
        if (!$category) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        if ($type == 'category') {
            $ic = $this->em->getRepository(PostCategory::class)->findBy(['categoryDesign' => $id]);
            if ($ic) {
                $this->responseJson->show_alert = true;
                $this->responseJson->title = $this->translator->trans('Error').'!';
                $this->responseJson->msg = $this->translator->trans('swal.The category template cannot be selected. Category templates cannot be shared.') . ' (Ajx-PR ' . __LINE__ . ')';
                return $this->responseJson;
            }
        }
        if ($type == 'category') {
            $category->setCategoryDesign($id);
        }
        if ($type == 'post') {
            $category->setPostDesign($id);
        }
        if ($type == 'loop') {
            $category->setPostLoop($id);
        }
        $this->em->persist($category);
        $this->em->flush();
        $this->responseJson->id = $id;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function post_category_table(): object
    {
        if (!$this->security->isGranted('MANAGE_POST', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }

        $columns = array(
            'c.position',
            'c.title',
            'c.description',
            '',
            'c.catImg',
            '',
            '',
            '',
            '',
            '',
            ''
        );

        $data_arr = array();
        $request = $this->data->request->all();

        $search = (string)$request['search']['value'];
        $query = $this->em->createQueryBuilder()
            ->from(PostCategory::class, 'c')
            ->select('c');

        if (isset($request['search']['value'])) {
            $query->andWhere(
                'c.title LIKE :searchTerm OR
                 c.description LIKE :searchTerm OR
                 c.type LIKE :searchTerm OR
                 c.createdAt LIKE :searchTerm')
                ->setParameter('searchTerm', '%' . $search . '%');
        }

        if (isset($request['order'])) {
            $query->orderBy($columns[$request['order']['0']['column']], $request['order']['0']['dir']);
        } else {
            $query->orderBy('c.position', 'ASC');
        }
        if ($request['length'] != -1) {
            $query->setFirstResult($request['start']);
            $query->setMaxResults($request['length']);
        }


        $table = $query->getQuery()->getArrayResult();
        if (!$table) {
            $this->responseJson->draw = $request['draw'];
            $this->responseJson->recordsTotal = 0;
            $this->responseJson->recordsFiltered = 0;
            $this->responseJson->data = $data_arr;
            return $this->responseJson;
        }

        foreach ($table as $tmp) {
            $btn = '';
            $countSites = $this->em->getRepository(PostSites::class)->count(['postCategory' => $this->em->getRepository(PostCategory::class)->find($tmp['id'])]);
            if ($tmp['catImg']) {
                $img = '<span class="d-none">' . $this->translator->trans('yes') . '</span><i class="bi bi-check2-circle text-green fs-5"></i>';
            } else {
                $img = '<span class="d-none">' . $this->translator->trans('no') . '</span><i class="bi bi-x-circle text-danger fs-5"></i>';
            }
            if ($tmp['type'] == 'first' || !$this->security->isGranted('DELETE_POST_CATEGORY', $this->account)) {
                $btnDel = '<button disabled title="' . $this->translator->trans('Delete') . '" class="pe-none opacity-50 btn text-nowrap btn-sm btn-outline-secondary"><i class="bi bi-trash"></i></button>';
            } else {
                $btnDel = '<button data-id="' . $tmp['id'] . '" title="' . $this->translator->trans('Delete') . '" class=" btn-trash btn text-nowrap btn-sm btn-danger dark"><i class="bi bi-trash"></i></button>';
            }
            $slug = $this->post_category_name . '-' . $tmp['id'];
            $appSites = $this->em->getRepository(PostSites::class)->findOneBy(['postSlug' => $slug, 'siteType' => 'category']);
            if ($appSites) {
                $countSites = $countSites - 1;
                $seo = '<span class="d-none">' . $this->translator->trans('yes') . '</span><i class="bi bi-globe-americas text-green fs-5"></i>';
            } else {
                $seo = '<span class="d-none">' . $this->translator->trans('no') . '</span><i class="bi bi-globe-americas text-danger fs-5"></i>';
            }

            if ($this->security->isGranted('POST_CATEGORY_DESIGN', $this->account)) {
                $btnCatDesign = '<button data-id="' . $tmp['id'] . '" class="btn-design btn btn-warning-custom text-nowrap dark btn-sm">' . $this->translator->trans('posts.Category Design') . '</button>';
            } else {
                $btnCatDesign = '<button class="pe-none opacity-50 btn btn-outline-secondary text-nowrap dark btn-sm">' . $this->translator->trans('posts.Category Design') . '</button>';
            }
            if ($this->security->isGranted('POST_DESIGN', $this->account)) {
                $btnPostDesign = '<button data-id="' . $tmp['id'] . '" class="btn-post btn btn-switch-blue text-nowrap dark btn-sm">' . $this->translator->trans('posts.Post Design') . '</button>';
            } else {
                $btnPostDesign = '<button class="pe-none opacity-50 btn btn-outline-secondary text-nowrap dark btn-sm">' . $this->translator->trans('posts.Post Design') . '</button>';
            }
            if ($this->security->isGranted('POST_LOOP_DESIGN', $this->account)) {
                $btnLoopDesign = '<button data-id="' . $tmp['id'] . '" class="btn-loop btn btn-success-custom text-nowrap dark btn-sm">' . $this->translator->trans('posts.Post loop') . '</button>';
            } else {
                $btnLoopDesign = '<button class="opacity-50 pe-none btn btn-outline-secondary text-nowrap dark btn-sm">' . $this->translator->trans('posts.Post loop') . '</button>';
            }

            $data_item = array();
            $data_item[] = '<i data-owner="category" data-id="' . $tmp['id'] . '" class="arrow-sortable bi bi-arrows-move"></i>';
            $data_item[] = $tmp['title'];
            $data_item[] = $tmp['description'];
            $data_item[] = $seo;
            $data_item[] = $img;
            $data_item[] = $countSites;
            $data_item[] = $tmp['id'];
            $data_item[] = $btnCatDesign;
            $data_item[] = $btnPostDesign;
            $data_item[] = $btnLoopDesign;
            $data_item[] = $btnDel;
            $data_arr[] = $data_item;
        }
        $countAll = $this->em->getRepository(PostCategory::class)->count([]);
        $this->responseJson->draw = $request['draw'];
        $this->responseJson->recordsTotal = $countAll;
        if ($search) {
            $this->responseJson->recordsFiltered = count($table);
        } else {
            $this->responseJson->recordsFiltered = $countAll;
        }

        $this->responseJson->data = $data_arr;
        return $this->responseJson;
    }

    private function post_table(): object
    {
        if (!$this->security->isGranted('MANAGE_PAGE_SITES', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }

        $request = $this->data->request->all();
        $search = (string)$request['search']['value'];

        $columns = array(
            'p.position',
            's.seoTitle',
            'p.siteType',
            'p.postStatus',
            'c.title',
            's.noIndex',
            's.noFollow',
            's.fbActive',
            's.xActive',
            '',
            '',
            '',
        );

        $reg = [];
        foreach ($_POST['columns'] as $key => $val) {
            if ($val['search']['regex'] == 'true') {
                if ($val['search']['value']) {
                    if ($columns[$key] == 'c.title') {
                        $columns[$key] = 'c.title';
                        $regItem = [
                            'column' => $columns[$key],
                            'search' => $val['search']['value']
                        ];
                        $reg[] = $regItem;
                    }
                }
            }
        }

        $categories = $this->em->getRepository(PostCategory::class)->findBy([], ['position' => 'asc']);
        $catSelect = [];
        foreach ($categories as $tmp) {
            $item = [
                'site_id' => $tmp->getId(),
                'id' => $tmp->getTitle(),
                'label' => $tmp->getTitle()
            ];
            $catSelect[] = $item;
        }
        $firstCat = [
            '0' => [
                'id' => '',
                'label' => $this->translator->trans('All')
            ]
        ];
        $this->responseJson->categories = $catSelect;
        $query = $this->em->createQueryBuilder()
            ->from(PostSites::class, 'p')
            ->select('p, c')
            ->leftJoin('p.postCategory', 'c');


        if ($reg) {
            foreach ($reg as $tmp) {
                if ($tmp['column'] == 'c.title') {
                    $query
                        ->andWhere("REGEXP(" . $tmp['column'] . ", :regCat) = 1")
                        ->setParameter('regCat', $tmp['search']);
                }
            }
        }
        $usersAll = $query->getQuery()->getArrayResult();

        $query = $this->em->createQueryBuilder()
            ->from(PostSites::class, 'p')
            ->select('p, c, s')
            ->leftJoin('p.postCategory', 'c')
            ->leftJoin('p.siteSeo', 's');

        if ($reg) {
            foreach ($reg as $tmp) {
                if ($tmp['column'] == 'c.title') {
                    $query
                        ->andWhere("REGEXP(" . $tmp['column'] . ", :regCat) = 1")
                        ->setParameter('regCat', $tmp['search']);
                }
            }
        }

        if (isset($request['search']['value'])) {
            $query->andWhere(
                's.seoTitle LIKE :searchTerm OR
                 s.seoContent LIKE :searchTerm OR
                 p.postStatus LIKE :searchTerm OR
                 c.description LIKE :searchTerm OR
                 c.title LIKE :searchTerm')
                ->setParameter('searchTerm', '%' . $search . '%');
        }

        if (isset($request['order'])) {
            $query->orderBy($columns[$request['order']['0']['column']], $request['order']['0']['dir']);
        } else {
            $query->orderBy('p.position', 'ASC');

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
            $btn = '';
            $txtColor = '';
            $type = '';
            $owner = '';
            if ($tmp['siteType'] == 'post') {
                $type = $this->translator->trans('posts.Post');
                $txtColor = 'text-body';
                $owner = 'post';
                $btn = '<button data-id="' . $tmp['id'] . '" title="' . $this->translator->trans('media.Details') . '" class="btn-details btn btn-switch-blue text-nowrap dark btn-sm"><i title="' . $this->translator->trans('media.Details') . '" class="bi bi-pencil-square me-2"></i>' . $this->translator->trans('Edit') . '</button>';
            }
            if ($tmp['siteType'] == 'category') {
                $owner = 'category';
                $type = $this->translator->trans('system.Category');
                $txtColor = 'text-orange';
                $btn = '<button title="" class="btn-details btn btn-outline-secondary text-nowrap disabled btn-sm"><i title="" class="bi bi-pencil-square me-2"></i>' . $this->translator->trans('Edit') . '</button>';
            }

            if (!$this->security->isGranted('DELETE_POST_CATEGORY', $this->account)) {
                $btnDel = '<button disabled title="' . $this->translator->trans('Delete') . '" class="pe-none opacity-50 btn text-nowrap btn-sm btn-outline-secondary"><i class="bi bi-trash"></i></button>';
            } else {
                $btnDel = '<button data-id="' . $tmp['id'] . '" title="' . $this->translator->trans('Delete') . '" class=" btn-trash btn text-nowrap btn-sm btn-danger dark"><i class="bi bi-trash"></i></button>';
            }

            $data_item = array();
            $data_item[] = '<i data-owner="' . $owner . '" data-id="' . $tmp['id'] . '" class="arrow-sortable bi bi-arrows-move"></i>';
            $data_item[] = '<span class="' . $txtColor . '">' . $tmp['siteSeo']['seoTitle'] . '</span>';
            $data_item[] = '<span class="' . $txtColor . '">' . $type . '</span>';
            $data_item[] = '<span class="' . $txtColor . '">' . $tmp['postStatus'] . '</span>';
            $data_item[] = '<span class="' . $txtColor . '">' . $tmp['postCategory']['title'] . '</span>';;
            $data_item[] = $this->set_site_icons($tmp['siteSeo']['noIndex'], 'text-orange', 'text-success');
            $data_item[] = $this->set_site_icons($tmp['siteSeo']['noFollow'], 'text-orange', 'text-success');
            $data_item[] = $this->set_site_icons($tmp['siteSeo']['fbActive']);
            $data_item[] = $this->set_site_icons($tmp['siteSeo']['xActive']);
            $data_item[] = $tmp['id'];
            $data_item[] = $btn;
            $data_item[] = $btnDel;
            $data_arr[] = $data_item;
        }


        $this->responseJson->draw = $request['draw'];
        $this->responseJson->recordsTotal = count($usersAll);
        if ($search) {
            $this->responseJson->recordsFiltered = count($table);
        } else {
            $this->responseJson->recordsFiltered = count($usersAll);
        }

        $this->responseJson->data = $data_arr;
        $this->responseJson->status = true;

        return $this->responseJson;
    }

    private function set_site_icons($status, $success = null, $error = null): string
    {
        $success ? $successColor = $success : $successColor = 'text-success';
        $error ? $errorColor = $error : $errorColor = 'text-danger';
        if ($status) {
            $icon = '<span class="d-none">' . $this->translator->trans('yes') . '</span><i class="bi bi-check2-circle ' . $successColor . '"></i>';
        } else {
            $icon = '<span class="d-none">' . $this->translator->trans('no') . '</span><i class="bi bi-x-circle ' . $errorColor . '"></i>';
        }
        return $icon;
    }

    private function get_cat_selects(): array
    {
        $catSelects = $this->em->getRepository(PostCategory::class)->findBy([], ['position' => 'ASC']);
        $s = [];
        foreach ($catSelects as $tmp) {
            $item = [
                'id' => $tmp->getId(),
                'label' => $tmp->getTitle()
            ];
            $s[] = $item;
        }
        return $s;
    }
}
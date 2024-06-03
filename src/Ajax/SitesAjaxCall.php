<?php

namespace App\Ajax;

use App\AppHelper\Helper;
use App\Entity\Account;
use App\Entity\AppSites;
use App\Entity\FormBuilder;
use App\Entity\SiteCategory;
use App\Entity\SiteSeo;
use App\Service\UploaderHelper;
use App\Settings\Settings;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use Gedmo\Sluggable\Util\Urlizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class SitesAjaxCall
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
        private readonly UploaderHelper         $uploaderHelper,
        private readonly UrlGeneratorInterface  $urlGenerator,
        private readonly MessageBusInterface    $bus,
        private readonly string                 $projectDir,
        private readonly string                 $category_name,
    )
    {

    }

    /**
     * @throws Exception
     */
    public function ajaxSiteHandle(Request $request)
    {
        $this->data = $request;
        $this->responseJson = (object)['status' => false, 'msg' => date('H:i:s'), 'type' => $request->get('method')];
        if (!method_exists($this, $request->get('method'))) {
            throw new Exception("Method not found!#Not Found");
        }
        $this->account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->tokenStorage->getToken()->getUser()]);
        if (!$this->security->isGranted('MANAGE_PAGE', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        return call_user_func_array(self::class . '::' . $request->get('method'), []);
    }

    private function add_site_category(): object
    {
        if (!$this->security->isGranted('MANAGE_PAGE_CATEGORY', $this->account)) {
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
        $findSlug = $this->em->getRepository(SiteCategory::class)->count(['slug' => $slug]);
        if ($findSlug) {
            $add = $findSlug + 1;
            $slug = $slug . $add;
        }

        $siteCat = new SiteCategory();
        $siteCat->setTitle($title);
        $siteCat->setSlug($slug);
        $siteCat->setDescription($description);
        $this->em->persist($siteCat);
        $this->em->flush();


        $this->responseJson->status = true;
        $this->responseJson->msg = $this->translator->trans('medien.Category successfully created.');
        return $this->responseJson;
    }

    private function add_category_seo(): object
    {
        if (!$this->security->isGranted('MANAGE_PAGE_CATEGORY', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $slug = 'category-' . $id;
        $ifSeo = $this->em->getRepository(AppSites::class)->count(['siteType' => 'category', 'siteSlug' => $slug]);
        if ($ifSeo) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $category = $this->em->getRepository(SiteCategory::class)->find($id);
        if (!$category) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $siteSeo = new SiteSeo();
        $siteSeo->setSeoTitle($category->getTitle());
        $this->em->persist($siteSeo);
        $appSite = new AppSites();
        $appSite->setSiteType('category');
        $appSite->setSiteStatus('publish');
        $appSite->setSiteSlug($slug);
        $appSite->setSiteSeo($siteSeo);
        $appSite->setSiteCategory($category);

        $this->em->persist($appSite);
        $this->em->flush();
        $this->responseJson->status = true;
        $this->responseJson->msg = $this->translator->trans('menu.Seo page successfully created.');
        return $this->responseJson;
    }

    private function urlizer_slug(): object
    {
        $site = filter_var($this->data->get('site'), FILTER_UNSAFE_RAW);
        if ($site) {
            $this->responseJson->slug = Urlizer::urlize($site, '-');
            $this->responseJson->status = true;
        }
        return $this->responseJson;
    }

    private function set_category_position(): object
    {
        if (!$this->security->isGranted('MANAGE_PAGE_CATEGORY', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $ids = filter_var($this->data->get('ids'), FILTER_UNSAFE_RAW);
        if ($ids) {
            $ids = json_decode($ids, true);
            $i = 1;
            foreach ($ids as $tmp) {
                $cat = $this->em->getRepository(SiteCategory::class)->find($tmp['id']);
                $cat->setPosition($i);
                $this->em->persist($cat);
                $i++;
            }
            $this->em->flush();
            $this->responseJson->status = true;
        }

        return $this->responseJson;
    }

    /**
     * @throws ExceptionInterface
     */
    private function get_site_category(): object
    {
        if (!$this->security->isGranted('MANAGE_PAGE_CATEGORY', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);

        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SC ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $category = $this->em->getRepository(SiteCategory::class)->find($id);
        if (!$category) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SC ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $query = $this->em->createQueryBuilder()
            ->from(SiteCategory::class, 'c')
            ->select('c')
            ->andWhere('c.id=:id')
            ->setParameter('id', $id);
        $record = $query->getQuery()->getArrayResult();
        if ($record) {
            $record = $record[0];
            $searchSlug = 'category-' . $record['id'];
            $sites = $this->em->getRepository(AppSites::class)->findOneBy(['siteSlug' => $searchSlug, 'siteType' => 'category']);
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

    private function delete_site_category(): object
    {
        if (!$this->security->isGranted('MANAGE_PAGE_CATEGORY', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);

        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SC ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $category = $this->em->getRepository(SiteCategory::class)->find($id);
        if (!$category) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SC ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $default = $this->em->getRepository(SiteCategory::class)->findOneBy(['type' => 'first']);
        if (!$default) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SC ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $pages = $this->em->getRepository(AppSites::class)->findBy(['siteCategory' => $category]);
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

    private function delete_site(): object
    {
        $this->responseJson->title = $this->translator->trans('Error');
        if (!$this->security->isGranted('MANAGE_PAGE_SITES', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);

        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SC ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $site = $this->em->getRepository(AppSites::class)->find($id);
        if (!$site) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SC ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $this->em->remove($site);
        $this->em->flush();

        $this->responseJson->title = $this->translator->trans('swal.Page deleted');
        $this->responseJson->msg = $this->translator->trans('swal.The page has been successfully deleted.');
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function update_site_category(): object
    {
        if (!$this->security->isGranted('MANAGE_PAGE_CATEGORY', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $cat = filter_var($this->data->get('category'), FILTER_UNSAFE_RAW);
        if (!$cat) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SC ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $cat = json_decode($cat, true);
        $category = $this->em->getRepository(SiteCategory::class)->find($cat['id']);
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
            $findSlug = $this->em->getRepository(SiteCategory::class)->count(['slug' => $slug]);
            if ($findSlug) {
                $add = $findSlug + 1;
                $slug = $slug . $add;
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

    /**
     * @throws ExceptionInterface
     */
    private function get_site(): object
    {
        if (!$this->security->isGranted('MANAGE_PAGE_SEO', $this->account)) {
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
            ->from(AppSites::class, 'p')
            ->select('p, c, s')
            ->leftJoin('p.siteCategory', 'c')
            ->leftJoin('p.siteSeo', 's')
            ->andWhere('p.id=:id')
            ->setParameter('id', $id);

        $site = $query->getQuery()->getArrayResult();
        if (!$site) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $record = $site[0];
        $record['siteCategory'] = $record['siteCategory']['id'];
        $record['siteDate'] = $record['siteDate']->format('d.m.Y H:i:s');
        $seo = $record['siteSeo'];
        $seo['createdAt'] = $seo['createdAt']->format('d.m.Y H:i:s');
        unset($record['siteSeo']);
        if ($record['sitePassword']) {
            $record['isPw'] = true;
        } else {
            $record['isPw'] = false;
        }
        $record['sitePassword'] = '';
        $builder = $this->em->getRepository(FormBuilder::class)->findBy(['type' => 'page']);
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

        $this->responseJson->builder_select = $builderArr;
        $this->responseJson->site = $record;
        $this->responseJson->seo = $seo;
        $this->responseJson->select_header = $headerSelects;
        $this->responseJson->select_footer = $footerSelects;
        $this->responseJson->category_selects = $this->get_cat_selects();
        $this->responseJson->xCardTypesSelect = $this->xCardTypes;
        $this->responseJson->ogTypesSelect = $this->ogTypes;
        $this->responseJson->selectSiteStatus = $this->select_site_status();
        $this->responseJson->status = true;
        $this->responseJson->handle = $handle;
        return $this->responseJson;
    }

    private function get_site_header_footer():object
    {
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $type = filter_var($this->data->get('type'), FILTER_UNSAFE_RAW);
        if (!$id || !$type) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
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
        $query = $this->em->createQueryBuilder()
            ->from(AppSites::class, 'p')
            ->select('p')
            ->andWhere('p.id=:id')
            ->setParameter('id', $id);
        $site = $query->getQuery()->getArrayResult();
        if (!$site) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $record = $site[0];
        $this->responseJson->site = $record;
        $this->responseJson->builder_select = $builderArr;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function set_site_position(): object
    {
        if (!$this->security->isGranted('MANAGE_PAGE_SITES', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $ids = filter_var($this->data->get('ids'), FILTER_UNSAFE_RAW);
        if ($ids) {
            $ids = json_decode($ids, true);
            $i = 1;
            foreach ($ids as $tmp) {
                $site = $this->em->getRepository(AppSites::class)->find($tmp['id']);
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

    private function add_site(): object
    {
        if (!$this->security->isGranted('MANAGE_PAGE_SITES', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }

        $title = filter_var($this->data->get('title'), FILTER_UNSAFE_RAW);
        $route = filter_var($this->data->get('route'), FILTER_UNSAFE_RAW);
        $slug = filter_var($this->data->get('slug'), FILTER_UNSAFE_RAW);
        $category = filter_var($this->data->get('category'), FILTER_VALIDATE_INT);
        if (!$title || !$slug || !$category) {
            $this->responseJson->msg = $this->translator->trans('system.Please check your entry.');
            return $this->responseJson;
        }
        $cat = $this->em->getRepository(SiteCategory::class)->find($category);
        if (!$cat) {
            $this->responseJson->msg = $this->translator->trans('system.Please check your entry.');
            return $this->responseJson;
        }
        $siteSeo = new SiteSeo();
        $siteSeo->setSeoTitle($title);
        $this->em->persist($siteSeo);


        $appSite = new AppSites();
        $appSite->setSiteType('page');
        $appSite->setSiteStatus('publish');
        $appSite->setSiteSlug($slug);
        $appSite->setRouteName($route);
        $appSite->setSiteSeo($siteSeo);
        $appSite->setSiteCategory($cat);

        $this->em->persist($appSite);
        $this->em->flush();
        $this->responseJson->status = true;
        $this->responseJson->title = $this->translator->trans('system.Page created');
        $this->responseJson->msg = $this->translator->trans('system.Page was successfully created.');
        return $this->responseJson;
    }

    private function update_site(): object
    {
        if (!$this->security->isGranted('MANAGE_PAGE_SITES', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $data = filter_var($this->data->get('site'), FILTER_UNSAFE_RAW);
        if (!$data) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = json_decode($data, true);

        $site = $this->em->getRepository(AppSites::class)->find($data['id']);

        if (!$site) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $slug = $data['siteSlug'];
        $slug = Urlizer::urlize($slug, '-');
        if ($site->getSiteSlug() != $slug) {
            $findSlug = $this->em->getRepository(AppSites::class)->findBy(['siteSlug' => $slug]);
            if ($findSlug) {
                $this->responseJson->msg = $this->translator->trans('Slug is already available') . ' (Ajx-SE ' . __LINE__ . ')';
                return $this->responseJson;
            }
        }

        $routeName = $data['routeName'];
        if ($site->getRouteName() != $routeName) {
            $findRoute = $this->em->getRepository(AppSites::class)->findBy(['routeName' => $routeName]);
            if ($findRoute) {
                $this->responseJson->msg = $this->translator->trans('Route is already available') . ' (Ajx-SE ' . __LINE__ . ')';
                return $this->responseJson;
            }
        }
        $helper = Helper::instance();
        if ($data['sitePassword']) {
            $pwHash = $helper->hashPassword($data['sitePassword']);
        } else {
            $pwHash = '';
        }

        $category = $this->em->getRepository(SiteCategory::class)->find((int)$data['siteCategory']);
        $site->setSiteCategory($category);
        $site->setSiteStatus($data['siteStatus']);
        $site->setSiteSlug($slug);
        if ($routeName) {
            $site->setRouteName($routeName);
        }

        $site->setCommentStatus($data['commentStatus']);
        $site->setExcerptLimit($data['excerptLimit']);
        $site->setExtraCss($data['extraCss']);
        $site->setSiteExcerpt($data['siteExcerpt']);
        $site->setSiteUser($data['siteUser']);
        $site->setSitePassword($pwHash);
        $site->setSiteImg($data['siteImg']);
        $site->setBuilderActive($data['builderActive']);
        $site->setSiteContent($data['siteContent']);
        $site->setFormBuilder($data['formBuilder'] ?: 0);
        $site->setHeader($data['header']);
        $site->setFooter($data['footer']);
        $site->getSiteSeo()->setLastUpdate(new DateTimeImmutable());
        $this->em->persist($site);
        $this->em->flush();
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function update_header_footer_site():object
    {
        $data = filter_var($this->data->get('site'), FILTER_UNSAFE_RAW);
        if (!$data) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = json_decode($data, true);

        $site = $this->em->getRepository(AppSites::class)->find($data['id']);

        if (!$site) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
          //  return $this->responseJson;
            $data['formBuilder'] = 0;
        }
        $site->setFormBuilder($data['formBuilder'] ?: 0);
        $site->setBuilderActive(true);
        $this->em->persist($site);
        $this->em->flush();

        $this->responseJson->status = true;
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
        //dd($data);
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

    private function add_header_footer(): object
    {
        $type = filter_var($this->data->get('type'), FILTER_UNSAFE_RAW);
        if (!$type) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        if ($type == 'header') {
            if (!$this->security->isGranted('MANAGE_HEADER', $this->account)) {
                $this->responseJson->msg = $this->translator->trans('system.no authorisations');
                return $this->responseJson;
            }
        } else {
            if (!$this->security->isGranted('MANAGE_FOOTER', $this->account)) {
                $this->responseJson->msg = $this->translator->trans('system.no authorisations');
                return $this->responseJson;
            }
        }

        $designation = filter_var($this->data->get('designation'), FILTER_UNSAFE_RAW);
        $handle = filter_var($this->data->get('handle'), FILTER_UNSAFE_RAW);
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$handle) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        if ($handle == 'update' && !$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        if (!$designation) {
            $designation = $type . '-' . uniqid();
        }
        if ($handle == 'update') {
            $site = $this->em->getRepository(AppSites::class)->find($id);
            if (!$site) {
                $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
                return $this->responseJson;
            }
        } else {
            $defCat = $this->em->getRepository(SiteCategory::class)->findOneBy(['type' => 'first']);
            if (!$defCat) {
                $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
                return $this->responseJson;
            }
            $site = new AppSites();
            $site->setSiteType($type);
            $site->setSiteCategory($defCat);
            $site->setSiteSlug($type . '-' . uniqid());
            $site->setSiteStatus('publish');
        }
        $site->setCustom($designation);

        $this->em->persist($site);
        $this->em->flush();
        $this->responseJson->status = true;
        $this->responseJson->title = $this->translator->trans('Data saved');
        $this->responseJson->msg = $this->translator->trans('The data has been saved successfully.');
        return $this->responseJson;
    }

    private function get_footer_header(): object
    {
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $site = $this->em->getRepository(AppSites::class)->find($id);
        if (!$site) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $record = [
            'id' => $site->getId(),
            'designation' => $site->getCustom()
        ];
        $this->responseJson->status = true;
        $this->responseJson->record = $record;
        return $this->responseJson;
    }

    private function delete_footer_header():object
    {
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $site = $this->em->getRepository(AppSites::class)->find($id);
        if (!$site) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $this->em->remove($site);
        $this->em->flush();
        $this->responseJson->title = $this->translator->trans('swal.Page deleted');
        $this->responseJson->msg = $this->translator->trans('swal.The page has been successfully deleted.');
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function site_table(): object
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
            'p.siteStatus',
            'p.siteType',
            'p.routeName',
            'p.siteSlug',
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

        foreach ($request['columns'] as $key => $val) {
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

        $categories = $this->em->getRepository(SiteCategory::class)->findBy([], ['position' => 'asc']);
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
            ->from(AppSites::class, 'p')
            ->select('p, c')
            ->andWhere('p.siteType =:pageType')
            ->setParameter('pageType', 'page')
            ->orWhere('p.siteType =:pageCategory')
            ->setParameter('pageCategory', 'category')
            ->leftJoin('p.siteCategory', 'c');


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
            ->from(AppSites::class, 'p')
            ->select('p, c, s')
            ->andWhere('p.siteType =:pageType')
            ->setParameter('pageType', 'page')
            ->orWhere('p.siteType =:pageCategory')
            ->setParameter('pageCategory', 'category')
            ->leftJoin('p.siteCategory', 'c')
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
                 p.siteStatus LIKE :searchTerm OR
                 p.routeName LIKE :searchTerm OR
                 p.siteSlug LIKE :searchTerm OR
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
            $slug = '<span class="' . $txtColor . '">' . $tmp['siteSlug'] . '</span>';
            if ($tmp['siteType'] == 'page') {
                $txtColor = 'text-body';
                $btn = '<button data-id="' . $tmp['id'] . '" title="' . $this->translator->trans('media.Details') . '" class="btn-details btn btn-switch-blue text-nowrap dark btn-sm"><i title="' . $this->translator->trans('media.Details') . '" class="bi bi-pencil-square me-2"></i>' . $this->translator->trans('Edit') . '</button>';
            }
            if ($tmp['siteType'] == 'category') {
                $btn = '<button title="" class="btn-details btn btn-outline-secondary text-nowrap disabled btn-sm"><i title="" class="bi bi-pencil-square me-2"></i>' . $this->translator->trans('Edit') . '</button>';
                $txtColor = 'text-orange';
                $slug = '';
            }
            $data_item = array();
            $data_item[] = '<i data-owner="" data-id="' . $tmp['id'] . '" class="arrow-sortable bi bi-arrows-move"></i>';
            $data_item[] = '<span class="' . $txtColor . '">' . $tmp['siteSeo']['seoTitle'] . '</span>';
            $data_item[] = '<span class="' . $txtColor . '">' . $tmp['siteStatus'] . '</span>';
            $data_item[] = '<span class="' . $txtColor . '">' . $tmp['siteType'] . '</span>';
            $data_item[] = '<span class="' . $txtColor . '">' . $tmp['routeName'] . '</span>';
            $data_item[] = $slug;
            $data_item[] = '<span class="' . $txtColor . '">' . $tmp['siteCategory']['title'] . '</span>';;
            $data_item[] = $this->set_site_icons($tmp['siteSeo']['noIndex'], 'text-orange', 'text-success');
            $data_item[] = $this->set_site_icons($tmp['siteSeo']['noFollow'], 'text-orange', 'text-success');
            $data_item[] = $this->set_site_icons($tmp['siteSeo']['fbActive']);
            $data_item[] = $this->set_site_icons($tmp['siteSeo']['xActive']);
            $data_item[] = $tmp['id'];
            $data_item[] = $btn;
            $data_item[] = $tmp['id'];
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

    private function site_category_table(): object
    {

        if (!$this->security->isGranted('MANAGE_PAGE_CATEGORY', $this->account)) {
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
            ''
        );

        $data_arr = array();
        $request = $this->data->request->all();

        $search = (string)$request['search']['value'];
        $query = $this->em->createQueryBuilder()
            ->from(SiteCategory::class, 'c')
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

            $countSites = $this->em->getRepository(AppSites::class)->count(['siteCategory' => $this->em->getRepository(SiteCategory::class)->find($tmp['id'])]);
            if ($tmp['catImg']) {
                $img = '<span class="d-none">' . $this->translator->trans('yes') . '</span><i class="bi bi-check2-circle text-green fs-5"></i>';
            } else {
                $img = '<span class="d-none">' . $this->translator->trans('no') . '</span><i class="bi bi-x-circle text-danger fs-5"></i>';
            }
            if ($tmp['type'] == 'first') {
                $btnDel = '<button disabled title="' . $this->translator->trans('Delete') . '" class="pe-none btn text-nowrap btn-sm btn-outline-secondary"><i class="bi bi-trash"></i></button>';
            } else {
                $btnDel = '<button data-id="' . $tmp['id'] . '" title="' . $this->translator->trans('Delete') . '" class=" btn-trash btn text-nowrap btn-sm btn-danger dark"><i class="bi bi-trash"></i></button>';
            }
            $slug = 'category-' . $tmp['id'];
            $appSites = $this->em->getRepository(AppSites::class)->findOneBy(['siteSlug' => $slug, 'siteType' => 'category']);
            if ($appSites) {
                $countSites = $countSites - 1;
                $seo = '<span class="d-none">' . $this->translator->trans('yes') . '</span><i class="bi bi-globe-americas text-green fs-5"></i>';
            } else {
                $seo = '<span class="d-none">' . $this->translator->trans('no') . '</span><i class="bi bi-globe-americas text-danger fs-5"></i>';
            }

            $data_item = array();
            $data_item[] = '<i data-owner="" data-id="' . $tmp['id'] . '" class="arrow-sortable bi bi-arrows-move"></i>';
            $data_item[] = $tmp['title'];
            $data_item[] = $tmp['description'];
            $data_item[] = $seo;
            $data_item[] = $img;
            $data_item[] = $countSites;
            $data_item[] = $tmp['id'];
            $data_item[] = $btnDel;
            $data_arr[] = $data_item;
        }
        $countAll = $this->em->getRepository(SiteCategory::class)->count([]);
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

    private function header_footer_table(): object
    {

        $type = filter_var($this->data->get('type'), FILTER_UNSAFE_RAW);
        $request = $this->data->request->all();


        if ($type == 'header' && !$this->security->isGranted('MANAGE_HEADER', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        if ($type == 'footer' && !$this->security->isGranted('MANAGE_FOOTER', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }

        $data_arr = array();
        $search = (string)$request['search']['value'];

        $columns = array(
            'p.custom',
            'p.siteStatus',
            'p.siteType',
            '',
            '',
            '',
        );

        $query = $this->em->createQueryBuilder()
            ->from(AppSites::class, 'p')
            ->select('p')
            ->andWhere('p.siteType =:siteType')
            ->setParameter('siteType', $type);

        if (isset($request['search']['value'])) {
            $query->andWhere(
                'p.custom LIKE :searchTerm OR
                 p.siteType LIKE :searchTerm OR
                 p.siteStatus LIKE :searchTerm')
                ->setParameter('searchTerm', '%' . $search . '%');
        }

        if (isset($request['order'])) {
            $query->orderBy($columns[$request['order']['0']['column']], $request['order']['0']['dir']);
        } else {
            $query->orderBy('p.custom', 'ASC');
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
            $data_item = array();
            $data_item[] = $tmp['custom'];
            $data_item[] = $tmp['siteStatus'];
            $data_item[] = $tmp['siteType'];
            $data_item[] = $tmp['id'];
            $data_item[] = $tmp['id'];
            $data_item[] = $tmp['id'];
            $data_arr[] = $data_item;
        }

        $countAll = $this->em->getRepository(AppSites::class)->count(['siteType' => 'header']);
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
        $catSelects = $this->em->getRepository(SiteCategory::class)->findBy([], ['position' => 'ASC']);
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
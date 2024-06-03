<?php

namespace App\Controller;

use App\Entity\Account;
use App\Entity\AppSites;
use App\Entity\SiteCategory;
use App\Entity\SiteSeo;
use App\Entity\SystemSettings;
use App\Settings\Settings;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Translation\TranslatorInterface;


#[Route('/admin/dashboard', name: 'dashboard')]
class SiteController extends AbstractController
{
    use Settings;
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly TranslatorInterface    $translator,
    )
    {
    }

    #[Route('/websites', name: '_overview_sites')]
    public function index(): Response
    {
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->getUser()]);
        $this->denyAccessUnlessGranted('MANAGE_PAGE_SEO', $account);
        $this->make_privacy_sites();
        return $this->render('site/index.html.twig', [
            'title' => $this->translator->trans('system.Page settings'),
        ]);
    }

    #[Route('/website-categories', name: '_category_overview_sites')]
    public function category(): Response
    {
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->getUser()]);
        $this->denyAccessUnlessGranted('MANAGE_PAGE_CATEGORY', $account);
        $this->make_privacy_sites();
        return $this->render('site/category.html.twig', [
            'title' => $this->translator->trans('Pages Categories'),
        ]);
    }

    #[Route('/menu', name: '_menu_page')]
    public function menu(): Response
    {
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->getUser()]);
        $this->denyAccessUnlessGranted('MANAGE_MENU', $account);

        return $this->render('site/menu.html.twig', [
            'title' => $this->translator->trans('system.Page menu'),
        ]);
    }

    #[Route('/header', name: '_header_sites')]
    public function header(): Response
    {
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->getUser()]);
        $this->denyAccessUnlessGranted('MANAGE_HEADER', $account);

        return $this->render('site/header.html.twig', [
            'title' => $this->translator->trans('system.Manage header'),
        ]);
    }
    #[Route('/footer', name: '_footer_sites')]
    public function footer(): Response
    {
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->getUser()]);
        $this->denyAccessUnlessGranted('MANAGE_FOOTER', $account);

        return $this->render('site/footer.html.twig', [
            'title' => $this->translator->trans('system.Manage footer'),
        ]);
    }

    private function make_privacy_sites(): void
    {
        $allSites = $this->em->getRepository(SiteSeo::class)->findAll();

        $categories = $this->em->getRepository(SiteCategory::class)->findOneBy(['type' => 'first']);
        if(!$categories){
            $categories = new SiteCategory();
            $categories->setType('first');
            $categories->setTitle($this->translator->trans('media.General'));
            $categories->setSlug('general');
            $categories->setDescription($this->translator->trans('media.General category'));
            $this->em->persist($categories);
            $this->em->flush();
        }

        if(!$allSites){
            $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
            foreach ($this->default_sites() as $tmp) {
                $content = $settings->getApp()['site_name'] . ' ' . $tmp['title'];
                $siteSeo = new SiteSeo();
                $siteSeo->setSeoTitle($tmp['title']);
                $siteSeo->setSeoContent($content);
                $siteSeo->setNoFollow($tmp['no_follow']);
                $siteSeo->setNoIndex($tmp['no_index']);
                $this->em->persist($siteSeo);

                $appSite = new AppSites();
                $appSite->setSiteType($tmp['site_type']);
                $appSite->setSiteSlug($tmp['site_slug']);
                $appSite->setRouteName($tmp['route_name']);
                $appSite->setSiteStatus('publish');
                $appSite->setSiteCategory($categories);
                $appSite->setSiteSeo($siteSeo);
                $this->em->persist($appSite);
            }
            $this->em->flush();
        }
    }
}

<?php

namespace App\Controller;

use App\Entity\Account;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Translation\TranslatorInterface;

#[Route('/admin/dashboard', name: 'dashboard')]
class ToolsController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly TranslatorInterface    $translator,
    )
    {
    }
    #[Route('/slider', name: '_slider_tools')]
    public function slider(): Response
    {
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->getUser()]);
        $this->denyAccessUnlessGranted('MEDIEN_SLIDER', $account);
        return $this->render('tools/slider.html.twig', [
            'title' => $this->translator->trans('mediaSlider.Medien Slider'),
        ]);
    }
    #[Route('/carousel', name: '_carousel_tools')]
    public function carousel(): Response
    {
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->getUser()]);
        $this->denyAccessUnlessGranted('MEDIEN_CAROUSEL', $account);
        return $this->render('tools/carousel.html.twig', [
            'title' => $this->translator->trans('carousel.Medien Carousel'),
        ]);
    }
    #[Route('/gallery', name: '_gallery_tools')]
    public function gallery(): Response
    {
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->getUser()]);
        $this->denyAccessUnlessGranted('MEDIEN_GALLERY', $account);
        return $this->render('tools/gallery.html.twig', [
            'title' => $this->translator->trans('Gallery'),
        ]);
    }

    #[Route('/map-protection', name: '_map_protection_tools')]
    public function map_protection(): Response
    {
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->getUser()]);
        $this->denyAccessUnlessGranted('MANAGE_MAPS_PROTECTION', $account);
        return $this->render('tools/map-protection.html.twig', [
            'title' => $this->translator->trans('Map data protection'),
        ]);
    }

    #[Route('/custom-fields', name: '_custom_fields_tools')]
    public function custom_fields(): Response
    {
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->getUser()]);
        $this->denyAccessUnlessGranted('MANAGE_CUSTOM_FIELDS', $account);
        return $this->render('tools/custom-fields.html.twig', [
            'title' => $this->translator->trans('Custom Fields'),
        ]);
    }
}

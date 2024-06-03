<?php

namespace App\Controller;

use App\Entity\Account;
use App\Entity\MediaCategory;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Translation\TranslatorInterface;

#[Route('/admin/dashboard', name: 'dashboard')]
class MedienController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly TranslatorInterface    $translator,

    )
    {
    }

    #[Route('/media', name: '_overview_media')]
    public function overview(): Response
    {
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->getUser()]);
        $this->denyAccessUnlessGranted('MANAGE_MEDIEN', $account);
        $this->make_default_category();
        return $this->render('media/index.html.twig', [
            'title' => $this->translator->trans('Mediathek'),
            'account' => $account
        ]);
    }

    #[Route('/media/category', name: '_category_media')]
    public function category(): Response
    {
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->getUser()]);
        $this->denyAccessUnlessGranted('MANAGE_MEDIEN', $account);
        $this->make_default_category();
        return $this->render('media/category.html.twig', [
            'title' => $this->translator->trans('system.Media library category'),
            'account' => $account
        ]);
    }

    #[Route('/media/converter', name: '_converter_media')]
    public function converter(): Response
    {
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->getUser()]);
        $this->denyAccessUnlessGranted('MANAGE_MEDIEN', $account);
        if (class_exists("Imagick")) {
            $imagick = true;
        } else {
            $imagick = false;
        }
        return $this->render('media/converter.html.twig', [
            'title' => $this->translator->trans('converter.Image converter'),
            'account' => $account,
            'imagick' => $imagick
        ]);
    }

    private function make_default_category(): void
    {

        /** @var User $user */
        $user = $this->getUser();
        $mediaCat = $this->em->getRepository(MediaCategory::class)->findOneBy(['user' => $user]);
        if (!$mediaCat) {
            $firstCat = new MediaCategory();
            $firstCat->setDesignation($this->translator->trans('media.General'));
            $firstCat->setDescription($this->translator->trans('media.General category'));
            $firstCat->setUser($user);
            $firstCat->setType('first_cat');
            $this->em->persist($firstCat);
            $this->em->flush();
        }
    }
}

<?php

namespace App\Controller;

use App\Entity\Account;
use App\Entity\PostCategory;
use App\Settings\Settings;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Translation\TranslatorInterface;

#[Route('/admin/dashboard', name: 'dashboard')]
class PostController extends AbstractController
{
    use Settings;
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly TranslatorInterface    $translator,
    )
    {
    }
    #[Route('/post', name: '_overview_post')]
    public function index(): Response
    {
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->getUser()]);
        $this->denyAccessUnlessGranted('MANAGE_POST', $account);
        $this->make_privacy_sites();
        return $this->render('post/index.html.twig', [
            'title' => $this->translator->trans('Posts'),
        ]);
    }
    #[Route('/post-category', name: '_category_post')]
    public function post_category(): Response
    {
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->getUser()]);
        $this->denyAccessUnlessGranted('MANAGE_POST', $account);
        $this->make_privacy_sites();
        return $this->render('post/category.html.twig', [
            'title' => $this->translator->trans('Post categories'),
        ]);
    }

    private function make_privacy_sites(): void
    {
        $categories = $this->em->getRepository(PostCategory::class)->findAll();
        if(!$categories) {
            $categories = new PostCategory();
            $categories->setType('first');
            $categories->setTitle($this->translator->trans('media.General'));
            $categories->setSlug('general');
            $categories->setDescription($this->translator->trans('media.General category'));
            $this->em->persist($categories);
            $this->em->flush();
        }
    }
}

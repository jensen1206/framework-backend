<?php

namespace App\Controller;

use App\AppHelper\EmHelper;
use App\Entity\Account;
use App\Entity\PostCategory;
use App\Entity\PostSites;
use App\Entity\SystemSettings;
use App\Entity\Tag;
use App\Entity\User;
use App\Settings\Settings;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\SwitchUserToken;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\Component\HttpFoundation\Request;

#[IsGranted('ROLE_USER')]
class DashboardController extends AbstractController
{
    use Settings;

    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly Security               $security,
        private readonly TranslatorInterface    $translator,
        private readonly LoggerInterface        $queueLogger,
        private readonly EmHelper               $emHelper,
        private readonly string                 $appInstallPath
    )
    {
    }

    #[Route('/admin/dashboard', name: 'app_dashboard')]
    public function index(Request $request): Response
    {

        $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
        if ($this->isGranted('ROLE_SUPER_ADMIN') && $this->isGranted('ROLE_PREVIOUS_ADMIN')) {
            $token = $this->security->getToken();
            if ($token instanceof SwitchUserToken) {
                $impersonatorUser = $token->getOriginalToken()->getUser();
                $impersonatorRoles = $impersonatorUser->getRoles();
                if (!in_array('ROLE_SUPER_ADMIN', $impersonatorRoles)) {
                    return $this->redirect('/dashboard?_switch_user=_exit');
                }
            }
        }
        $tag1 = new Tag();
        $tag1->setDesignation('dinosaurs');
        $tag2 = new Tag();
        $tag2->setDesignation('monster trucks');

        $post = $this->em->getRepository(PostSites::class)->find(4);
        $tt = $this->em->getRepository(Tag::class)->find(1);
        $tt2 = $this->em->getRepository(Tag::class)->find(2);
        $post->addTag($tt);
        $post->addTag($tt2);
        $this->em->persist($post);
       // $this->em->flush();

       // $pc = $this->em->getRepository(PostCategory::class)->find(2);

        //$post->addCategory($pc);

        //$this->em->persist($pc);

       // $this->em->flush();

       // $test = $this->em->getRepository(PostSites::class)->find(1);

        //dd($test->getTags(), $test->getCategories());
        $filesystem = new Filesystem();
        if ($filesystem->exists($this->appInstallPath)) {
            $flash = sprintf('<p class="lh-1 mb-2"><i class="bi bi-exclamation-circle me-1"></i> %s</p><p class="text-center lh-1 mb-0"><a href="%s" class="alert-link">%s</a></p>', $this->translator->trans('system.Please delete the installation folder.'), $this->generateUrl('delete_install'), $this->translator->trans('system.Delete folder now'));
            $this->addFlash('backend_error', $flash);
        }
        if ($request->server->get('SITE_BASE_URL') != $request->getSchemeAndHttpHost()) {
            $this->emHelper->set_env('SITE_BASE_URL', $request->getSchemeAndHttpHost());
        }

        /** @var User $user */
        $user = $this->getUser();
        if (!$user->isVerified()) {
            return $this->render('public/account-not-activated.html.twig', [
                'title' => $settings->getApp()['site_name'],
            ]);
        }

        return $this->render('dashboard/index.html.twig', [
            'title' => $this->translator->trans('Admin Dashboard'),
        ]);
    }

    #[Route('/delete-install', name: 'delete_install')]
    public function delete_install_folder(Request $request): Response
    {
        $filesystem = new Filesystem();
        $filesystem->remove($this->appInstallPath);
        $filesystem->remove($this->getParameter('projectDir') . DIRECTORY_SEPARATOR . 'archiv-installer.php');
        $root = $this->getParameter('projectDir') . DIRECTORY_SEPARATOR;
        $scannedBackups = array_diff(scandir($root), array('..', '.'));
        foreach ($scannedBackups as $file) {
            if (is_file($root . $file)) {
                $pathInfo = pathinfo($root . $file);
                if ($pathInfo['extension'] == 'zip') {
                    if (str_starts_with($file, 'archiv')) {
                        unlink($root . $file);
                    }
                }
            }
        }

        return $this->redirect($this->generateUrl('app_dashboard'));
    }

    #[Route('/logged-in', name: 'app_logged_in')]
    public function app_logged_in(Request $request): Response
    {
        $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
        if ($this->getUser()) {
            /** @var User $user */
            $user = $this->getUser();
            if ($settings->getLog()['login'] && $user->isSuAdmin() === false) {
                $this->queueLogger->info($user->getEmail() . ' - ' . $this->translator->trans('log.User has logged in'), [
                    'type' => 'login',
                    'account' => $user->getEmail(),
                    'ip' => $request->getClientIp()
                ]);
            }
        }

        return $this->redirect($this->generateUrl('app_dashboard'));
    }
}

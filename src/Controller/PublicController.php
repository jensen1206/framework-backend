<?php

namespace App\Controller;

use App\AppHelper\EmHelper;
use App\Entity\Account;
use App\Entity\AppSites;
use App\Entity\FormBuilder;
use App\Entity\PluginSections;
use App\Entity\PostCategory;
use App\Entity\PostSites;
use App\Entity\SiteCategory;
use App\Entity\User;
use App\Service\PublicSiteSeo;
use App\Service\ScssCompiler;
use App\Settings\Settings;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Query\Expr\Join;
use Exception;
use Firebase\JWT\JWK;
use Firebase\JWT\JWT;
use League\Bundle\OAuth2ServerBundle\Model\Client as clientModel;
use Sonata\SeoBundle\Seo\SeoPageInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Uid\Uuid;
use Symfony\Contracts\Translation\TranslatorInterface;



class PublicController extends AbstractController
{
    use Settings;

    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly TranslatorInterface    $translator,
        private readonly SeoPageInterface       $seo,
        private readonly PublicSiteSeo          $publicSiteSeo,
        private readonly ScssCompiler           $scssCompiler,
        private readonly MessageBusInterface    $bus,
        private readonly EmHelper               $emHelper,
        private readonly string                 $baseUrl,

    )
    {
        if($this->emHelper->system_is_installed('SUPER_ADMIN')) {
            $this->scss_compiler();
        }
    }

    #[Route('/', name: 'app_public_index')]
    public function index(Request $request): Response
    {
        $locale = $request->getLocale();
        if(!$this->emHelper->system_is_installed('SUPER_ADMIN')) {
            return $this->redirect($this->generateUrl('app_install'));
        }
       /* $user = $this->em->getRepository(User::class)->findByRole('SUPER_ADMIN');
        if (!$user) {
            return $this->redirect($this->generateUrl('app_registration_su_admin'));
        }*/
        $this->publicSiteSeo->set_seo($request, 'app_public_index');
        $site = $this->em->getRepository(AppSites::class)->findOneBy(['routeName' => 'app_public_index']);
        $formBuilder = [];
        $formSettings = [];
        $siteContent = '';
        $formHeader = [];
        $formHeaderSettings = [];
        $formFooter = [];
        $formFooterSettings = [];
        $builder_id = '';
        if ($site) {
            if ($site->getHeader()) {
                $header = $this->em->getRepository(AppSites::class)->find($site->getHeader());
                $headerBuilder = $this->em->getRepository(FormBuilder::class)->find($header->getFormBuilder());
                if ($headerBuilder) {
                    $headerForm = $headerBuilder->getForm();
                    $formHeader = $headerForm['builder'];
                    $formHeaderSettings = $headerForm['settings'];
                }
            }
            if ($site->getFooter()) {
                $footer = $this->em->getRepository(AppSites::class)->find($site->getFooter());
                $footerBuilder = $this->em->getRepository(FormBuilder::class)->find($footer->getFormBuilder());
                if ($footerBuilder) {
                    $footerForm = $footerBuilder->getForm();
                    $formFooter = $footerForm['builder'];
                    $formFooterSettings = $footerForm['settings'];
                }
            }
            if ($site->isBuilderActive() && $site->getFormBuilder()) {
                $builder = $this->em->getRepository(FormBuilder::class)->find($site->getFormBuilder());
                if ($builder) {
                    $form = $builder->getForm();
                    $builder_id = $builder->getFormId();
                    $formBuilder = $form['builder'];
                    $formSettings = $form['settings'];
                }
            } else {
                if ($site->getSiteContent()) {
                    $siteContent = $site->getSiteContent();
                }
            }
        }
        if(!$site) {
            return $this->render('public/index.html.twig', [
                'type' => 'page',
            ]);
        }

        return $this->render('public/index.html.twig', [
            'builder_active' => $site->isBuilderActive() ?? null,
            'builder' => $formBuilder,
            'builder_id' => $builder_id,
            'settings' => $formSettings,
            'header' => $formHeader,
            'headerSettings' => $formHeaderSettings,
            'footer' => $formFooter,
            'footerSettings' => $formFooterSettings,
            'type' => 'page',
            'site_content' => $siteContent
        ]);
    }

    #[Route('/{slug}', name: 'app_public_slug')]
    public function site_by_slug(Request $request): Response
    {
      // dd($request);
            if ($request->get('slug') == 'cron') {
               // $pid = posix_getpid();
            //    $exe = exec("readlink -f /proc/$pid/exe");
                 //   dd($exe , PHP_BINARY);
               // $cmd = 'php /var/www/html/bin/console okvpn:cron > /dev/null 2>&1 &';
              //  dd($this->getParameter('projectDir'));

            }

        $user = $this->em->getRepository(User::class)->findByRole('SUPER_ADMIN');
        if (!$user) {
            return $this->redirect($this->generateUrl('app_registration_su_admin'));
        }

        $slug = $request->get('slug');
        $this->publicSiteSeo->set_seo($request);
        $site = $this->em->getRepository(AppSites::class)->findOneBy(['siteSlug' => $slug]);
        $formBuilder = [];
        $formSettings = [];
        $siteContent = '';
        $formHeader = [];
        $formHeaderSettings = [];
        $formFooter = [];
        $formFooterSettings = [];
        $builder_id = '';
        if ($site) {
            if ($site->getHeader()) {
                $header = $this->em->getRepository(AppSites::class)->find($site->getHeader());
                if($header) {
                    $headerBuilder = $this->em->getRepository(FormBuilder::class)->find($header->getFormBuilder());
                    if ($headerBuilder) {
                        $headerForm = $headerBuilder->getForm();
                        $formHeader = $headerForm['builder'];
                        $formHeaderSettings = $headerForm['settings'];
                    }
                }
            }
            if ($site->getFooter()) {
                $footer = $this->em->getRepository(AppSites::class)->find($site->getFooter());
                if($footer) {
                    $footerBuilder = $this->em->getRepository(FormBuilder::class)->find($footer->getFormBuilder());
                    if ($footerBuilder) {
                        $footerForm = $footerBuilder->getForm();
                        $formFooter = $footerForm['builder'];
                        $formFooterSettings = $footerForm['settings'];
                    }
                }
            }
            if ($site->isBuilderActive() && $site->getFormBuilder()) {
                $builder = $this->em->getRepository(FormBuilder::class)->find($site->getFormBuilder());
                $form = $builder->getForm();
                $builder_id = $builder->getFormId();
                $formBuilder = $form['builder'];
                $formSettings = $form['settings'];
            } else {
                if ($site->getSiteContent()) {
                    $siteContent = $site->getSiteContent();
                }
            }
        }
        if (!$site) {
            return $this->render('public/404.html.twig', [
                'title' => '404',
            ]);
        }
        $builderArr = [];
        foreach ($formBuilder as $tmp) {
            $section = $this->em->getRepository(PluginSections::class)->findOneBy(['elementId' => $tmp['id']]);
            if ($section) {
                $tmp = $section->getPlugin();
            }
            if (!$tmp['container']) {
                $tmp['container'] = 'container';
            }
            $builderArr[] = $tmp;
        }

        return $this->render('public/index.html.twig', [
            'builder_active' => $site->isBuilderActive(),
            'type' => 'page',
            'builder' => $builderArr,
            'builder_id' => $builder_id,
            'header' => $formHeader,
            'headerSettings' => $formHeaderSettings,
            'footer' => $formFooter,
            'footerSettings' => $formFooterSettings,
            'settings' => $formSettings,
            'site_content' => $siteContent
        ]);

    }

    /*  #[Route('/{siteSlug}/{category}/{slug}', name: 'public_category_page')]
      public function category_site(Request $request): Response
      {
          $slug = $request->get('slug');
          $category = $this->em->getRepository(SiteCategory::class)->findOneBy(['slug' => $slug]);
          if($category){
              $uri = 'category-'.$category->getId();
              $this->publicSiteSeo->set_seo($request, null, $uri);
          }

          return $this->render('public/category.html.twig', [
               'title' => $this->translator->trans('medien.Category'),
          ]);
      }*/

    #[Route('/{postCategory}/{slug}', name: 'public_post')]
    public function public_post_site(Request $request): Response
    {

        $slug = $request->get('slug');
        $postCategory = $request->get('postCategory');
        if($postCategory == 'logged-out') {
            $id = $request->get('id');
            if ($id == $slug) {
                $this->addFlash('success', $this->translator->trans('system.You have successfully logged out.'));
                return $this->render('public/logged-out.html.twig', [
                    'title' => $this->translator->trans('Admin Dashboard'),
                ]);
            }
            return $this->redirect($this->generateUrl('app_public_index'));
        }
        $category = '';
        $data = [];
        $siteCatStatus = false;
        $postCatStatus = false;
        $catSlug = '';
        if ($postCategory == $this->getParameter('post_category_name')) {
            $category = $this->em->getRepository(PostCategory::class)->findOneBy(['slug' => $slug]);
            $postCatStatus = true;
            if (!$category) {
                return $this->render('public/404.html.twig', [
                    'title' => '404',
                ]);
            }
        }
        $formHeader = [];
        $formHeaderSettings = [];
        $formFooter = [];
        $formFooterSettings = [];

        if ($postCategory == $this->getParameter('category_name')) {
            $category = $this->em->getRepository(SiteCategory::class)->findOneBy(['slug' => $slug]);
            $siteCatStatus = true;
            $postCatStatus = false;
            if (!$category) {
                return $this->render('public/404.html.twig', [
                    'title' => '404',
                ]);
            }
        }
        if ($postCatStatus) {
            $catSlug = $this->getParameter('post_category_name') . '-' . $category->getId();

            $this->publicSiteSeo->set_seo($request, null, null, null, $catSlug);
            if ($category->getCategoryDesign()) {
                $builderDb = $this->em->getRepository(FormBuilder::class)->find($category->getCategoryDesign());
                if ($category->getCategoryHeader()) {
                    $header = $this->em->getRepository(AppSites::class)->find($category->getCategoryHeader());
                    if ($header->getFormBuilder()) {
                        $builderHeader = $this->em->getRepository(FormBuilder::class)->find($header->getFormBuilder());
                        if ($builderHeader) {
                            $header = $builderHeader->getForm();
                            $formHeader = $header['builder'];
                            $formHeaderSettings = $header['settings'];
                        }
                    }
                }
                if ($category->getCategoryFooter()) {
                    $footer = $this->em->getRepository(AppSites::class)->find($category->getCategoryFooter());
                    if ($footer->getFormBuilder()) {
                        $builderFooter = $this->em->getRepository(FormBuilder::class)->find($footer->getFormBuilder());
                        if ($builderFooter) {
                            $footer = $builderFooter->getForm();
                            $formFooter = $footer['builder'];
                            $formFooterSettings = $footer['settings'];
                        }
                    }
                }

                $data = [
                    'post_id' => $category->getId(),
                    'category' => $category,
                    'type' => $builderDb->getType(),
                    'settings' => $builderDb->getForm()['settings'],
                    'builder' => $builderDb->getForm()['builder'],
                    'builder_id' => $builderDb->getFormId(),
                    'builder_active' => true,
                    'header' => $formHeader,
                    'headerSettings' => $formHeaderSettings,
                    'footer' => $formFooter,
                    'footerSettings' => $formFooterSettings,
                ];
                return $this->render('public/index.html.twig', $data);
            }
            $posts = $this->em->getRepository(PostSites::class)->findBy(['postCategory' => $category]);
            return $this->render('public/category-no-design.html.twig', [
                'category' => $category,
                'posts' => $posts
            ]);
        }
        if ($siteCatStatus) {
            $catSlug = $this->getParameter('category_name') . '-' . $category->getId();
            $this->publicSiteSeo->set_seo($request, null, $catSlug, null, null);
            $sites = $this->em->getRepository(AppSites::class)->findBy(['siteCategory' => $category, 'siteStatus' => 'publish', 'siteType' => 'page'], ['position' => 'asc']);
            return $this->render('public/category.html.twig', [
                'title' => $category->getTitle(),
                'sites' => $sites
            ]);
        }

        $category = $this->em->getRepository(PostCategory::class)->findOneBy(['slug' => $postCategory]);
        $post = $this->em->getRepository(PostSites::class)->findOneBy(['postSlug' => $slug, 'postStatus' => 'publish']);
        // public function set_seo($request, $routeName = null, $category = null, $post = null): void
        if ($post) {
            $this->publicSiteSeo->set_seo($request, null, null, $slug);
        } else {
            return $this->render('public/404.html.twig', [
                'title' => '404',
            ]);
        }

        if ($post->getPostCategory()->getPostDesign()) {
            $builderDb = $this->em->getRepository(FormBuilder::class)->find($post->getPostCategory()->getPostDesign());
            if ($category->getPostHeader()) {
                $header = $this->em->getRepository(AppSites::class)->find($category->getPostHeader());
                if ($header->getFormBuilder()) {
                    $builderHeader = $this->em->getRepository(FormBuilder::class)->find($header->getFormBuilder());
                    if ($builderHeader) {
                        $header = $builderHeader->getForm();
                        $formHeader = $header['builder'];
                        $formHeaderSettings = $header['settings'];
                    }
                }
            }
            if ($category->getPostFooter()) {
                $footer = $this->em->getRepository(AppSites::class)->find($category->getPostFooter());
                if ($footer->getFormBuilder()) {
                    $builderFooter = $this->em->getRepository(FormBuilder::class)->find($footer->getFormBuilder());
                    if ($builderFooter) {
                        $footer = $builderFooter->getForm();
                        $formFooter = $footer['builder'];
                        $formFooterSettings = $footer['settings'];
                    }
                }
            }
            $data = [
                'post_id' => $post->getId(),
                'post' => $post,
                'category' => $category,
                'type' => $builderDb->getType(),
                'settings' => $builderDb->getForm()['settings'],
                'builder' => $builderDb->getForm()['builder'],
                'builder_id' => $builderDb->getFormId(),
                'builder_active' => true,
                'header' => $formHeader,
                'headerSettings' => $formHeaderSettings,
                'footer' => $formFooter,
                'footerSettings' => $formFooterSettings,
            ];
        }

        return $this->render('public/index.html.twig',
            $data
        );
    }

    #[Route('/privacy', name: 'public_privacy_page')]
    public function privacy(Request $request): Response
    {

        $this->publicSiteSeo->set_seo($request);
        return $this->render('public/privacy/privacy.html.twig', [
            'title' => $this->translator->trans('app.Data protection'),
        ]);
    }

    #[Route('/imprint', name: 'public_imprint_page')]
    public function imprint(Request $request): Response
    {
        $this->publicSiteSeo->set_seo($request);
        return $this->render('public/privacy/imprint.html.twig', [
            'title' => $this->translator->trans('Imprint'),
        ]);
    }

    #[Route('/terms', name: 'public_terms_page')]
    public function terms(Request $request): Response
    {
        $this->publicSiteSeo->set_seo($request);
        return $this->render('public/privacy/terms.html.twig', [
            'title' => $this->translator->trans('General Terms and conditions'),
        ]);
    }

    #[Route('/logged-out/{id}', name: 'app_logged_out')]
    public function app_logged_out(Request $request): Response
    {
        $id = $request->get('id');
        if ($id == $this->logout_token) {
            $this->addFlash('success', $this->translator->trans('system.You have successfully logged out.'));
            return $this->render('public/logged-out.html.twig', [
                'title' => $this->translator->trans('Admin Dashboard'),
            ]);
        }
        return $this->redirect($this->generateUrl('app_public_index'));
    }

    #[Route('/cronjob/{job<\d+>?1}', name: 'app_cron_messanger')]
    public function cronJobMessanger(Request $request): Response
    {
        $selfUrl = $request->getHost();
       /* if($selfUrl == 'localhost') {
            $path = 'php';
        } else {
          //  $path = PHP_BINARY;
            $path = PHP_BINARY;
            $re = '/\d(.+)/m';
            preg_match($re, $path, $matches);
            $version = $matches[0] ?? '';
            $path = 'php'.$version;
            $path = str_replace('-fpm','', $path);
        }*/
        $path = $request->server->get('PHP_VERSION_DATA');
        $cmd = sprintf('%s %s/bin/console messenger:stop-workers',$path, $this->getParameter('projectDir'));
        exec($cmd);
        $cmd = sprintf('%s %s/bin/console messenger:consume scheduler_send_mail > /dev/null 2>&1 &',$path, $this->getParameter('projectDir'));
        exec($cmd);
        //dd($request->get('key'), $request->get('slug'), $this->get_cronjob_key($request->get('key')));

        return new Response('Cron execute', 200);
    }

    #[Route('/api/test', name: 'app_api_test')]
    // #[IsGranted('ROLE_OAUTH2_ADMIN')]
    public function apiTest(Request $request): Response
    {
        $authorizationHeader = '';
        if ($request->headers->has('Authorization')) {
            $authorizationHeader = substr($request->headers->get('Authorization'), 7);
        }
        $ux = null;
        try {
            $jwks = JWK::parseKeySet($this->jwks());
            JWT::$leeway = 10;
            // dd($jwks);
            $x = JWT::decode($authorizationHeader, $jwks[$this->jwt_kid]);

            $uuid = Uuid::fromString($x->aud);
            $uuid = $uuid->toRfc4122();
            if (Uuid::isValid($uuid)) {
                $t = Uuid::fromString($uuid)->toBinary();
                $query = $this->em->createQueryBuilder();
                $query
                    ->from(Account::class, 'a')
                    ->select('a.id as accountId,
                    a.imageFilename,
                    a.firstName,
                    a.lastName,
                    a.company,
                    a.phone,
                    a.mobil,
                    u.email,
                    u.uuid,
                    o.name
                    ')
                    ->leftJoin(
                        User::class,
                        'u',
                        Join::WITH,
                        'u.id = a.accountHolder'
                    )
                    ->LeftJoin(
                        clientModel::class,
                        'o',
                        Join::WITH,
                        'o.identifier =:clientUuid'
                    )
                    ->andWhere("u.uuid =:uuid")
                    ->setParameter('clientUuid', $x->aud)
                    ->setParameter('uuid', $t);

                $ux = $query->getQuery()->getOneOrNullResult();
            }

        } catch (Exception $e) {
            $content = 'Error decoding JWT: ' . $e->getMessage();
            dd($content);
        }

        /** @var User $user */
        $user = $this->getUser();
        if ($ux) {
            $loggedInEmail = $ux;
        } else {
            $loggedInEmail = 'empty';
        }

        return $this->json([
            'message' => 'You successfully authenticated!',
            'email' => $ux['email'] ?? '',
            'name' => $ux['name'] ?? '',
            'phone' => $ux['phone'] ?? '',

        ]);
    }

    protected function scss_compiler(): void
    {
        $this->scssCompiler->start_scss_compiler_file();
    }

    private function jwks(): array
    {
        // Load the public key from the filesystem and use OpenSSL to parse it.
        $kernelDirectory = $this->getParameter('projectDir');
        $publicKey = openssl_pkey_get_public(file_get_contents($kernelDirectory . '/var/keys/public.key'));
        $details = openssl_pkey_get_details($publicKey);
        return [
            'keys' => [
                [
                    'kty' => 'RSA',
                    'alg' => 'RS256',
                    'use' => 'sig',
                    'kid' => $this->jwt_kid,
                    'n' => strtr(rtrim(base64_encode($details['rsa']['n']), '='), '+/', '-_'),
                    'e' => strtr(rtrim(base64_encode($details['rsa']['e']), '='), '+/', '-_'),
                ],
            ],
        ];
    }

}

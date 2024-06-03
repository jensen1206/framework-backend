<?php

namespace App\Ajax;

use App\AppHelper\Helper;
use App\Entity\FormBuilder;
use App\Entity\PostSites;
use App\Settings\Settings;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Contracts\Translation\TranslatorInterface;
use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;

class PublicAjaxCall
{
    protected object $responseJson;

    protected Request $data;
    use Settings;

    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly TranslatorInterface    $translator,
        private readonly Environment            $twig
    )
    {
    }

    /**
     * @throws Exception
     */
    public function ajaxPublicHandle(Request $request)
    {
        $this->data = $request;
        $this->responseJson = (object)['status' => false, 'msg' => date('H:i:s'), 'type' => $request->get('method')];
        if (!method_exists($this, $request->get('method'))) {
            throw new Exception("Method not found!#Not Found");
        }

        return call_user_func_array(self::class . '::' . $request->get('method'), []);
    }


    private function create_random_password(): object
    {
        $helper = Helper::instance();
        $this->responseJson->password = $helper->generate_callback_pw(16, 3, 8);
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function create_oauth_secret(): object
    {
        $helper = Helper::instance();
        $this->responseJson->secret = $helper->generate_callback_pw(128, 0, 64);
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function load_more_post(): object
    {
        $page = filter_var($this->data->get('page'), FILTER_VALIDATE_INT);
        $loop = filter_var($this->data->get('loop'), FILTER_VALIDATE_INT);
        $builder = filter_var($this->data->get('builder'), FILTER_UNSAFE_RAW);
        $grid = filter_var($this->data->get('grid'), FILTER_UNSAFE_RAW);
        $form = filter_var($this->data->get('form'), FILTER_UNSAFE_RAW);
        $handle = filter_var($this->data->get('handle'), FILTER_UNSAFE_RAW);
        $formData = [];
        $dbBuilder = $this->em->getRepository(FormBuilder::class)->findOneBy(['formId' => $builder]);
        if ($dbBuilder) {
            foreach ($dbBuilder->getForm()['builder'] as $tmp) {
                foreach ($tmp['grid'] as $g) {
                    if ($g['id'] == $grid) {
                        foreach ($g['forms'] as $f) {
                            if ($f['id'] == $form) {
                                $formData = $f;
                            }
                        }
                    }
                }
            }
        }

        $ids = [];

        $config = $formData['config'];
        $limit = $config['lazy_load'];

        foreach ($config['categories'] as $tmp) {
            $ids[] = $tmp['id'];
        }

        $query = $this->em->createQueryBuilder()
            ->from(PostSites::class, 'p')
            ->select('p, c, s')
            ->andWhere('p.siteType=:type')
            ->setParameter('type', 'post')
            ->leftJoin('p.postCategory', 'c')
            ->leftJoin('p.siteSeo', 's')
            ->andWhere('c.id IN (:cats)')
            ->setParameter('cats', $ids);

        $count = $query->getQuery()->getArrayResult();

        $last = ceil(count($count) / $formData['config']['lazy_load']);

        $next = true;
         if($page+1 > $last-1) {
            $next = false;
         }

        $this->responseJson->count = $last;
        $query = $this->em->createQueryBuilder()
            ->from(PostSites::class, 'p')
            ->select('p, c, s')
            ->andWhere('p.siteType=:type')
            ->setParameter('type', 'post')
            ->leftJoin('p.postCategory', 'c')
            ->leftJoin('p.siteSeo', 's')
            ->andWhere('c.id IN (:cats)')
            ->setParameter('cats', $ids)
            ->setFirstResult($limit * $page);

        if ($limit > 0) {
            $query->setMaxResults($limit);
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
        $result = $query->getQuery()->getArrayResult();
        $dataLoop = [];
        foreach ($result as $tmp) {
            $pageBuilder = $this->em->getRepository(FormBuilder::class)->find($tmp['postCategory']['postLoop']);

            $item = [
                'post' => $tmp,
                'postLoop' => $tmp['postCategory']['postLoop'],
                'builder' => $pageBuilder->getForm()['builder'],
                'settings' =>  $pageBuilder->getForm()['settings'],
            ];
            $dataLoop[] = $item;
        }

        $data = [
            'ajaxLoop' => $dataLoop,
            'loop_col_extra_css' => '',
            'loop_col_inner_extra_css' => '',
            'currentLoop' => $loop,
            'builder' => $builder,
            'grid' => $grid,
            'form' => $form,
            'page' => $page+1,
            'next' => $next,
            'handle' => $handle
        ];

        try {
            $template = $this->twig->render('public/builder/category/ajax-category-loop-column.html.twig', $data);
        } catch (LoaderError|RuntimeError|SyntaxError $e) {
            $this->responseJson->msg = $e->getMessage() . ' ajx-'.__LINE__;
            return $this->responseJson;
        }
        $helper = Helper::instance();
        $this->responseJson->template = $helper->replace_template($template);
        $this->responseJson->status = true;
        $this->responseJson->loop = $loop;
        $this->responseJson->page = $page+1;
        $this->responseJson->next = $next;
        $this->responseJson->handle = $handle;
        return $this->responseJson;
    }

    private function get_leaflet_map():object
    {
        $builder = filter_var($this->data->get('builder'), FILTER_UNSAFE_RAW);
        $row = filter_var($this->data->get('row'), FILTER_UNSAFE_RAW);
        $grid = filter_var($this->data->get('grid'), FILTER_UNSAFE_RAW);
        $form = filter_var($this->data->get('form'), FILTER_UNSAFE_RAW);
        $id = filter_var($this->data->get('id'), FILTER_UNSAFE_RAW);
        $formData = [];
        $dbBuilder = $this->em->getRepository(FormBuilder::class)->findOneBy(['formId' => $builder]);
        if ($dbBuilder) {
            foreach ($dbBuilder->getForm()['builder'] as $tmp) {
                foreach ($tmp['grid'] as $g) {
                    if ($g['id'] == $grid) {
                        foreach ($g['forms'] as $f) {
                            if ($f['id'] == $form) {
                                $formData = $f;
                            }
                        }
                    }
                }
            }
        }
        $helper = Helper::instance();
        if($formData) {
            $config = $formData['config'];

            $pinArr = [];
            if(is_array($formData['pins'])) {
                foreach ($formData['pins'] as $tmp) {
                    $fill = $tmp['polygone_fill'];
                    $border = $tmp['polygone_border'];
                    $polygone_fill = sprintf('rgba(%d,%d,%d,%s)', $fill['r'], $fill['g'], $fill['b'], $fill['a']);
                    $polygone_border = sprintf('rgba(%d,%d,%d,%s)', $border['r'], $border['g'], $border['b'], $border['a']);
                    $geo = $tmp['geo_json'];
                    $pinItem = [
                        'lat' => (float) $geo['lat'],
                        'lon' => (float) $geo['lon'],
                        'popup' => $tmp['textbox'],
                        'show_pin' => $tmp['show_pin'],
                        'polygone_show' => $tmp['polygone_show'],
                        'polygone_fill' => $polygone_fill,
                        'polygone_border' => $polygone_border,
                        'polygone_border_width' => (float) $tmp['polygone_border_width'],
                        'type' => $geo['type'],
                        'geo_json' => $geo['geojson']
                    ];
                    $pinArr[] = $pinItem;
                }
            }
            if($config['pin']) {
                $pin =  '/uploads/mediathek/' . $config['pin'];
            } else {
                $pin = '/images/marker-icon-sh.png';
            }
            $item = [
                'exit_full_screen' => $this->translator->trans('maps.Exit full screen mode'),
                'show_full_screen' => $this->translator->trans('maps.Show full screen mode'),
                'maxClusterRadius' => (int) $config['maxClusterRadius'],
                'mini_map_active' => $config['mini_map_active'],
                'mini_map_width' => (int) $config['mini_map_width'],
                'mini_map_height' => (int) $config['mini_map_height'],
                'mini_map_min_zoom' => (int) $config['mini_map_min_zoom'],
                'mini_map_max_zoom' => (int) $config['mini_map_max_zoom'],
                'msg_min_hide' => $this->translator->trans('maps.Hide thumbnail map'),
                'msg_min_show' => $this->translator->trans('maps.Show thumbnail map'),
                'pin' => $pin,
                'min_zoom' => (int) $config['min_zoom'],
                'max_zoom' => (int) $config['max_zoom'],
                'zoom' => (int) $config['zoom'],
                'pins' => $pinArr,
            ];
            $this->responseJson->id = $id;
            $this->responseJson->osm = $item;
            $this->responseJson->status = true;
            return $this->responseJson;
        }

        return $this->responseJson;
    }

    private function get_slide(): object
    {

        return $this->responseJson;
    }
}
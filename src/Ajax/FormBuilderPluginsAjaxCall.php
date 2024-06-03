<?php

namespace App\Ajax;

use App\AppHelper\EmHelper;
use App\AppHelper\Helper;
use App\Entity\Account;
use App\Entity\AppMaps;
use App\Entity\AppMenu;
use App\Entity\AppSites;
use App\Entity\FormBuilder;
use App\Entity\Forms;
use App\Entity\Media;
use App\Entity\MediaSlider;
use App\Entity\PluginSections;
use App\Entity\PostCategory;
use App\Entity\PostSites;
use App\Entity\SystemSettings;
use App\Service\UploaderHelper;
use App\Settings\BuilderPlugins;
use App\Settings\Settings;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use League\Flysystem\FilesystemException;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Uid\UuidV1;
use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;
use function Symfony\Component\Translation\t;

class FormBuilderPluginsAjaxCall
{
    use BuilderPlugins;
    use Settings;

    protected object $responseJson;
    protected Request $data;


    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly TranslatorInterface    $translator,
        private readonly Security               $security,
        private readonly TokenStorageInterface  $tokenStorage,
        private readonly UrlGeneratorInterface  $urlGenerator,
        private readonly UploaderHelper         $uploaderHelper,
        private readonly EmHelper               $emHelper,
        private readonly string                 $uploadsPath,
        private readonly string                 $uploadsDirName,
        private readonly string                 $fontsDir
    )
    {
    }

    /**
     * @throws Exception
     */
    public function ajaxPBPluginHandle(Request $request)
    {
        $this->data = $request;
        $this->responseJson = (object)['status' => false, 'msg' => date('H:i:s'), 'type' => $request->get('method')];
        if (!method_exists($this, $request->get('method'))) {
            throw new Exception("Method not found!#Not Found");
        }
        $account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->tokenStorage->getToken()->getUser()]);
        if (!$this->security->isGranted('MANAGE_BUILDER_PLUGINS', $account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        return call_user_func_array(self::class . '::' . $request->get('method'), []);
    }


    private function get_plugins(): object
    {
        $builderType = filter_var($this->data->get('builderType'), FILTER_UNSAFE_RAW);
        $loop = false;
        $postCategory = [];
        if ($builderType == 'loop' || $builderType == 'post') {
            $loop = $this->bp_plugins('loop', '', '');
        }


        $postCategory = $this->bp_plugins('post-category', '', '');

        $all = [];
        //$medien = $this->bp_plugins('gallery')['plugins'];
        $medien = $this->bp_plugins('', '', 'medien');
        $structure = $this->bp_plugins('', '', 'structure');
        $contents = $this->bp_plugins('', '', 'contents');

        foreach ($this->bp_plugins('', '', '', '') as $tmp) {
            if ($tmp['section'] == 'loop') {
                if ($builderType == 'loop' || $builderType == 'post') {
                    foreach ($tmp['plugins'] as $plugins) {
                        $all[] = $plugins;
                    }
                } else {
                    continue;
                }
            } else {
                foreach ($tmp['plugins'] as $plugins) {
                    $all[] = $plugins;
                }
            }

        }


        $savedElements = $this->em->getRepository(PluginSections::class)->findBy(['handle' => 'element']);
        $elements = [];
        foreach ($savedElements as $tmp) {
            $form = $tmp->getPlugin();
            $item = [
                'id' => $tmp->getId(),
                'type' => $tmp->getType(),
                'designation' => $tmp->getDesignation(),
                'icon' => $form['icon']
            ];
            $elements[] = $item;
        }
        $this->responseJson->medien = $medien;
        $this->responseJson->structure = $structure;
        $this->responseJson->loop = $loop;
        $this->responseJson->post_category = $postCategory;
        $this->responseJson->contents = $contents;
        $this->responseJson->saved_elements = $elements;
        $this->responseJson->record = $all;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function set_builder_plugin(): object
    {
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $group = filter_var($this->data->get('group'), FILTER_UNSAFE_RAW);
        $grid = filter_var($this->data->get('grid'), FILTER_UNSAFE_RAW);
        $type = filter_var($this->data->get('type'), FILTER_UNSAFE_RAW);

        if (!$id || !$group || !$grid || !$type) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $builder = $this->em->getRepository(FormBuilder::class)->find($id);
        if (!$builder) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $formBuilder = $builder->getForm();
        $plugin = $this->bp_plugins(null, $type);
        $plugin = $this->set_plugin_options($plugin);
        /*if ($plugin['type'] == 'spacer') {
            $re = '/\(.+?\)/';
            $plugin['data']['input'] = preg_replace($re, '(' . $plugin['config']['value'] . ')', $plugin['data']['input']);
        }*/

        $formArr = [];
        foreach ($formBuilder['builder'] as $tmp) {
            $gridArr = [];
            if ($tmp['id'] == $group) {
                foreach ($tmp['grid'] as $gridForm) {
                    if ($gridForm['id'] == $grid) {
                        $forms = $gridForm['forms'];
                        $forms = array_merge_recursive($forms, [$plugin]);
                        $gridForm['forms'] = $forms;
                    }
                    $gridArr[] = $gridForm;
                }
                $tmp['grid'] = $gridArr;
            }
            $formArr[] = $tmp;
        }
        if (!$formArr) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $formBuilder['builder'] = $formArr;
        $builder->setForm($formBuilder);
        $this->em->persist($builder);
        $this->em->flush();
        $this->responseJson->grid = $grid;
        $this->responseJson->group = $group;
        $this->responseJson->record = $plugin;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function get_edit_plugin(): object
    {
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $group = filter_var($this->data->get('group'), FILTER_UNSAFE_RAW);
        $grid = filter_var($this->data->get('grid'), FILTER_UNSAFE_RAW);
        $input = filter_var($this->data->get('input'), FILTER_UNSAFE_RAW);

        if (!$id || !$grid || !$group || !$input) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $builder = $this->em->getRepository(FormBuilder::class)->find($id);
        if (!$builder) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $pageBuilder = $builder->getForm();
        $formData = [];
        $newFormData = [];


        foreach ($pageBuilder['builder'] as $tmp) {
            if ($tmp['id'] == $group) {
                $section = $this->em->getRepository(PluginSections::class)->findOneBy(['elementId' => $group]);
                if ($section) {
                    $tmp = $section->getPlugin();
                }
                foreach ($tmp['grid'] as $grid) {
                    foreach ($grid['forms'] as $form) {
                        if ($form['id'] == $input) {
                            $formData = $form;
                            break;
                        }
                    }
                }
            }
        }

        if (!$formData) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }


        $this->responseJson->record = $this->set_plugin_options($formData);
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function set_plugin_options($plugin): array
    {
        $plugin['options'] = [];

        if (in_array('slider', $plugin['backend'])) {
            $sliderArr = [];
            $slider = $this->em->getRepository(MediaSlider::class)->findBy(['type' => 'slider']);
            foreach ($slider as $tmp) {
                $item = [
                    'id' => $tmp->getId(),
                    'label' => $tmp->getDesignation()
                ];
                $sliderArr[] = $item;
            }
            $plugin['options']['slider'] = $sliderArr;
        }

        if (in_array('carousel', $plugin['backend'])) {
            $carouselArr = [];
            $carousel = $this->em->getRepository(MediaSlider::class)->findBy(['type' => 'carousel']);
            $imgArr = [];
            foreach ($carousel as $tmp) {
                $item = [
                    'id' => $tmp->getId(),
                    'label' => $tmp->getDesignation()
                ];
                $carouselArr[] = $item;
            }
            if ($plugin['config']['carousel']) {
                $carouselSlider = $this->em->getRepository(MediaSlider::class)->find($plugin['config']['carousel']);
                if ($carouselSlider) {
                    $slider = $carouselSlider->getSlider();
                    foreach ($slider['slider'] as $slide) {
                        if ($slide['active']) {
                            $imgArr[] = $slide['image'];
                        }
                    }
                }
            }

            $plugin['images'] = $imgArr;
            $plugin['options']['carousel'] = $carouselArr;
        }

        if (in_array('pages', $plugin['backend']) || in_array('page-select', $plugin['backend'])) {
            $sites = $this->em->getRepository(AppSites::class)->findBy(['siteType' => 'page']);
            $siteSelects = [];
            foreach ($sites as $tmp) {
                $item = [
                    'id' => $tmp->getId(),
                    'label' => $tmp->getSiteSeo()->getSeoTitle()
                ];
                $siteSelects[] = $item;
            }

            $postCategory = $this->em->getRepository(PostCategory::class)->findAll();
            $catSelects = [];

            $plugin['options']['pages'] = $siteSelects;
        }
        if (in_array('sizes', $plugin['backend'])) {
            $plugin['options']['sizes'] = $this->select_size();
        }
        if (in_array('link', $plugin['backend']) || in_array('link-select', $plugin['backend'])) {
            $plugin['options']['link'] = $this->select_link_options();
        }
        if (in_array('button_action', $plugin['backend'])) {
            $plugin['options']['link'] = $this->select_link_options(false);
        }
        if (in_array('source', $plugin['backend'])) {
            $plugin['options']['source'] = $this->select_source();
        }
        if (in_array('button', $plugin['backend'])) {
            $plugin['options']['btn_variant'] = $this->button_variant();
        }
        if (in_array('button_size', $plugin['backend'])) {
            $plugin['options']['button_size'] = $this->select_button_size();
        }
        if (in_array('tag_name', $plugin['backend'])) {
            $plugin['options']['tag_name'] = $this->select_tag_name();
        }
        if (in_array('align', $plugin['backend'])) {
            $plugin['options']['align'] = $this->select_align();
        }
        if (in_array('caption', $plugin['backend'])) {
            $plugin['options']['caption'] = $this->select_caption();
        }
        if (in_array('video', $plugin['backend'])) {
            $plugin['options']['video'] = $this->select_video_extern_types();
        }
        if (in_array('rtl', $plugin['backend'])) {
            $plugin['options']['rtl'] = $this->select_rtl();
        }
        if (in_array('gallery-select', $plugin['backend'])) {
            $gallery = $this->em->getRepository(MediaSlider::class)->findBy(['type' => 'gallery']);
            $arr = [];
            foreach ($gallery as $tmp) {
                $item = [
                    'id' => $tmp->getId(),
                    'label' => $tmp->getDesignation()
                ];
                $arr[] = $item;
            }
            $plugin['options']['gallery-select'] = $arr;
        }

        if (in_array('posts-select', $plugin['backend'])) {
            $posts = $this->em->getRepository(PostSites::class)->findBy(['siteType' => 'post', 'postStatus' => 'publish'], ['position' => 'asc']);

            $arr = [];
            foreach ($posts as $tmp) {
                $item = [
                    'id' => $tmp->getId(),
                    'label' => $tmp->getSiteSeo()->getSeoTitle()
                ];
                $arr[] = $item;
            }
            $plugin['options']['posts-select'] = $arr;
        }

        if (in_array('tag_headline', $plugin['backend'])) {
            $plugin['options']['tag_name'] = $this->select_tag_name(false);
        }
        if (in_array('order_by', $plugin['backend'])) {
            $plugin['options']['order_by'] = $this->select_order_by_default();
        }
        if (in_array('order', $plugin['backend'])) {
            $plugin['options']['order'] = $this->select_order_default();
        }
        if (in_array('post_galleries', $plugin['backend'])) {
            $postCategories = $this->em->getRepository(PostCategory::class)->findAll();
            $catArr = [];
            foreach ($postCategories as $tmp) {
                $item = [
                    'id' => $tmp->getId(),
                    'label' => $tmp->getTitle()
                ];
                $catArr[] = $item;
            }
            $plugin['options']['post_galleries'] = $catArr;
        }
        if (in_array('loop_design', $plugin['backend'])) {
            $loopDesign = $this->em->getRepository(FormBuilder::class)->findBy(['type' => 'loop']);
            $loopArr = [];
            foreach ($loopDesign as $tmp) {
                $item = [
                    'id' => $tmp->getId(),
                    'label' => $tmp->getForm()['designation']
                ];
                $loopArr[] = $item;
            }
            $plugin['options']['loop_design'] = $loopArr;
        }

        if (in_array('post_categories', $plugin['backend'])) {
            $postCategories = $this->em->getRepository(PostCategory::class)->findAll();
            $catArr = [];
            foreach ($postCategories as $tmp) {
                $item = [
                    'id' => $tmp->getId(),
                    'label' => $tmp->getTitle()
                ];
                $catArr[] = $item;
            }
            $plugin['options']['post_categories'] = $catArr;
        }
        if (in_array('menu', $plugin['backend'])) {
            $appMenu = $this->em->getRepository(AppMenu::class)->findBy(['lvl' => 0]);
            $menuArr = [];
            foreach ($appMenu as $tmp) {
                $item = [
                    'id' => $tmp->getId(),
                    'label' => $tmp->getTitle()
                ];
                $menuArr[] = $item;
            }
            $plugin['options']['menu'] = $menuArr;
        }

        if (in_array('protection', $plugin['backend'])) {
            //
            $protection = $this->em->getRepository(AppMaps::class)->findBy(['type' => 'protection']);
            $arr = [];
            foreach ($protection as $tmp) {
                $item = [
                    'id' => $tmp->getId(),
                    'label' => $tmp->getDesignation()
                ];
                $arr[] = $item;
            }
            $plugin['options']['protection'] = $arr;
        }

        if (in_array('forms', $plugin['backend'])) {
            $forms = $this->em->getRepository(Forms::class)->findAll();
            $arr = [];
            foreach ($forms as $tmp) {
                $item = [
                    'id' => $tmp->getFormId(),
                    'label' => $tmp->getDesignation()
                ];
                $arr[] = $item;
            }
            $plugin['options']['forms'] = $arr;
        }

        if (in_array('custom_fields', $plugin['backend'])) {
            $cfArr = [];
            $cf = $this->em->getRepository(MediaSlider::class)->findOneBy(['type' => 'custom_fields']);
            if($cf) {
                $cfArr = $cf->getSlider();
            }

            $plugin['options']['custom_fields'] = $cfArr;
        }

        return $plugin;
    }

    private function add_gmaps_pin(): object
    {
        $this->responseJson->record = $this->default_gmaps_pin();
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function search_osm_address(): object
    {
        $address = filter_var($this->data->get('address'), FILTER_UNSAFE_RAW);
        if (!$address) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $address = json_decode($address, true);
        if (!$address['city']) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $helper = Helper::instance();
        $query = sprintf('%s %s,%s', $address['street'], $address['hnr'], $address['zip'] . ' ' . $address['city']);
        $query = rawurlencode($query);
        $osm = $helper->get_osm_json_data($query);
        if(!$osm->status) {
            $this->responseJson->msg = $this->translator->trans('maps.No address found');
            return $this->responseJson;
        }
        $record = [
            'id' => uniqid(),
            'textbox' => '',
            'show_pin' => true,
            'polygone_show' => false,
            'polygone_fill' =>  [
                'r' => 255,
                'g' => 159,
                'b' => 21,
                'a' => 0.2
            ],
            'polygone_border' => [
                'r' => 0,
                'g' => 115,
                'b' => 47,
                'a' => 0.7
            ],
            'polygone_border_width' => 2,
            'geo_json' => json_decode($osm->geo_json, true),
        ];
        $this->responseJson->record = $record;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function get_post_gallery(): object
    {
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $post = $this->em->getRepository(PostSites::class)->findOneBy(['id' => $id, 'postStatus' => 'publish']);

        $postGallery = $post->getPostGallery();
        if (!$postGallery) {
            return $this->responseJson;
        }

        $thumbUrl = $this->uploaderHelper->getThumbnailPath($this->uploaderHelper::MEDIATHEK);
        $mediumUrl = $this->uploaderHelper->getMediumPath($this->uploaderHelper::MEDIATHEK);
        $largeUrl = $this->uploaderHelper->getLargePath($this->uploaderHelper::MEDIATHEK);
        $largeXlUrl = $this->uploaderHelper->getLargeXlFilterPath($this->uploaderHelper::MEDIATHEK);
        $fullUrl = $this->uploaderHelper->getLargeXlFilterPath($this->uploaderHelper::MEDIATHEK);

        $thumbPath = $this->uploadsPath . 'media/cache/squared_thumbnail_small/' . $this->uploaderHelper::MEDIATHEK . '/';
        $mediumPath = $this->uploadsPath . 'media/cache/medium_image_filter/' . $this->uploaderHelper::MEDIATHEK . '/';
        $largePath = $this->uploadsPath . 'media/cache/large_image_filter/' . $this->uploaderHelper::MEDIATHEK . '/';
        $largeXlPath = $this->uploadsPath . 'media/cache/full_image_filter/' . $this->uploaderHelper::MEDIATHEK . '/';

        $helper = Helper::instance();
        $mediaRepo = $this->em->getRepository(Media::class);
        $arr = [];
        foreach ($postGallery as $tmp) {
            $img = $mediaRepo->find($tmp['imgId']);
            $urls = [];
            if ($img->getType() == 'image') {
                $regExMedia = '/\/media.+/';
                $thumbAttr = '';
                if (is_file($thumbPath . $img->getFileName())) {
                    $thumbAttr = $helper->get_image_size($thumbPath . $img->getFileName());
                    preg_match($regExMedia, $thumbUrl, $matches);
                    $thumbUrl = $matches[0];
                }
                $mediumAttr = '';
                if (is_file($mediumPath . $img->getFileName())) {
                    $mediumAttr = $helper->get_image_size($mediumPath . $img->getFileName());
                    preg_match($regExMedia, $mediumUrl, $matches);
                    $mediumUrl = $matches[0];
                }
                $largeAttr = '';
                if (is_file($largePath . $img->getFileName())) {
                    $largeAttr = $helper->get_image_size($largePath . $img->getFileName());
                    preg_match($regExMedia, $largeUrl, $matches);
                    $largeUrl = $matches[0];
                }
                $largeXlAttr = '';
                if (is_file($largeXlPath . $img->getFileName())) {
                    $largeXlAttr = $helper->get_image_size($largeXlPath . $img->getFileName());
                    preg_match($regExMedia, $largeXlUrl, $matches);
                    $largeXlUrl = $matches[0];
                }
                $urls = [
                    'thumbnail' => [
                        'attr' => $thumbAttr,
                        'url' => $thumbUrl . '/' . $img->getFileName(),
                    ],
                    'medium' => [
                        'attr' => $mediumAttr,
                        'url' => $mediumUrl . '/' . $img->getFileName(),
                    ],
                    'large' => [
                        'attr' => $largeAttr,
                        'url' => $largeUrl . '/' . $img->getFileName(),
                    ],
                    'xl-large' => [
                        'attr' => $largeXlAttr,
                        'url' => $largeXlUrl . '/' . $img->getFileName(),
                    ],
                    'full' => [
                        'attr' => $img->getSizeData(),
                        'url' => '/' . $this->uploadsDirName . '/' . $this->uploaderHelper::MEDIATHEK . '/' . $img->getFileName(),
                    ],
                ];
            }
            $item = [
                'imgId' => $img->getId(),
                'action' => 'lightbox',
                'lightbox_type' => 'slide',
                'url' => '',
                'site_id' => '',
                'custom_link' => '',
                'show_designation' => false,
                'show_description' => false,
                'blank' => false,
                'id' => uniqid(),
                'file_size' => $helper->FileSizeConvert((float)$img->getSize()),
                'alt' => $img->getAlt(),
                'attr' => $img->getAttr(),
                'type' => $img->getType(),
                'fileName' => $img->getFileName(),
                'original' => $img->getOriginal(),
                'customCss' => $img->getCustomCss(),
                'title' => $img->getTitle(),
                'description' => $img->getDescription(),
                'labelling' => $img->getLabelling(),
                'owner' => $img->getUser()->getEmail(),
                'urls' => $urls,
            ];
            $arr[] = $item;
        }
        $this->responseJson->record = $arr;

        $links = [
            'liip_extensions' => $this->liip_imagine_extensions,
            'thumb_url' => $thumbUrl,
            'medium_url' => $mediumUrl,
            'large_url' => $largeUrl,
            'large_xl_url' => $largeXlUrl,
            'media_url' => $fullUrl,
        ];
        $this->responseJson->status = true;
        $this->responseJson->links = $links;
        return $this->responseJson;
    }

    private function set_edit_plugin(): object
    {
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $group = filter_var($this->data->get('group'), FILTER_UNSAFE_RAW);
        $grid = filter_var($this->data->get('grid'), FILTER_UNSAFE_RAW);
        $input = filter_var($this->data->get('input'), FILTER_UNSAFE_RAW);
        $edit = filter_var($this->data->get('edit'), FILTER_UNSAFE_RAW);

        $site_id = filter_var($this->data->get('site_id'), FILTER_VALIDATE_INT);
        $catId = filter_var($this->data->get('catId'), FILTER_VALIDATE_INT);

        if (!$id || !$grid || !$group || !$input || !$edit) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $builder = $this->em->getRepository(FormBuilder::class)->find($id);
        if (!$builder) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $edit = json_decode($edit, true);

        if (isset($edit['chosen'])) {
            unset($edit['chosen']);
        }

        if ($edit['type'] == 'spacer') {
            $re = '/\d{1,4}(.*)\b/';
            preg_match($re, $edit['data']['input'], $matches);
            if (!$matches[1]) {
                $edit['data']['input'] = $matches[0] . 'px';
            }
        }

        $pageBuilder = $builder->getForm();
        $formData = [];
        $g = [];
        foreach ($pageBuilder['builder'] as $tmp) {
            if ($tmp['id'] == $group) {

                foreach ($tmp['grid'] as $grids) {
                    $f = [];
                    foreach ($grids['forms'] as $form) {
                        if ($form['id'] == $input) {
                            $form = $edit;
                        }
                        $f[] = $form;
                    }
                    $grids['forms'] = $f;
                    $g[] = $grids;
                }

                $tmp['grid'] = $g;
                $this->update_saved_row($group, $tmp);
            }
            $formData[] = $tmp;
        }
        $pageBuilder['builder'] = $formData;
        $builder->setForm($pageBuilder);
        $this->em->persist($builder);
        $this->em->flush();
        if($site_id){
            $this->update_site($site_id);
        }
        if($catId) {
            $this->update_category_site($catId);
        }

        $this->responseJson->record = $edit;
        $this->responseJson->grid = $grid;
        $this->responseJson->group = $group;
        $this->responseJson->input = $input;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function update_saved_row($elementId, $group): void
    {
        $row = $this->em->getRepository(PluginSections::class)->findOneBy(['elementId' => $elementId]);

        if ($row) {
            $group['saved'] = true;
            $row->setPlugin($group);
            $this->em->persist($row);
            $this->em->flush();
        } else {
            $saved = $group['saved'] ?? null;
            if ($saved) {
                unset($group['saved']);
            }
        }
    }


    private function get_carousel_images(): object
    {
        $id = filter_var($this->data->get('carousel'), FILTER_VALIDATE_INT);
        $carousel = $this->em->getRepository(MediaSlider::class)->find($id);
        $slider = $carousel->getSlider();
        $imgArr = [];
        foreach ($slider['slider'] as $tmp) {
            if ($tmp['active']) {
                $imgArr[] = $tmp['image'];
            }
        }
        if ($imgArr) {
            $this->responseJson->status = true;
            $this->responseJson->record = $imgArr;
        }

        return $this->responseJson;
    }

    private function save_element(): object
    {
        $edit = filter_var($this->data->get('edit'), FILTER_UNSAFE_RAW);
        $designation = filter_var($this->data->get('designation'), FILTER_UNSAFE_RAW);
        $handle = filter_var($this->data->get('handle'), FILTER_UNSAFE_RAW);
        if (!$edit || !$designation || !$handle) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $edit = json_decode($edit, true);
        $setId = $edit['id'];
        $edit['id'] = uniqid();
        $edit['elementId'] = $setId;
        $element = new PluginSections();
        $element->setType($edit['type']);
        $element->setElementId($setId);
        $element->setPlugin($edit);
        $element->setHandle($handle);
        $element->setDesignation($designation);
        $this->em->persist($element);
        $this->em->flush();
        $this->responseJson->status = true;
        $this->responseJson->msg = $this->translator->trans('plugins.Element successfully saved.');

        return $this->responseJson;
    }

    private function set_saved_element(): object
    {
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $group = filter_var($this->data->get('group'), FILTER_UNSAFE_RAW);
        $grid = filter_var($this->data->get('grid'), FILTER_UNSAFE_RAW);
        $elementId = filter_var($this->data->get('element'), FILTER_VALIDATE_INT);


        if (!$id || !$grid || !$group || !$elementId) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $element = $this->em->getRepository(PluginSections::class)->find($elementId);
        if (!$element) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $builder = $this->em->getRepository(FormBuilder::class)->find($id);
        if (!$builder) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $element = $element->getPlugin();
        $element['id'] = uniqid();
        $formBuilder = $builder->getForm();
        $newData = [];
        $d = [];
        foreach ($formBuilder['builder'] as $tmp) {
            if ($tmp['id'] == $group) {
                foreach ($tmp['grid'] as $gridData) {
                    if ($gridData['id'] == $grid) {
                        $gridData['forms'] = array_merge_recursive($gridData['forms'], [$element]);
                    }
                    $d[] = $gridData;
                }
                $tmp['grid'] = $d;
            }
            $newData[] = $tmp;
        }
        $formBuilder['builder'] = $newData;
        $builder->setForm($formBuilder);
        $this->em->persist($builder);
        $this->em->flush();

        $this->responseJson->grid = $grid;
        $this->responseJson->group = $group;
        $this->responseJson->record = $element;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    /**
     * @throws ExceptionInterface
     */
    private function get_form_element(): object
    {
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $element = $this->em->getRepository(PluginSections::class)->find($id);
        if (!$element) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $serializer = new Serializer([new ObjectNormalizer()]);
        $element = $serializer->normalize($element);

        $this->responseJson->status = true;
        $this->responseJson->record = $element;
        return $this->responseJson;
    }

    private function update_element_title(): object
    {
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $designation = filter_var($this->data->get('designation'), FILTER_UNSAFE_RAW);
        if (!$id || !$designation) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $element = $this->em->getRepository(PluginSections::class)->find($id);
        if (!$element) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $element->setDesignation($designation);
        $this->em->persist($element);
        $this->em->flush();
        $this->responseJson->status = true;
        $this->responseJson->msg = $this->translator->trans('plugins.Element successfully saved.');
        return $this->responseJson;
    }

    /**
     * @throws Exception
     * @throws FilesystemException
     */
    private function import_element(): object
    {
        $this->responseJson->title = $this->translator->trans('Error');
        $file = $this->data->files->get('file');
        $uuid = new UuidV1();
        $file_id = $uuid->toRfc4122();
        $upload = $this->uploaderHelper->upload($file, $file_id, $this->uploaderHelper::BUILDER, true, false);
        if ($upload) {
            $dir = $this->uploadsPath . $this->uploaderHelper::BUILDER . DIRECTORY_SEPARATOR;
            if (!is_file($dir . $upload)) {
                $this->responseJson->msg = $this->translator->trans('builder.File upload error') . ' (Ajx-SE ' . __LINE__ . ')';
                return $this->responseJson;
            }

            $data = json_decode(file_get_contents($dir . $upload), true);
            if (!$data) {
                $this->responseJson->msg = $this->translator->trans('builder.File upload error') . ' (Ajx-SE ' . __LINE__ . ')';
                return $this->responseJson;
            }
            $name = $data['name'] ?? null;
            if (!$name) {
                $this->responseJson->msg = $this->translator->trans('builder.The form builder is faulty.') . ' (Ajx-SE ' . __LINE__ . ')';
                return $this->responseJson;
            }
            $type = $data['type'] ?? null;
            $section = $data['section'] ?? null;
            if (!$type || !$section) {
                $this->responseJson->msg = $this->translator->trans('builder.The form builder is faulty.') . ' (Ajx-SE ' . __LINE__ . ')';
                return $this->responseJson;
            }
            $this->uploaderHelper->deleteFile($upload, $this->uploaderHelper::BUILDER, true);
            if ($section == 'section') {
                $checkRow = $this->em->getRepository(PluginSections::class)->findBy(['elementId' => $data['elementId']]);
                if ($checkRow) {
                    $this->responseJson->msg = $this->translator->trans('system.The section already exists.');
                    return $this->responseJson;
                }
            }
            $data['id'] = uniqid();
            $element = new PluginSections();
            $element->setDesignation($data['name'] . ' - Import');
            unset($data['name']);
            $element->setPlugin($data);
            $element->setType($data['type']);
            $element->setHandle($section);
            $element->setElementId($data['elementId']);
            $this->em->persist($element);
            $this->em->flush();
            $this->responseJson->status = true;
            $this->responseJson->title = $this->translator->trans('plugins.Form builder element imported');
            $this->responseJson->msg = $this->translator->trans('plugins.Form builder element was saved successfully.');
        }


        return $this->responseJson;
    }

    private function delete_element(): object
    {
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $element = $this->em->getRepository(PluginSections::class)->find($id);
        if (!$element) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $this->em->remove($element);
        $this->em->flush();
        $this->responseJson->status = true;
        $this->responseJson->title = $this->translator->trans('swal.Element deleted');
        $this->responseJson->msg = $this->translator->trans('swal.Form builder element successfully deleted.');
        return $this->responseJson;
    }

    private function get_icons(): object
    {
        $dir = $this->fontsDir . 'Icons' . DIRECTORY_SEPARATOR;
        $bsJson = json_decode(file_get_contents($dir . 'bootstrap-icons.json'), true);
        $bs = [];
        $md = [];
        $fa = [];
        foreach ($bsJson as $key => $val) {
            $id = dechex($val);
            $item = [
                'id' => $id,
                'icon' => 'bi bi-' . $key,
                'title' => $id . '-' . $key,
            ];
            $bs[] = $item;
        }

        $mdJson = json_decode(file_get_contents($dir . 'material-design.json'), true);
        $i = 0;
        foreach ($mdJson as $tmp) {
            $id = $tmp['hex'];
            if ($i < 57) {
                $name = '_' . $tmp['name'];
            } else {
                $name = $tmp['name'];
            }
            $item = [
                'id' => $id,
                'icon' => 'material-icons ' . $name,
                'title' => $tmp['category'] . '-' . $id . '-' . $name,
                'category' => $tmp['category']
            ];
            $md[] = $item;
            $i++;
        }

        $faJson = json_decode(file_get_contents($dir . 'fa-icons.json'), true);
        foreach ($faJson as $tmp) {
            $id = $tmp['code'];
            $item = [
                'id' => $id,
                'icon' => $tmp['icon'],
                'title' => $id . '-' . $tmp['icon'],
            ];
            $fa[] = $item;
        }

        $this->responseJson->bs = $bs;
        $this->responseJson->md = $md;
        $this->responseJson->fa = $fa;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function add_accordion_item():object
    {
        $count = filter_var($this->data->get('count'), FILTER_VALIDATE_INT);
        $item = [
            'id' => uniqid(),
            'header' => 'Accordion Item #'.$count,
            'body' => 'Accordion Body #'.$count,
            'open' => false
        ];

        $this->responseJson->record = $item;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function elements_table(): object
    {

        $columns = array(
            'p.designation',
            'p.handle',
            'p.type',
            'p.createdAt',
            '',
            '',
            ''
        );
        $data_arr = array();
        $request = $this->data->request->all();
        $search = (string)$request['search']['value'];
        $query = $this->em->createQueryBuilder()
            ->from(PluginSections::class, 'p')
            ->select('p');

        if (isset($request['search']['value'])) {
            $query->andWhere(
                'p.designation LIKE :searchTerm OR
                 p.type LIKE :searchTerm OR
                 p.handle LIKE :searchTerm OR
                 p.createdAt LIKE :searchTerm')
                ->setParameter('searchTerm', '%' . $search . '%');
        }
        if (isset($request['order'])) {
            $query->orderBy($columns[$request['order']['0']['column']], $request['order']['0']['dir']);
        } else {
            $query->orderBy('p.createdAt', 'ASC');
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
            $download = $this->urlGenerator->generate('download_form_builder_element', ['id' => $tmp['id']]);
            $data_item = array();
            $data_item[] = $tmp['designation'];
            $data_item[] = $tmp['handle'];
            $data_item[] = $tmp['type'];
            $data_item[] = '<span class="d-block lh-1">' . $tmp['createdAt']->format('d.m.Y') . '</span><small class="small-lg d-block mt-1">' . $tmp['createdAt']->format('H:i:s') . '</small>';
            $data_item[] = $download;
            $data_item[] = $tmp['id'];
            $data_item[] = $tmp['id'];
            $data_arr[] = $data_item;
        }

        $countAll = $this->em->getRepository(PluginSections::class)->count([]);
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

    private function update_site($site_id): void
    {
        if($site_id){
            $site = $this->em->getRepository(AppSites::class)->find($site_id);
            if($site){
                $site->getSiteSeo()->setLastUpdate(new DateTimeImmutable());
                $this->em->persist($site);
                $this->em->flush();
            }
        }
    }
    private function update_category_site($cat_id): void
    {
        if($cat_id){
            $cat = $this->em->getRepository(PostCategory::class)->find($cat_id);
            if($cat) {
                $sites = $this->em->getRepository(PostSites::class)->findBy(['postCategory' => $cat]);
               if($sites) {
                   foreach ($sites as $site) {
                       $site->getSiteSeo()->setLastUpdate(new DateTimeImmutable());
                       $this->em->persist($site);
                       $this->em->flush();
                   }
               }
            }
        }
    }
}
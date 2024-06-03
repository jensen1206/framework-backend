<?php

namespace App\Ajax;

use App\AppHelper\EmHelper;
use App\AppHelper\Helper;
use App\Entity\Account;
use App\Entity\AppMaps;
use App\Entity\AppSites;
use App\Entity\MediaSlider;
use App\Service\UploaderHelper;
use App\Settings\Settings;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Query\Parameter;
use Exception;
use phpDocumentor\Reflection\Types\This;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class MediaGalleryAjaxCall
{
    protected object $responseJson;
    private Account $account;
    protected Request $data;
    use Settings;

    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly TranslatorInterface    $translator,
        private readonly Security               $security,
        private readonly TokenStorageInterface  $tokenStorage,
        private readonly UploaderHelper         $uploaderHelper,
        private readonly EmHelper               $emHelper,
        private readonly UrlGeneratorInterface  $urlGenerator,
        private readonly string                 $uploadsPath,
    )
    {
    }

    /**
     * @throws Exception
     */
    public
    function ajaxMediaGallery(Request $request)
    {
        $this->data = $request;
        $this->responseJson = (object)['status' => false, 'msg' => date('H:i:s'), 'type' => $request->get('method')];
        if (!method_exists($this, $request->get('method'))) {
            throw new Exception("Method not found!#Not Found");
        }
        $this->account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->tokenStorage->getToken()->getUser()]);
        if (!$this->security->isGranted('MANAGE_TOOLS', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        return call_user_func_array(self::class . '::' . $request->get('method'), []);
    }

    private function get_slider(): object
    {
        $slider = $this->em->getRepository(MediaSlider::class)->findBy(['type' => 'slider']);
        $record = [];
        if ($slider) {
            foreach ($slider as $tmp) {

                $item = [
                    'id' => $tmp->getId(),
                    'slider' => $tmp->getSlider()
                ];
                $item['slider']['designation'] = $tmp->getDesignation();
                $record[] = $item;
            }

            $this->responseJson->record = $record;
            $this->responseJson->status = true;
        }
        return $this->responseJson;
    }

    private function create_slider(): object
    {
        if (!$this->security->isGranted('MEDIEN_SLIDER', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $designation = filter_var($this->data->get('designation'), FILTER_UNSAFE_RAW);
        if (!$designation) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $addSlider = new MediaSlider();
        $addSlider->setDesignation($designation);
        $addSlider->setSlider($this->add_default_slider());
        $addSlider->setType('slider');
        $this->em->persist($addSlider);
        $this->em->flush();

        $record = [
            'id' => $addSlider->getId(),
            'slider' => $addSlider->getSlider()
        ];
        $record['slider']['designation'] = $designation;
        $this->responseJson->status = true;
        $this->responseJson->title = $this->translator->trans('mediaSlider.Slider created');
        $this->responseJson->msg = $this->translator->trans('mediaSlider.Slider successfully created and saved.');
        $this->responseJson->record = $record;

        return $this->responseJson;
    }

    private function update_slider(): object
    {
        if (!$this->security->isGranted('MEDIEN_SLIDER', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $slider = filter_var($this->data->get('slider'), FILTER_UNSAFE_RAW);
        if (!$id || !$slider) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $slider = json_decode($slider, true);
        if (!$slider['designation']) {
            $this->responseJson->msg = $this->translator->trans('plugins.No designation found') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $updSlider = $this->em->getRepository(MediaSlider::class)->find($id);
        if (!$updSlider) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $updSlider->setDesignation($slider['designation']);
        unset($slider['designation']);
        $updSlider->setSlider($slider);
        $this->em->persist($updSlider);
        $this->em->flush();
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function add_breakpoint(): object
    {
        if (!$this->security->isGranted('MEDIEN_SLIDER', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);

        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $slider = $this->em->getRepository(MediaSlider::class)->find($id);
        if (!$slider) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $updSlider = $slider->getSlider();
        $add = $this->add_default_breakpoint();
        $updSlider['breakpoints'] = array_merge_recursive($updSlider['breakpoints'], [$add]);
        $slider->setSlider($updSlider);
        $this->em->persist($slider);
        $this->em->flush();
        $this->responseJson->id = $id;
        $this->responseJson->record = $add;
        $this->responseJson->status = true;

        return $this->responseJson;
    }

    private function delete_slider(): object
    {
        if (!$this->security->isGranted('MEDIEN_SLIDER', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);

        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $slider = $this->em->getRepository(MediaSlider::class)->find($id);
        if (!$slider) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $this->em->remove($slider);
        $this->em->flush();

        $this->responseJson->status = true;
        $this->responseJson->id = $id;
        $this->responseJson->title = $this->translator->trans('swal.Slider deleted');
        $this->responseJson->msg = $this->translator->trans('swal.The slider has been successfully deleted.');
        return $this->responseJson;
    }

    private function delete_breakpoint(): object
    {
        if (!$this->security->isGranted('MEDIEN_SLIDER', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $breakpoint = filter_var($this->data->get('breakpoint'), FILTER_UNSAFE_RAW);

        if (!$id || !$breakpoint) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $slider = $this->em->getRepository(MediaSlider::class)->find($id);
        if (!$slider) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $newBreakpoint = [];
        $br = $slider->getSlider();
        foreach ($br['breakpoints'] as $tmp) {
            if ($tmp['id'] == $breakpoint) {
                continue;
            }
            $newBreakpoint[] = $tmp;
        }
        $br['breakpoints'] = $newBreakpoint;
        $slider->setSlider($br);
        $this->em->persist($slider);
        $this->em->flush();

        $this->responseJson->status = true;
        $this->responseJson->id = $id;
        $this->responseJson->breakpoint = $breakpoint;
        $this->responseJson->title = $this->translator->trans('swal.Breakpoint deleted');
        $this->responseJson->msg = $this->translator->trans('swal.The breakpoint has been successfully deleted.');

        return $this->responseJson;
    }

    private function get_gallery(): object
    {
        if (!$this->security->isGranted('MEDIEN_GALLERY', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $gallery = $this->em->getRepository(MediaSlider::class)->findBy(['type' => 'gallery']);
        $record = [];
        foreach ($gallery as $tmp) {
            $item = [
                'id' => $tmp->getId(),
                'label' => $tmp->getDesignation()
            ];
            $record[] = $item;
        }
        $helper = Helper::instance();
        $selects = [
            'select_link_option' => $this->select_link_options(),
            'select_site_posts' => $this->emHelper->get_post_site_selects(),
            'select_img_size' => $this->select_size(),
            'select_animation' => $helper->get_animate_option()
        ];
        $this->responseJson->sitePostSelects = $this->emHelper->get_post_site_selects();
        $this->responseJson->selects = $selects;
        $this->responseJson->record = $record;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function add_gallery(): object
    {
        if (!$this->security->isGranted('MEDIEN_GALLERY', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $designation = filter_var($this->data->get('designation'), FILTER_UNSAFE_RAW);
        if (!$designation) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $addGallery = new MediaSlider();
        $addGallery->setType('gallery');
        $addGallery->setDesignation($designation);
        $addGallery->setSlider($this->gallery_default_breakpoints($designation));
        $this->em->persist($addGallery);
        $this->em->flush();

        $record = [
            'id' => $addGallery->getId(),
            'label' => $addGallery->getDesignation()
        ];

        $this->responseJson->msg = $this->translator->trans('gallery.Gallery successfully created');
        $this->responseJson->title = $this->translator->trans('gallery.Gallery created');
        $this->responseJson->record = $record;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function delete_gallery(): object
    {
        if (!$this->security->isGranted('MEDIEN_GALLERY', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }

        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $delete = $this->em->getRepository(MediaSlider::class)->find($id);
        if (!$delete) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $this->em->remove($delete);
        $this->em->flush();
        $this->responseJson->status = true;
        $this->responseJson->id = $id;
        $this->responseJson->title = $this->translator->trans('swal.Gallery successfully deleted');
        $this->responseJson->msg = $this->translator->trans('swal.Gallery was successfully deleted');

        return $this->responseJson;
    }

    private function get_edit_gallery(): object
    {
        if (!$this->security->isGranted('MEDIEN_GALLERY', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }

        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $galerie = $this->em->getRepository(MediaSlider::class)->find($id);
        if (!$galerie) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $record = $galerie->getSlider();
        $record['id'] = $galerie->getId();
        $this->responseJson->record = $record;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function update_gallery(): object
    {
        if (!$this->security->isGranted('MEDIEN_GALLERY', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }

        $edit = filter_var($this->data->get('edit'), FILTER_UNSAFE_RAW);
        if (!$edit) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $edit = json_decode($edit, true);
        $gallery = $this->em->getRepository(MediaSlider::class)->find($edit['id']);
        if (!$gallery) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $gallery->setDesignation($edit['designation']);
        $gallery->setSlider($edit);
        $this->em->persist($gallery);
        $this->em->flush();
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function get_carousel(): object
    {
        if (!$this->security->isGranted('MEDIEN_CAROUSEL', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $carousel = $this->em->getRepository(MediaSlider::class)->findBy(['type' => 'carousel']);
        $record = [];
        foreach ($carousel as $tmp) {
            $item = [
                'id' => $tmp->getId(),
                'carousel' => $tmp->getSlider()
            ];
            $item['carousel']['designation'] = $tmp->getDesignation();
            $record[] = $item;
        }
        $sites = $this->em->getRepository(AppSites::class)->findBy(['siteType' => 'page'], ['position' => 'asc']);
        $sitesArr = [];
        foreach ($sites as $tmp) {
            $item = [
                'id' => $tmp->getId(),
                'label' => $tmp->getSiteSeo()->getSeoTitle()
            ];
            $sitesArr[] = $item;
        }
        $helper = Helper::instance();
        $selects = [
            'select_image_size' => $this->select_size(),
            'select_source' => $this->select_source(),
            'select_link_options' => $this->select_link_options(false),
            'select_button_variant' => $this->button_variant(),
            'select_button_size' => $this->select_button_size(),
            'site_selects' => $sitesArr,
            'select_tag_name' => $this->select_tag_name(),
            'animate_selects' => $helper->get_animate_option(),
            'select_carousel_type' => $this->select_carousel_animation()

        ];

        $this->responseJson->selects = $selects;
        $this->responseJson->record = $record;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function create_carousel(): object
    {
        if (!$this->security->isGranted('MEDIEN_CAROUSEL', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $designation = filter_var($this->data->get('designation'), FILTER_UNSAFE_RAW);
        if (!$designation) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $add = new MediaSlider();
        $add->setType('carousel');
        $add->setDesignation($designation);
        $add->setSlider($this->default_carousel());
        $this->em->persist($add);
        $this->em->flush();
        $record = [
            'id' => $add->getId(),
            'carousel' => $add->getSlider()
        ];

        $record['carousel']['designation'] = $designation;
        $this->responseJson->status = true;
        $this->responseJson->title = $this->translator->trans('carousel.Carousel created');
        $this->responseJson->msg = $this->translator->trans('carousel.Carousel successfully created and saved.');
        $this->responseJson->record = $record;
        return $this->responseJson;
    }

    private function update_carousel(): object
    {
        $carousel = filter_var($this->data->get('carousel'), FILTER_UNSAFE_RAW);
        if (!$carousel) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $carousel = json_decode($carousel, true);

        $upd = $this->em->getRepository(MediaSlider::class)->find($carousel['id']);
        if (!$upd) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $upd->setDesignation($carousel['carousel']['designation']);
        unset($carousel['carousel']['designation']);
        $upd->setSlider($carousel['carousel']);
        $this->em->persist($upd);
        $this->em->flush();
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function add_slider(): object
    {
        if (!$this->security->isGranted('MEDIEN_CAROUSEL', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $carousel = $this->em->getRepository(MediaSlider::class)->find($id);
        if (!$carousel) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $upd = $carousel->getSlider();
        $add = $this->default_carousel_slider();
        $upd['slider'] = array_merge_recursive($upd['slider'], [$add]);
        $carousel->setSlider($upd);
        $this->em->persist($carousel);
        $this->em->flush();
        $this->responseJson->id = $id;
        $this->responseJson->record = $add;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function delete_carousel_slider(): object
    {
        if (!$this->security->isGranted('MEDIEN_CAROUSEL', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $id = filter_var($this->data->get('id'), FILTER_UNSAFE_RAW);
        $carouselId = filter_var($this->data->get('carousel'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $carousel = $this->em->getRepository(MediaSlider::class)->find($carouselId);
        if (!$carousel) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $upd = $carousel->getSlider();
        $newData = [];
        foreach ($upd['slider'] as $tmp) {
            if ($tmp['id'] == $id) {
                continue;
            }
            $newData[] = $tmp;
        }
        $upd['slider'] = $newData;
        $carousel->setSlider($upd);
        $this->em->persist($carousel);
        $this->em->flush();
        $this->responseJson->id = $id;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function delete_carousel(): object
    {
        if (!$this->security->isGranted('MEDIEN_CAROUSEL', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $carousel = $this->em->getRepository(MediaSlider::class)->find($id);
        if (!$carousel) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $this->em->remove($carousel);
        $this->em->flush();

        $this->responseJson->status = true;
        $this->responseJson->msg = $this->translator->trans('swal.Carousel has been successfully deleted.');
        $this->responseJson->title = $this->translator->trans('swal.Carousel deleted');
        $this->responseJson->id = $id;
        return $this->responseJson;
    }

    private function update_carousel_slider(): object
    {
        if (!$this->security->isGranted('MEDIEN_CAROUSEL', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $carousel = filter_var($this->data->get('carousel'), FILTER_VALIDATE_INT);
        $slider = filter_var($this->data->get('slider'), FILTER_UNSAFE_RAW);

        if (!$carousel || !$slider) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $carousel = $this->em->getRepository(MediaSlider::class)->find($carousel);
        if (!$carousel) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $slider = json_decode($slider, true);
        $upd = $carousel->getSlider();
        $newData = [];
        foreach ($upd['slider'] as $tmp) {
            if ($tmp['id'] == $slider['id']) {
                $tmp = $slider;
            }
            $newData[] = $tmp;
        }
        $upd['slider'] = $newData;
        $carousel->setSlider($upd);
        $this->em->persist($carousel);
        $this->em->flush();
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function add_button(): object
    {
        if (!$this->security->isGranted('MEDIEN_CAROUSEL', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $slider = filter_var($this->data->get('slider'), FILTER_UNSAFE_RAW);

        if (!$id || !$slider) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $carousel = $this->em->getRepository(MediaSlider::class)->find($id);
        if (!$carousel) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $addButton = $this->default_carousel_slider_button();
        $upd = $carousel->getSlider();
        $newData = [];
        foreach ($upd['slider'] as $tmp) {
            if ($tmp['id'] == $slider) {
                $tmp['slide_button'] = array_merge_recursive($tmp['slide_button'], [$addButton]);
            }
            $newData[] = $tmp;
        }
        $upd['slider'] = $newData;
        $carousel->setSlider($upd);
        $this->em->persist($carousel);
        $this->em->flush();
        $this->responseJson->record = $addButton;
        $this->responseJson->id = $id;
        $this->responseJson->slider = $slider;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function delete_carousel_slider_button(): object
    {
        if (!$this->security->isGranted('MEDIEN_CAROUSEL', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $id = filter_var($this->data->get('id'), FILTER_UNSAFE_RAW);
        $slider = filter_var($this->data->get('slider'), FILTER_UNSAFE_RAW);
        $carouselId = filter_var($this->data->get('carousel'), FILTER_VALIDATE_INT);

        if (!$id || !$slider || !$carouselId) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $carousel = $this->em->getRepository(MediaSlider::class)->find($carouselId);
        if (!$carousel) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $upd = $carousel->getSlider();
        $newData = [];
        $sArr = [];
        foreach ($upd['slider'] as $s) {
            $bArr = [];
            if ($s['id'] == $slider) {
                foreach ($s['slide_button'] as $b) {
                    if ($b['id'] == $id) {
                        continue;
                    }
                    $bArr[] = $b;
                }
                $s['slide_button'] = $bArr;
            }
            $newData[] = $s;

        }

        $upd['slider'] = $newData;
        $carousel->setSlider($upd);
        $this->em->persist($carousel);
        $this->em->flush();

        $this->responseJson->status = true;
        $this->responseJson->carousel = $carouselId;
        $this->responseJson->slider = $slider;
        $this->responseJson->id = $id;
        return $this->responseJson;
    }

    private function map_protection_handle(): object
    {
        $handle = filter_var($this->data->get('handle'), FILTER_UNSAFE_RAW);
        $designation = filter_var($this->data->get('designation'), FILTER_UNSAFE_RAW);
        $data_type = filter_var($this->data->get('data_type'), FILTER_UNSAFE_RAW);
        if(!$handle || !$designation){
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $map_data = [];
        if($handle == 'insert') {
            $data_type = filter_var($this->data->get('data_type'), FILTER_UNSAFE_RAW);
            if(!$data_type) {
                $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
                return $this->responseJson;
            }
            $appMap = new AppMaps();
            $map_data = $this->default_map_protection();
            $appMap->setType($data_type);
            $this->responseJson->title = $this->translator->trans('Saved');
            $this->responseJson->msg = $this->translator->trans('The data has been saved successfully.');
        } else {
            $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
            if(!$id){
                $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
                return $this->responseJson;
            }
            $appMap = $this->em->getRepository(AppMaps::class)->find($id);
            if(!$appMap){
                $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
                return $this->responseJson;
            }
            $map_data = filter_var($this->data->get('map_data'), FILTER_UNSAFE_RAW);
            $map_data = json_decode($map_data, true);
        }

        $appMap->setDesignation($designation);
        $appMap->setMapData($map_data);
        $this->em->persist($appMap);
        $this->em->flush();


        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function get_map_protection(): object
    {
        if (!$this->security->isGranted('MANAGE_MAPS_PROTECTION', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }

        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if(!$id){
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $appMap = $this->em->getRepository(AppMaps::class)->find($id);
        if(!$appMap){
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $pages = $this->em->getRepository(AppSites::class)->findBy(['siteType' => 'page', 'siteStatus' => 'publish']);
        $pageSelects = [];
        foreach ($pages as $tmp) {

            $url = '';
            if($tmp->getRouteName()) {
                $url = $this->urlGenerator->generate($tmp->getRouteName());
            } else {
                if($tmp->getSiteSlug()) {
                   $url = $this->urlGenerator->generate('app_public_slug', ['slug' => $tmp->getSiteSlug()]);
                }
            }
            $item = [
                'id' => $tmp->getId(),
                'label' => $tmp->getSiteSeo()->getSeoTitle(),
                'value' => $url
            ];
            $pageSelects[] = $item;
        }

        $this->responseJson->selectPages = $pageSelects;
        $this->responseJson->record = $appMap->getMapData();
        $this->responseJson->id = $appMap->getId();
        $this->responseJson->designation = $appMap->getDesignation();
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function delete_map_protection(): object
    {
        if (!$this->security->isGranted('MANAGE_MAPS_PROTECTION', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if(!$id){
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $appMap = $this->em->getRepository(AppMaps::class)->find($id);
        if(!$appMap){
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $this->em->remove($appMap);
        $this->em->flush();

        $this->responseJson->status = true;
        $this->responseJson->title = $this->translator->trans('swal.Data protection deleted');
        $this->responseJson->msg = $this->translator->trans('swal.Data protection was successfully deleted');
        return $this->responseJson;
    }

    private function map_protection_table(): object
    {
        if (!$this->security->isGranted('MANAGE_MAPS_PROTECTION', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }

        $columns = array(
            'm.designation',
            'm.type',
            'm.createdAt',
            '',
            ''
        );
        $request = $this->data->request->all();
        $search = (string)$request['search']['value'];

        $query = $this->em->createQueryBuilder();
        $query
            ->from(AppMaps::class, 'm')
            ->select('m')
            ->andWhere('m.type=:type')
            ->setParameter('type','protection');

        if (isset($request['search']['value'])) {
            $query->andWhere(
                'm.createdAt LIKE :searchTerm OR
                 m.designation LIKE :searchTerm OR
                 m.type LIKE :searchTerm')
                ->setParameter('searchTerm','%' . $search . '%');
        }
        if (isset($request['order'])) {
            $query->orderBy($columns[$request['order']['0']['column']], $request['order']['0']['dir']);
        } else {
            $query->orderBy('m.designation', 'DESC');
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
            $data_item = array();
            $data_item[] = $tmp['designation'];
            $data_item[] = $tmp['type'];
            $data_item[] = '<span class="d-block lh-1">' . $tmp['createdAt']->format('d.m.Y') . ' <small class="d-block mt-1 small-lg">' . $tmp['createdAt']->format('H:i:s') . '</small></span>';
            $data_item[] = $tmp['id'];
            $data_item[] = $tmp['id'];
            $data_arr[] = $data_item;
        }

        $allCount = $this->em->getRepository(AppMaps::class)->count(['type' => 'protection']);
        $this->responseJson->draw = $request['draw'];
        $this->responseJson->recordsTotal = $allCount;
        if ($search) {
            $this->responseJson->recordsFiltered = count($table);
        } else {
            $this->responseJson->recordsFiltered = $allCount;
        }
        $this->responseJson->data = $data_arr;
        return $this->responseJson;
    }

    private function get_custom_fields(): object
    {
        $fields = $this->em->getRepository(MediaSlider::class)->findOneBy(['type' => 'custom_fields']);
        $record = [];
         if($fields) {
             $record = [
                 'id' => $fields->getId(),
                 'data' => $fields->getSlider()
             ];
         }
        $this->responseJson->record = $record;
         if($fields){
             $this->responseJson->status = true;
         }
        $this->responseJson->selects = $this->default_custom_field_selects();
        return $this->responseJson;
    }

    private function add_custom_field():object
    {
        if (!$this->security->isGranted('MANAGE_CUSTOM_FIELDS', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $designation = filter_var($this->data->get('designation'), FILTER_UNSAFE_RAW);
        $type = filter_var($this->data->get('type'), FILTER_UNSAFE_RAW);
        if(!$designation){
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        if(!$type) {
            $type = 'text';
        }
        $add = $this->default_custom_field($designation, $type);
        $fields = $this->em->getRepository(MediaSlider::class)->findOneBy(['type' => 'custom_fields']);
        if(!$fields){
            $fields  = new MediaSlider();
            $fields->setDesignation('Custom Fields');
            $fields->setType('custom_fields');
            $fields->setSlider([$add]);
        } else {
            $get = $fields->getSlider();
            $addCustom = array_merge_recursive($get, [$add]);
            $fields->setSlider($addCustom);
        }

        $this->em->persist($fields);
        $this->em->flush();
        $this->responseJson->status = true;
        $this->responseJson->title = $this->translator->trans('Saved');
        $this->responseJson->msg = $this->translator->trans('The data has been saved successfully.');

        return $this->responseJson;
    }

    private function update_custom_field():object
    {
        if (!$this->security->isGranted('MANAGE_CUSTOM_FIELDS', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $custom = filter_var($this->data->get('custom'), FILTER_UNSAFE_RAW);
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if(!$id || !$custom) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $custom = json_decode($custom, true);
        $update = $this->em->getRepository(MediaSlider::class)->find($id);
        if(!$update) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $update->setSlider($custom);
        $this->em->persist($update);
        $this->em->flush();

        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function delete_custom_field():object
    {
        if (!$this->security->isGranted('MANAGE_CUSTOM_FIELDS', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $field_id = filter_var($this->data->get('field_id'), FILTER_UNSAFE_RAW);
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if(!$id || !$field_id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $upd = $this->em->getRepository(MediaSlider::class)->find($id);
        if(!$upd){
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (AC-Ajx- ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $custom = [];
        foreach ($upd->getSlider() as $tmp){
            if($tmp['id'] == $field_id) {
                continue;
            }
            $custom[] = $tmp;
        }
        $upd->setSlider($custom);
        $this->em->persist($upd);
        $this->em->flush();
        $this->responseJson->id = $field_id;
        $this->responseJson->title = $this->translator->trans('system.Deleted');
        $this->responseJson->msg = $this->translator->trans('system.Entry successfully deleted.');
        $this->responseJson->status = true;
        return $this->responseJson;
    }

}
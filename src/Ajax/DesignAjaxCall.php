<?php

namespace App\Ajax;

use App\AppHelper\EmHelper;
use App\AppHelper\Helper;
use App\Entity\Account;
use App\Entity\AppFonts;
use App\Entity\SystemSettings;
use App\Service\UploaderHelper;
use App\Settings\Settings;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class DesignAjaxCall
{
    private Account $account;
    protected object $responseJson;
    protected Request $data;
    use Settings;

    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly TranslatorInterface    $translator,
        private readonly Security               $security,
        private readonly TokenStorageInterface  $tokenStorage,
        private readonly UploaderHelper         $uploaderHelper,
        private readonly UrlGeneratorInterface  $urlGenerator,
        private readonly MessageBusInterface    $bus,
        private readonly EmHelper               $emHelper,
        private readonly string                 $fontsDir,
        private readonly string                 $publicPath
    )
    {
    }

    /**
     * @throws Exception
     */
    public
    function ajaxDesignHandle(Request $request)
    {
        $this->data = $request;
        $this->responseJson = (object)['status' => false, 'msg' => date('H:i:s'), 'type' => $request->get('method')];
        if (!method_exists($this, $request->get('method'))) {
            throw new Exception("Method not found!#Not Found");
        }
        $this->account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->tokenStorage->getToken()->getUser()]);
        if (!$this->security->isGranted('MANAGE_FONTS', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        return call_user_func_array(self::class . '::' . $request->get('method'), []);
    }

    private
    function get_fonts(): object
    {
        $getFonts = $this->em->getRepository(AppFonts::class)->findAll();
        $arr = [];
        $this->emHelper->generate_font_face();
        if ($getFonts) {
            foreach ($getFonts as $tmp) {
                $item = [
                    'id' => $tmp->getId(),
                    'designation' => $tmp->getDesignation(),
                    'localName' => $tmp->getLocalName(),
                    'fontInfo' => $tmp->getFontInfo(),
                    'fontData' => $tmp->getFontData()
                ];
                $arr[] = $item;
            }
        }
        $this->responseJson->record = $arr;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private
    function font_update(): object
    {
        $data = filter_var($this->data->get('data'), FILTER_UNSAFE_RAW);
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$data || !$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = json_decode($data, true);
        $font = $this->em->getRepository(AppFonts::class)->find($id);
        if (!$font) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $fontData = $font->getFontData();

        if (!$fontData) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $arr = [];
        foreach ($fontData as $tmp) {
            if ($tmp['id'] == $data['id']) {
                $tmp['font_style'] = $data['font_style'];
                $tmp['font_weight'] = $data['font_weight'];
            }
            $arr[] = $tmp;
        }

        $font->setFontData($arr);
        $this->em->persist($font);
        $this->em->flush();

        $this->emHelper->generate_font_face();

        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private
    function delete_font(): object
    {
        if (!$this->security->isGranted('DELETE_FONTS', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $font = $this->em->getRepository(AppFonts::class)->find($id);
        if (!$font) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $helper = Helper::instance();
        $dir = $this->publicPath . 'fonts' . DIRECTORY_SEPARATOR . $font->getDesignation();
        if(is_dir($dir)) {
            $helper->recursive_destroy_dir($dir);
        }

        $this->em->remove($font);
        $this->em->flush();

        $this->emHelper->generate_font_face();

        $this->responseJson->id = $id;
        $this->responseJson->status = true;
        $this->responseJson->title = $this->translator->trans('swal.Font deleted');
        $this->responseJson->msg = $this->translator->trans('swal.The font has been successfully deleted') . '.';
        return $this->responseJson;
    }

    private function update_font_face():object
    {
        $this->emHelper->generate_font_face();
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private
    function get_settings(): object
    {
        $fonts = $this->em->getRepository(AppFonts::class)->findAll();
        $fontArr = [];

        foreach ($fonts as $tmp) {
            $item = [
                'id' => $tmp->getId(),
                'label' => $tmp->getDesignation(),
                'styles' => $tmp->getFontData()
            ];
            $fontArr[] = $item;
        }
        $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);

        $this->responseJson->fonts =  $settings->getDesign();
        $this->responseJson->font_selects = $fontArr;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function update_font():object
    {
        $handle = filter_var($this->data->get('handle'), FILTER_UNSAFE_RAW);
        $data = filter_var($this->data->get('data'), FILTER_UNSAFE_RAW);
        if (!$handle || !$data) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = json_decode($data, true);
        $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
        $updData = $settings->getDesign();
        if(!$updData || !$updData[$handle]){
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $updData[$handle] = $data;
        $settings->setDesign($updData);
        $this->em->persist($settings);
        $this->em->flush();

        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function reset_color_settings():object
    {
        $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
        $colors = $settings->getDesign();

        $defColors = $this->default_settings('design');
        $colors['color'] = $defColors['color'];
        $settings->setDesign($colors);
        $this->em->persist($settings);
        $this->em->flush();
        $this->responseJson->record = $defColors['color'];
        $this->responseJson->status = true;
        $this->responseJson->msg = $this->translator->trans('swal.All settings have been successfully reset.');
        $this->responseJson->title = $this->translator->trans('swal.Settings reset');
        return $this->responseJson;
    }

}
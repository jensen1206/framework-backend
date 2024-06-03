<?php

namespace App\Ajax;

use App\AppHelper\Helper;
use App\Entity\Account;
use App\Entity\AppSites;
use App\Entity\FormBuilder;
use App\Entity\MediaSlider;
use App\Entity\PluginSections;
use App\Entity\SystemSettings;
use App\Service\UploaderHelper;
use App\Settings\Settings;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use League\Flysystem\FilesystemException;
use Scheb\TwoFactorBundle\Security\TwoFactor\Provider\Totp\TotpAuthenticatorInterface;
use stdClass;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\Component\Uid\UuidV1;


class FormBuilderAjaxCall
{
    use Settings;

    protected object $responseJson;
    private Account $account;
    protected Request $data;

    public function __construct(
        private readonly EntityManagerInterface     $em,
        private readonly TokenStorageInterface      $tokenStorage,
        private readonly TotpAuthenticatorInterface $totpAuthenticator,
        private readonly TranslatorInterface        $translator,
        private readonly Security                   $security,
        private readonly UploaderHelper             $uploaderHelper,
        private readonly UrlGeneratorInterface      $urlGenerator,
        private readonly string                     $uploadsPath,
    )
    {
    }

    /**
     * @throws Exception
     */
    public
    function ajaxFormBuilderHandle(Request $request)
    {
        $this->data = $request;
        $this->responseJson = (object)['status' => false, 'msg' => date('H:i:s'), 'type' => $request->get('method')];
        if (!method_exists($this, $request->get('method'))) {
            throw new Exception("Method not found!#Not Found");
        }
        $this->account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->tokenStorage->getToken()->getUser()]);
        if (!$this->security->isGranted('MANAGE_PAGE', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        return call_user_func_array(self::class . '::' . $request->get('method'), []);

    }

    private function create_layout(): object
    {
        if (!$this->security->isGranted('MANAGE_SITE_BUILDER', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $type = filter_var($this->data->get('type'), FILTER_UNSAFE_RAW);
        $bezeichnung = filter_var($this->data->get('bezeichnung'), FILTER_UNSAFE_RAW);

        $fbId = 'FB' . uniqid();
        $form = [
            '0' => [
                'id' => uniqid(),
                'row_css' => '',
                'row_id' => '',
                'container' => 'container',
                'innerContainer' => '',
                'zIndex' => '',
                'innerZindex' => '',
                'cbg' => [
                    'r' => 255,
                    'g' => 255,
                    'b' => 255,
                    'a' => 0
                ],
                'icbg' => [
                    'r' => 255,
                    'g' => 255,
                    'b' => 255,
                    'a' => 0
                ],
                'bg_image' => new stdClass(),
                'bg_inner_image' => new stdClass(),
                'parallax_container_active' => false,
                'parallax_container_fixed' => false,
                'parallax_container_height' => '350px',
                'parallax_container_speed' => 1.2,
                'parallax_container_position_left' => '50%',
                'parallax_container_position_right' => '50%',
                'parallax_container_type' => 'scroll',
                'parallax_inner_active' => false,
                'parallax_inner_fixed' => false,
                'parallax_inner_height' => '350px',
                'parallax_inner_speed' => 1.2,
                'parallax_inner_position_left' => '50%',
                'parallax_inner_position_right' => '50%',
                'parallax_inner_type' => 'scroll',
                'grid' => [
                    '0' => [
                        'id' => uniqid(),
                        'col' => 12,
                        'column_css' => '',
                        'column_id' => '',
                        'column_inner_css' => '',
                        'zIndex' => '',
                        'parallax_active' => false,
                        'parallax_fixed' => false,
                        'parallax_height' => '350px',
                        'parallax_speed' => 1.2,
                        'parallax_position_left' => '50%',
                        'parallax_position_right' => '50%',
                        'parallax_type' => 'scroll',
                        'animation' => [
                            'type' => '',
                            'iteration' => 1,
                            'duration' => '0.5s',
                            'delay' => '0.1s',
                            'count' => 1,
                            'offset' => 5,
                            'no_repeat' => false
                        ],
                        'bg' => [
                            'r' => 255,
                            'g' => 255,
                            'b' => 255,
                            'a' => 0
                        ],
                        'bg_image' => new stdClass(),
                        'forms' => []
                    ]
                ]
            ]
        ];

        $settings = [
            'col' => 'lg',
            'gutter' => 'g-3',
            'individuell' => '',
            'extra_css' => ''
        ];
        $appSettings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
        $helper = Helper::instance();
        if ($bezeichnung) {
            $designation = $bezeichnung;
        } else {
            if ($type == 'category') {
                $designation = $this->translator->trans('system.Category') . '-' . $helper->generate_callback_pw(6, 0, 6);
            } elseif ($type == 'post') {
                $designation = $this->translator->trans('posts.Post') . '-' . $helper->generate_callback_pw(6, 0, 6);
            } elseif ($type == 'loop') {
                $designation = $this->translator->trans('posts.Post loop') . '-' . $helper->generate_callback_pw(6, 0, 6);
            } elseif ($type == 'header') {
                $designation = 'Header-' . $helper->generate_callback_pw(6, 0, 6);
            } elseif ($type == 'footer') {
                $designation = 'Footer-' . $helper->generate_callback_pw(6, 0, 6);
            } else {
                $designation = $this->translator->trans('builder.Page-Builder') . '-' . $helper->generate_callback_pw(6, 0, 6);
            }
        }

        if (!$type) {
            $type = 'page';
        }

        $builderForm = [
            'id' => $fbId,
            'builder_version' => $this->formBuilderVersion,
            'app_version' => $appSettings->getApp()['version'],
            'designation' => $designation,
            'type' => $type,
            'builder' => $form,
            'settings' => $settings,
            'conditions' => []
        ];
        $builder = new FormBuilder();
        $builder->setFormId($fbId);
        $builder->setForm($builderForm);
        $builder->setType($type);
        $this->em->persist($builder);
        $this->em->flush();
        $this->responseJson->status = true;
        $this->responseJson->id = $builder->getId();
        $this->responseJson->designation = $designation;
        $this->responseJson->title = $this->translator->trans('builder.Page builder created');
        $this->responseJson->msg = $this->translator->trans('builder.A new page builder has been successfully created.');
        return $this->responseJson;
    }

    private function add_builder_row(): object
    {
        if (!$this->security->isGranted('MANAGE_BUILDER_SITES', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }

        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $site_id = filter_var($this->data->get('site_id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $builder = $this->em->getRepository(FormBuilder::class)->find($id);
        if (!$builder) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $newArr = [
            '0' => [
                'id' => uniqid(),
                'row_css' => '',
                'row_id' => '',
                'container' => 'container',
                'innerContainer' => '',
                'zIndex' => '',
                'innerZindex' => '',
                'cbg' => [
                    'r' => 255,
                    'g' => 255,
                    'b' => 255,
                    'a' => 0
                ],
                'icbg' => [
                    'r' => 255,
                    'g' => 255,
                    'b' => 255,
                    'a' => 0
                ],
                'bg_image' => new stdClass(),
                'bg_inner_image' => new stdClass(),
                'parallax_container_active' => false,
                'parallax_container_fixed' => false,
                'parallax_container_height' => '350px',
                'parallax_container_speed' => 1.2,
                'parallax_container_position_left' => '50%',
                'parallax_container_position_right' => '50%',
                'parallax_container_type' => 'scroll',
                'parallax_inner_active' => false,
                'parallax_inner_fixed' => false,
                'parallax_inner_height' => '350px',
                'parallax_inner_speed' => 1.2,
                'parallax_inner_position_left' => '50%',
                'parallax_inner_position_right' => '50%',
                'parallax_inner_type' => 'scroll',
                'grid' => [
                    '0' => [
                        'id' => uniqid(),
                        'column_css' => '',
                        'column_id' => '',
                        'col' => 12,
                        'column_inner_css' => '',
                        'zIndex' => '',
                        'parallax_active' => false,
                        'parallax_fixed' => false,
                        'parallax_height' => '350px',
                        'parallax_speed' => 1.2,
                        'parallax_position_left' => '50%',
                        'parallax_position_right' => '50%',
                        'parallax_type' => 'scroll',
                        'animation' => [
                            'type' => '',
                            'iteration' => 1,
                            'duration' => '0.5s',
                            'delay' => '0.1s',
                            'count' => 1,
                            'offset' => 5,
                            'no_repeat' => false
                        ],
                        'bg' => [
                            'r' => 255,
                            'g' => 255,
                            'b' => 255,
                            'a' => 0
                        ],
                        'bg_image' => new stdClass(),
                        'forms' => []
                    ]
                ]
            ]
        ];

        $this->update_site($site_id);
        $dbForm = $builder->getForm();
        $dbForm['builder'] = array_merge_recursive($dbForm['builder'], $newArr);
        $builder->setForm($dbForm);
        $this->em->persist($builder);
        $this->em->flush();

        $this->responseJson->record = $newArr[0];
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function update_group_position(): object
    {
        if (!$this->security->isGranted('MANAGE_BUILDER_SITES', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }

        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $site_id = filter_var($this->data->get('site_id'), FILTER_VALIDATE_INT);
        $elements = filter_var($this->data->get('elements'), FILTER_UNSAFE_RAW);
        if (!$id || !$elements) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $builder = $this->em->getRepository(FormBuilder::class)->find($id);
        if (!$builder) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $elements = json_decode($elements, true);
        $groupData = [];
        foreach ($elements as $element) {
            $search = $this->search_group_element($builder->getForm(), $element);
            if ($search) {
                $groupData[] = $search;
            }
        }
        $formBuilder = $builder->getForm();
        $formBuilder['builder'] = $groupData;
        $builder->setForm($formBuilder);
        $this->em->persist($builder);
        $this->em->flush();
        $this->update_site($site_id);
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function search_group_element($data, $elementId)
    {
        foreach ($data['builder'] as $tmp) {
            if ($tmp['id'] == $elementId) {
                return $tmp;
            }
        }
        return [];
    }

    private function split_col(): object
    {
        if (!$this->security->isGranted('MANAGE_BUILDER_SITES', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }

        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $site_id = filter_var($this->data->get('site_id'), FILTER_VALIDATE_INT);
        $colId = filter_var($this->data->get('colId'), FILTER_UNSAFE_RAW);
        $col = filter_var($this->data->get('col'), FILTER_VALIDATE_INT);
        $groupId = filter_var($this->data->get('groupId'), FILTER_UNSAFE_RAW);

        if (!$id || !$colId || !$col || !$groupId) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $addColCount = floor(($col / 2));
        $addContent = [
            'id' => uniqid(),
            'col' => $addColCount,
            'column_css' => '',
            'column_id' => '',
            'column_inner_css' => '',
            'zIndex' => '',
            'parallax_active' => false,
            'parallax_fixed' => false,
            'parallax_height' => '350px',
            'parallax_speed' => 1.2,
            'parallax_position_left' => '50%',
            'parallax_position_right' => '50%',
            'parallax_type' => 'scroll',
            'animation' => [
                'type' => '',
                'iteration' => 1,
                'duration' => '0.5s',
                'delay' => '0.1s',
                'count' => 1,
                'offset' => 5,
                'no_repeat' => false
            ],
            'bg' => [
                'r' => 255,
                'g' => 255,
                'b' => 255,
                'a' => 0
            ],
            'bg_image' => new stdClass(),
            'forms' => []
        ];

        $split = $col - $addColCount;


        $builder = $this->em->getRepository(FormBuilder::class)->find($id);
        if (!$builder) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $gridAddData = [];
        $formBuilder = $builder->getForm();
        $splitCount = 0;
        $addCount = 0;
        $countGridCol = 0;
        foreach ($formBuilder['builder'] as $tmp) {
            $gridArr = [];
            if ($tmp['id'] == $groupId) {
                foreach ($tmp['grid'] as $grid) {
                    if ($grid['id'] == $colId) {
                        $countGridCol = $grid['col'];
                        $grid['col'] = $split;
                    }
                    $gridArr[] = $grid;
                }
                $addGrid = array_merge_recursive($gridArr, [$addContent]);
                $tmp['grid'] = $addGrid;
            }
            $gridAddData[] = $tmp;
        }
        $gutter = 12 - $countGridCol + $countGridCol;
        if ($gutter != 12) {
            $this->responseJson->msg = $this->translator->trans('builder.An error has occurred.') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $formBuilder['builder'] = $gridAddData;
        $builder->setForm($formBuilder);
        $this->em->persist($builder);
        $this->em->flush();
        $this->update_site($site_id);
        $this->responseJson->group_id = $groupId;
        $this->responseJson->col_id = $colId;
        $this->responseJson->split = $split;
        $this->responseJson->record = $addContent;
        $this->responseJson->addCol = $addColCount;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function remove_col(): object
    {
        if (!$this->security->isGranted('MANAGE_BUILDER_SITES', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $site_id = filter_var($this->data->get('site_id'), FILTER_VALIDATE_INT);
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $col = filter_var($this->data->get('col'), FILTER_UNSAFE_RAW);
        $group_id = filter_var($this->data->get('group_id'), FILTER_UNSAFE_RAW);
        $grid_id = filter_var($this->data->get('grid_id'), FILTER_UNSAFE_RAW);
        $grid = filter_var($this->data->get('grid'), FILTER_UNSAFE_RAW);
        if (!$grid || !$col || !$grid_id || !$group_id || !$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $grid = json_decode($grid, true);
        $newCols = $grid['grid'][$col - 1]['col'] + $grid['grid'][$col]['col'];
        $copyForms = $grid['grid'][$col]['forms'];

        unset($grid['grid'][$col]);
        $grid['grid'] = array_filter(array_merge_recursive($grid['grid']));
        $forms = array_merge_recursive($grid['grid'][$col - 1]['forms'], $copyForms);

        $grid['grid'][$col - 1]['forms'] = $forms;
        $grid['grid'][$col - 1]['col'] = $newCols;

        $builder = $this->em->getRepository(FormBuilder::class)->find($id);
        if (!$builder) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $formBuilder = $builder->getForm();
        $newData = [];
        foreach ($formBuilder['builder'] as $tmp) {
            if ($tmp['id'] == $group_id) {
                $tmp['grid'] = $grid['grid'];
            }
            $newData[] = $tmp;
        }

        $formBuilder['builder'] = $newData;
        $builder->setForm($formBuilder);
        $this->em->persist($builder);
        $this->em->flush();
        $this->update_site($site_id);
        $this->responseJson->status = true;
        $this->responseJson->record = $grid;
        return $this->responseJson;
    }

    private function update_grid_position(): object
    {
        if (!$this->security->isGranted('MANAGE_BUILDER_SITES', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }

        $site_id = filter_var($this->data->get('site_id'), FILTER_VALIDATE_INT);
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $group = filter_var($this->data->get('group'), FILTER_UNSAFE_RAW);
        $elements = filter_var($this->data->get('elements'), FILTER_UNSAFE_RAW);

        if (!$id || !$group || !$elements) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $builder = $this->em->getRepository(FormBuilder::class)->find($id);
        if (!$builder) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $formBuilder = $builder->getForm();
        $elements = json_decode($elements, true);
        $gridArr = [];
        foreach ($elements as $element) {
            $search = $this->search_grid_element($formBuilder, $element);
            if ($search) {
                $gridArr[] = $search;
            }
        }
        $newData = [];
        foreach ($formBuilder['builder'] as $tmp) {
            if ($tmp['id'] == $group) {
                $tmp['grid'] = $gridArr;
            }
            $newData[] = $tmp;
        }
        $formBuilder['builder'] = $newData;
        $builder->setForm($formBuilder);
        $this->em->persist($builder);

        $this->em->flush();
        $this->update_site($site_id);
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function update_form_position(): object
    {
        if (!$this->security->isGranted('MANAGE_BUILDER_SITES', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }

        $site_id = filter_var($this->data->get('site_id'), FILTER_VALIDATE_INT);
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $to_group = filter_var($this->data->get('to_group'), FILTER_UNSAFE_RAW);
        $to_grid = filter_var($this->data->get('to_grid'), FILTER_UNSAFE_RAW);
        $elements = filter_var($this->data->get('elements'), FILTER_UNSAFE_RAW);
        if (!$id || !$to_group || !$to_grid || !$elements) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $builder = $this->em->getRepository(FormBuilder::class)->find($id);
        if (!$builder) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $formBuilder = $builder->getForm();
        $elements = json_decode($elements, true);
        $formArr = [];
        $final = [];
        foreach ($elements as $element) {
            $search = $this->search_form_item($formBuilder, $element);
            if ($search) {
                $formArr[] = $search;
            }
        }
        $gf = [];
        foreach ($formBuilder['builder'] as $tmp) {
            if ($tmp['id'] == $to_group) {
                foreach ($tmp['grid'] as $grid) {
                    if ($grid['id'] == $to_grid) {
                        $grid['forms'] = $formArr;
                    }
                    $gf[] = $grid;
                }
                $tmp['grid'] = $gf;
            }
            $final[] = $tmp;
        }
        $formBuilder['builder'] = $final;
        $builder->setForm($formBuilder);
        $this->em->persist($builder);
        $this->em->flush();
        $this->update_site($site_id);
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function update_grid_form(): object
    {
        if (!$this->security->isGranted('MANAGE_BUILDER_SITES', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }

        $site_id = filter_var($this->data->get('site_id'), FILTER_VALIDATE_INT);
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $from_group = filter_var($this->data->get('from_group'), FILTER_UNSAFE_RAW);
        $from_grid = filter_var($this->data->get('from_grid'), FILTER_UNSAFE_RAW);
        $to_group = filter_var($this->data->get('to_group'), FILTER_UNSAFE_RAW);
        $to_grid = filter_var($this->data->get('to_grid'), FILTER_UNSAFE_RAW);
        $elements = filter_var($this->data->get('elements'), FILTER_UNSAFE_RAW);
        if (!$id || !$to_group || !$to_grid || !$elements || !$from_group || !$from_grid) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $builder = $this->em->getRepository(FormBuilder::class)->find($id);
        if (!$builder) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $formBuilder = $builder->getForm();
        $elements = json_decode($elements, true);
        $newData = [];
        $d = [];
        $fd = [];
        foreach ($formBuilder['builder'] as $tmp) {
            if ($tmp['id'] == $from_group) {
                foreach ($tmp['grid'] as $grid) {
                    if ($grid['id'] == $from_grid) {
                        foreach ($grid['forms'] as $form) {
                            if (in_array($form['id'], $elements)) {
                                continue;
                            }
                            $fd[] = $form;
                        }
                        $grid['forms'] = $fd;
                    }
                    $d[] = $grid;
                }
                $tmp['grid'] = $d;
                $newData = $tmp;
            }
        }
        $newBuilder = [];
        foreach ($formBuilder['builder'] as $tmp) {
            if ($tmp['id'] == $from_group) {
                $tmp['grid'] = $newData['grid'];
            }
            $newBuilder[] = $tmp;
        }
        $formArr = [];
        $final = [];
        foreach ($elements as $element) {
            $search = $this->search_form_item($formBuilder, $element);
            if ($search) {
                $formArr[] = $search;
            }
        }
        $gf = [];
        foreach ($newBuilder as $tmp) {
            if ($tmp['id'] == $to_group) {
                foreach ($tmp['grid'] as $grid) {
                    if ($grid['id'] == $to_grid) {
                        $grid['forms'] = $formArr;
                    }
                    $gf[] = $grid;
                }
                $tmp['grid'] = $gf;
            }
            $final[] = $tmp;
        }
        $formBuilder['builder'] = $final;
        $builder->setForm($formBuilder);
        $this->em->persist($builder);
        $this->em->flush();
        $this->update_site($site_id);
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function delete_group(): object
    {
        if (!$this->security->isGranted('MANAGE_BUILDER_SITES', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $site_id = filter_var($this->data->get('site_id'), FILTER_VALIDATE_INT);
        $group_id = filter_var($this->data->get('group_id'), FILTER_UNSAFE_RAW);
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$id || !$group_id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $builder = $this->em->getRepository(FormBuilder::class)->find($id);
        if (!$builder) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $formBuilder = $builder->getForm();
        $groupArr = [];
        foreach ($formBuilder['builder'] as $tmp) {
            if ($tmp['id'] == $group_id) {
                continue;
            }
            $groupArr[] = $tmp;
        }
        if (!$groupArr) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $formBuilder['builder'] = $groupArr;
        $builder->setForm($formBuilder);
        $this->em->persist($builder);
        $this->em->flush();
        $this->update_site($site_id);
        $this->responseJson->group_id = $group_id;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function search_form_item($data, $elementId)
    {
        foreach ($data['builder'] as $tmp) {
            foreach ($tmp['grid'] as $grid) {
                foreach ($grid['forms'] as $form) {
                    if ($form['id'] == $elementId) {
                        return $form;
                    }
                }
            }
        }
        return [];
    }

    private function search_grid_element($data, $elementId)
    {
        foreach ($data['builder'] as $tmp) {
            foreach ($tmp['grid'] as $grid) {
                if ($grid['id'] == $elementId) {
                    return $grid;
                }
            }
        }

        return [];
    }

    private function get_form_builder(): object
    {

        if (!$this->security->isGranted('MANAGE_BUILDER_SITES', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }

        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);

        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $builder = $this->em->getRepository(FormBuilder::class)->find($id);
        if (!$builder) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $newData = [];


        $formBuilder = $builder->getForm();

        foreach ($formBuilder['builder'] as $tmp) {
            $g = [];
            foreach ($tmp['grid'] as $grid) {
                $f = [];
                foreach ($grid['forms'] as $form) {
                    $imgArr = [];
                    if ($form['type'] == 'medien-carousel') {
                        $carouselId = $form['config']['carousel'];
                        if ($carouselId) {
                            $carousel = $this->em->getRepository(MediaSlider::class)->find($carouselId);
                            if ($carousel) {
                                $slider = $carousel->getSlider();
                                foreach ($slider['slider'] as $slide) {
                                    if ($slide['active']) {
                                        $imgArr[] = $slide['image'];
                                    }
                                }
                            }
                        }
                        $form['images'] = $imgArr;
                    }
                    if ($form['type'] == 'custom-fields') {
                        $upd = $this->update_custom_fields($form['config']['fields']);
                        $form['config']['fields'] = $upd;
                    }
                    $f[] = $form;
                }
                $grid['forms'] = $f;
                $g[] = $grid;
            }
            $tmp['grid'] = $g;
            $newData[] = $tmp;
        }
        $newArr = [];
        foreach ($newData as $tmp) {
            $section = $this->em->getRepository(PluginSections::class)->findOneBy(['elementId' => $tmp['id']]);
            if ($section) {
                $tmp = $section->getPlugin();
            }
            $newArr[] = $tmp;
        }
        $helper = Helper::instance();

        $selects = [
            'bg_position' => $this->select_bg_position(),
            'bg_style' => $this->select_bg_style(),
            'animation' => $helper->get_animate_option(),
            'alignItems' => $this->select_align_item(),
            'selectBorder' => $this->select_border_style(),
            'selectParallaxType' => $this->select_parallax_type()
        ];
        $formBuilder['builder'] = $newArr;
        if (!isset($formBuilder['type'])) {
            $formBuilder['type'] = $builder->getType();
        }

        $this->responseJson->selects = $selects;
        $this->responseJson->builder = $formBuilder;
        $this->responseJson->builder_id = $builder->getFormId();
        $this->responseJson->status = true;

        return $this->responseJson;
    }

    private function update_custom_fields($fields): array
    {
        $fieldIds = [];
        foreach ($fields as $tmp) {
            $fieldIds[] = $tmp['id'];
        }
        $updArr = [];
        $custom = $this->em->getRepository(MediaSlider::class)->findOneBy(['type' => 'custom_fields']);
        if ($custom) {
            foreach ($custom->getSlider() as $tmp) {
                if (in_array($tmp['id'], $fieldIds)) {
                    $updArr[] = $tmp;
                }
            }
        }
        return $updArr;
    }

    /**
     * @throws Exception
     * @throws FilesystemException
     */
    private function import_page_builder(): object
    {
        if (!$this->security->isGranted('MANAGE_SITE_BUILDER', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
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
            $this->uploaderHelper->deleteFile($upload, $this->uploaderHelper::BUILDER, true);
            $builder = $this->em->getRepository(FormBuilder::class)->findOneBy(['formId' => $data['id']]);
            if ($builder) {
                $this->responseJson->msg = $this->translator->trans('builder.This form builder is already available.') . ' (Ajx-SE ' . __LINE__ . ')';
                return $this->responseJson;
            }
            if (!isset($data['builder_version'])) {
                $this->responseJson->msg = $this->translator->trans('builder.The form builder is faulty.') . ' (Ajx-SE ' . __LINE__ . ')';
                return $this->responseJson;
            }
            if (!isset($data['app_version'])) {
                $this->responseJson->msg = $this->translator->trans('builder.The form builder is faulty.') . ' (Ajx-SE ' . __LINE__ . ')';
                return $this->responseJson;
            }
            if (!isset($data['designation'])) {
                $this->responseJson->msg = $this->translator->trans('builder.The form builder is faulty.') . ' (Ajx-SE ' . __LINE__ . ')';
                return $this->responseJson;
            }
            if (!isset($data['builder'])) {
                $this->responseJson->msg = $this->translator->trans('builder.The form builder is faulty.') . ' (Ajx-SE ' . __LINE__ . ')';
                return $this->responseJson;
            }
            if (!isset($data['settings'])) {
                $this->responseJson->msg = $this->translator->trans('builder.The form builder is faulty.') . ' (Ajx-SE ' . __LINE__ . ')';
                return $this->responseJson;
            }
            if (!isset($data['conditions'])) {
                $this->responseJson->msg = $this->translator->trans('builder.The form builder is faulty.') . ' (Ajx-SE ' . __LINE__ . ')';
                return $this->responseJson;
            }
            if (!isset($data['type'])) {
                $this->responseJson->msg = $this->translator->trans('builder.The form builder is faulty.') . ' (Ajx-SE ' . __LINE__ . ')';
                return $this->responseJson;
            }
            if (!$data['builder_version'] == $this->formBuilderVersion) {
                $this->responseJson->msg = $this->translator->trans('builder.The Form Builder version is not compatible.') . ' (Ajx-SE ' . __LINE__ . ')';
                return $this->responseJson;
            }

            foreach ($data['builder'] as $tmp) {
                $id = $tmp['id'] ?? null;
                $grid = $tmp['grid'] ?? null;
                if (!$id || !$grid) {
                    $this->responseJson->msg = $this->translator->trans('builder.The form builder is faulty.') . ' (Ajx-SE ' . __LINE__ . ')';
                    return $this->responseJson;
                }
                if (!is_array($grid)) {
                    $this->responseJson->msg = $this->translator->trans('builder.The form builder is faulty.') . ' (Ajx-SE ' . __LINE__ . ')';
                    return $this->responseJson;
                }
                foreach ($grid as $g) {
                    $gId = $g['id'] ?? null;
                    $col = $g['col'] ?? null;

                    if (!$gId || !$col) {
                        $this->responseJson->msg = $this->translator->trans('builder.The form builder is faulty.') . ' (Ajx-SE ' . __LINE__ . ')';
                        return $this->responseJson;
                    }
                    if (!isset($g['forms']) || !is_array($g['forms'])) {
                        $this->responseJson->msg = $this->translator->trans('builder.The form builder is faulty.') . ' (Ajx-SE ' . __LINE__ . ')';
                        return $this->responseJson;
                    }
                }
            }

            $builder = new FormBuilder();
            $builder->setFormId($data['id']);
            $builder->setType($data['type']);
            $builder->setForm($data);
            $this->em->persist($builder);
            $this->em->flush();
            $this->responseJson->status = true;
            $this->responseJson->title = $this->translator->trans('builder.Form builder imported');
            $this->responseJson->msg = $this->translator->trans('builder.The form builder has been saved successfully.');
        }
        return $this->responseJson;
    }

    private function update_builder_title(): object
    {
        if (!$this->security->isGranted('MANAGE_BUILDER_SITES', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }

        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $designation = filter_var($this->data->get('designation'), FILTER_UNSAFE_RAW);
        if (!$id || !$designation) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $builder = $this->em->getRepository(FormBuilder::class)->find($id);
        if (!$builder) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $form = $builder->getForm();
        $form['designation'] = $designation;
        $builder->setForm($form);
        $this->em->persist($builder);
        $this->em->flush();
        $this->responseJson->status = true;
        $this->responseJson->msg = $this->translator->trans('The changes have been saved successfully.');
        return $this->responseJson;
    }

    private function duplicate_builder(): object
    {
        if (!$this->security->isGranted('MANAGE_BUILDER_SITES', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }

        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $builder = $this->em->getRepository(FormBuilder::class)->find($id);
        if (!$builder) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $fbId = 'FB' . uniqid();
        $form = $builder->getForm();
        $form['id'] = $fbId;
        $form['designation'] = $form['designation'] . ' - copy';
        $newBuilder = new FormBuilder();
        $newBuilder->setForm($form);
        $newBuilder->setFormId($fbId);
        $newBuilder->setType($builder->getType());
        $this->em->persist($newBuilder);
        $this->em->flush();
        $this->responseJson->status = true;
        $this->responseJson->msg = $this->translator->trans('builder.Page-Builder was successfully copied!');
        return $this->responseJson;
    }

    private function delete_form_builder(): object
    {
        if (!$this->security->isGranted('MANAGE_BUILDER_SITES', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }

        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $builder = $this->em->getRepository(FormBuilder::class)->find($id);
        if (!$builder) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $sites = $this->em->getRepository(AppSites::class)->findBy(['formBuilder' => $builder->getId()]);
        if ($sites) {
            foreach ($sites as $tmp) {
                $tmp->setFormBuilder(0);
                $this->em->persist($tmp);
                $this->em->flush();
                //$this->em->remove($tmp);
                //$this->em->flush();
            }
        }
        $this->em->remove($builder);
        $this->em->flush();
        $this->responseJson->status = true;
        $this->responseJson->title = $this->translator->trans('swal.Form builder deleted');
        $this->responseJson->msg = $this->translator->trans('swal.Form builder successfully deleted and all pages updated.');
        return $this->responseJson;
    }

    private function update_settings(): object
    {
        if (!$this->security->isGranted('MANAGE_BUILDER_SITES', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $settings = filter_var($this->data->get('settings'), FILTER_UNSAFE_RAW);
        $site_id = filter_var($this->data->get('site_id'), FILTER_VALIDATE_INT);
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$id || !$settings) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $builder = $this->em->getRepository(FormBuilder::class)->find($id);
        if (!$builder) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $settings = json_decode($settings, true);
        $formBuilder = $builder->getForm();
        $formBuilder['settings'] = $settings;
        $builder->setForm($formBuilder);
        $this->em->persist($builder);
        $this->em->flush();
        $this->update_site($site_id);
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function delete_plugin(): object
    {
        if (!$this->security->isGranted('MANAGE_BUILDER_PLUGINS', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $site_id = filter_var($this->data->get('site_id'), FILTER_VALIDATE_INT);
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $grid = filter_var($this->data->get('grid'), FILTER_UNSAFE_RAW);
        $group = filter_var($this->data->get('group'), FILTER_UNSAFE_RAW);
        $input = filter_var($this->data->get('input'), FILTER_UNSAFE_RAW);
        if (!$id || !$grid || !$group || !$input) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $builder = $this->em->getRepository(FormBuilder::class)->find($id);
        if (!$builder) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $formBuilder = $builder->getForm();
        $newData = [];
        $d = [];
        $fd = [];

        foreach ($formBuilder['builder'] as $tmp) {
            if ($tmp['id'] == $group) {
                foreach ($tmp['grid'] as $gridData) {
                    if ($gridData['id'] == $grid) {
                        foreach ($gridData['forms'] as $form) {
                            if ($form['id'] == $input) {
                                continue;
                            }
                            $fd[] = $form;
                        }
                        $gridData['forms'] = $fd;
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
        $this->update_site($site_id);
        $this->responseJson->grid = $grid;
        $this->responseJson->group = $group;
        $this->responseJson->input = $input;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function duplicate_plugin(): object
    {
        if (!$this->security->isGranted('MANAGE_BUILDER_PLUGINS', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $site_id = filter_var($this->data->get('site_id'), FILTER_VALIDATE_INT);
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $grid = filter_var($this->data->get('grid'), FILTER_UNSAFE_RAW);
        $group = filter_var($this->data->get('group'), FILTER_UNSAFE_RAW);
        $input = filter_var($this->data->get('input'), FILTER_UNSAFE_RAW);
        if (!$id || !$grid || !$group || !$input) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $builder = $this->em->getRepository(FormBuilder::class)->find($id);
        if (!$builder) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $formBuilder = $builder->getForm();
        $newData = [];
        $d = [];
        $fd = [];
        $sendForm = [];
        foreach ($formBuilder['builder'] as $tmp) {
            if ($tmp['id'] == $group) {
                foreach ($tmp['grid'] as $gridData) {
                    if ($gridData['id'] == $grid) {
                        $addForm = [];
                        foreach ($gridData['forms'] as $form) {
                            if ($form['id'] == $input) {
                                $add = $form;
                                $add['id'] = uniqid();
                                $add['config']['container_id'] = '';
                                $addForm[] = $add;
                                $sendForm = $add;
                            }
                            $fd[] = $form;
                        }
                        if ($addForm) {
                            $fd = array_merge_recursive($fd, $addForm);
                        }
                        $gridData['forms'] = $fd;
                    }
                    $d[] = $gridData;
                }
                $tmp['grid'] = $d;
                $this->update_saved_row($group, $tmp);
            }
            $newData[] = $tmp;
        }
        $formBuilder['builder'] = $newData;
        $builder->setForm($formBuilder);
        $this->em->persist($builder);
        $this->em->flush();
        $this->update_site($site_id);
        $this->responseJson->record = $sendForm;
        $this->responseJson->group = $group;
        $this->responseJson->grid = $grid;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function update_row_edit(): object
    {
        if (!$this->security->isGranted('MANAGE_BUILDER_PLUGINS', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $site_id = filter_var($this->data->get('site_id'), FILTER_VALIDATE_INT);
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);

        $group = filter_var($this->data->get('group'), FILTER_UNSAFE_RAW);
        $edit = filter_var($this->data->get('edit'), FILTER_UNSAFE_RAW);
        if (!$id || !$group || !$edit) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $builder = $this->em->getRepository(FormBuilder::class)->find($id);
        if (!$builder) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $edit = json_decode($edit, true);
        if (!$edit['container']) {
            $edit['container'] = 'container';
        }

        $formBuilder = $builder->getForm();
        $newData = [];
        $sendBuilder = [];
        foreach ($formBuilder['builder'] as $tmp) {
            if ($tmp['id'] == $group) {
                $tmp['container'] = $edit['container'];
                $tmp['row_css'] = $edit['row_css'];
                $tmp['row_id'] = $edit['row_id'];
                $tmp['innerContainer'] = $edit['innerContainer'];
                $tmp['cbg'] = $edit['cbg'];
                $tmp['icbg'] = $edit['icbg'];
                $tmp['bg_image'] = $edit['bg_image'];
                $tmp['zIndex'] = $edit['zIndex'];
                $tmp['innerZindex'] = $edit['innerZindex'];
                $tmp['bg_inner_image'] = $edit['bg_inner_image'];
                $tmp['parallax_container_active'] = $edit['parallax_container_active'];
                $tmp['parallax_container_fixed'] = $edit['parallax_container_fixed'];
                $tmp['parallax_container_height'] = $edit['parallax_container_height'];
                $tmp['parallax_container_speed'] = $edit['parallax_container_speed'];
                $tmp['parallax_container_position_left'] = $edit['parallax_container_position_left'];
                $tmp['parallax_container_position_right'] = $edit['parallax_container_position_right'];
                $tmp['parallax_container_type'] = $edit['parallax_container_type'];
                $tmp['parallax_inner_active'] = $edit['parallax_inner_active'];
                $tmp['parallax_inner_fixed'] = $edit['parallax_inner_fixed'];
                $tmp['parallax_inner_height'] = $edit['parallax_inner_height'];
                $tmp['parallax_inner_speed'] = $edit['parallax_inner_speed'];
                $tmp['parallax_inner_position_left'] = $edit['parallax_inner_position_left'];
                $tmp['parallax_inner_position_right'] = $edit['parallax_inner_position_right'];
                $tmp['parallax_inner_type'] = $edit['parallax_inner_type'];

                $this->update_saved_row($group, $tmp);
                $sendBuilder = $tmp;
            }
            $newData[] = $tmp;
        }
        if (!$newData) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $formBuilder['builder'] = $newData;
        $builder->setForm($formBuilder);
        $this->em->persist($builder);
        $this->em->flush();
        $this->update_site($site_id);
        $this->responseJson->status = true;
        $this->responseJson->group = $group;
        $this->responseJson->record = $sendBuilder;
        return $this->responseJson;
    }

    private function update_column_edit(): object
    {
        if (!$this->security->isGranted('MANAGE_BUILDER_PLUGINS', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $site_id = filter_var($this->data->get('site_id'), FILTER_VALIDATE_INT);
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $group = filter_var($this->data->get('group'), FILTER_UNSAFE_RAW);
        $gridId = filter_var($this->data->get('grid'), FILTER_UNSAFE_RAW);
        $edit = filter_var($this->data->get('edit'), FILTER_UNSAFE_RAW);
        if (!$id || !$group || !$gridId || !$edit) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $edit = json_decode($edit, true);

        $builder = $this->em->getRepository(FormBuilder::class)->find($id);
        if (!$builder) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-SE ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $formBuilder = $builder->getForm();
        $newData = [];
        $g = [];
        foreach ($formBuilder['builder'] as $tmp) {
            if ($tmp['id'] == $group) {
                $this->update_saved_row($group, $tmp);
                foreach ($tmp['grid'] as $grid) {

                    if ($grid['id'] == $gridId) {

                        $grid['column_id'] = $edit['column_id'];
                        $grid['column_css'] = $edit['column_css'];
                        $grid['column_inner_css'] = $edit['column_inner_css'];
                        $grid['bg'] = $edit['bg'];
                        $grid['bg_image'] = $edit['bg_image'];
                        $grid['zIndex'] = $edit['zIndex'];
                        $grid['animation'] = $edit['animation'];
                        $grid['parallax_active'] = $edit['parallax_active'];
                        $grid['parallax_fixed'] = $edit['parallax_fixed'];
                        $grid['parallax_height'] = $edit['parallax_height'];
                        $grid['parallax_speed'] = $edit['parallax_speed'];
                        $grid['parallax_position_left'] = $edit['parallax_position_left'];
                        $grid['parallax_position_right'] = $edit['parallax_position_right'];
                        $grid['parallax_type'] = $edit['parallax_type'];
                    }
                    $g[] = $grid;
                }
                $tmp['grid'] = $g;
            }
            $newData[] = $tmp;
        }
        $formBuilder['builder'] = $newData;
        $builder->setForm($formBuilder);
        $this->em->persist($builder);
        $this->em->flush();
        $this->update_site($site_id);
        $this->responseJson->status = true;
        $this->responseJson->grid = $gridId;
        $this->responseJson->group = $group;
        $this->responseJson->column_id = $edit['column_id'];
        $this->responseJson->column_css = $edit['column_css'];
        $this->responseJson->column_inner_css = $edit['column_inner_css'];

        $this->responseJson->bg = $edit['bg'];
        $this->responseJson->bg_image = $edit['bg_image'];
        $this->responseJson->zIndex = $edit['zIndex'];
        $this->responseJson->animation = $edit['animation'];
        $this->responseJson->record = $edit;
        return $this->responseJson;
    }

    private function add_row_save(): object
    {
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $group = filter_var($this->data->get('group'), FILTER_UNSAFE_RAW);
        $designation = filter_var($this->data->get('designation'), FILTER_UNSAFE_RAW);
        if (!$id || !$group || !$designation) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $isGroup = $this->em->getRepository(PluginSections::class)->findBy(['elementId' => $group]);
        if ($isGroup) {
            $this->responseJson->msg = $this->translator->trans('system.The section already exists.') . ' (Ajx-SE ' . __LINE__ . ')';

            return $this->responseJson;
        }
        $builder = $this->em->getRepository(FormBuilder::class)->find($id);
        if (!$builder) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $formBuilder = $builder->getForm();
        $grid = [];
        foreach ($formBuilder['builder'] as $tmp) {
            if ($tmp['id'] == $group) {
                $grid = $tmp;
                break;
            }
        }
        $grid['id'] = $group;
        $grid['elementId'] = $group;
        $grid['saved'] = true;
        $element = new PluginSections();
        $element->setType('row');
        $element->setHandle('section');
        $element->setDesignation($designation);
        $element->setElementId($group);
        $element->setPlugin($grid);
        $this->em->persist($element);
        $this->em->flush();
        $this->responseJson->status = true;
        $this->responseJson->msg = $this->translator->trans('system.Grid successfully saved.');
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

    private function get_saved_sections(): object
    {
        $id = filter_var($this->data->get('builder'), FILTER_VALIDATE_INT);
        $builder = $this->em->getRepository(FormBuilder::class)->find($id);
        if (!$builder) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $formBuilder = $builder->getForm();
        $groups = [];
        foreach ($formBuilder['builder'] as $builder) {
            $groups[] = $builder['id'];
        }

        $sections = $this->em->getRepository(PluginSections::class)->findBy(['handle' => 'section']);
        if (!$sections) {
            return $this->responseJson;
        }
        $record = [];
        foreach ($sections as $section) {
            if (in_array($section->getElementId(), $groups)) {
                continue;
            }
            $item = [
                'icon' => 'bi bi-grid-1x2',
                'id' => $section->getElementId(),
                'designation' => $section->getDesignation()
            ];
            $record[] = $item;
        }

        if ($record) {
            $this->responseJson->record = $record;
            $this->responseJson->status = true;
        }
        return $this->responseJson;
    }

    private function set_saved_section(): object
    {
        $id = filter_var($this->data->get('id'), FILTER_UNSAFE_RAW);
        $builderId = filter_var($this->data->get('builder'), FILTER_UNSAFE_RAW);
        if (!$id || !$builderId) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $section = $this->em->getRepository(PluginSections::class)->findOneBy(['elementId' => $id]);
        if (!$section) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $builder = $this->em->getRepository(FormBuilder::class)->find($builderId);
        if (!$builder) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $addBuilder = $builder->getForm();
        $addBuilder['builder'] = array_merge_recursive([$section->getPlugin()], $addBuilder['builder']);

        $builder->setForm($addBuilder);
        $this->em->persist($builder);
        $this->em->flush();
        $this->responseJson->record = $addBuilder['builder'];
        $this->responseJson->status = true;
        $this->responseJson->msg = $this->translator->trans('system.Section added');
        return $this->responseJson;
    }

    private function builder_table(): object
    {
        if (!$this->security->isGranted('MANAGE_SITE_BUILDER', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }

        $columns = array(
            '',
            'f.type',
            'f.createdAt',
            '',
            '',
            '',
            ''
        );

        $data_arr = array();
        $request = $this->data->request->all();
        $query = $this->em->createQueryBuilder()
            ->from(FormBuilder::class, 'f')
            ->select('f.type')
            ->distinct();
        $builder = $query->getQuery()->getArrayResult();

        $selectArr = [];
        foreach ($builder as $tmp) {
            $item = [
                'id' => $tmp['type'],
                'label' => ucfirst($tmp['type'])
            ];
            $selectArr[] = $item;
        }
        $this->responseJson->select_type = $selectArr;

        $reg = [];
        foreach ($request['columns'] as $key => $val) {
            if ($val['search']['regex'] == 'true') {
                if ($val['search']['value']) {
                    if ($columns[$key] == 'f.type') {
                        $regItem = [
                            'column' => $columns[$key],
                            'search' => $val['search']['value']
                        ];
                        $reg[] = $regItem;
                    }
                }
            }
        }


        $search = (string)$request['search']['value'];
        $query = $this->em->createQueryBuilder()
            ->from(FormBuilder::class, 'f')
            ->select('f');
        if (isset($request['search']['value'])) {
            $query->andWhere(
                'f.form LIKE :searchTerm OR
                 f.type LIKE :searchTerm OR
                 f.createdAt LIKE :searchTerm')
                ->setParameter('searchTerm', '%' . $search . '%');
        }

        if ($reg) {
            foreach ($reg as $tmp) {
                if ($tmp['column'] == 'f.type') {
                    $query
                        ->andWhere("REGEXP(" . $tmp['column'] . ", :regType) = 1")
                        ->setParameter('regType', $tmp['search']);
                }
            }
        }

        if (isset($request['order'])) {
            $query->orderBy($columns[$request['order']['0']['column']], $request['order']['0']['dir']);
        } else {
            $query->orderBy('f.createdAt', 'ASC');
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
            $download = $this->urlGenerator->generate('download_form_builder', ['formId' => $tmp['formId']]);
            $data_item = array();
            $data_item[] = $tmp['form']['designation'];
            $data_item[] = $tmp['type'];
            $data_item[] = '<span class="d-block lh-1">' . $tmp['createdAt']->format('d.m.Y') . '</span><small class="small-lg d-block mt-1">' . $tmp['createdAt']->format('H:i:s') . '</small>';
            $data_item[] = $tmp['id'];
            $data_item[] = $download;
            $data_item[] = $tmp['id'];
            $data_item[] = $tmp['id'];
            $data_arr[] = $data_item;
        }

        $countAll = $this->em->getRepository(FormBuilder::class)->count([]);
        $this->responseJson->draw = $request['draw'];
        $this->responseJson->recordsTotal = $countAll;
        if ($search || $reg) {
            $this->responseJson->recordsFiltered = count($table);
        } else {
            $this->responseJson->recordsFiltered = $countAll;
        }

        $this->responseJson->data = $data_arr;
        return $this->responseJson;

    }

    private function update_site($site_id): void
    {
        if ($site_id) {
            $site = $this->em->getRepository(AppSites::class)->find($site_id);
            if ($site) {
                $site->getSiteSeo()->setLastUpdate(new DateTimeImmutable());
                $this->em->persist($site);
                $this->em->flush();
            }
        }
    }
}
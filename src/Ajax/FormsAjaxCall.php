<?php

namespace App\Ajax;

use App\AppHelper\Helper;
use App\Entity\Account;
use App\Entity\AppSites;
use App\Entity\EmailsSent;
use App\Entity\Forms;
use App\Entity\SystemSettings;
use App\Service\UploaderHelper;
use App\Settings\FormularSettings;
use App\Settings\Settings;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Query\Parameter;
use Exception;
use Gedmo\Sluggable\Util\Urlizer;
use League\Flysystem\FilesystemException;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Uid\UuidV1;
use Symfony\Contracts\Translation\TranslatorInterface;

class FormsAjaxCall
{
    protected object $responseJson;
    protected Request $data;
    protected Account $account;
    use Settings;
    use FormularSettings;

    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly TranslatorInterface    $translator,
        private readonly Security               $security,
        private readonly TokenStorageInterface  $tokenStorage,
        private readonly UrlGeneratorInterface  $urlGenerator,
        private readonly UploaderHelper         $uploaderHelper,
        private readonly string                 $baseUrl,
        private readonly string                 $uploadsPath,
    )
    {
    }

    /**
     * @throws Exception
     */
    public function ajaxFormsHandle(Request $request)
    {
        $this->data = $request;
        $this->responseJson = (object)['status' => false, 'msg' => date('H:i:s'), 'type' => $request->get('method')];
        if (!method_exists($this, $request->get('method'))) {
            throw new Exception("Method not found!#Not Found");
        }
        $this->account = $this->em->getRepository(Account::class)->findOneBy(['accountHolder' => $this->tokenStorage->getToken()->getUser()]);
        if (!$this->security->isGranted('MANAGE_FORMS', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        return call_user_func_array(self::class . '::' . $request->get('method'), []);
    }

    private function builder_handle(): object
    {
        if (!$this->security->isGranted('ADD_FORMS', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }
        $id = filter_var($this->data->get('id'), FILTER_UNSAFE_RAW);
        $designation = filter_var($this->data->get('designation'), FILTER_UNSAFE_RAW);
        if (!$designation) {
            $designation = $this->translator->trans('forms.Form') . '-' . uniqid();
        }
        if ($id) {
            $this->responseJson->handle = 'update';
            $form = $this->em->getRepository(Forms::class)->find($id);
            if (!$form) {
                $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
                return $this->responseJson;
            }
            $upd = $form->getForm();
            $upd['name'] = $designation;
            $form->setForm($upd);
            $this->responseJson->msg = $this->translator->trans('The changes have been saved successfully.');
        } else {
            $this->responseJson->handle = 'insert';
            $appSettings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
            $app = $appSettings->getApp();
            $defSubject = sprintf($this->translator->trans('forms.Message from %s'), $app['site_name']);
            $url = '<a target="_blank" href="' . $this->baseUrl . '">' . $this->baseUrl . '</a>';
            $defMessage = sprintf($this->translator->trans('forms.This message was sent from the %s contact form.'), $url);
            $fbId = 'FB' . uniqid();
            $form = [
                '0' => [
                    'id' => uniqid(),
                    'page' => 1,
                    'grid' => [
                        '0' => [
                            'id' => uniqid(),
                            'col' => 12,
                            'forms' => []
                        ]
                    ]
                ]
            ];

            $settings = [
                'col' => 'lg',
                'gutter' => 'g-3',
                'individuell' => ''
            ];
            $sendMail = [
                'email' => [
                    'recipient' => $app['admin_email'],
                    'subject' => $defSubject,
                    'cc' => '',
                    'bcc' => '',
                    'message' => $defMessage
                ],
                'responder' => [
                    'subject' => $defSubject,
                    'active' => false,
                    'message' => $defMessage
                ],
            ];
            $builderForm = [
                'id' => $fbId,
                'bu_version' => $this->version,
                'app_version' => $app['version'],
                'name' => $designation,
                'builder' => $form,
                'type' => 'builder',
                'send_email' => $sendMail,
                'settings' => $settings,
                'message' => [
                    'email_sent' => [
                        '0' => [
                            'id' => 1,
                            'label' => $this->translator->trans('forms.The sender s message was sent successfully'),
                            'value' => $this->translator->trans('forms.The message was sent successfully.'),
                        ],
                        '1' => [
                            'id' => 2,
                            'label' => $this->translator->trans('forms.The sender s message could not be sent'),
                            'value' => $this->translator->trans('forms.An error occurred while trying to send your message. Please try again later.'),
                        ],
                        '2' => [
                            'id' => 3,
                            'label' => $this->translator->trans('forms.Error filling out the form'),
                            'value' => $this->translator->trans('forms.One or more fields have an error. Please check and try again.'),
                        ],
                        '3' => [
                            'id' => 4,
                            'label' => $this->translator->trans('forms.Input was recognised as spam'),
                            'value' => $this->translator->trans('forms.An error occurred while trying to send your message. Please try again later.'),
                        ],
                        '4' => [
                            'id' => 5,
                            'label' => $this->translator->trans('forms.Form is being sent'),
                            'value' => $this->translator->trans('forms.Form is being sent'),
                        ],
                        '5' => [
                            'id' => 6,
                            'label' => $this->translator->trans('forms.Heading Error message'),
                            'value' => $this->translator->trans('forms.Form could not be sent!'),
                        ],
                    ]
                ],
                'conditions' => []
            ];
            $form = new Forms();
            $form->setFormId($fbId);
            $form->setForm($builderForm);
            $this->responseJson->title = $this->translator->trans('forms.Form created');
            $this->responseJson->msg = $this->translator->trans('forms.Form has been successfully created');
        }

        $form->setDesignation($designation);
        $this->em->persist($form);
        $this->em->flush();
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function get_build_form(): object
    {
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $page = filter_var($this->data->get('page'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $getForm = $this->em->getRepository(Forms::class)->find($id);
        if (!$getForm) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $formData = $getForm->getForm();

        if (!$page) {
            $page = 1;
        }

        $builder = [];
        $pages = [];
        $conditions = [];
        $sites = [];

        $appSites = $this->em->getRepository(AppSites::class)->findBy(['siteType' => 'page', 'siteStatus' => 'publish']);
        foreach ($appSites as $tmp) {
            //urlGenerator
            $url = '';
            if ($tmp->getRouteName()) {
                $url = $this->urlGenerator->generate($tmp->getRouteName());
            }
            if ($tmp->getSiteSlug()) {
                $url = $this->urlGenerator->generate('app_public_slug', ['slug' => $tmp->getSiteSlug()]);
            }
            $item = [
                'id' => $tmp->getId(),
                'label' => $tmp->getSiteSeo()->getSeoTitle(),
                'url' => $url
            ];
            $sites[] = $item;
        }

        foreach ($formData['conditions'] as $tmp) {
            $item = [
                'id' => $tmp['id'],
                'label' => $tmp['name']
            ];
            $conditions[] = $item;
        }

        foreach ($formData['builder'] as $tmp) {
            $pages[] = $tmp['page'];
            if ($tmp['page'] == $page) {
                $builder[] = $tmp;
            }
        }
        $pages = array_merge(array_unique(array_filter($pages)));

        $settings = $formData['settings'] ?? null;
        if (!$settings) {
            $settings = [
                'col' => 'lg',
                'gutter' => 'g-3',
                'individuell' => ''
            ];
            $formData['settings'] = $settings;
        }
        unset($formData['send_email']);
        $formData['builder'] = $builder;
        $selects = $this->form_selects();
        $selects['pages'] = $sites;
        $this->responseJson->selects = $selects;
        $this->responseJson->form_id = $getForm->getId();
        $this->responseJson->page = $page;
        $this->responseJson->pages = $pages;
        $this->responseJson->record = $formData;
        $this->responseJson->conditions = $conditions;
        $this->responseJson->status = true;

        return $this->responseJson;
    }

    private function delete_form_builder(): object
    {
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $form = $this->em->getRepository(Forms::class)->find($id);
        if (!$form) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $this->em->remove($form);
        $this->em->flush();
        $this->responseJson->status = true;
        $this->responseJson->msg = $this->translator->trans('swal.Form builder deleted');
        $this->responseJson->title = $this->translator->trans('forms.Form successfully deleted.');
        return $this->responseJson;
    }

    private function update_builder_group_position(): object
    {
        $form_id = filter_var($this->data->get('form_id'), FILTER_VALIDATE_INT);
        $page = filter_var($this->data->get('page'), FILTER_VALIDATE_INT);
        $elements = filter_var($this->data->get('elements'), FILTER_UNSAFE_RAW);
        if (!$form_id || !$elements || !$page) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $forms = $this->em->getRepository(Forms::class)->find($form_id);
        if (!$forms) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = $forms->getForm();
        $elements = explode(',', $elements);
        $groupData = [];
        foreach ($elements as $element) {
            $search = $this->search_group_element($data, $element);
            if ($search) {
                $groupData[] = $search;
            }
        }
        $otherPage = [];
        foreach ($data['builder'] as $tmp) {
            if ($tmp['page'] == $page) {
                continue;
            }
            $otherPage[] = $tmp;
        }
        if (!$groupData) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $helper = Helper::instance();
        if ($otherPage) {
            $groupData = array_merge_recursive($groupData, $otherPage);
            $groupData = $helper->order_by_args($groupData, 'page', 2);
        }

        $data['builder'] = $groupData;
        $forms->setForm($data);
        $this->em->persist($forms);
        $this->em->flush();
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function delete_builder_group(): object
    {
        $form_id = filter_var($this->data->get('form_id'), FILTER_UNSAFE_RAW);
        $group_id = filter_var($this->data->get('group_id'), FILTER_UNSAFE_RAW);
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$form_id || !$group_id || !$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $forms = $this->em->getRepository(Forms::class)->find($id);
        if (!$forms) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = $forms->getForm();
        if (!$data) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $groupArr = [];
        foreach ($data['builder'] as $tmp) {
            if ($tmp['id'] == $group_id) {
                continue;
            }
            $groupArr[] = $tmp;
        }
        $data['builder'] = $groupArr;
        $forms->setForm($data);
        $this->em->persist($forms);
        $this->em->flush();

        $this->responseJson->title = $this->translator->trans('Changes saved');
        $this->responseJson->msg = $this->translator->trans('The changes have been saved successfully.');
        $this->responseJson->group = $group_id;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function update_builder_grid_position(): object
    {
        $form_id = filter_var($this->data->get('form_id'), FILTER_VALIDATE_INT);
        $group = filter_var($this->data->get('group'), FILTER_UNSAFE_RAW);
        $elements = filter_var($this->data->get('elements'), FILTER_UNSAFE_RAW);
        if (!$form_id || !$elements || !$group) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $forms = $this->em->getRepository(Forms::class)->find($form_id);
        if (!$forms) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = $forms->getForm();
        $elements = explode(',', $elements);
        $gridArr = [];
        foreach ($elements as $element) {
            $search = $this->search_grid_element($data, $element);
            if ($search) {
                $gridArr[] = $search;
            }
        }

        $newData = [];
        foreach ($data['builder'] as $tmp) {
            if ($tmp['id'] == $group) {
                $tmp['grid'] = $gridArr;
            }
            $newData[] = $tmp;
        }

        $data['builder'] = $newData;
        $forms->setForm($data);
        $this->responseJson->status = true;

        return $this->responseJson;
    }

    private function remove_builder_col(): object
    {
        $grid = filter_var($this->data->get('grid'), FILTER_UNSAFE_RAW);
        $col = filter_var($this->data->get('col'), FILTER_UNSAFE_RAW);
        $group_id = filter_var($this->data->get('group_id'), FILTER_UNSAFE_RAW);
        $grid_id = filter_var($this->data->get('grid_id'), FILTER_UNSAFE_RAW);
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$grid || !$col || !$grid_id || !$group_id || !$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $grid = json_decode($grid, true);
        $newCols = $grid['grid'][$col - 1]['col'] + $grid['grid'][$col]['col'];
        $copyForms = $grid['grid'][$col]['forms'];
        $delGridId = $grid['grid'][$col]['id'];

        unset($grid['grid'][$col]);
        $grid['grid'] = array_filter(array_merge_recursive($grid['grid']));
        $forms = array_merge_recursive($grid['grid'][$col - 1]['forms'], $copyForms);

        $grid['grid'][$col - 1]['forms'] = $forms;
        $grid['grid'][$col - 1]['col'] = $newCols;

        $forms = $this->em->getRepository(Forms::class)->find($id);
        if (!$forms) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = $forms->getForm();

        $newData = [];

        foreach ($data['builder'] as $tmp) {
            if ($tmp['id'] == $group_id) {
                $tmp['grid'] = $grid['grid'];
            }
            $newData[] = $tmp;
        }
        $data['builder'] = $newData;
        $this->em->persist($forms);
        $this->em->flush();
        $this->responseJson->status = true;
        $this->responseJson->record = $grid;
        return $this->responseJson;
    }

    private function builder_splitt_col(): object
    {
        $colId = filter_var($this->data->get('colId'), FILTER_UNSAFE_RAW);
        $col = filter_var($this->data->get('col'), FILTER_UNSAFE_RAW);
        $groupId = filter_var($this->data->get('groupId'), FILTER_UNSAFE_RAW);
        $form_id = filter_var($this->data->get('form_id'), FILTER_VALIDATE_INT);
        if (!$colId || !$col || !$groupId || !$form_id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $addColCount = floor(($col / 2));
        $addContent = [
            'id' => uniqid(),
            'col' => $addColCount,
            'forms' => []
        ];
        $splitt = $col - $addColCount;

        $forms = $this->em->getRepository(Forms::class)->find($form_id);
        if (!$forms) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $data = $forms->getForm();

        $gridAddData = [];
        foreach ($data['builder'] as $tmp) {
            $gridArr = [];
            if ($tmp['id'] == $groupId) {
                foreach ($tmp['grid'] as $grid) {
                    if ($grid['id'] == $colId) {
                        $grid['col'] = $splitt;
                    }
                    $gridArr[] = $grid;
                }
                $addGrid = array_merge_recursive($gridArr, [$addContent]);
                $tmp['grid'] = $addGrid;
            }
            $gridAddData[] = $tmp;
        }

        $data['builder'] = $gridAddData;
        $forms->setForm($data);
        $this->em->persist($forms);
        $this->em->flush();
        $this->responseJson->group_id = $groupId;
        $this->responseJson->col_id = $colId;
        $this->responseJson->splitt = $splitt;
        $this->responseJson->record = $addContent;
        $this->responseJson->addCol = $addColCount;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function get_form_fields(): object
    {
        $handle = filter_var($this->data->get('handle'), FILTER_UNSAFE_RAW);
        $this->responseJson->grid = filter_var($this->data->get('grid'), FILTER_UNSAFE_RAW);
        $this->responseJson->group = filter_var($this->data->get('group'), FILTER_UNSAFE_RAW);
        if (!$handle) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        if ($handle == 'modal') {
            $this->responseJson->record = $this->form_types();
            $this->responseJson->status = true;
        }
        return $this->responseJson;
    }

    private function get_new_form_field(): object
    {
        return $this->responseJson;
    }

    private function update_builder_form_position(): object
    {
        $form_id = filter_var($this->data->get('form_id'), FILTER_VALIDATE_INT);
        $to_group = filter_var($this->data->get('to_group'), FILTER_UNSAFE_RAW);
        $to_grid = filter_var($this->data->get('to_grid'), FILTER_UNSAFE_RAW);
        $elements = filter_var($this->data->get('elements'), FILTER_UNSAFE_RAW);
        if (!$form_id || !$to_group || !$to_grid || !$elements) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $forms = $this->em->getRepository(Forms::class)->find($form_id);
        if (!$forms) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = $forms->getForm();
        $elements = explode(',', $elements);
        $formArr = [];
        $final = [];
        foreach ($elements as $element) {
            $search = $this->search_form_item($data, $element);
            if ($search) {
                $formArr[] = $search;
            }
        }
        $gf = [];
        foreach ($data['builder'] as $tmp) {
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
        $data['builder'] = $final;
        $forms->setForm($data);
        $this->em->persist($forms);
        $this->em->flush();
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function update_builder_grid_form(): object
    {
        $form_id = filter_var($this->data->get('form_id'), FILTER_VALIDATE_INT);
        $from_group = filter_var($this->data->get('from_group'), FILTER_UNSAFE_RAW);
        $from_grid = filter_var($this->data->get('from_grid'), FILTER_UNSAFE_RAW);
        $to_group = filter_var($this->data->get('to_group'), FILTER_UNSAFE_RAW);
        $to_grid = filter_var($this->data->get('to_grid'), FILTER_UNSAFE_RAW);
        $elements = filter_var($this->data->get('elements'), FILTER_UNSAFE_RAW);
        if (!$form_id || !$from_group || !$from_grid || !$to_group || !$to_grid || !$elements) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $forms = $this->em->getRepository(Forms::class)->find($form_id);
        if (!$forms) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = $forms->getForm();
        $elements = explode(',', $elements);
        $newData = [];
        $d = [];
        $fd = [];
        foreach ($data['builder'] as $tmp) {
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
        foreach ($data['builder'] as $tmp) {
            if ($tmp['id'] == $from_group) {
                $tmp['grid'] = $newData['grid'];
            }
            $newBuilder[] = $tmp;
        }

        $formArr = [];
        $final = [];
        foreach ($elements as $element) {
            $search = $this->search_form_item($data, $element);
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
        $data['builder'] = $final;
        $forms->setForm($data);
        $this->em->persist($forms);
        $this->em->flush();

        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function get_build_edit_data(): object
    {
        $form_id = filter_var($this->data->get('form_id'), FILTER_VALIDATE_INT);
        $group = filter_var($this->data->get('group'), FILTER_UNSAFE_RAW);
        $grid = filter_var($this->data->get('grid'), FILTER_UNSAFE_RAW);
        $inputId = filter_var($this->data->get('id'), FILTER_UNSAFE_RAW);
        if (!$form_id || !$group || !$grid || !$inputId) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $forms = $this->em->getRepository(Forms::class)->find($form_id);
        if (!$forms) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = $forms->getForm();
        $formData = [];
        $gridId = '';
        foreach ($data['builder'] as $tmp) {
            if ($tmp['id'] == $group) {
                foreach ($tmp['grid'] as $grid) {
                    foreach ($grid['forms'] as $form) {
                        if ($form['id'] == $inputId) {
                            $formData = $form;
                            $gridId = $grid['id'];
                            break;
                        }
                    }
                }
            }
        }
        if (!$formData || !$gridId) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $this->responseJson->rating = false;
        if ($formData['type'] == 'rating') {
            $this->responseJson->rating = true;
            $this->responseJson->rating_select = $this->rating_options_field();
        }
        $this->responseJson->record = $formData;
        $this->responseJson->grid_id = $gridId;
        $this->responseJson->group_id = $group;
        $this->responseJson->input_id = $inputId;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function add_builder_row(): object
    {
        $form_id = filter_var($this->data->get('form_id'), FILTER_UNSAFE_RAW);
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $row = filter_var($this->data->get('row'), FILTER_VALIDATE_INT);
        $page = filter_var($this->data->get('page'), FILTER_VALIDATE_INT);
        if (!$form_id || !$id || !$row || !$page) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $newArr = [
            'id' => uniqid(),
            'page' => (int)$page,
            'grid' => [
                '0' => [
                    'id' => uniqid(),
                    'col' => 12,
                    'forms' => []
                ]
            ]
        ];
        $forms = $this->em->getRepository(Forms::class)->find($id);
        if (!$forms) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = $forms->getForm();
        $add = array_merge_recursive($data['builder'], [$newArr]);
        $data['builder'] = $add;

        $forms->setForm($data);
        $this->em->persist($forms);
        $this->em->flush();
        $this->responseJson->status = true;
        $this->responseJson->record = $newArr;
        return $this->responseJson;
    }

    private function delete_form_input(): object
    {
        $grid = filter_var($this->data->get('grid'), FILTER_UNSAFE_RAW);
        $form_id = filter_var($this->data->get('form_id'), FILTER_VALIDATE_INT);
        $group = filter_var($this->data->get('group'), FILTER_UNSAFE_RAW);
        $input_id = filter_var($this->data->get('input_id'), FILTER_UNSAFE_RAW);
        if (!$grid || !$form_id || !$group || !$input_id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $forms = $this->em->getRepository(Forms::class)->find($form_id);
        if (!$forms) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = $forms->getForm();
        $newData = [];
        $d = [];
        $fd = [];
        foreach ($data['builder'] as $tmp) {

            if ($tmp['id'] == $group) {
                foreach ($tmp['grid'] as $gridData) {
                    if ($gridData['id'] == $grid) {
                        foreach ($gridData['forms'] as $form) {
                            if ($form['id'] == $input_id) {
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
        $data['builder'] = $newData;

        $conArr = [];
        foreach ($data['conditions'] as $tmp) {
            $del = false;
            foreach ($tmp['group'] as $conGroup) {
                foreach ($conGroup['rules'] as $rule) {
                    if ($rule['field'] == $input_id) {
                        $del = true;
                    }
                }
            }
            if ($del) {
                continue;
            }
            $conArr[] = $tmp;
        }
        $data['conditions'] = $conArr;
        $forms->setForm($data);
        $this->em->persist($forms);
        $this->em->flush();

        $this->responseJson->group = $group;
        $this->responseJson->grid = $grid;
        $this->responseJson->input = $input_id;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function add_selection_option(): object
    {
        $form_id = filter_var($this->data->get('form_id'), FILTER_VALIDATE_INT);
        $group = filter_var($this->data->get('group'), FILTER_UNSAFE_RAW);
        $grid = filter_var($this->data->get('grid'), FILTER_UNSAFE_RAW);
        $inputId = filter_var($this->data->get('id'), FILTER_UNSAFE_RAW);
        $handle = filter_var($this->data->get('handle'), FILTER_UNSAFE_RAW);
        if (!$form_id || !$group || !$grid || !$inputId || !$handle) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $forms = $this->em->getRepository(Forms::class)->find($form_id);
        if (!$forms) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = $forms->getForm();
        $newData = [];
        $d = [];
        $fd = [];
        $addData = [];
        if ($handle == 'select') {
            $addData = $this->select_options_field();
        }
        if ($handle == 'checkbox') {
            $addData = $this->checkbox_options_field();
        }

        if (!$addData) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }

        foreach ($data['builder'] as $tmp) {
            if ($tmp['id'] == $group) {
                foreach ($tmp['grid'] as $gridData) {
                    if ($gridData['id'] == $grid) {
                        foreach ($gridData['forms'] as $form) {
                            if ($form['id'] == $inputId) {
                                $form['options'] = array_merge_recursive($form['options'], [$addData]);
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

        $data['builder'] = $newData;

        $forms->setForm($data);
        $this->em->persist($forms);
        $this->em->flush();

        $this->responseJson->record = $addData;
        $this->responseJson->group = $group;
        $this->responseJson->grid = $grid;
        $this->responseJson->input = $inputId;
        $this->responseJson->handle = $handle;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function update_edit_form_field(): object
    {
        $form_id = filter_var($this->data->get('form_id'), FILTER_VALIDATE_INT);
        $group = filter_var($this->data->get('group'), FILTER_UNSAFE_RAW);
        $grid = filter_var($this->data->get('grid'), FILTER_UNSAFE_RAW);
        $inputId = filter_var($this->data->get('input_id'), FILTER_UNSAFE_RAW);
        $formData = filter_var($this->data->get('data'), FILTER_UNSAFE_RAW);
        if (!$form_id || !$group || !$grid || !$inputId || !$formData) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $formData = json_decode($formData, true);

        $forms = $this->em->getRepository(Forms::class)->find($form_id);
        if (!$forms) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = $forms->getForm();
        if ($formData['type'] == 'select') {
            $formData = $this->check_input_data($data, $formData);
        }
        if ($formData['type'] == 'date') {
            $formData = $this->check_config_date($data, $formData);
        }
        if ($formData['type'] == 'privacy-check') {
            $formData = $this->check_data_protection($data, $formData);
        }
        $helper = Helper::instance();
        if ($formData['type'] == 'upload') {
            $accept = $formData['config']['accept'];
            $accept = $helper->trim_string($accept);
            $accept = str_replace([',', ';', '.'], [',', ',', ''], $accept);
            $accept = explode(',', $accept);
            $acArr = [];
            foreach ($accept as $ac) {
                $acArr[] = '.' . $ac;
            }
            $accept = implode(',', $acArr);
            $formData['config']['accept'] = $accept;
        }

        if ($formData['type'] == 'privacy-check') {
            $regEx = '/({(.+?.*?)})/';
            preg_match($regEx, $formData['config']['default'], $matches);
            $placeholder = $matches[0] ?? null;
            $linkStr = $matches[2] ?? null;
            if($placeholder && $linkStr){
                $href = '<a href="'.$formData['config']['url'].'">'.$matches[2].'</a>';
                $link = str_replace($matches[0], $href, $formData['config']['default']);
                $formData['config']['link'] = $link;
            }
        }
        $newData = [];
        $d = [];
        $fd = [];
        foreach ($data['builder'] as $tmp) {
            if ($tmp['id'] == $group) {
                foreach ($tmp['grid'] as $gridData) {
                    if ($gridData['id'] == $grid) {
                        foreach ($gridData['forms'] as $form) {
                            if ($form['id'] == $inputId) {
                                $form = $formData;
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
        $data['builder'] = $newData;

        $forms->setForm($data);
        $this->em->persist($forms);
        $this->em->flush();
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function delete_select_option(): object
    {
        $form_id = filter_var($this->data->get('form_id'), FILTER_VALIDATE_INT);
        $group = filter_var($this->data->get('group'), FILTER_UNSAFE_RAW);
        $grid = filter_var($this->data->get('grid'), FILTER_UNSAFE_RAW);
        $inputId = filter_var($this->data->get('input'), FILTER_UNSAFE_RAW);
        $optionId = filter_var($this->data->get('options'), FILTER_UNSAFE_RAW);
        if (!$form_id || !$group || !$grid || !$inputId || !$optionId) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $forms = $this->em->getRepository(Forms::class)->find($form_id);
        if (!$forms) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = $forms->getForm();
        $newData = [];
        $d = [];
        $fd = [];
        $opt = [];
        $def = false;

        foreach ($data['builder'] as $tmp) {
            if ($tmp['id'] == $group) {
                foreach ($tmp['grid'] as $gridData) {
                    if ($gridData['id'] == $grid) {
                        foreach ($gridData['forms'] as $form) {
                            if ($form['id'] == $inputId) {
                                foreach ($form['options'] as $option) {
                                    if ($option['id'] == $optionId) {
                                        if ($option['default']) {
                                            $def = true;
                                        }
                                        continue;
                                    }
                                    $opt[] = $option;
                                }
                                if ($def) {
                                    $form['config']['standard'] = true;
                                }
                                $form['options'] = $opt;
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
        $data['builder'] = $newData;
        $forms->setForm($data);
        $this->em->persist($forms);
        $this->em->flush();

        $this->responseJson->default = $def;
        $this->responseJson->optionId = $optionId;
        $this->responseJson->group = $group;
        $this->responseJson->grid = $grid;
        $this->responseJson->input = $inputId;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function update_select_position(): object
    {
        $form_id = filter_var($this->data->get('form_id'), FILTER_VALIDATE_INT);
        $group = filter_var($this->data->get('group'), FILTER_UNSAFE_RAW);
        $grid = filter_var($this->data->get('grid'), FILTER_UNSAFE_RAW);
        $inputId = filter_var($this->data->get('id'), FILTER_UNSAFE_RAW);
        $elements = filter_var($this->data->get('elements'), FILTER_UNSAFE_RAW);


        if (!$form_id || !$group || !$grid || !$inputId || !$elements) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $forms = $this->em->getRepository(Forms::class)->find($form_id);
        if (!$forms) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = $forms->getForm();
        $elements = explode(',', $elements);
        $newOptions = [];
        foreach ($elements as $element) {
            $newOptions[] = $this->search_form_options($data, $element);
        }
        if (!$newOptions) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $newData = [];
        $d = [];
        $fd = [];
        foreach ($data['builder'] as $tmp) {
            if ($tmp['id'] == $group) {
                foreach ($tmp['grid'] as $gridData) {
                    if ($gridData['id'] == $grid) {
                        foreach ($gridData['forms'] as $form) {
                            if ($form['id'] == $inputId) {
                                $form['options'] = $newOptions;
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

        $data['builder'] = $newData;
        $forms->setForm($data);
        $this->em->persist($forms);
        $this->em->flush();

        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function urlizer_slug(): object
    {
        $slug = filter_var($this->data->get('slug'), FILTER_UNSAFE_RAW);
        if ($slug) {
            $this->responseJson->slug = Urlizer::urlize($slug, '-');
            $this->responseJson->status = true;
        }
        return $this->responseJson;
    }

    private function set_form_field(): object
    {
        $form_type = filter_var($this->data->get('form_type'), FILTER_UNSAFE_RAW);
        $grid = filter_var($this->data->get('grid'), FILTER_UNSAFE_RAW);
        $form_id = filter_var($this->data->get('form_id'), FILTER_VALIDATE_INT);
        $group = filter_var($this->data->get('group'), FILTER_UNSAFE_RAW);
        if (!$form_type || !$form_id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $field = $this->form_types('', $form_type);
        if (!$field) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $formsDb = $this->em->getRepository(Forms::class)->find($form_id);
        if (!$formsDb) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $form_data = $formsDb->getForm();
        $formArr = [];
        foreach ($form_data['builder'] as $tmp) {
            $gridArr = [];
            if ($tmp['id'] == $group) {
                foreach ($tmp['grid'] as $gridForm) {
                    if ($gridForm['id'] == $grid) {
                        $forms = $gridForm['forms'];
                        $forms = array_merge_recursive($forms, [$field]);
                        $gridForm['forms'] = $forms;
                    }
                    $gridArr[] = $gridForm;
                }
                $tmp['grid'] = $gridArr;
            }

            $formArr[] = $tmp;
        }

        $form_data['builder'] = $formArr;

        $formsDb->setForm($form_data);

        $this->em->persist($formsDb);
        $this->em->flush();
        $this->responseJson->grid = $grid;
        $this->responseJson->group = $group;
        $this->responseJson->record = $field;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function update_builder_settings(): object
    {
        $form_id = filter_var($this->data->get('form_id'), FILTER_VALIDATE_INT);
        $updData = filter_var($this->data->get('data'), FILTER_UNSAFE_RAW);
        if (!$form_id || !$updData) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $forms = $this->em->getRepository(Forms::class)->find($form_id);
        if (!$forms) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = $forms->getForm();
        $updData = json_decode($updData, true);
        $data['settings'] = $updData;
        $forms->setForm($data);
        $this->em->persist($forms);
        $this->em->flush();
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function add_form_conditions(): object
    {
        $form_id = filter_var($this->data->get('form_id'), FILTER_VALIDATE_INT);
        $name = filter_var($this->data->get('name'), FILTER_UNSAFE_RAW);
        if (!$form_id || !$name) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $forms = $this->em->getRepository(Forms::class)->find($form_id);
        if (!$forms) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = $forms->getForm();
        $helper = Helper::instance();
        $name = $helper->pregWhitespace($name);
        $conId = uniqid();
        $add = [
            'id' => $conId,
            'type' => 'show',
            'name' => $name,
            'fields' => [],
            'group' => []
        ];
        $con = array_merge_recursive($data['conditions'], [$add]);
        $data['conditions'] = $con;
        $forms->setForm($data);
        $this->em->persist($forms);
        $this->em->flush();
        $this->responseJson->forms = $this->get_builder_form_fields($form_id);
        $this->responseJson->conditions = $data['conditions'];
        $this->responseJson->edit = $add;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function get_form_conditions(): object
    {
        $form_id = filter_var($this->data->get('form_id'), FILTER_VALIDATE_INT);
        $forms = $this->em->getRepository(Forms::class)->find($form_id);
        if (!$forms) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = $forms->getForm();
        $this->responseJson->conditions = $data['conditions'];
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function get_form_condition_by_id(): object
    {
        $form_id = filter_var($this->data->get('form_id'), FILTER_VALIDATE_INT);
        $id = filter_var($this->data->get('id'), FILTER_UNSAFE_RAW);
        if (!$form_id || !$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $forms = $this->em->getRepository(Forms::class)->find($form_id);
        if (!$forms) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = $forms->getForm();
        $arr = [];
        $g = [];
        $fields = [];
        foreach ($data['conditions'] as $tmp) {
            if ($tmp['id'] == $id) {
                foreach ($tmp['group'] as $group) {
                    $r = [];
                    foreach ($group['rules'] as $rule) {
                        if ($rule['field'] && $rule['is_select']) {
                            $select = $this->get_builder_form_fields($form_id, $rule['field']);
                            $rule['selects'] = $select['form']['options'];
                        }
                        if ($rule['field']) {
                            $fields[] = $rule['field'];
                        }
                        $r[] = $rule;
                    }
                    $group['rules'] = $r;
                    $g[] = $group;

                }

                $tmp['group'] = $g;
                $arr = $tmp;
            }
        }
        $this->responseJson->edit = $arr;
        $this->responseJson->fields = $fields;
        $this->responseJson->forms = $this->get_builder_form_fields($form_id);
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function add_form_condition_type(): object
    {
        $form_id = filter_var($this->data->get('form_id'), FILTER_VALIDATE_INT);
        $id = filter_var($this->data->get('id'), FILTER_UNSAFE_RAW);
        $field = filter_var($this->data->get('field'), FILTER_UNSAFE_RAW);
        $handle = filter_var($this->data->get('handle'), FILTER_UNSAFE_RAW);
        if (!$form_id || !$id || !$field || !$handle) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $forms = $this->em->getRepository(Forms::class)->find($form_id);
        if (!$forms) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = $forms->getForm();
        $updData = $this->form_condition_handle($data['builder'], $field, $handle, $id);
        $data['builder'] = $updData;
        $forms->setForm($data);
        $this->em->persist($forms);
        $this->em->flush();

        $this->responseJson->forms = $this->get_builder_form_fields($form_id);
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function delete_form_condition(): object
    {
        $form_id = filter_var($this->data->get('form_id'), FILTER_VALIDATE_INT);
        $id = filter_var($this->data->get('id'), FILTER_UNSAFE_RAW);
        if (!$form_id || !$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $forms = $this->em->getRepository(Forms::class)->find($form_id);
        if (!$forms) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = $forms->getForm();

        $newData = [];
        $updData = [];
        foreach ($data['conditions'] as $tmp) {
            if ($tmp['id'] == $id) {
                continue;
            }
            $newData[] = $tmp;
        }

        $data['conditions'] = $newData;
        foreach ($data['builder'] as $tmp) {
            $d = [];
            foreach ($tmp['grid'] as $grid) {
                $fd = [];
                foreach ($grid['forms'] as $form) {
                    if ($form['condition'] && isset($form['condition']['type'])) {
                        if ($form['condition']['type'] == $id) {
                            $form['condition'] = [];
                        }
                    }
                    $fd[] = $form;
                }
                $grid['forms'] = $fd;
                $d[] = $grid;
            }
            $tmp['grid'] = $d;
            $updData[] = $tmp;
        }
        $data['builder'] = $updData;
        $forms->setForm($data);
        $this->em->persist($forms);
        $this->em->flush();
        $this->responseJson->conditions = $newData;
        $this->responseJson->status = true;
        $this->responseJson->msg = $this->translator->trans('forms.Form condition successfully deleted.');
        return $this->responseJson;
    }

    private function add_condition_rule(): object
    {
        $form_id = filter_var($this->data->get('form_id'), FILTER_VALIDATE_INT);
        $id = filter_var($this->data->get('id'), FILTER_UNSAFE_RAW);
        if (!$form_id || !$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $forms = $this->em->getRepository(Forms::class)->find($form_id);
        if (!$forms) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = $forms->getForm();
        $conData = $data['conditions'];
        $ruleId = uniqid();
        $addGroup = [
            'id' => $ruleId,
            'compare' => 'is',
            'is_select' => false,
            'field' => '',
            'value' => ''
        ];
        $conArr = [];
        $editRule = [];

        $newId = uniqid();
        foreach ($conData as $tmp) {
            if ($tmp['id'] == $id) {
                $add = [
                    'id' => $newId,
                    'rules' => [$addGroup]
                ];

                $g = [];
                if (isset($tmp['group'])) {
                    foreach ($tmp['group'] as $group) {
                        $r = [];
                        if (isset($group['rules'])) {
                            foreach ($group['rules'] as $rule) {
                                if ($rule['is_select']) {
                                    if ($rule['field']) {
                                        $select = $this->get_builder_form_fields($form_id, $rule['field']);
                                        $rule['selects'] = $select['form']['options'];
                                    } else {
                                        $rule['selects'] = [];
                                    }
                                }
                                $r[] = $rule;
                            }
                        }
                        $group['rules'] = $r;
                        $g[] = $group;
                    }
                    $tmp['group'] = $g;
                }
                $tmp['group'] = array_merge_recursive($tmp['group'], [$add]);
            }
            $conArr[] = $tmp;
        }

        foreach ($conArr as $tmp) {
            if ($tmp['id'] == $id) {
                foreach ($tmp['group'] as $group) {
                    if ($group['id'] == $newId) {
                        $editRule = $tmp;
                    }
                }
            }
        }

        $data['conditions'] = $conArr;
        $forms->setForm($data);
        $this->em->persist($forms);
        $this->em->flush();

        $this->responseJson->conditions = $conArr;
        $this->responseJson->edit = $editRule;
        $this->responseJson->id = $id;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function get_builder_form_options(): object
    {
        $form_id = filter_var($this->data->get('form_id'), FILTER_VALIDATE_INT);
        $field_id = filter_var($this->data->get('field_id'), FILTER_UNSAFE_RAW);
        $rule_group = filter_var($this->data->get('rule_group'), FILTER_UNSAFE_RAW);
        $rule_id = filter_var($this->data->get('rule_id'), FILTER_UNSAFE_RAW);
        $con_id = filter_var($this->data->get('con_id'), FILTER_UNSAFE_RAW);
        $handle = filter_var($this->data->get('handle'), FILTER_UNSAFE_RAW);
        $reload = filter_var($this->data->get('reload'), FILTER_VALIDATE_BOOLEAN);
        if ($reload) {
            $this->responseJson->type = 'reload_get_builder_form_options';
        }
        if (!$form_id || !$field_id || !$rule_group || !$rule_id || !$con_id || !$handle) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $form = $this->get_builder_form_fields($form_id, $field_id);
        if (!$form) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $forms = $this->em->getRepository(Forms::class)->find($form_id);
        if (!$forms) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = $forms->getForm();

        $newCont = [];
        $editCont = [];
        $g = [];
        $r = [];
        $fields = [];
        $editRule = [];
        foreach ($data['conditions'] as $tmp) {

            if ($tmp['id'] == $con_id) {
                foreach ($tmp['group'] as $group) {

                    if ($group['id'] == $rule_group) {
                        foreach ($group['rules'] as $rule) {

                            if ($rule['id'] == $rule_id) {

                                if ($handle == 'field') {
                                    $rule['field'] = $field_id;
                                    $rule['is_select'] = $form['is_option'];
                                    $rule['value'] = '';
                                    if ($form['is_option']) {
                                        $select = $this->get_builder_form_fields($form_id, $rule['field']);
                                        $rule['selects'] = $select['form']['options'];
                                    }
                                }
                                if ($handle == 'value') {
                                    $rule['value'] = $field_id;
                                }
                                if ($handle == 'compare') {
                                    $rule['compare'] = $field_id;
                                }
                                $editRule = $rule;
                            }

                            $r[] = $rule;
                        }
                        $group['rules'] = $r;
                    }
                    $g[] = $group;
                }
                $tmp['group'] = $g;
            }
            $newCont[] = $tmp;
        }
        foreach ($newCont as $tmp) {
            if ($tmp['id'] == $con_id) {
                foreach ($tmp['group'] as $group) {
                    foreach ($group['rules'] as $rule) {
                        if ($rule['field']) {
                            $fields[] = $rule['field'];
                        }
                    }
                }
            }
        }

        $data['conditions'] = $newCont;
        foreach ($newCont as $tmp) {
            if ($tmp['id'] == $con_id) {
                $editCont = $tmp;
            }
        }
        $forms->setForm($data);
        $this->em->persist($forms);
        $this->em->flush();

        if (isset($editRule['is_select']) && $editRule['is_select']) {
            $form_value = [
                'is_select' => true,
                'record' => [
                    'form_id' => $editRule['id'],
                    'select' => $editRule['selects'] ?? []
                ]
            ];
        } else {
            $form_value = [
                'is_select' => false,
                'record' => [
                    'form_id' => $editRule['id'],
                    'value' => $editRule['id'],
                ]
            ];
        }

        $this->responseJson->is_select = $editRule['is_select'];
        $this->responseJson->status = true;
        $this->responseJson->fields = $fields;
        $this->responseJson->form_value = $form_value;
        $this->responseJson->edit = $editCont;
        return $this->responseJson;
    }

    private function add_rule_line(): object
    {
        $form_id = filter_var($this->data->get('form_id'), FILTER_VALIDATE_INT);
        $group_id = filter_var($this->data->get('group_id'), FILTER_UNSAFE_RAW);
        $con_id = filter_var($this->data->get('con_id'), FILTER_UNSAFE_RAW);
        if (!$form_id || !$group_id || !$con_id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $forms = $this->em->getRepository(Forms::class)->find($form_id);
        if (!$forms) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $data = $forms->getForm();
        $addId = uniqid();
        $addRule = [
            'id' => $addId,
            'compare' => 'is',
            'is_select' => false,
            'field' => '',
            'value' => ''
        ];

        $newCont = [];
        $g = [];
        foreach ($data['conditions'] as $tmp) {
            if ($tmp['id'] == $con_id) {
                foreach ($tmp['group'] as $group) {
                    if ($group['id'] == $group_id) {
                        $group['rules'] = array_merge_recursive($group['rules'], [$addRule]);
                    }
                    $g[] = $group;
                }
                $tmp['group'] = $g;
            }
            $newCont[] = $tmp;
        }
        $data['conditions'] = $newCont;
        $forms->setForm($data);
        $this->em->persist($forms);
        $this->em->flush();

        $this->responseJson->rule = $addRule;
        $this->responseJson->group_id = $group_id;
        $this->responseJson->con_id = $con_id;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function delete_form_line(): object
    {
        $form_id = filter_var($this->data->get('form_id'), FILTER_VALIDATE_INT);
        $rule_group = filter_var($this->data->get('group_id'), FILTER_UNSAFE_RAW);
        $rule_id = filter_var($this->data->get('rule_id'), FILTER_UNSAFE_RAW);
        $con_id = filter_var($this->data->get('id'), FILTER_UNSAFE_RAW);
        if (!$form_id || !$rule_group || !$rule_id || !$con_id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $forms = $this->em->getRepository(Forms::class)->find($form_id);
        if (!$forms) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $data = $forms->getForm();

        $editCont = [];
        $g = [];
        $r = [];
        $delGroup = false;
        $fields = [];

        foreach ($data['conditions'] as $tmp) {
            if ($tmp['id'] == $con_id) {
                foreach ($tmp['group'] as $group) {
                    if ($group['id'] == $rule_group) {
                        foreach ($group['rules'] as $rule) {
                            if ($rule['id'] == $rule_id) {
                                continue;
                            }
                            $r[] = $rule;
                        }
                        $group['rules'] = $r;
                    }
                    if (count($group['rules']) == 0) {
                        $delGroup = true;
                        continue;
                    }
                    $g[] = $group;
                }
                $tmp['group'] = $g;
            }
            $editCont[] = $tmp;
        }
        foreach ($editCont as $tmp) {
            if ($tmp['id'] == $con_id) {
                foreach ($tmp['group'] as $group) {
                    foreach ($group['rules'] as $rule) {
                        if ($rule['field']) {
                            $fields[] = $rule['field'];
                        }
                    }
                }
            }
        }

        $data['conditions'] = $editCont;
        $forms->setForm($data);
        $this->em->persist($forms);
        $this->em->flush();

        $this->responseJson->delete_group = $delGroup;
        $this->responseJson->group_id = $rule_group;
        $this->responseJson->rule_id = $rule_id;
        $this->responseJson->fields = $fields;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function update_condition_rule(): object
    {
        $form_id = filter_var($this->data->get('form_id'), FILTER_VALIDATE_INT);
        $id = filter_var($this->data->get('id'), FILTER_UNSAFE_RAW);
        $conData = filter_var($this->data->get('data'), FILTER_UNSAFE_RAW);
        if (!$form_id || !$id || !$conData) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $forms = $this->em->getRepository(Forms::class)->find($form_id);
        if (!$forms) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = $forms->getForm();

        $conData = json_decode($conData, true);
        $updData = [];
        foreach ($data['conditions'] as $tmp) {
            if ($tmp['id'] == $id) {
                $tmp['name'] = $conData['name'];
                $tmp['type'] = $conData['type'];
                $tmp['group'] = $conData['group'];
            }
            $updData[] = $tmp;
        }
        $data['conditions'] = $updData;
        $forms->setForm($data);
        $this->em->persist($forms);
        $this->em->flush();

        $this->responseJson->status = true;
        return $this->responseJson;

    }

    private function get_form_email_settings(): object
    {
        $form_id = filter_var($this->data->get('form_id'), FILTER_VALIDATE_INT);
        if (!$form_id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $forms = $this->em->getRepository(Forms::class)->find($form_id);
        if (!$forms) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = $forms->getForm();
        $formInputs = [];
        $sendEmailSelect = false;
        foreach ($data['builder'] as $tmp) {
            foreach ($tmp['grid'] as $grid) {
                foreach ($grid['forms'] as $form) {
                    if ($form['show_msg']) {
                        if (isset($form['config']['send_email']) && $form['config']['send_email']) {
                            $sendEmailSelect = true;
                        }
                        $item = [
                            'slug' => $form['slug'],
                            'id' => $form['id'],
                            'label' => $form['label']
                        ];
                        $formInputs[] = $item;
                    }
                }
            }
        }
        $data['send_email']['email']['message'] = html_entity_decode($data['send_email']['email']['message']);
        $data['send_email']['responder']['message'] = html_entity_decode($data['send_email']['responder']['message']);
        $this->responseJson->record = $data['send_email'];
        $this->responseJson->email_select_active = $sendEmailSelect;
        $this->responseJson->fields = $formInputs;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function update_form_email_settings(): object
    {
        $form_id = filter_var($this->data->get('form_id'), FILTER_VALIDATE_INT);
        $formData = filter_var($this->data->get('data'), FILTER_UNSAFE_RAW);

        if (!$form_id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $formData = json_decode($formData, true);

        $forms = $this->em->getRepository(Forms::class)->find($form_id);
        if (!$forms) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = $forms->getForm();
        $helper = Helper::instance();
        $cc = $helper->trim_string($formData['email']['cc']);
        $bcc = $helper->trim_string($formData['email']['bcc']);
        $cc = str_replace([';', ','], '#', $cc);
        $cc = explode('#', $cc);
        $bcc = str_replace([';', ','], '#', $bcc);
        $bcc = explode('#', $bcc);
        $sendMail = [
            'email' => [
                'recipient' => $formData['email']['recipient'],
                'subject' => $formData['email']['subject'],
                'cc' => implode(',', $cc),
                'bcc' => implode(',', $bcc),
                'message' => $formData['email']['message']
            ],
            'responder' => [
                'subject' => $formData['responder']['subject'],
                'active' => filter_var($formData['responder']['active'], FILTER_VALIDATE_BOOLEAN),
                'message' => $formData['responder']['message']
            ],
        ];

        $data['send_email'] = $sendMail;
        $forms->setForm($data);
        $this->em->persist($forms);
        $this->em->flush();
        $this->responseJson->status = true;
        $this->responseJson->msg = $this->translator->trans('forms.Settings saved successfully.');
        return $this->responseJson;
    }

    private function get_form_error_msg(): object
    {
        $form_id = filter_var($this->data->get('form_id'), FILTER_VALIDATE_INT);

        if (!$form_id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $forms = $this->em->getRepository(Forms::class)->find($form_id);
        if (!$forms) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = $forms->getForm();
        $fieldMsg = [];
        $optArr = [];
        foreach ($data['builder'] as $tmp) {
            foreach ($tmp['grid'] as $grid) {
                foreach ($grid['forms'] as $form) {
                    $required = $form['required'] ?? null;
                    if ($required || $form['type'] == 'checkbox' || $form['type'] == 'upload') {
                        if ($form['type'] == 'upload') {
                            $message = $form['message'];
                        } else {
                            $message = [];
                        }
                        if ($form['type'] == 'checkbox') {
                            foreach ($form['options'] as $option) {
                                if (isset($option['required']) && $option['required']) {
                                    $optItem = [
                                        'id' => $option['id'],
                                        'label' => $option['label'] ?? '',
                                        'value' => $option['err_msg'] ?? ''
                                    ];
                                    $optArr[] = $optItem;
                                }
                            }
                        }

                        $item = [
                            'group' => $tmp['id'],
                            'grid' => $grid['id'],
                            'id' => $form['id'],
                            'type' => $form['type'],
                            'label' => $form['label'],
                            'value' => $form['err_msg'],
                        ];
                        if ($form['type'] == 'checkbox') {
                            $item['checkbox'] = $optArr;
                        }
                        if ($form['type'] == 'upload') {
                            $item['message'] = $message;
                        }

                        $fieldMsg[] = $item;
                    }
                }
            }
        }
        $this->responseJson->status = true;
        $this->responseJson->field_message = $fieldMsg;
        $this->responseJson->form_message = $data['message']['email_sent'] ?? [];
        return $this->responseJson;
    }

    private function update_form_message(): object
    {
        $form_id = filter_var($this->data->get('form_id'), FILTER_VALIDATE_INT);
        $handle = filter_var($this->data->get('handle'), FILTER_UNSAFE_RAW);
        $update = filter_var($this->data->get('data'), FILTER_UNSAFE_RAW);
        $checkbox = filter_var($this->data->get('checkbox'), FILTER_UNSAFE_RAW);

        if (!$checkbox) {
            $checkbox = [];
        }

        if (!$form_id || !$handle || !$update) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $forms = $this->em->getRepository(Forms::class)->find($form_id);
        if (!$forms) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = $forms->getForm();

        $update = json_decode($update, true);
        $groupId = $update['group'] ?? '';
        $gridId = $update['grid'] ?? '';
        $formId = $update['id'] ?? '';

        $formArr = [];
        if ($handle == 'form') {
            foreach ($data['message']['email_sent'] as $tmp) {
                if ($tmp['id'] == $formId) {
                    $tmp['value'] = $update['value'];
                }
                $formArr[] = $tmp;
            }
            $data['message']['email_sent'] = $formArr;
            $forms->setForm($data);
            $this->em->persist($forms);
            $this->em->flush();
        }

        if ($handle == 'checkbox') {
            $checkbox = json_decode($checkbox, true);
        }
        if ($handle == 'field' || $handle == 'message' || $handle == 'checkbox') {
            $newData = [];
            $d = [];
            $fd = [];

            foreach ($data['builder'] as $tmp) {
                if ($tmp['id'] == $groupId) {
                    foreach ($tmp['grid'] as $gridData) {
                        if ($gridData['id'] == $gridId) {
                            foreach ($gridData['forms'] as $form) {
                                $fc = [];
                                if ($form['id'] == $formId) {
                                    $form['err_msg'] = $update['value'];
                                    if ($handle == 'message') {
                                        $form['message'] = $update['message'];
                                    }
                                    if ($handle == 'checkbox') {
                                        foreach ($form['options'] as $option) {
                                            if ($option['id'] == $checkbox['id']) {
                                                $option['err_msg'] = $checkbox['value'];
                                            }
                                            $fc[] = $option;
                                        }
                                        $form['options'] = $fc;
                                    }
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

            $data['builder'] = $newData;
            $forms->setForm($data);
            $this->em->persist($forms);
            $this->em->flush();
        }
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function add_builder_page(): object
    {
        $form_id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);

        if (!$form_id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $forms = $this->em->getRepository(Forms::class)->find($form_id);
        if (!$forms) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = $forms->getForm();
        $pageArr = [];
        foreach ($data['builder'] as $tmp) {
            $pageArr[] = $tmp['page'];
        }
        $pageArr = array_merge(array_unique(array_filter($pageArr)));
        $page = count($pageArr) + 1;
        $pageArr = array_merge($pageArr, [$page]);

        $newArr = [
            'id' => uniqid(),
            'page' => (int)$page,
            'grid' => [
                '0' => [
                    'id' => uniqid(),
                    'col' => 12,
                    'forms' => []
                ]
            ]
        ];

        $newData = array_merge_recursive($data['builder'], [$newArr]);
        $data['builder'] = $newData;
        $forms->setForm($data);
        $this->em->persist($forms);
        $this->em->flush();

        $this->responseJson->page = $page;
        $this->responseJson->pages = $pageArr;
        $this->responseJson->record = [$newArr];
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function delete_builder_page(): object
    {
        $form_id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        $page = filter_var($this->data->get('page'), FILTER_VALIDATE_INT);
        if (!$form_id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $forms = $this->em->getRepository(Forms::class)->find($form_id);
        if (!$forms) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = $forms->getForm();
        $pageArr = [];
        if ($page - 1 < 1) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $newData = [];
        $pages = [];
        foreach ($data['builder'] as $tmp) {
            if ($tmp['page'] == $page) {
                continue;
            }
            if ($tmp['page'] >= $page) {
                $tmp['page'] = $tmp['page'] - 1;
            }
            $pages[] = $tmp['page'];
            $pageArr[] = $tmp;
        }

        foreach ($pageArr as $tmp) {
            if ($tmp['page'] == 1) {
                $newData[] = $tmp;
            }
        }

        $pages = array_merge(array_unique(array_filter($pages)));
        $data['builder'] = $pageArr;
        $forms->setForm($data);
        $this->em->persist($forms);
        $this->em->flush();

        $this->responseJson->page = 1;
        $this->responseJson->pages = $pages;
        $this->responseJson->record = $newData;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function get_email_settings(): object
    {

        $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
        $emailSettings = $settings->getEmail();
        $this->responseJson->record = $emailSettings['forms'];
        $this->responseJson->status = true;

        return $this->responseJson;
    }

    private function update_email_settings(): object
    {
        $update = filter_var($this->data->get('settings'), FILTER_UNSAFE_RAW);
        $update = json_decode($update, true);
        if (!$update) {
            return $this->responseJson;
        }

        $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
        if (!$settings) {
            return $this->responseJson;
        }
        $emailSettings = $settings->getEmail();
        $emailSettings['forms'] = $update;
        $settings->setEmail($emailSettings);
        $this->em->persist($settings);
        $this->em->flush();

        $this->responseJson->status = true;
        return $this->responseJson;
    }

    /**
     * @throws FilesystemException
     */
    private function delete_email(): object
    {
        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $email = $this->em->getRepository(EmailsSent::class)->find($id);
        if (!$email) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-PR ' . __LINE__ . ')';
            return $this->responseJson;
        }
        if ($email->getEmailAttachments()) {
            $this->delete_attachment($email->getEmailAttachments());
        }
        $this->em->remove($email);
        $this->em->flush();

        $this->responseJson->msg = $this->translator->trans('system.The file was successfully deleted.');
        $this->responseJson->title = $this->translator->trans('system.Deleted') . '!';
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    /**
     * @throws FilesystemException
     */
    private function delete_all_email(): object
    {
        $email = $this->em->getRepository(EmailsSent::class)->findBy(['type' => 'public-email']);
        foreach ($email as $tmp) {
            if ($tmp->getEmailAttachments()) {
                $this->delete_attachment($tmp->getEmailAttachments());
            }
            $this->em->remove($tmp);
            $this->em->flush();
        }

        $this->responseJson->msg = $this->translator->trans('system.All entries have been deleted.');
        $this->responseJson->title = $this->translator->trans('system.Deleted') . '!';
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    /**
     * @throws FilesystemException
     */
    private function delete_attachment($attachment): void
    {
        foreach ($attachment as $tmp) {
            $this->uploaderHelper->deleteFile($tmp['file_name'], $this->uploaderHelper::ATTACHMENT, false);
        }
    }

    /**
     * @throws Exception
     * @throws FilesystemException
     */
    private function import_page_builder(): object
    {
        if (!$this->security->isGranted('ADD_FORMS', $this->account)) {
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
            $forms = $this->em->getRepository(Forms::class)->findOneBy(['formId' => $data['id']]);
            if ($forms) {
                $this->responseJson->msg = $this->translator->trans('builder.This form builder is already available.') . ' (Ajx-SE ' . __LINE__ . ')';
                return $this->responseJson;
            }
            if (!isset($data['bu_version'])) {
                $this->responseJson->msg = $this->translator->trans('builder.The form builder is faulty.') . ' (Ajx-SE ' . __LINE__ . ')';
                return $this->responseJson;
            }
            if (!isset($data['name'])) {
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
            if (!isset($data['send_email'])) {
                $this->responseJson->msg = $this->translator->trans('builder.The form builder is faulty.') . ' (Ajx-SE ' . __LINE__ . ')';
                return $this->responseJson;
            }
            if (!isset($data['message'])) {
                $this->responseJson->msg = $this->translator->trans('builder.The form builder is faulty.') . ' (Ajx-SE ' . __LINE__ . ')';
                return $this->responseJson;
            }
            if (!$data['bu_version'] == $this->version) {
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

            $add = new Forms();
            $add->setFormId($data['id']);
            $add->setType($data['type']);
            $add->setDesignation($data['name']);
            $add->setForm($data);
            $this->em->persist($add);
            $this->em->flush();
            $this->responseJson->status = true;
            $this->responseJson->title = $this->translator->trans('builder.Form builder imported');
            $this->responseJson->msg = $this->translator->trans('builder.The form builder has been saved successfully.');
        }
        return $this->responseJson;
    }

    private function duplicate_forms(): object
    {
        if (!$this->security->isGranted('MANAGE_FORMS', $this->account)) {
            $this->responseJson->msg = $this->translator->trans('system.no authorisations');
            return $this->responseJson;
        }

        $id = filter_var($this->data->get('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $forms = $this->em->getRepository(Forms::class)->find($id);
        if(!$forms){
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Ajx-FB ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $fbId = 'FB' . uniqid();
        $form = $forms->getForm();
        $form['id'] = $fbId;
        $form['name'] = $form['name'] . ' - copy';
        $copy = new Forms();
        $copy->setType($forms->getType());
        $copy->setFormId($fbId);
        $copy->setForm($form);
        $copy->setDesignation($form['name']);
        $this->em->persist($copy);
        $this->em->flush();
        $this->responseJson->status = true;
        $this->responseJson->msg = $this->translator->trans('builder.Page-Builder was successfully copied!');

        return $this->responseJson;
    }

    private function email_sent_table(): object
    {
        $columns = array(
            's.createdAt',
            's.type',
            's.absUser',
            's.sentFrom',
            's.sentTo',
            's.emailCc',
            's.emailBcc',
            's.emailSubject',
            '',
            ''
        );
        $request = $this->data->request->all();
        $search = (string)$request['search']['value'];
        $query = $this->em->createQueryBuilder();
        $query
            ->from(EmailsSent::class, 's')
            ->select('s')
            ->andWhere('s.type =:type')
            ->setParameter('type', 'public-email');

        if (isset($request['search']['value'])) {
            $query->andWhere(
                's.createdAt LIKE :searchTerm OR
                 s.type LIKE :searchTerm OR
                 s.absUser LIKE :searchTerm OR
                 s.sentFrom LIKE :searchTerm OR
                 s.sentTo LIKE :searchTerm OR
                 s.emailContext LIKE :searchTerm OR
                 s.emailCc LIKE :searchTerm OR
                 s.emailBcc LIKE :searchTerm OR
                 s.emailSubject LIKE :searchTerm')
                ->setParameter('searchTerm', '%' . $search . '%');
        }

        if (isset($request['order'])) {
            $query->orderBy($columns[$request['order']['0']['column']], $request['order']['0']['dir']);
        } else {
            $query->orderBy('s.createdAt', 'ASC');
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
            $showClass = ' text-muted ';
            $bodyClass = ' text-muted ';
            if (!$tmp['ifShow']) {
                $showClass = ' text-green ';
                $bodyClass = '';
            }

            $anhang = '';
            if ($tmp['emailAttachments']) {
                $anhang = '<span class="d-none"> – ' . $this->translator->trans('email.Attachment') . ': ' . count($tmp['emailAttachments']) . '</span><i title="' . $this->translator->trans('email.Attachment') . ': ' . count($tmp['emailAttachments']) . '" class="bi bi-paperclip fs-5 ms-2 ' . $showClass . '"></i>';
            }
            $data_item = array();
            $data_item[] = '<span class="d-block' . $showClass . 'lh-1">' . $tmp['createdAt']->format('d.m.Y') . '<small class="small-lg mt-1 d-block"> ' . $tmp['createdAt']->format('H:i:s') . '</small></span>';
            $data_item[] = '<span class="' . $bodyClass . '">' . $tmp['type'] . '</span>';
            $data_item[] = '<span class="' . $bodyClass . '">'.$tmp['absUser'].'</span>';
            $data_item[] = '<span class="' . $bodyClass . '">' . $tmp['sentFrom'] . '</span>';
            $data_item[] = '<span class="' . $bodyClass . '">' . $tmp['sentTo'] . '</span>' . $anhang;
            $data_item[] = '<small class="d-inline-block lh-12 ' . $bodyClass . '">' . implode(', ', $tmp['emailCc']) . '</small>';
            $data_item[] = '<small class="d-inline-block lh-12 ' . $bodyClass . '">' . implode(', ', $tmp['emailBcc']) . '</small>';
            $data_item[] = '<span class="lh-12 d-inline-block ' . $bodyClass . '">' . $tmp['emailSubject'] . '</span>';
            $data_item[] = $tmp['id'];
            $data_item[] = $tmp['id'];
            $data_arr[] = $data_item;
        }

        $allQuery = $this->em->createQueryBuilder();
        $allQuery
            ->from(EmailsSent::class, 's')
            ->select('s')
            ->andWhere('s.type =:type')
            ->setParameter('type', 'public-email');

        $allCount = $allQuery->getQuery()->getArrayResult();
        $this->responseJson->draw = $request['draw'];
        $this->responseJson->recordsTotal = count($allCount);
        if ($search) {
            $this->responseJson->recordsFiltered = count($table);
        } else {
            $this->responseJson->recordsFiltered = count($allCount);
        }

        $this->responseJson->data = $data_arr;
        return $this->responseJson;
    }

    private function form_table(): object
    {
        $delete = true;
        if (!$this->security->isGranted('DELETE_FORMS', $this->account)) {
            $delete = false;
        }

        $columns = array(
            'f.designation',
            'f.formId',
            'fs.createdAt',
            '',
            '',
            '',
            ''
        );

        $request = $this->data->request->all();
        $search = (string)$request['search']['value'];
        $query = $this->em->createQueryBuilder();
        $query
            ->from(Forms::class, 'f')
            ->select('f');

        if (isset($request['search']['value'])) {
            $query->andWhere(
                'f.createdAt LIKE :searchTerm OR
                 f.designation LIKE :searchTerm OR
                 f.formId LIKE :searchTerm');
            $query->setParameters(new ArrayCollection([
                new Parameter('searchTerm', '%' . $search . '%'),
            ]));
        }

        if (isset($request['order'])) {
            $query->orderBy($columns[$request['order']['0']['column']], $request['order']['0']['dir']);
        } else {
            $query->orderBy('f.designation', 'ASC');

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

            if ($delete) {
                $btn = '<button data-id="' . $tmp['id'] . '" title="' . $this->translator->trans('Delete') . '" class="btn-trash btn btn-danger dark btn-sm"><i class="bi bi-trash"></i></button>';
            } else {
                $btn = '<button title="' . $this->translator->trans('Delete') . '" class="btn-trash pe-none btn btn-outline-secondary disabled btn-sm"><i class="bi bi-trash"></i></button>';
            }

            $download = $this->urlGenerator->generate('download_forms', ['formId' => $tmp['formId']]);
            $data_item = array();
            $data_item[] = $tmp['designation'];
            $data_item[] = $tmp['formId'];
            $data_item[] = '<span class="d-block lh-1">' . $tmp['createdAt']->format('d.m.Y') . '<small class="small-lg mt-1 d-block"> ' . $tmp['createdAt']->format('H:i:s') . '</small></span>';
            $data_item[] = $tmp['id'];
            $data_item[] = $download;
            $data_item[] = $tmp['id'];
            $data_item[] = $btn;
            $data_arr[] = $data_item;
        }

        $allCount = $this->em->getRepository(Forms::class)->count([]);
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

    private function search_group_element($data, $elementId)
    {
        foreach ($data['builder'] as $tmp) {
            if ($tmp['id'] == $elementId) {
                return $tmp;
            }
        }

        return [];
    }

    private function check_input_data($data, $formData): array
    {

        // $slug = str_replace([' ', '-', ',', '.', '(', ')', '/', '\\'], '', $formData['slug']);
        $reg = '@[^A-Za-z0-9_]@';
        $slug = preg_replace($reg, '', $formData['slug']);
        $selects = 0;
        $checkData = [];
        $helper = Helper::instance();
        foreach ($data['builder'] as $tmp) {
            foreach ($tmp['grid'] as $grid) {
                foreach ($grid['forms'] as $form) {
                    if ($form['id'] == $formData['id']) {
                        if ($formData['type'] == 'select' && isset($formData['config']['send_email'])) {
                            $checkSend = $this->check_email_selects($data);
                            if ($checkSend) {
                                $formData['config']['send_email'] = false;
                            }
                        }

                        $checkSlug = $this->check_config_slug($data, $slug);
                        if ($checkSlug) {
                            $formData['slug'] = $formData['slug'] . '_' . $helper->generate_callback_pw(5, 0, 5);
                        }
                        $checkData = $formData;
                    }
                }
            }
        }

        return $checkData;
    }

    private function check_email_selects($data): bool
    {

        $count = 0;
        foreach ($data['builder'] as $tmp) {
            foreach ($tmp['grid'] as $grid) {
                foreach ($grid['forms'] as $form) {
                    if (isset($form['config']['send_email']) && $form['config']['send_email']) {
                        $count++;
                    }
                }
            }
        }

        return $count > 1;
    }

    private function check_config_slug($data, $slug): bool
    {
        $count = 0;
        foreach ($data['builder'] as $tmp) {
            foreach ($tmp['grid'] as $grid) {
                foreach ($grid['forms'] as $form) {
                    if ($form['slug'] == $slug) {
                        $count++;
                    }
                }
            }
        }
        return $count > 0;
    }

    private function check_config_date($data, $formData): array
    {
        foreach ($data['builder'] as $tmp) {
            foreach ($tmp['grid'] as $grid) {
                foreach ($grid['forms'] as $form) {

                    if ($form['id'] == $formData['id']) {
                        if ($formData['config']['date_type'] == 'date') {
                            if ($formData['config']['date_min']) {
                                $formData['config']['date_min'] = date('Y-m-d', strtotime($formData['config']['date_min']));
                            }
                            if ($formData['config']['date_min']) {
                                $formData['config']['date_max'] = date('Y-m-d', strtotime($formData['config']['date_max']));
                            }
                        }
                        if ($formData['config']['date_type'] == 'time') {
                            if ($formData['config']['date_min']) {
                                $formData['config']['date_min'] = date('H:i', strtotime($formData['config']['date_min']));
                            }
                            if ($formData['config']['date_min']) {
                                $formData['config']['date_max'] = date('H:i', strtotime($formData['config']['date_max']));
                            }
                        }
                        if ($formData['config']['date_type'] == 'month') {
                            if ($formData['config']['date_min']) {
                                $formData['config']['date_min'] = date('Y-m', strtotime($formData['config']['date_min']));
                            }
                            if ($formData['config']['date_min']) {
                                $formData['config']['date_max'] = date('Y-m', strtotime($formData['config']['date_max']));
                            }
                        }
                        if ($formData['config']['date_type'] == 'datetime-local') {
                            if ($formData['config']['date_min']) {
                                $formData['config']['date_min'] = date('Y-m-d\TH:i', strtotime($formData['config']['date_min']));
                            }
                            if ($formData['config']['date_min']) {
                                $formData['config']['date_max'] = date('Y-m-d\TH:i', strtotime($formData['config']['date_max']));
                            }
                        }
                    }
                }
            }
        }
        return $formData;
    }

    private function check_data_protection($data, $formData): array
    {
        $checkData = [];
        $regEx = '/.*?{(.+).*?}/';
        foreach ($data['builder'] as $tmp) {
            foreach ($tmp['grid'] as $grid) {
                foreach ($grid['forms'] as $form) {
                    if ($form['id'] == $formData['id']) {
                        if ($formData['type'] == 'privacy-check' && $formData['config']['url'] && $formData['config']['default']) {
                            preg_match($regEx, $formData['config']['default'], $matches);
                            $placeholder = $matches[0] ?? null;
                            $text = $matches[1] ?? null;
                            if ($placeholder && $text) {
                                if ($formData['config']['new_tab']) {
                                    $tab = 'target="_blank"';
                                } else {
                                    $tab = '';
                                }

                                $link = sprintf('<a %s href="%s">%s</a>', $tab, $formData['config']['url'], $text);
                                $formData['config']['link'] = str_replace($placeholder, $link, $formData['config']['default']);
                            }
                        }

                        $checkData = $formData;
                    }
                }
            }
        }
        return $checkData;
    }

    private function search_form_options($data, $elementId): array
    {
        foreach ($data['builder'] as $tmp) {
            foreach ($tmp['grid'] as $grid) {
                foreach ($grid['forms'] as $form) {
                    foreach ($form['options'] as $option) {
                        if (isset($option['id']) && $option['id'] == $elementId) {
                            return $option;
                        }
                    }
                }
            }
        }

        return [];
    }

    private function get_builder_form_fields($form_id, $id = null): array
    {

        $forms = $this->em->getRepository(Forms::class)->find($form_id);
        if (!$forms) {
            return [];
        }
        $optionsArr = ['switch', 'radio', 'checkbox', 'select'];
        $data = $forms->getForm();
        $arr = [];

        foreach ($data['builder'] as $tmp) {
            foreach ($tmp['grid'] as $grid) {
                foreach ($grid['forms'] as $form) {
                    if ($id && $form['id'] == $id) {
                        return [
                            'is_option' => in_array($form['type'], $optionsArr),
                            'form' => $form
                        ];
                    }

                    $item = [
                        'is_option' => in_array($form['type'], $optionsArr),
                        'form' => $form
                    ];
                    $arr[] = $item;
                }
            }
        }
        return $arr;
    }

    private function form_condition_handle($data, $formId, $handle, $condition = null): array
    {

        $newData = [];
        foreach ($data as $tmp) {
            $d = [];
            foreach ($tmp['grid'] as $grid) {
                $fd = [];
                foreach ($grid['forms'] as $form) {

                    if ($form['id'] == $formId) {
                        if ($handle == 'add') {
                            $form['condition']['type'] = $condition;
                        }
                        if ($handle == 'delete') {
                            $form['condition'] = [];
                        }
                    }
                    $fd[] = $form;
                }
                $grid['forms'] = $fd;
                $d[] = $grid;
            }
            $tmp['grid'] = $d;
            $newData[] = $tmp;
        }

        return $newData;
    }
}
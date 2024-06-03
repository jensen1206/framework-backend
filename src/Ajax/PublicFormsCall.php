<?php

namespace App\Ajax;

use App\AppHelper\Helper;
use App\Entity\Forms;
use App\Entity\SystemSettings;
use App\Entity\User;
use App\Message\Command\SavePublicEmail;
use App\Service\UploaderHelper;
use App\Settings\Settings;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use League\Flysystem\FilesystemException;
use SMTPValidateEmail\Exceptions\NoConnection;
use SMTPValidateEmail\Exceptions\NoHelo;
use SMTPValidateEmail\Exceptions\NoMailFrom;
use SMTPValidateEmail\Exceptions\NoTimeout;
use SMTPValidateEmail\Exceptions\SendFailed;
use stdClass;
use Symfony\Component\Console\Messenger\RunCommandMessage;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Scheduler\RecurringMessage;
use Symfony\Contracts\Translation\TranslatorInterface;
use Gedmo\Sluggable\Util\Urlizer;
use SMTPValidateEmail\Validator as SmtpEmailValidator;

class PublicFormsCall
{
    protected object $responseJson;
    protected Request $data;
    use Settings;

    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly TranslatorInterface    $translator,
        private readonly UploaderHelper         $uploaderHelper,
        private readonly MessageBusInterface    $bus,
        private readonly UrlGeneratorInterface  $urlGenerator,
        private readonly string                 $emailTemplatePath,
        private readonly string                 $uploadsPrivatePath,
        private readonly string                 $projectDir
    )
    {
    }

    /**
     * @throws Exception
     */
    public function ajaxFormsPublic(Request $request)
    {
        $this->data = $request;
        $this->responseJson = (object)['status' => false, 'msg' => date('H:i:s'), 'type' => $request->get('method')];
        if (!method_exists($this, $request->get('method'))) {
            throw new Exception("Method not found!#Not Found");
        }

        return call_user_func_array(self::class . '::' . $request->get('method'), []);
    }

    private function get_app_form_builder(): object
    {
        $builder_id = filter_var($this->data->get('builder_id'), FILTER_UNSAFE_RAW);
        $page = filter_var($this->data->get('page'), FILTER_VALIDATE_INT);

        $forms = $this->em->getRepository(Forms::class)->findOneBy(['formId' => $builder_id]);
        if (!$forms) {
            $this->responseJson->msg = $this->translator->trans('Ajax transmission error') . ' (Log-Ajx-' . __LINE__ . ')';
            return $this->responseJson;
        }

        $data = $forms->getForm();
        if (!$page) {
            $page = 1;
        }
        $pages = [];
        $conditions = [];
        $builder = [];
        foreach ($data['builder'] as $tmp) {
            $pages[] = $tmp['page'];
        }

        $builderArr = [];
        $pages = array_merge(array_unique(array_filter($pages)));

        foreach ($pages as $tmp) {
            $builderPage = [];
            foreach ($data['builder'] as $build) {
                if ($build['page'] == $tmp) {
                    $builderPage[] = $build;
                }
            }
            $builderArr[] = $builderPage;
        }
        $settings = $data['settings'];
        if ($settings['gutter'] == 'individuell') {
            $gutter = $settings['individuell'];
        } else {
            $gutter = $settings['gutter'];
        }
        $formSettings = [
            'col' => $settings['col'],
            'gutter' => $gutter
        ];

        $visibility = '';
        $deactivate = '';
        $conditionsArr = [];
        $conFields = [];

        foreach ($data['conditions'] as $tmp) {
            if ($tmp['type'] == 'show') {
                $visibility = false;
                $deactivate = false;
            }
            if ($tmp['type'] == 'hide') {
                $visibility = true;
                $deactivate = false;
            }
            if ($tmp['type'] == 'deactivate') {
                $visibility = true;
                $deactivate = false;
            }
            if ($tmp['type'] == 'activate') {
                $visibility = true;
                $deactivate = true;
            }
            $item = [
                'id' => $tmp['id'],
                'visibility' => $visibility,
                'deactivate' => $deactivate
            ];
            $conditionsArr[] = $item;
            foreach ($tmp['group'] as $group) {
                foreach ($group['rules'] as $rule) {
                    $conFields[] = $rule['field'];
                }
            }
        }

        $pages = array_merge(array_unique(array_filter($pages)));
        $conFields = array_merge(array_unique(array_filter($conFields)));
        unset($data['send_email']);

        $data['builder'] = $builder;

        $this->responseJson->status = true;
        $this->responseJson->form_id = $data['id'];
        $this->responseJson->page = $page;
        $this->responseJson->pages = $pages;
        $this->responseJson->record = $builderArr;
        $this->responseJson->form_settings = $formSettings;
        $this->responseJson->conditions = $conditionsArr;
        $this->responseJson->con_fields = $conFields;
        $this->responseJson->error_messages = $data['message']['email_sent'][2]['value'];
        $this->responseJson->random = uniqid();
        return $this->responseJson;
    }

    private function check_form_condition(): object
    {
        $builder_id = filter_var($this->data->get('builder_id'), FILTER_UNSAFE_RAW);
        $formsId = filter_var($this->data->get('form'), FILTER_UNSAFE_RAW);
        $data = filter_var($this->data->get('data'), FILTER_UNSAFE_RAW);
        $value = filter_var($this->data->get('value'), FILTER_UNSAFE_RAW);

        if (!$builder_id || !$formsId || !$data) {
            return $this->responseJson;
        }

        $forms = $this->em->getRepository(Forms::class)->findOneBy(['formId' => $builder_id]);
        if (!$forms) {
            return $this->responseJson;
        }
        $formData = $forms->getForm();
        $data = json_decode($data, true);
        $ruleArr = [];
        $conId = '';
        $conType = '';

        foreach ($formData['conditions'] as $tmp) {
            foreach ($tmp['group'] as $group) {
                foreach ($group['rules'] as $rule) {
                    $conField = $rule['field'];
                    if ($rule['value'] == $value) {
                        $ruleArr = $tmp['group'];
                        $conId = $tmp['id'];
                        $conType = $tmp['type'];
                    } else {
                        if ($rule['field'] == $formsId) {
                            $ruleArr = $tmp['group'];
                            $conId = $tmp['id'];
                            $conType = $tmp['type'];
                        }
                    }
                }
            }
        }
        $ra = [];
        if (!$ruleArr) {
            $this->responseJson->status = false;
            $this->responseJson->condition = $conId;
            $this->responseJson->con_type = $conType;

            return $this->responseJson;
        }
        foreach ($ruleArr as $tmp) {
            $ri = [];
            foreach ($tmp['rules'] as $rule) {
                $ruleItem = [
                    'compare' => $rule['compare'],
                    'if_option' => $rule['is_select'],
                    'field' => $rule['field'],
                    'value' => $rule['value']
                ];
                $ri[] = $ruleItem;
            }
            $item = [
                'rules' => $ri
            ];
            $ra[] = $item;
        }
        if (!$ra) {
            $this->responseJson->msg = __LINE__;

            return $this->responseJson;
        }
        $rule_false = 0;
        $r = 0;
        foreach ($ra as $tmp) {
            foreach ($tmp['rules'] as $rule) {

                $check = $this->get_rule_data_condition($data, $conType, $rule['field'], $rule['value'], $rule['compare']);
                if (!$check) {
                    $rule_false++;
                }
            }
            if ($rule_false == 0) {

                $this->responseJson->status = true;
                $this->responseJson->condition = $conId;
                $this->responseJson->con_type = $conType;

                return $this->responseJson;
            }

            if ($r > 0) {
                $rule_false = 0;
                foreach ($tmp['rules'] as $rule) {
                    $check = $this->get_rule_data_condition($data, $conType, $rule['field'], $rule['value'], $rule['compare']);
                    if (!$check) {
                        $rule_false++;
                    }
                }
            }
            $r++;
        }

        if ($rule_false == 0) {
            $this->responseJson->status = true;
            $this->responseJson->condition = $conId;
            $this->responseJson->con_type = $conType;

            return $this->responseJson;
        }

        $this->responseJson->condition = $conId;
        $this->responseJson->con_type = $conType;
        $this->responseJson->status = false;
        return $this->responseJson;
    }

    /**
     * @throws Exception
     */
    private function chunk_upload(): object
    {

        $chunkIndex = filter_var($this->data->get('dzchunkindex'), FILTER_VALIDATE_INT);
        $chunksCount = filter_var($this->data->get('dztotalchunkcount'), FILTER_VALIDATE_INT);
        $file_id = filter_var($this->data->get('dzuuid'), FILTER_UNSAFE_RAW);
        $file_name = filter_var($this->data->get('filename'), FILTER_UNSAFE_RAW);
        $file = $this->data->files->get('file');
        $upload = $this->uploaderHelper->upload($file, $file_id, $this->uploaderHelper::ATTACHMENT, false, true, intval($chunkIndex) ?? 0, intval($chunksCount) ?? 0);
        if ($upload) {
            $this->responseJson->file = $upload;
            $this->responseJson->id = $file_id;
            $this->responseJson->file_name = $file_name;
            $this->responseJson->status = true;
        }
        return $this->responseJson;
    }

    /**
     * @throws FilesystemException
     */
    private function delete_upload_file(): object
    {
        $file_id = filter_var($this->data->get('file_id'), FILTER_UNSAFE_RAW);
        $fileData = filter_var($this->data->get('data'), FILTER_UNSAFE_RAW);
        if ($fileData) {
            $fileData = json_decode($fileData, true);
            if (isset($fileData['files']) && $fileData['files']) {
                foreach ($fileData['files'] as $tmp) {
                    if ($file_id == $tmp['id']) {
                        $this->uploaderHelper->deleteFile($tmp['file'], $this->uploaderHelper::ATTACHMENT, false);
                    }
                }
            }
        }
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    /**
     * @throws SendFailed
     * @throws NoConnection
     * @throws NoTimeout
     * @throws NoMailFrom
     * @throws NoHelo
     */
    private function formular_builder_send(): object
    {
        $builder = filter_var($this->data->get('builder'), FILTER_UNSAFE_RAW);
        $data = filter_var($this->data->get('data'), FILTER_UNSAFE_RAW);
        $email = filter_var($this->data->get('email'), FILTER_UNSAFE_RAW);
        $name = filter_var($this->data->get('name'), FILTER_UNSAFE_RAW);
        $terms = filter_var($this->data->get('terms'), FILTER_VALIDATE_BOOLEAN);

        if (!$builder || !$data) {
            return $this->responseJson;
        }

        $forms = $this->em->getRepository(Forms::class)->findOneBy(['formId' => $builder]);
        if (!$forms) {
            return $this->responseJson;
        }
        $helper = Helper::instance();

        $builderData = $forms->getForm();
        $formName = $forms->getDesignation();

        $message = $builderData['message']['email_sent'];
        $sendEmail = $builderData['send_email'];
        $emailTxt = html_entity_decode($sendEmail['email']['message']);
        $emailResponder = html_entity_decode($sendEmail['responder']['message']);
        $emailTxt = $helper->replace_template($emailTxt);
        $emailResponder = $helper->replace_template($emailResponder);

        if ($email || $name || $terms) {
            foreach ($message as $tmp) {
                if ($tmp['id'] == 4) {
                    $this->responseJson->error = 4;
                    $this->responseJson->msg = $tmp['value'];
                    break;
                }
            }
            return $this->responseJson;
        }


        $data = json_decode($data, true);
        $formData = [];


        foreach ($data as $tmp) {
            if ($tmp['form']['type'] == 'button' || $tmp['form']['type'] == 'html' || $tmp['form']['type'] == 'hr' || $tmp['form']['type'] == 'placeholder') {
                continue;
            }
            $formData[] = $tmp;
        }

        $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
        $appEmail = $settings->getEmail()['forms'];

        $errorLabel = [];
        $sendData = [];
        $summaryData = [];
        $summary = '';
        $sendEmailTo = '';
        $anhangData = [];
        $responderEmail = '';

        foreach ($formData as $tmp) {
            $form = $tmp['form'];
            $validate = $this->get_validate_form_field($builderData, $tmp['grid'], $form, $form['type']);
            if (!$validate->status) {
                $errorLabel[] = $validate->label;
            } else {
                if ($form['type'] == 'select' || $form['type'] == 'radio') {
                    foreach ($form['options'] as $option) {
                        if ($form['config']['selected'] == $option['id']) {
                            $form['config']['default'] = $option['value'];

                            if ($form['type'] == 'select') {
                                $sendEmailTo = $form['config']['default'];
                            }
                            $item = [
                                'label' => $form['label'],
                                'slug' => $form['slug'],
                                'type' => $form['type'],
                                'value' => $form['config']['default'],
                            ];
                            $emailTxt = str_replace('{' . $form['slug'] . '}', $form['config']['default'], $emailTxt);
                            $emailResponder = str_replace('{' . $form['slug'] . '}', $form['config']['default'], $emailResponder);
                            $summary .= '<div><strong>' . $form['label'] . ': </strong>' . $form['config']['default'] . '</div>';
                            $sendData[] = $item;
                        }
                    }
                }
                if ($form['type'] == 'checkbox') {
                    $items = [];

                    foreach ($form['options'] as $option) {
                        if ($option['checked']) {
                            $items[] = [
                                'label' => $option['label'],
                                'value' => $option['value']
                            ];
                        }
                    }
                    $liTxt = '';
                    $summary .= '<div><strong>' . $form['label'] . '</strong></div>';
                    $summary .= '<ul>';
                    if ($items) {
                        foreach ($items as $it) {
                            $summary .= '<li>' . $it['label'] . ' <small>(' . $it['value'] . ')</small></li>';
                            $liTxt .= '<li>' . $it['label'] . ' <small>(' . $it['value'] . ')</small></li>';
                        }
                    }
                    $txt = '<ul>' . $liTxt . '</ul>';
                    $emailTxt = str_replace('{' . $form['slug'] . '}', $txt, $emailTxt);
                    $emailResponder = str_replace('{' . $form['slug'] . '}', $txt, $emailResponder);
                    $summary .= '</ul>';
                    $item = [
                        'label' => $form['label'],
                        'slug' => $form['slug'],
                        'type' => $form['type'],
                        'value' => $items
                    ];
                    $sendData[] = $item;
                }

                if ($form['type'] == 'switch') {
                    $items = [];
                    foreach ($form['options'] as $option) {
                        if ($option['default']) {
                            $items[] = [
                                'label' => $option['label'],
                                'value' => $option['value']
                            ];
                        }
                    }
                    $liTxt = '';
                    $summary .= '<div><strong>' . $form['label'] . '</strong></div>';
                    $summary .= '<ul>';
                    if ($items) {
                        foreach ($items as $it) {
                            $summary .= '<li>' . $it['label'] . ' <small>(' . $it['value'] . ')</small></li>';
                            $liTxt .= '<li>' . $it['label'] . ' <small>(' . $it['value'] . ')</small></li>';
                        }
                    }
                    $txt = '<ul>' . $liTxt . '</ul>';
                    $emailTxt = str_replace('{' . $form['slug'] . '}', $txt, $emailTxt);
                    $emailResponder = str_replace('{' . $form['slug'] . '}', $txt, $emailResponder);
                    $summary .= '</ul>';
                    $item = [
                        'label' => $form['label'],
                        'slug' => $form['slug'],
                        'type' => $form['type'],
                        'value' => $items
                    ];
                    $sendData[] = $item;
                }

                if ($form['type'] == 'upload') {
                    $item = [
                        'label' => $form['label'],
                        'slug' => $form['slug'],
                        'type' => $form['type'],
                        'value' => $form['config']['default']['files']
                    ];
                    $anhangData = $form['config']['default']['files'];
                    $sendData[] = $item;
                }

                if ($form['type'] == 'credit-card') {
                    $item = [
                        'label' => $form['label'],
                        'slug' => $form['slug'],
                        'type' => $form['type'],
                        'value' => $form['options']
                    ];
                    $summary .= '<div><strong>' . $form['label'] . ': </strong></div>';
                    $txt = '';
                    if ($validate->show_name) {
                        $summary .= '<strong>';
                        $summary .= $validate->label_name;
                        $summary .= ': </strong>' . $item['value']['full_name'] . '<br/>';
                        $txt .= '<br><strong>' . $validate->label_name . ': </strong>' . $item['value']['full_name'] . '<br/>';
                    }
                    $summary .= '<strong>';
                    $summary .= $validate->label_card_number;
                    $summary .= ': </strong>' . $item['value']['card_number'] . '<br/>';
                    $txt .= '<strong>' . $validate->label_card_number . ': </strong>' . $item['value']['card_number'] . '<br/>';

                    if ($validate->show_date) {
                        $summary .= '<strong>';
                        $summary .= $validate->label_card_date;
                        $summary .= ': </strong>' . $item['value']['expiry_date'] . '<br/>';
                        $txt .= '<strong>' . $validate->label_card_date . ': </strong>' . $item['value']['expiry_date'] . '<br/>';
                    }
                    if ($validate->show_cvc) {
                        $summary .= '<strong>';
                        $summary .= $validate->label_card_cvc;
                        $summary .= ': </strong>' . $item['value']['cvc'] . '<br/>';
                        $txt .= '<strong>' . $validate->label_card_cvc . ': </strong>' . $item['value']['cvc'];
                    }
                    $emailTxt = str_replace('{' . $form['slug'] . '}', $txt, $emailTxt);
                    $emailResponder = str_replace('{' . $form['slug'] . '}', $txt, $emailResponder);
                    $sendData[] = $item;
                }

                if ($form['type'] == 'credit-card-date') {
                    $item = [
                        'label' => $form['label'],
                        'slug' => $form['slug'],
                        'type' => $form['type'],
                        'value' => $form['options']['expiry_date']
                    ];
                    $summary .= '<strong>';
                    $summary .= $item['label'];
                    $summary .= ': </strong>' . $item['value'] . '<br/>';
                    $emailTxt = str_replace('{' . $form['slug'] . '}', $item['value'], $emailTxt);
                    $emailResponder = str_replace('{' . $form['slug'] . '}', $item['value'], $emailResponder);
                    $sendData[] = $item;
                }

                if ($form['type'] == 'credit-card-cvc') {
                    $item = [
                        'label' => $form['label'],
                        'slug' => $form['slug'],
                        'type' => $form['type'],
                        'value' => $form['options']['cvc']
                    ];
                    $summary .= '<strong>';
                    $summary .= $item['label'];
                    $summary .= ': </strong>' . $item['value'] . '<br/>';
                    $emailTxt = str_replace('{' . $form['slug'] . '}', $item['value'], $emailTxt);
                    $emailResponder = str_replace('{' . $form['slug'] . '}', $item['value'], $emailResponder);
                    $sendData[] = $item;
                }

                if ($form['type'] == 'text' ||
                    $form['type'] == 'textarea' ||
                    $form['type'] == 'number' ||
                    $form['type'] == 'phone' ||
                    $form['type'] == 'password' ||
                    $form['type'] == 'tinymce' ||
                    $form['type'] == 'date' ||
                    $form['type'] == 'color' ||
                    $form['type'] == 'range' ||
                    $form['type'] == 'rating' ||
                    $form['type'] == 'email' ||
                    $form['type'] == 'url' ||
                    $form['type'] == 'privacy-check'
                ) {
                    if ($form['type'] == 'email') {
                        if ($validate->is_autoresponder) {
                            $responderEmail = filter_var($form['config']['default'], FILTER_VALIDATE_EMAIL);
                        }
                    }
                    if ($form['type'] == 'tinymce') {
                        if ($validate->sanitize == 'restriktiv') {
                            $form['config']['default'] = strip_tags($form['config']['default']);
                        }
                        if ($validate->sanitize == 'permissiv') {
                            $form['config']['default'] = $this->better_strip_tags(html_entity_decode($form['config']['default']), '<span><ul><li><ol><p><br><b><strong><h1><h2><h3><h4><h5><h6>');
                            $form['config']['default'] = $helper->replace_template($form['config']['default']);
                        }
                    } else {
                        $form['config']['default'] = $helper->pregWhitespace(htmlentities($form['config']['default']));
                    }
                    if ($form['type'] == 'privacy-check') {
                        if ($form['config']['selected']) {
                            $form['config']['default'] = $this->translator->trans('forms.Data protection accepted');
                        } else {
                            $form['config']['default'] = $this->translator->trans('forms.Data protection not accepted');
                        }
                    }
                    $item = [
                        'label' => $form['label'],
                        'slug' => $form['slug'],
                        'type' => $form['type'],
                        'value' => $form['config']['default']
                    ];
                    $summary .= '<strong>';
                    $summary .= $item['label'];
                    $summary .= ': </strong>';
                    $summary .= $item['value'] . '<br/>';
                    $emailTxt = str_replace('{' . $form['slug'] . '}', $item['value'], $emailTxt);
                    $emailResponder = str_replace('{' . $form['slug'] . '}', $item['value'], $emailResponder);
                    $sendData[] = $item;
                }
            }
        }

        $emailTxt = str_replace('{summary}', $summary, $emailTxt);
        $emailResponder = str_replace('{summary}', $summary, $emailResponder);

        $emailTxt = $helper->replace_template($emailTxt);
        $emailResponder = $helper->replace_template($emailResponder);

        if ($errorLabel) {
            foreach ($message as $m) {
                if ($m['id'] == 3) {
                    $this->responseJson->error = 3;
                    $this->responseJson->msg = $m['value'];
                }
                if ($m['id'] == 6) {
                    $this->responseJson->error = 6;
                    $this->responseJson->error_headline = $m['value'];
                }
            }
            $this->responseJson->error_label = implode(', ', $errorLabel);
            return $this->responseJson;
        }
        $attach = [];
        $attachDir = $this->uploadsPrivatePath . $this->uploaderHelper::ATTACHMENT . DIRECTORY_SEPARATOR;

        if ($anhangData) {
            foreach ($anhangData as $anhang) {

                if (is_file($attachDir . $anhang['file'])) {
                    $item = [
                        'file' => $attachDir . $anhang['file'],
                        'name' => Urlizer::urlize($anhang['file_name'], '-'),
                        'file_name' => $anhang['file']
                    ];
                    $attach[] = $item;
                }
            }
        }
        $sendEmail['email']['cc'] ? $cc = $sendEmail['email']['cc'] : $cc = [];
        $sendEmail['email']['bcc'] ? $bcc = $sendEmail['email']['bcc'] : $bcc = [];
        if ($cc) {
            $cc = $helper->trim_string($cc);
            $cc = str_replace([',', ';'], '#', $cc);
            $cc = explode('#', $cc);
            $cc = array_merge(array_unique(array_filter($cc)));
        }
        if ($bcc) {
            $bcc = $helper->trim_string($bcc);
            $bcc = str_replace([',', ';'], '#', $bcc);
            $bcc = explode('#', $bcc);
            $bcc = array_merge(array_unique(array_filter($bcc)));
        }

        if ($sendEmailTo && filter_var($sendEmailTo, FILTER_VALIDATE_EMAIL)) {
            $to = $sendEmailTo;
        } else {
            $to = $sendEmail['email']['recipient'];
        }
        $re = '/{.+?}/m';
        preg_match_all($re, $emailTxt, $matches);
        if ($matches) {
            foreach ($matches as $tmp) {
                $emailTxt = str_replace($tmp, '', $emailTxt);
            }
        }
        preg_match_all($re, $emailResponder, $matches);
        if ($matches) {
            foreach ($matches as $tmp) {
                $emailResponder = str_replace($tmp, '', $emailResponder);
            }
        }

        $sendEmail['email']['subject'] ? $subject = $sendEmail['email']['subject'] : $subject = $settings->getApp()['site_name'];
        $args = [
            'async' => $appEmail['async_active'],
            'type' => 'public-email',
            'subject' => $subject,
            'formular' => $formName,
            'from' => $appEmail['abs_email'],
            'from_name' => $appEmail['abs_name'],
            'template' => 'send-public-email.html.twig',
            'to' => $to,
            'context' => [
                'content' => $emailTxt
            ],
            'attachments' => $attach,
            'cc' => $cc,
            'bcc' => $bcc,
        ];

        $this->bus->dispatch(new SavePublicEmail($args));

        if ($responderEmail && $sendEmail['responder']['active']) {
            $sendEmail['responder']['subject'] ? $subject = $sendEmail['responder']['subject'] : $subject = $settings->getApp()['site_name'];
            $args = [
                'async' => $appEmail['async_active'],
                'type' => 'public-email',
                'subject' => $subject,
                'formular' => $formName,
                'from' => $appEmail['abs_email'],
                'from_name' => $appEmail['abs_name'],
                'template' => 'send-public-email.html.twig',
                'to' => $responderEmail,
                'context' => [
                    'content' => $emailResponder
                ],
                'attachments' => [],
                'cc' => [],
                'bcc' => [],
            ];

            $this->bus->dispatch(new SavePublicEmail($args));
        }
        $selfUrl = $this->data->getSchemeAndHttpHost();
        $uri = $this->urlGenerator->generate('app_public_slug', ['slug' => 'cron']);
        $cronUrl = $selfUrl . $uri;
        // $cmd = sprintf('curl -s  "%s"  > /dev/null 2>&1 &', $cronUrl);
        // exec($cmd);

        foreach ($message as $m) {
            if ($m['id'] == 1) {
                $this->responseJson->msg = $m['value'];
            }
        }
        // $pid = posix_getpid();
        //    $exe = exec("readlink -f /proc/$pid/exe");
        //   dd($exe , PHP_BINARY);
        $selfUrl = $this->data->getHost();
      /*  if($selfUrl == 'localhost') {
            $path = 'php';
        } else {
           // $path = PHP_BINARY;
            $path = PHP_BINARY;
            $re = '/\d(.+)/m';
            preg_match($re, $path, $matches);
            $version = $matches[0] ?? '';
            $path = 'php'.$version;
            $path = str_replace('-fpm','', $path);
        }*/
        $path = $this->data->server->get('PHP_VERSION_DATA');
        $cmd = sprintf('%s %s/bin/console messenger:stop-workers', $path, $this->projectDir);
        exec($cmd);
        $cmd = sprintf('%s %s/bin/console messenger:consume scheduler_send_mail > /dev/null 2>&1 &', $path, $this->projectDir);
        exec($cmd);
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function get_validate_form_field($builderForm, $gridId, $dataForm, $type = null): object
    {

        $return = new stdClass();
        $return->status = false;
        $return->label = '';

        foreach ($builderForm['builder'] as $tmp) {
            foreach ($tmp['grid'] as $grid) {
                if ($grid['id'] == $gridId) {
                    foreach ($grid['forms'] as $form) {
                        if ($form['id'] == $dataForm['id']) {
                            if ($type == 'checkbox') {
                                foreach ($form['options'] as $option) {
                                    if ($option['required']) {
                                        foreach ($dataForm['options'] as $dataOptions) {
                                            if ($dataOptions['id'] == $option['id'] && !$dataOptions['checked']) {
                                                $return->label = $form['label'];
                                                return $return;
                                            }
                                        }
                                    } else {
                                        $return->status = true;
                                        return $return;
                                    }
                                }
                            }
                            if ($type == 'select') {
                                $return->send_email = $form['config']['send_email'];
                                if ($form['required']) {
                                    if ($dataForm['config']['selected']) {

                                        $return->status = true;
                                    } else {
                                        $return->label = $form['label'];
                                    }
                                    return $return;
                                }
                                $return->status = true;
                                return $return;
                            }

                            if ($type == 'radio') {
                                foreach ($dataForm['options'] as $dataOptions) {
                                    if ($dataOptions['checked']) {
                                        $return->status = true;
                                        return $return;
                                    }
                                }
                                $return->label = $form['label'];
                                return $return;
                            }

                            if ($type == 'text' ||
                                $type == 'textarea' ||
                                $type == 'number' ||
                                $type == 'phone' ||
                                $type == 'password' ||
                                $type == 'tinymce' ||
                                $type == 'date' ||
                                $type == 'color' ||
                                $type == 'range' ||
                                $type == 'rating'
                            ) {
                                if ($type == 'tinymce') {
                                    $return->sanitize = $form['config']['sanitize'];
                                }
                                if ($form['required'] && !$dataForm['config']['default']) {
                                    $return->label = $form['label'];
                                } else {
                                    $return->status = true;
                                }

                                return $return;
                            }
                            if ($type == 'url') {
                                if ($form['required'] && !$dataForm['config']['default']) {
                                    $return->label = $form['label'];
                                    return $return;
                                }
                                if ($dataForm['config']['default']) {
                                    $status = filter_var($dataForm['config']['default'], FILTER_VALIDATE_URL);
                                    if ($status) {
                                        $return->status = true;
                                    } else {
                                        $return->label = $form['label'];
                                    }
                                    return $return;
                                }
                                $return->status = true;
                                return $return;
                            }
                            if ($type == 'email') {
                                $return->is_autoresponder = $form['is_autoresponder'] ?? false;
                                if ($form['required'] && !$dataForm['config']['default']) {
                                    $return->label = $form['label'];
                                    return $return;
                                }
                                if ($dataForm['config']['default']) {
                                    $status = filter_var($dataForm['config']['default'], FILTER_VALIDATE_EMAIL);
                                    if ($status) {
                                        $return->status = true;
                                    } else {
                                        $return->label = $form['label'];
                                    }

                                    return $return;
                                }


                                $return->status = true;
                                return $return;
                            }
                            if ($type == 'button' || $type == 'switch') {
                                $return->status = true;
                                return $return;
                            }
                            if ($type == 'credit-card-date') {
                                if ($form['required'] && !$dataForm['options']['expiry_date']) {
                                    $return->label = $form['label'];
                                    return $return;
                                }
                                $return->status = true;
                                return $return;
                            }
                            if ($type == 'credit-card-cvc') {
                                if ($form['required'] && !$dataForm['options']['cvc']) {
                                    $return->label = $form['label'];
                                    return $return;
                                }
                                $return->status = true;
                                return $return;
                            }
                            if ($type == 'credit-card') {

                                $return->label_name = $form['options']['label_name'];
                                $return->label_card_number = $form['options']['label_card_number'];
                                $return->label_card_date = $form['options']['label_card_date'];
                                $return->label_card_cvc = $form['options']['label_card_cvc'];
                                $return->show_name = $form['options']['show_name'];
                                $return->show_date = $form['options']['show_date'];
                                $return->show_cvc = $form['options']['show_cvc'];
                                if ($form['required']) {
                                    if ($form['options']['show_cvc'] && !$dataForm['options']['cvc']) {
                                        $return->label = $this->translator->trans('forms.CVC');
                                        return $return;
                                    }

                                    if ($form['options']['show_name'] && !$dataForm['options']['full_name']) {
                                        $return->label = $this->translator->trans('forms.Full name');
                                        return $return;
                                    }
                                    if ($form['options']['show_date'] && !$dataForm['options']['expiry_date']) {
                                        $return->label = $this->translator->trans('forms.Expiry date');
                                        return $return;
                                    }
                                    if (!$dataForm['options']['card_number']) {
                                        $return->label = $this->translator->trans('forms.Card Number');
                                        return $return;
                                    }
                                }

                                $return->status = true;
                                return $return;
                            }
                            if ($type == 'upload') {
                                if ($form['required']) {
                                    $default = $dataForm['config']['default'];
                                    $files = $default['files'] ?? null;
                                    if (!$files) {
                                        $return->label = $form['label'];
                                        return $return;
                                    }
                                    if (!count($files)) {
                                        $return->label = $form['label'];
                                        return $return;
                                    }
                                }
                                $return->status = true;
                                return $return;
                            }
                            if ($type == 'privacy-check') {
                                if (!$dataForm['config']['selected']) {
                                    $return->label = $form['label'];
                                    return $return;
                                }
                                $return->status = true;
                                return $return;
                            }
                        }
                    }
                }
            }
        }

        return $return;
    }

    private function get_rule_data_condition($data, $type, $field, $value, $compare)
    {
        foreach ($data as $tmp) {
            $form = $tmp['form'];
            if ($form['id'] == $field) {

                if ($form['type'] == 'switch' || $form['type'] == 'checkbox') {
                    foreach ($form['options'] as $option) {
                        if ($option['id'] == $value) {
                            if ($form['type'] == 'checkbox') {
                                switch ($compare) {
                                    case 'is':
                                    case 'isnot':
                                        return $option['checked'];
                                    case 'greater':
                                        return $option['default'] > $value;
                                    case 'smaller':
                                        return $option['default'] < $value;
                                    case 'contains':
                                        if (preg_match("~$value~", $option['default'])) {
                                            return true;
                                        }
                                        break;
                                    default :
                                        return false;
                                }
                            }
                            if ($option['default']) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }
                }

                switch ($compare) {
                    case 'is':
                        if ($form['type'] == 'select' || $form['type'] == 'radio' || $form['type'] == 'privacy-check') {
                            return $form['config']['selected'] == $value;
                        }

                        return $form['config']['default'] == $value;
                    case 'isnot':
                        if ($form['type'] == 'select' || $form['type'] == 'radio') {
                            return $form['config']['selected'] != $value;
                        }

                        return $form['config']['default'] != $value;
                    case 'greater':
                        if ($form['type'] == 'select' || $form['type'] == 'radio') {
                            return $form['config']['selected'] > $value;
                        }

                        return (int)$form['config']['default'] > (int)$value;
                    case 'smaller':
                        if ($form['type'] == 'select' || $form['type'] == 'radio') {
                            return $form['config']['selected'] < $value;
                        }

                        return (int)$form['config']['default'] < (int)$value;
                    case 'contains':
                        if ($form['type'] == 'select' || $form['type'] == 'radio') {
                            if (preg_match("~$value~", $form['config']['selected'])) {
                                return true;
                            }
                        }
                        if (preg_match("~$value~", $form['config']['default'])) {
                            return true;
                        }

                        return false;
                }
            }
        }
        return false;
    }

    private function better_strip_tags($str, $allowable_tags = '', $strip_attrs = false, $preserve_comments = false, callable $callback = null): string
    {
        $closing = '';
        $allowable_tags = array_map('strtolower', array_filter( // lowercase
            preg_split('/(?:>|^)\\s*(?:<|$)/', $allowable_tags, -1, PREG_SPLIT_NO_EMPTY), // get tag names
            function ($tag) {
                return preg_match('/^[a-z][a-z0-9_]*$/i', $tag);
            } // filter broken
        ));
        $tag = '';
        $comments_and_stuff = preg_split('/(<!--.*?(?:-->|$))/', $str, -1, PREG_SPLIT_DELIM_CAPTURE);
        foreach ($comments_and_stuff as $i => $comment_or_stuff) {
            if ($i % 2) { // html comment
                if (!($preserve_comments && preg_match('/<!--.*?-->/', $comment_or_stuff))) {
                    $comments_and_stuff[$i] = '';
                }
            } else { // stuff between comments
                $tags_and_text = preg_split("/(<(?:[^>\"']++|\"[^\"]*+(?:\"|$)|'[^']*+(?:'|$))*(?:>|$))/", $comment_or_stuff, -1, PREG_SPLIT_DELIM_CAPTURE);
                foreach ($tags_and_text as $j => $tag_or_text) {
                    $is_broken = false;
                    $is_allowable = true;
                    $result = $tag_or_text;
                    if ($j % 2) { // tag
                        if (preg_match("%^(</?)([a-z][a-z0-9_]*)\\b(?:[^>\"'/]++|/+?|\"[^\"]*\"|'[^']*')*?(/?>)%i", $tag_or_text, $matches)) {
                            $tag = strtolower($matches[2]);
                            if (in_array($tag, $allowable_tags)) {
                                if ($strip_attrs) {
                                    $opening = $matches[1];
                                    $closing = ($opening === '</') ? '>' : $closing;
                                    $result = $opening . $tag . $closing;
                                }
                            } else {
                                $is_allowable = false;
                                $result = '';
                            }
                        } else {
                            $is_broken = true;
                            $result = '';
                        }
                    } else { // text
                        $tag = false;
                    }
                    if (!$is_broken && isset($callback)) {
                        // allow result modification
                        call_user_func_array($callback, array(&$result, $tag_or_text, $tag, $is_allowable));
                    }
                    $tags_and_text[$j] = $result;
                }
                $comments_and_stuff[$i] = implode('', $tags_and_text);
            }
        }
        return implode('', $comments_and_stuff);
    }
}
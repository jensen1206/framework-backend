<?php

namespace App\Settings;

use App\AppHelper\Helper;

trait FormularSettings
{

    protected string $version = '1.0.0';


    protected function default_message()
    {

    }

    protected function form_types($group = '', $type = '', $id = ''): array
    {
        $helper = Helper::instance();
        $selectId = uniqid();
        $radioChecked = uniqid();
        $switchChecked = uniqid();
        $forms = [
            '0' => [
                'name' => 'Basic',
                'slug' => 'basic',
                'forms' => [
                    '0' => [
                        'id' => uniqid(),
                        'label' => $this->translator->trans('forms.Label Text'),
                        'form_type' => 'textfeld',
                        'slug' => 'textfeld_' . $helper->generate_callback_pw(6, 0, 6),
                        'show_msg' => true,
                        'type' => 'text',
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => $this->translator->trans('forms.Text'),
                        'icon' => 'bi bi-card-text',
                        'err_msg' => $this->translator->trans('forms.This field must be filled in.'),
                        'condition' => [],
                        'options' => [],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => '',
                            'custom_class' => ''
                        ],
                    ],
                    '1' => [
                        'id' => uniqid(),
                        'label' => $this->translator->trans('forms.Label email'),
                        'form_type' => 'textfeld',
                        'slug' => 'email_' . $helper->generate_callback_pw(6, 0, 6),
                        'show_msg' => true,
                        'type' => 'email',
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'is_autoresponder' => true,
                        'select' => $this->translator->trans('forms.Email'),
                        'icon' => 'bi bi-envelope',
                        'err_msg' => $this->translator->trans('forms.The e-mail address you entered is invalid.'),
                        'condition' => [],
                        'options' => [],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => '',
                            'custom_class' => ''
                        ],
                    ],
                    '2' => [
                        'id' => uniqid(),
                        'label' => $this->translator->trans('forms.Label Number'),
                        'form_type' => 'textfeld',
                        'slug' => 'number_' . $helper->generate_callback_pw(6, 0, 6),
                        'show_msg' => true,
                        'type' => 'number',
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => $this->translator->trans('forms.Number'),
                        'icon' => 'bi bi-123',
                        'err_msg' => $this->translator->trans('forms.The number format is invalid.'),
                        'condition' => [],
                        'options' => [],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => '',
                            'custom_class' => ''
                        ],
                    ],
                    '3' => [
                        'id' => uniqid(),
                        'label' => $this->translator->trans('forms.Label Textarea'),
                        'form_type' => 'textfeld',
                        'slug' => 'message_' . $helper->generate_callback_pw(6, 0, 6),
                        'show_msg' => true,
                        'type' => 'textarea',
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => $this->translator->trans('forms.Textarea'),
                        'icon' => 'bi bi-textarea-t',
                        'err_msg' => $this->translator->trans('forms.This field must be filled in.'),
                        'condition' => [],
                        'options' => [],
                        'config' => [
                            'rows' => 4,
                            'height' => 100,
                            'caption' => '',
                            'placeholder' => '',
                            'default' => '',
                            'custom_class' => ''
                        ],
                    ],
                    '4' => [
                        'id' => uniqid(),
                        'label' => $this->translator->trans('forms.Label Url'),
                        'form_type' => 'textfeld',
                        'slug' => 'url_' . $helper->generate_callback_pw(6, 0, 6),
                        'show_msg' => true,
                        'type' => 'url',
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => $this->translator->trans('forms.Url'),
                        'icon' => 'bi bi-globe-americas',
                        'err_msg' => $this->translator->trans('forms.The URL is invalid.'),
                        'condition' => [],
                        'options' => [],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => '',
                            'custom_class' => ''
                        ],
                    ],
                    '5' => [
                        'id' => uniqid(),
                        'label' => $this->translator->trans('forms.Label Phone'),
                        'form_type' => 'textfeld',
                        'slug' => 'phone_' . $helper->generate_callback_pw(6, 0, 6),
                        'type' => 'phone',
                        'show_msg' => true,
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => $this->translator->trans('forms.Phone'),
                        'icon' => 'bi bi-telephone',
                        'err_msg' => $this->translator->trans('forms.The format is invalid.'),
                        'condition' => [],
                        'options' => [],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => '',
                            'custom_class' => ''
                        ],
                    ],
                    '6' => [
                        'id' => uniqid(),
                        'label' => $this->translator->trans('forms.Label Password'),
                        'form_type' => 'textfeld',
                        'slug' => 'password_' . $helper->generate_callback_pw(6, 0, 6),
                        'show_msg' => true,
                        'type' => 'password',
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => $this->translator->trans('Password'),
                        'icon' => 'bi bi-incognito',
                        'err_msg' => $this->translator->trans('forms.This field must be filled in.'),
                        'condition' => [],
                        'options' => [],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => '',
                            'custom_class' => ''
                        ],
                    ],
                    '7' => [
                        'id' => uniqid(),
                        'label' => $this->translator->trans('forms.Hidden'),
                        'form_type' => 'textfeld',
                        'slug' => 'hidden_' . $helper->generate_callback_pw(6, 0, 6),
                        'show_msg' => true,
                        'type' => 'hidden',
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => $this->translator->trans('forms.Hidden'),
                        'icon' => 'bi bi-eye-slash',
                        'err_msg' => '',
                        'condition' => [],
                        'options' => [],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => '',
                            'custom_class' => ''
                        ],
                    ],
                    '8' => [
                        'id' => uniqid(),
                        'label' => $this->translator->trans('forms.Button'),
                        'form_type' => 'textfeld',
                        'slug' => 'button_' . $helper->generate_callback_pw(6, 0, 6),
                        'show_msg' => false,
                        'type' => 'button',
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => $this->translator->trans('forms.Button'),
                        'icon' => 'bi bi-hand-index',
                        'err_msg' => '',
                        'condition' => [],
                        'options' => [
                            '0' => [
                                'type' => 'submit',
                                'name' => $this->translator->trans('forms.Submit'),
                            ],
                            '1' => [
                                'type' => 'button',
                                'name' => $this->translator->trans('forms.Button'),
                            ],
                            '2' => [
                                'type' => 'next',
                                'name' => $this->translator->trans('forms.next Page'),
                            ],
                            '3' => [
                                'type' => 'prev',
                                'name' => $this->translator->trans('forms.Previous page'),
                            ],
                            '4' => [
                                'type' => 'reset',
                                'name' => $this->translator->trans('forms.Reset'),
                            ],
                        ],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => false,
                            'custom_class' => '',
                            'btn_type' => 'submit',
                            'btn_class' => 'btn btn-secondary'
                        ],
                    ],
                    '9' => [
                        'id' => uniqid(),
                        'label' => $this->translator->trans('forms.Editor TinyMce'),
                        'form_type' => 'textfeld',
                        'slug' => 'tinymce_' . $helper->generate_callback_pw(6, 0, 6),
                        'type' => 'tinymce',
                        'show_msg' => true,
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => $this->translator->trans('forms.TinyMce'),
                        'icon' => 'bi bi-text-indent-left',
                        'err_msg' => $this->translator->trans('forms.This field must be filled in.'),
                        'condition' => [],
                        'options' => [
                            '0' => [
                                'type' => 'restriktiv',
                                'name' => $this->translator->trans('forms.Restrictive'),
                            ],
                            '1' => [
                                'type' => 'permissiv',
                                'name' => $this->translator->trans('forms.Permissive'),
                            ],
                        ],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => '',
                            'custom_class' => '',
                            'sanitize' => 'permissiv'
                        ],
                    ],
                ],
            ],
            '1' => [
                'name' => $this->translator->trans('forms.Select'),
                'slug' => 'select',
                'show_msg' => true,
                'forms' => [
                    '0' => [
                        'id' => uniqid(),
                        'label' => $this->translator->trans('forms.Select'),
                        'form_type' => 'select',
                        'slug' => 'select_' . $helper->generate_callback_pw(6, 0, 6),
                        'show_msg' => true,
                        'type' => 'select',
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => $this->translator->trans('forms.Select'),
                        'icon' => 'bi bi-caret-down',
                        'err_msg' => $this->translator->trans('forms.A field must be selected.'),
                        'condition' => [],
                        'options' => [
                            '0' => [
                                'default' => true,
                                'label' => $this->translator->trans('forms.please select'),
                                'value' => 'option_' . $selectId,
                                'id' => $selectId,
                            ]
                        ],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => '',
                            'custom_class' => '',
                            'selected' => $selectId,
                            'standard' => false,
                            'send_email' => false,
                        ],
                    ],
                    '1' => [
                        'id' => uniqid(),
                        'label' => 'Checkbox',
                        'form_type' => 'select',
                        'slug' => 'checkbox_' . $helper->generate_callback_pw(6, 0, 6),
                        'show_msg' => true,
                        'type' => 'checkbox',
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => 'Checkbox',
                        'icon' => 'bi bi-toggle-on',
                        'err_msg' => $this->translator->trans('forms.You must agree to this condition.'),
                        'condition' => [],
                        'options' => [
                            '0' => [
                                'checked' => false,
                                'required' => false,
                                'err_msg' => $this->translator->trans('forms.You must agree to this condition.'),
                                'label' => 'Checkbox',
                                'value' => 'checkbox_' . (int)$helper->generate_callback_pw(10, 0, 10),
                                'id' => uniqid(),
                            ]
                        ],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => '',
                            'custom_class' => '',
                            'switch' => true,
                            'inline' => false,
                            'animated' => false,
                            'animated_color' => '#0165E7'
                        ],
                    ],
                    '2' => [
                        'id' => uniqid(),
                        'label' => $this->translator->trans('forms.Radio'),
                        'form_type' => 'select',
                        'slug' => 'radio_' . $helper->generate_callback_pw(6, 0, 6),
                        'show_msg' => true,
                        'type' => 'radio',
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => $this->translator->trans('forms.Radio'),
                        'icon' => 'bi bi-ui-radios',
                        'err_msg' => $this->translator->trans('forms.A field must be selected.'),
                        'condition' => [],
                        'options' => [
                            '0' => [
                                'checked' => true,
                                'default' => true,
                                'label' => 'Radio 1',
                                'value' => 'radio_' . $radioChecked,
                                'id' => $radioChecked,
                            ],
                            '1' => [
                                'checked' => false,
                                'default' => false,
                                'label' => 'Radio 2',
                                'value' => 'radio_' . (int)$helper->generate_callback_pw(10, 0, 10),
                                'id' => uniqid(),
                            ]
                        ],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => '',
                            'custom_class' => '',
                            'selected' => $radioChecked,
                            'standard' => false,
                            'inline' => false,
                        ],
                    ],
                    '3' => [
                        'id' => uniqid(),
                        'label' => $this->translator->trans('forms.Switch'),
                        'form_type' => 'select',
                        'slug' => 'switch_' . $helper->generate_callback_pw(6, 0, 6),
                        'show_msg' => true,
                        'type' => 'switch',
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => $this->translator->trans('forms.Switch'),
                        'icon' => 'bi bi-ui-radios-grid',
                        'err_msg' => $this->translator->trans('forms.A field must be selected.'),
                        'condition' => [],
                        'options' => [
                            '0' => [
                                'default' => true,
                                'label' => $this->translator->trans('forms.Switch') . ' -1',
                                'value' => 'switch_' . $switchChecked,
                                'id' => $switchChecked,
                            ],
                            '1' => [
                                'default' => false,
                                'label' => $this->translator->trans('forms.Switch') . ' -2',
                                'value' => 'switch_' . (int)$helper->generate_callback_pw(10, 0, 10),
                                'id' => uniqid(),
                            ]
                        ],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => '',
                            'custom_class' => '',
                            'btn_size' => 'normal',
                            'alignment' => 'horizontal',
                            'selected' => $switchChecked,
                            'standard' => false,
                            // 'send_email'=> false,
                        ],
                    ],
                    '4' => [
                        'id' => uniqid(),
                        'label' => $this->translator->trans('forms.Date'),
                        'form_type' => 'select',
                        'slug' => 'date_' . $helper->generate_callback_pw(6, 0, 6),
                        'show_msg' => true,
                        'type' => 'date',
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => $this->translator->trans('forms.Date'),
                        'icon' => 'bi bi-calendar-date',
                        'err_msg' => $this->translator->trans('forms.The date format is incorrect.'),
                        'condition' => [],
                        'options' => [],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => '',
                            'custom_class' => '',
                            'date_type' => 'date',
                            'date_min' => '',
                            'date_max' => '',
                            // 'send_email'=> false,
                        ],
                    ],
                    '5' => [
                        'id' => uniqid(),
                        'label' => $this->translator->trans('forms.Colour picker'),
                        'form_type' => 'textfeld',
                        'slug' => 'color_' . $helper->generate_callback_pw(6, 0, 6),
                        'type' => 'color',
                        'show_msg' => true,
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => $this->translator->trans('forms.Colour picker'),
                        'icon' => 'bi bi-palette',
                        'err_msg' => $this->translator->trans('forms.This field must be filled in.'),
                        'condition' => [],
                        'options' => [],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => '#ffffff',
                            'custom_class' => ''
                        ],
                    ],//Sie müssen die {Datenschutzerklärung} akzeptieren.
                    '6' => [
                        'id' => uniqid(),
                        'label' => $this->translator->trans('forms.Privacy policy'),
                        'form_type' => 'select',
                        'slug' => 'privacy_check',
                        'show_msg' => true,
                        'type' => 'privacy-check',
                        'required' => true,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => $this->translator->trans('forms.Privacy policy'),
                        'icon' => 'bi bi-toggle-off',
                        'err_msg' => $this->translator->trans('forms.You must agree to this condition.'),
                        'condition' => [],
                        'options' => [],
                        'config' => [
                            'caption' => '',
                            'selected' => false,
                            'placeholder' => '',
                            'new_tab' => false,
                            'default' => $this->translator->trans('forms.Data protection information read and accepted.'),
                            'link' => '<a href="">' . $this->translator->trans('forms.Data protection information read and accepted.'),
                            'url' => '',
                            'custom_class' => '',
                            'switch' => false,
                            'inline' => false,
                            'animated' => false,
                            'animated_color' => '#0165E7'
                        ],
                    ],
                ]
            ],
            '2' => [
                'name' => $this->translator->trans('forms.File upload'),
                'slug' => 'upload',
                'show_msg' => true,
                'forms' => [
                    '0' => [
                        'id' => uniqid(),
                        'label' => $this->translator->trans('forms.File upload'),
                        'form_type' => 'upload',
                        'slug' => 'upload_' . $helper->generate_callback_pw(6, 0, 6),
                        'type' => 'upload',
                        'show_msg' => false,
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => $this->translator->trans('forms.File upload'),
                        'icon' => 'bi bi-upload',
                        'err_msg' => $this->translator->trans('forms.The selected file is invalid.'),
                        'condition' => [],
                        'options' => [],
                        'message' => [
                            //Datei auswählen
                            'drag_file_label' => $this->translator->trans('forms.Upload text'),
                            'drag_file_txt' => $this->translator->trans('forms.Drag & drop or click files here.'),
                            //erneut versuchen
                            //Datei ist zu groß
                            'file_large_label' => $this->translator->trans('forms.File is too large'),
                            'file_large_txt' => $this->translator->trans('forms.File is too large ({{filesize}} MB).') . $this->translator->trans('forms.Maximum file size {{maxFilesize}} MB.'),
                            //Maximale Dateigröße ist {filesize}
                            'max_filesize_label' => $this->translator->trans('forms.Maximum file size'),
                            'max_filesize_txt' => $this->translator->trans('forms.Maximum file size is {filesize}'),
                            //Maximale Uploads ({{maxFiles}}) überschritten.
                            'max_total_file_label' => $this->translator->trans('forms.Maximum total size of the file'),
                            'max_total_file_txt' => $this->translator->trans('forms.Maximum uploads ({{maxFiles}}) exceeded.'),
                            //Ungültiger Dateityp
                            'invalid_type_label' => $this->translator->trans('forms.Invalid file type'),
                            'invalid_type_txt' => $this->translator->trans('forms.Invalid file type'),

                        ],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => [
                                'files' => []
                            ],
                            'custom_class' => '',
                            'show_btn' => true,
                            'datei_select_txt' => $this->translator->trans('forms.Select file'),
                            'chunk_upload' => true,
                            'allowFileSizeValidation' => true,
                            'minFileSize' => '',
                            'maxTotalFileSize' => 10,
                            'maxFileSize' => 2,
                            'maxFiles' => 5,
                            'accept' => '.jpg,.jpeg,.png,.gif,.pdf',
                        ],
                    ]
                ]
            ],
            '3' => [
                'name' => $this->translator->trans('forms.Content'),
                'slug' => 'content',
                'show_msg' => true,
                'forms' => [
                    '0' => [
                        'id' => uniqid(),
                        'label' => $this->translator->trans('forms.HTML'),
                        'form_type' => 'html',
                        'slug' => 'html_' . $helper->generate_callback_pw(6, 0, 6),
                        'type' => 'html',
                        'show_msg' => false,
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => $this->translator->trans('forms.HTML'),
                        'icon' => 'bi bi-code-square',
                        'condition' => [],
                        'options' => [],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => '',
                            'custom_class' => ''
                        ],
                    ],
                    '1' => [
                        'id' => uniqid(),
                        'label' => $this->translator->trans('forms.HR Tag'),
                        'form_type' => 'html',
                        'slug' => 'hr_' . $helper->generate_callback_pw(6, 0, 6),
                        'type' => 'hr',
                        'show_msg' => false,
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => $this->translator->trans('forms.HR Tag'),
                        'icon' => 'bi bi-code-square',
                        'condition' => [],
                        'options' => [],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => 100,
                            'custom_class' => ''
                        ],
                    ],
                ]
            ],
            '4' => [
                'name' => $this->translator->trans('forms.eCommerce'),
                'slug' => 'ecommerce',
                'show_msg' => true,
                'forms' => [
                    '0' => [
                        'id' => uniqid(),
                        'label' => $this->translator->trans('forms.Credit Card Number'),
                        'form_type' => 'credit-card',
                        'slug' => 'credit_card',
                        'type' => 'credit-card',
                        'show_msg' => true,
                        'required' => true,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => $this->translator->trans('forms.Credit Card Number'),
                        'icon' => 'bi bi-credit-card-2-front',
                        'err_msg' => $this->translator->trans('forms.The name must be entered.'),
                        'condition' => [],
                        'options' => [
                            'show_name' => true,
                            'show_date' => true,
                            'show_cvc' => true,
                            'full_name' => '',
                            'card_number' => '',
                            'expiry_date' => '',
                            'cvc' => '',
                            'label_name' => $this->translator->trans('forms.Name of the cardholder'),
                            'label_placeholder' => $this->translator->trans('forms.Full name'),
                            'label_card_number' => $this->translator->trans('forms.Card Number'),
                            'label_card_date' => $this->translator->trans('forms.Expiry date'),
                            'label_card_cvc' => $this->translator->trans('forms.CVC'),
                        ],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => '',
                            'custom_class' => 'border p-3',
                        ],
                    ],
                    '1' => [
                        'id' => uniqid(),
                        'label' => $this->translator->trans('forms.Credit Card Exp Date'),
                        'form_type' => 'credit-card',
                        'slug' => 'credit_card_date',
                        'type' => 'credit-card-date',
                        'show_msg' => true,
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => $this->translator->trans('forms.Credit Card Exp Date'),
                        'icon' => 'bi bi-credit-card',
                        'condition' => [],
                        'options' => [
                            'show_date' => true,
                            'expiry_date' => '',
                            'label_card_date' => $this->translator->trans('forms.Expiry date'),
                        ],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => '',
                            'custom_class' => ''
                        ],
                    ],
                    '2' => [
                        'id' => uniqid(),
                        'label' => $this->translator->trans('forms.Credit Card CVC'),
                        'form_type' => 'credit-card',
                        'slug' => 'credit_card_cvc',
                        'type' => 'credit-card-cvc',
                        'show_msg' => true,
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => $this->translator->trans('forms.Credit Card CVC'),
                        'icon' => 'bi bi-credit-card-2-back',
                        'condition' => [],
                        'options' => [
                            'show_cvc' => true,
                            'cvc' => '',
                            'label_card_cvc' => $this->translator->trans('forms.CVC'),
                        ],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => '',
                            'custom_class' => ''
                        ],
                    ],
                ]

            ],
            '5' => [
                'name' => $this->translator->trans('forms.Extra'),
                'slug' => 'extra',
                'show_msg' => true,
                'forms' => [
                    '0' => [
                        'id' => uniqid(),
                        'label' => $this->translator->trans('forms.Slider'),
                        'form_type' => 'extra',
                        'slug' => 'slider_' . $helper->generate_callback_pw(6, 0, 6),
                        'show_msg' => true,
                        'type' => 'range',
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => $this->translator->trans('forms.Slider'),
                        'icon' => 'bi bi-sliders',
                        'err_msg' => $this->translator->trans('forms.A value must be selected.'),
                        'condition' => [],
                        'options' => [],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => 1,
                            'show_value' => true,
                            'min' => 0,
                            'max' => 100,
                            'step' => 1,
                            'prefix' => '',
                            'suffix' => '',
                            'custom_class' => ''
                        ],
                    ],
                    '1' => [
                        'id' => uniqid(),
                        'label' => $this->translator->trans('forms.Rating'),
                        'form_type' => 'extra',
                        'slug' => 'rating_' . $helper->generate_callback_pw(6, 0, 6),
                        'show_msg' => true,
                        'type' => 'rating',
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => $this->translator->trans('forms.Rating'),
                        'err_msg' => '',
                        'icon' => 'bi bi-star',
                        'condition' => [],
                        'options' => [
                            '0' => [
                                'icon' => 'bi bi-star',
                                'active' => 'bi bi-star-fill',
                                'id' => 'star',
                                'name' => $this->translator->trans('forms.star'),
                            ],
                            '1' => [
                                'icon' => 'bi bi-heart',
                                'active' => 'bi bi-heart-fill',
                                'id' => 'heart',
                                'name' => $this->translator->trans('forms.Heart'),
                            ],
                            '2' => [
                                'icon' => 'bi bi-emoji-neutral',
                                'active' => 'bi bi-emoji-smile-fill',
                                'id' => 'smiley',
                                'name' => $this->translator->trans('forms.Smiley'),
                            ],
                            '3' => [
                                'icon' => 'bi bi-circle',
                                'active' => 'bi bi-circle-fill',
                                'id' => 'dot',
                                'name' => $this->translator->trans('forms.Dot'),
                            ],
                            '4' => [
                                'icon' => 'bi bi-hand-thumbs-up',
                                'active' => 'bi bi-hand-thumbs-up-fill',
                                'id' => 'hand',
                                'name' => $this->translator->trans('forms.Hand'),
                            ],
                        ],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => 0,
                            'reset' => false,
                            'count' => 5,
                            'type' => 'star',
                            'icon' => 'bi bi-star',
                            'icon_active' => 'bi bi-star-fill',
                            'font_size' => '18px',
                            'distance' => '3px',
                            'color_fill' => '#FFAA00',
                            'color' => '#AFAFAF',
                            'custom_class' => ''
                        ],
                    ],
                ]
            ]
        ];
        if ($type) {
            foreach ($forms as $tmp) {
                foreach ($tmp['forms'] as $form) {
                    if ($form['type'] == $type) {
                        return $form;
                    }
                }
            }
        }
        if ($id) {
            foreach ($forms as $tmp) {
                foreach ($tmp['forms'] as $form) {
                    if ($form['id'] == $id) {
                        return $form;
                    }
                }
            }
        }
        if ($group) {
            foreach ($forms as $tmp) {
                if ($tmp['slug'] == $group) {
                    return $tmp;
                }
            }
        }
        return $forms;
    }

    protected function form_selects():array
    {
        return [
            'group_size' => [
                '0' => [
                    'type' => 'btn-group-sm',
                    'name' => $this->translator->trans('forms.small'),
                ],
                '1' => [
                    'type' => 'normal',
                    'name' => $this->translator->trans('forms.normal'),
                ],
                '2' => [
                    'type' => 'btn-group-lg',
                    'name' => $this->translator->trans('forms.large'),
                ]
            ],
            'group_alignment' => [
                '0' => [
                    'type' => 'horizontal',
                    'name' => $this->translator->trans('forms.horizontal'),
                ],
                '1' => [
                    'type' => 'w-100',
                    'name' => $this->translator->trans('forms.full width'),
                ],
                '2' => [
                    'type' => 'vertikal',
                    'name' => $this->translator->trans('forms.vertical'),
                ],
                '3' => [
                    'type' => 'vertikal full-width',
                    'name' => $this->translator->trans('forms.vertical') . ' ' . $this->translator->trans('forms.full width'),
                ]
            ],
            'date_formats' => [
                '0' => [
                    'value' => 'date',
                    'label' => $this->translator->trans('forms.Date'),
                ],
                '1' => [
                    'value' => 'datetime-local',
                    'label' => $this->translator->trans('forms.Date / Time'),
                ],
                '2' => [
                    'value' => 'time',
                    'label' => $this->translator->trans('forms.Time'),
                ],
                '3' => [
                    'value' => 'month',
                    'label' => $this->translator->trans('forms.Month'),
                ]
            ]
        ];
    }
    protected function rating_options_field($id = null): array
    {
        $return = [
            '0' => [
                'icon' => 'bi bi-star',
                'active' => 'bi bi-star-fill',
                'id' => 'star',
                'name' => $this->translator->trans('forms.star'),
            ],
            '1' => [
                'icon' => 'bi bi-heart',
                'active' => 'bi bi-heart-fill',
                'id' => 'heart',
                'name' => $this->translator->trans('forms.Heart'),
            ],
            '2' => [
                'icon' => 'bi bi-emoji-neutral',
                'active' => 'bi bi-emoji-smile-fill',
                'id' => 'smiley',
                'name' => $this->translator->trans('forms.Smiley'),
            ],
            '3' => [
                'icon' => 'bi bi-circle',
                'active' => 'bi bi-circle-fill',
                'id' => 'dot',
                'name' => $this->translator->trans('forms.Dot'),
            ],
            '4' => [
                'icon' => 'bi bi-hand-thumbs-up',
                'active' => 'bi bi-hand-thumbs-up-fill',
                'id' => 'hand',
                'name' => $this->translator->trans('forms.Hand'),
            ],
        ];

        if ($id) {
            foreach ($return as $tmp) {
                if ($tmp['id'] == $id) {
                    return $tmp;
                }
            }
        }
        return $return;
    }

    protected function select_options_field(): array
    {

        $selectId = uniqid();
        return [
            'default' => false,
            'label' => 'Option-' . $selectId,
            'value' => 'option_' . $selectId,
            'id' => $selectId,
        ];
    }

    protected function checkbox_options_field(): array
    {

        $selectId = uniqid();
        return [
            'checked' => false,
            'label' => 'Checkbox-' . $selectId,
            'value' => 'checkbox_' . $selectId,
            'err_msg' => $this->translator->trans('forms.You must agree to this condition.'),
            'id' => $selectId,
        ];
    }
}
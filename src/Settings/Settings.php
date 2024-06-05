<?php

namespace App\Settings;

use App\AppHelper\Helper;
use stdClass;
use function Symfony\Component\Translation\t;

trait Settings
{

    // protected string $category_slug = 'category';
    protected string $jwt_kid = 'wvazjc9b8tv5x31hw4pil2kgb7ipqyv6';

    //PW: XdvK*93XNGtx@Hg!z79.*AMB4jhLr8bUxym!-vQmAJgU.iHY4ZyqPvqEeMuquTM9NzCfhC
    protected string $cron_pw = '$2y$10$BzXLmVwmcjxnGrMLo2x37Ob7Yzy.ETM32BLMlZm1qkTRb5Ltl.nKq';
    protected string $logout_token = 'ua6tnxbnkuzk93cgjq8fyg5rny47u1od';
    protected array $liip_imagine_extensions = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'webm'];

    protected string $formBuilderVersion = '1.0.0';


    protected array $xCardTypes = [
        '0' => [
            'id' => 'summary',
            'label' => 'summary'
        ],
        '1' => [
            'id' => 'summary_large_image',
            'label' => 'summary_large_image'
        ],
        '2' => [
            'id' => 'app',
            'label' => 'app'
        ],
        '3' => [
            'id' => 'player',
            'label' => 'player'
        ],
    ];

    protected array $ogTypes = [
        '0' => [
            'label' => 'Website',
            'id' => 'website'
        ],
        '1' => [
            'label' => 'Article',
            'id' => 'article'
        ],
        '2' => [
            'label' => 'Blog',
            'id' => 'blog'
        ],
        '3' => [
            'label' => 'Profile',
            'id' => 'profile'
        ],
        '4' => [
            'label' => 'Book',
            'id' => 'book'
        ],
    ];

    protected function get_cronjob_key($key): bool
    {
        $helper = Helper::instance();
        if($helper->verifyPassword($key, $this->cron_pw)) {
            return true;
        }
        return false;
    }



    protected function default_settings($type = null): array
    {
        $settings = [
            'send_email_async' => true,
            'site_name' => 'ElevateEase',
            'app' => [
                'version' => '1.0.0',
                'db_version' => '1.0.0',
                'site_name' => 'ElevateEase',
                'admin_email' => 'symfony@app.email',
                'dashboard_logo' => '',
                'login_logo' => '',
                'signature_logo' => '',
                'dashboard_logo_size' => 50,
                'upload_types' => '.jpg,.jpeg,.png,.gif,.svg,.pdf,.mp4,.mp3,.m4v,.m4a,.webp,.arw',
                'login_logo_size' => 250,
                'signature_logo_size' => 150,
                'gmaps_active' => true,
                'html_minimise' => false,
                'export_vendor' => false,
                'privacy_page_route' => '',
                'imprint_page_route' => '',
                'agb_page_route' => '',
                'scss_by_login_active' => false,
                'scss_cache_active' => false,
                'scss_map_active' => false,
                'scss_cache_dir' => 'scss_cache',
                'scss_map_output' => 'compressed',
                'scss_map_option' => 'map_inline',
                'scss_source_file' => 'public-style.scss',
                'scss_destination_file' => 'public-style.css',
            ],
            'email' => [
                'async_active' => true,
                'email_save_active' => true,
                'attachment_active' => true,
                'reply_to' => '',
                'attachment_max_count' => 10,
                'attachment_max_size' => 5,
                'forms' => [
                    'async_active' => true,
                    'email_save_active' => true,
                    'save_attachment' => true,
                    'abs_name' => '',
                    'abs_email' => 'symfony@app.email',
                    'reply_to' => '',
                    'email_template' => 'send-public-email.html.twig'
                ]
            ],
            'oauth' => [
                'jwks_kty' => 'RSA',
                'jwks_alg' => 'RS256',
                'jwks_use' => 'sig',
                'default_scope' => 'BLOCK_READ',
                'jwks_x5c' => '',
                'jwks_x5t' => ''
            ],
            'log' => [
                'login' => false,
                'login_error' => false,
                'logout' => false,
                'register' => false,
                'forgot_password' => false,
                'password_change' => false,
                'account_activated' => false,
                'account_deactivated' => false,
                'account_deleted' => false,
                'backup_created' => false,
                'backup_deleted' => false,
                'email_send' => false
            ],
            'register' => [
                'show_forgotten_password' => true,
                'registration_active' => false,
                'registration_method' => 1,
                'send_notification' => false,
                'send_after_validate' => false,
                'email_notification' => '',
                'show_company' => 0,
                'show_title' => 0,
                'show_name' => 0,
                'show_street' => 0,
                'show_city' => 0,
                'show_phone' => 0,
                'show_mobile' => 0,
                'leak_checker' => true
            ],
            'design' => [
                'font_headline' => [
                    '0' => [
                        'id' => 'h1',
                        'label' => 'H1',
                        'size' => 40,
                        'size_sm' => 28,
                        'color' => [
                            'r' => 33,
                            'g' => 37,
                            'b' => 41,
                            'a' => 1
                        ],
                        'display' => false,
                        'font-family' => '',
                        'font-weight' => '500',
                        'font-style' => '',
                        'line-height' => '1.2'
                    ],
                    '1' => [
                        'id' => 'h2',
                        'label' => 'H2',
                        'size' => 32,
                        'size_sm' => 24,
                        'color' => [
                            'r' => 33,
                            'g' => 37,
                            'b' => 41,
                            'a' => 1
                        ],
                        'display' => false,
                        'font-family' => '',
                        'font-style' => '',
                        'font-weight' => '500',
                        'line-height' => '1.2'
                    ],
                    '2' => [
                        'id' => 'h3',
                        'label' => 'H3',
                        'size' => 28,
                        'size_sm' => 22,
                        'color' => [
                            'r' => 33,
                            'g' => 37,
                            'b' => 41,
                            'a' => 1
                        ],
                        'display' => false,
                        'font-family' => '',
                        'font-style' => '',
                        'font-weight' => '500',
                        'line-height' => '1.2'
                    ],
                    '3' => [
                        'id' => 'h4',
                        'label' => 'H4',
                        'size' => 24,
                        'size_sm' => 20,
                        'color' => [
                            'r' => 33,
                            'g' => 37,
                            'b' => 41,
                            'a' => 1
                        ],
                        'display' => false,
                        'font-family' => '',
                        'font-style' => '',
                        'font-weight' => '500',
                        'line-height' => '1.2'
                    ],
                    '4' => [
                        'id' => 'h5',
                        'label' => 'H5',
                        'size' => 20,
                        'size_sm' => 18,
                        'color' => [
                            'r' => 33,
                            'g' => 37,
                            'b' => 41,
                            'a' => 1
                        ],
                        'display' => false,
                        'font-family' => '',
                        'font-style' => '',
                        'font-weight' => '500',
                        'line-height' => '1.2'
                    ],
                    '5' => [
                        'id' => 'h6',
                        'label' => 'H6',
                        'size' => 16,
                        'size_sm' => 16,
                        'color' => [
                            'r' => 33,
                            'g' => 37,
                            'b' => 41,
                            'a' => 1
                        ],
                        'display' => false,
                        'font-family' => '',
                        'font-style' => '',
                        'font-weight' => '500',
                        'line-height' => '1.2'
                    ],
                ],
                'font' => [
                    '0' => [
                        'id' => 'body',
                        'label' => $this->translator->trans('design.Body'),
                        'font-family' => '',
                        'font-style' => '',
                        'size' => 16,
                        'size_sm' => 16,
                        'uppercase' => false,
                        'color' => [
                            'r' => 33,
                            'g' => 37,
                            'b' => 41,
                            'a' => 1
                        ],
                        'font-weight' => 'normal',
                        'line-height' => '1.5'
                    ],
                    '1' => [
                        'id' => 'menu',
                        'label' => $this->translator->trans('design.Menu'),
                        'font-family' => '',
                        'font-style' => '',
                        'size' => 16,
                        'size_sm' => 16,
                        'uppercase' => false,
                        'color' => '',
                        'font-weight' => 'normal',
                        'line-height' => '1.5'
                    ],
                    '2' => [
                        'id' => 'button',
                        'label' => $this->translator->trans('design.Button'),
                        'font-family' => '',
                        'font-style' => '',
                        'size' => 16,
                        'size_sm' => 16,
                        'uppercase' => false,
                        'color' => '',
                        'font-weight' => 'normal',
                        'line-height' => '1.5'
                    ],
                ],
                'color' => [
                    'menu_uppercase' => false,
                    'scroll_btn_active' => true,
                    'site_bg' => [
                        'r' => 255,
                        'g' => 255,
                        'b' => 255,
                        'a' => 1
                    ],
                    'nav_bg' => [
                        'r' => 230,
                        'g' => 230,
                        'b' => 230,
                        'a' => 0.8
                    ],
                    'footer_bg' => [
                        'r' => 248,
                        'g' => 249,
                        'b' => 250,
                        'a' => 1
                    ],
                    'footer_color' => [
                        'r' => 33,
                        'g' => 37,
                        'b' => 41,
                        'a' => 0.75
                    ],
                    'menu_btn_bg_color' => [
                        'r' => 230,
                        'g' => 230,
                        'b' => 230,
                        'a' => 0
                    ],
                    'menu_btn_color' => [
                        'r' => 71,
                        'g' => 71,
                        'b' => 71,
                        'a' => 1
                    ],
                    'menu_btn_active_bg' => [
                        'r' => 230,
                        'g' => 230,
                        'b' => 230,
                        'a' => 0
                    ],
                    'menu_btn_active_color' => [
                        'r' => 60,
                        'g' => 67,
                        'b' => 74,
                        'a' => 1
                    ],
                    'menu_btn_hover_bg' => [
                        'r' => 230,
                        'g' => 230,
                        'b' => 230,
                        'a' => 0
                    ],
                    'menu_btn_hover_color' => [
                        'r' => 60,
                        'g' => 67,
                        'b' => 74,
                        'a' => 1
                    ],
                    'dropdown_bg' => [
                        'r' => 230,
                        'g' => 230,
                        'b' => 230,
                        'a' => 1
                    ],
                    'menu_dropdown_bg' => [
                        'r' => 230,
                        'g' => 230,
                        'b' => 230,
                        'a' => 1
                    ],
                    'menu_dropdown_color' => [
                        'r' => 71,
                        'g' => 71,
                        'b' => 71,
                        'a' => 1
                    ],
                    'menu_dropdown_active_bg' => [
                        'r' => 212,
                        'g' => 212,
                        'b' => 212,
                        'a' => 1
                    ],
                    'menu_dropdown_active_color' => [
                        'r' => 60,
                        'g' => 67,
                        'b' => 74,
                        'a' => 1
                    ],
                    'menu_dropdown_hover_bg' => [
                        'r' => 237,
                        'g' => 237,
                        'b' => 237,
                        'a' => 1
                    ],
                    'menu_dropdown_hover_color' => [
                        'r' => 60,
                        'g' => 67,
                        'b' => 74,
                        'a' => 1
                    ],
                    'link_color' => [
                        'r' => 0,
                        'g' => 98,
                        'b' => 189,
                        'a' => 1
                    ],
                    'link_aktiv_color' => [
                        'r' => 0,
                        'g' => 68,
                        'b' => 128,
                        'a' => 1
                    ],
                    'link_hover_color' => [
                        'r' => 0,
                        'g' => 124,
                        'b' => 232,
                        'a' => 1
                    ],
                    'scroll_btn_bg' => [
                        'r' => 0,
                        'g' => 98,
                        'b' => 189,
                        'a' => 1
                    ],
                    'scroll_btn_color' => [
                        'r' => 255,
                        'g' => 255,
                        'b' => 255,
                        'a' => 1
                    ]
                ]
            ]
        ];
        if ($type) {
            foreach ($settings as $key => $val) {
                if ($key == $type) {
                    return $val;
                }
            }
        }
        return $settings;
    }

    protected function default_main_menu_settings(): array
    {
        return [
            'img' => [],
            'container' => 'container',
            'menu_align' => 'center',
            'menu_horizontal_align' => 'center',
            'container_breakpoint' => 'lg',
            'menu_breakpoint' => 'lg',
            'brand_text' => 'Symfony App',
            'extra_css' => '',
            'size_full' => 200,
            'size_scroll' => 130,
            'size_mobil' => 90,
            'nav_bg' => [
                'r' => 248,
                'g' => 249,
                'b' => 250,
                'a' => 1
            ]
        ];
    }

    protected function multiple_selection(): array
    {
        return [
            '0' => [
                'id' => 0,
                'label' => $this->translator->trans('medien.Multiple selection'),
            ],
            '1' => [
                'id' => 1,
                'label' => $this->translator->trans('medien.Assign to a category'),
            ],
            '2' => [
                'id' => 2,
                'label' => $this->translator->trans('medien.Delete selected'),
            ],
        ];
    }

    protected function button_variant(): array
    {
        return [
            '0' => [
                'id' => 'primary',
                'label' => 'Primary'
            ],
            '1' => [
                'id' => 'secondary',
                'label' => 'Secondary'
            ],
            '2' => [
                'id' => 'success',
                'label' => 'Success'
            ],
            '3' => [
                'id' => 'warning',
                'label' => 'Warning'
            ],
            '4' => [
                'id' => 'danger',
                'label' => 'Danger'
            ],
            '5' => [
                'id' => 'info',
                'label' => 'Info'
            ],
            '6' => [
                'id' => 'light',
                'label' => 'Light'
            ],
            '7' => [
                'id' => 'dark',
                'label' => 'Dark'
            ],
            '8' => [
                'id' => 'link',
                'label' => 'Link'
            ],
        ];
    }

    protected function select_button_size(): array
    {
        return [
            '0' => [
                'id' => '',
                'label' => $this->translator->trans('plugins.normal')
            ],
            '1' => [
                'id' => 'btn-sm',
                'label' => $this->translator->trans('plugins.Button sm')
            ],
            '2' => [
                'id' => 'btn-lg',
                'label' => $this->translator->trans('plugins.Button lg')
            ],
        ];
    }

    protected function select_size(): array
    {
        return [
            '0' => [
                'id' => 'thumbnail',
                'label' => $this->translator->trans('medien.Thumbnail')
            ],
            '1' => [
                'id' => 'medium',
                'label' => $this->translator->trans('medien.Medium')
            ],
            '2' => [
                'id' => 'large',
                'label' => $this->translator->trans('medien.Large')
            ],
            '3' => [
                'id' => 'xl-large',
                'label' => $this->translator->trans('medien.XL-Large')
            ],
            '4' => [
                'id' => 'full',
                'label' => $this->translator->trans('medien.Full')
            ]
        ];
    }

    protected function select_carousel_animation(): array
    {
        return [
            '0' => [
                'id' => 'slide',
                'label' => 'slide'
            ],
            '1' => [
                'id' => 'fade',
                'label' => 'fade'
            ]
        ];
    }

    protected function select_source(): array
    {
        return [
            '0' => [
                'id' => 'mediathek',
                'label' => $this->translator->trans('plugins.Mediathek')
            ],
            '1' => [
                'id' => 'extern',
                'label' => $this->translator->trans('plugins.Extern')
            ]
        ];
    }

    protected function select_link_options($lightbox = true): array
    {
        $link = [
            '0' => [
                'id' => '',
                'label' => $this->translator->trans('plugins.No action')
            ],
            '1' => [
                'id' => 'lightbox',
                'label' => $this->translator->trans('medien.Lightbox')
            ],
            '2' => [
                'id' => 'url',
                'label' => $this->translator->trans('Page / Article')
            ],
            '3' => [
                'id' => 'custom',
                'label' => $this->translator->trans('plugins.Custom link')
            ],
        ];
        if (!$lightbox) {
            $arr = [];
            foreach ($link as $tmp) {
                if ($tmp['id'] == 'lightbox') {
                    continue;
                }
                $arr[] = $tmp;
            }
            return $arr;
        }
        return $link;
    }

    protected function select_site_status(): array
    {
        return [
            '0' => [
                'label' => $this->translator->trans('system.Public'),
                'value' => 'publish'
            ],
            '1' => [
                'label' => $this->translator->trans('system.Private'),
                'value' => 'private'
            ],
            /*   '2' => [
                   'label' => $this->translator->trans('system.Password protected'),
                   'value' => 'protected'
               ],*/
        ];
    }

    protected function default_form_builder(): array
    {
        return [
            'form' => [
                'version' => '1.0.0',
                'grid' => [
                    '0' => [
                        'id' => uniqid(),
                        'col' => 12,
                        'extra_css' => '',
                        'forms' => []
                    ]
                ]
            ],
            'settings' => [
                'col' => 'lg',
                'gutter' => 'g-3',
                'individuell' => ''
            ]
        ];
    }

    protected function default_sites(): array
    {
        return [
            '0' => [
                'title' => $this->translator->trans('Homepage'),
                'route_name' => 'app_public_index',
                'site_slug' => '',
                'site_type' => 'page',
                'no_index' => false,
                'no_follow' => false
            ],
          /*  '1' => [
                'title' => $this->translator->trans('app.Data protection'),
                'route_name' => 'public_privacy_page',
                'site_slug' => 'privacy',
                'site_type' => 'page',
                'no_index' => true,
                'no_follow' => true
            ],
            '2' => [
                'title' => $this->translator->trans('Imprint'),
                'route_name' => 'public_imprint_page',
                'site_slug' => 'imprint',
                'site_type' => 'page',
                'no_index' => true,
                'no_follow' => true
            ],
            '23' => [
                'title' => $this->translator->trans('General Terms and conditions'),
                'route_name' => 'public_terms_page',
                'site_slug' => 'agb',
                'site_type' => 'page',
                'no_index' => true,
                'no_follow' => true
            ],*/
        ];
    }

    protected function admin_voter($id = null, $default = 0, $role = 0): array
    {
        $adminRoles = [
            '0' => [
                'id' => uniqid(),
                'default' => 1,
                'section' => 'user',
                'label' => $this->translator->trans('system.Edit profile'),
                'role' => 'ACCOUNT_EDIT'
            ],
            '1' => [
                'id' => uniqid(),
                'default' => 1,
                'section' => 'user',
                'label' => $this->translator->trans('system.Manage users'),
                'role' => 'MANAGE_ACCOUNT'
            ],
            '2' => [
                'id' => uniqid(),
                'default' => 1,
                'section' => 'user',
                'label' => $this->translator->trans('profil.Add new user'),
                'role' => 'ADD_ACCOUNT'
            ],
            '3' => [
                'id' => uniqid(),
                'default' => 1,
                'section' => 'user',
                'label' => $this->translator->trans('system.Manage authorisations'),
                'role' => 'MANAGE_AUTHORISATION'
            ],
            '4' => [
                'id' => uniqid(),
                'default' => 1,
                'section' => 'user',
                'label' => $this->translator->trans('system.Manage user roles'),
                'role' => 'EDIT_ROLES'
            ],
            '5' => [
                'id' => uniqid(),
                'default' => 1,
                'section' => 'email',
                'label' => $this->translator->trans('system.E-mail active'),
                'role' => 'ACCOUNT_EMAIL'
            ],
            '6' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'email',
                'label' => $this->translator->trans('system.Manage email'),
                'role' => 'MANAGE_EMAIL'
            ],
            '7' => [
                'id' => uniqid(),
                'default' => 1,
                'section' => 'email',
                'label' => $this->translator->trans('system.Send e-mail'),
                'role' => 'SEND_EMAIL'
            ],
            '8' => [
                'id' => uniqid(),
                'default' => 1,
                'section' => 'api',
                'label' => $this->translator->trans('system.Manage API'),
                'role' => 'MANAGE_API'
            ],
            '9' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'api',
                'label' => $this->translator->trans('system.Manage API authorisations'),
                'role' => 'EDIT_GRANTS'
            ],
            '10' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'log',
                'label' => $this->translator->trans('system.Manage system settings'),
                'role' => 'MANAGE_SYSTEM_SETTINGS'
            ],
            '11' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'log',
                'label' => $this->translator->trans('system.Manage activities'),
                'role' => 'MANAGE_ACTIVITY'
            ],
            '12' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'log',
                'label' => $this->translator->trans('system.Manage e-mail system'),
                'role' => 'MANAGE_EMAIL_SETTINGS'
            ],
            '13' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'log',
                'label' => $this->translator->trans('system.Manage registration'),
                'role' => 'MANAGE_REGISTRATION'
            ],
            '14' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'log',
                'label' => $this->translator->trans('system.Manage activation'),
                'role' => 'MANAGE_ACTIVATION'
            ],
            '15' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'log',
                'label' => $this->translator->trans('system.Manage APP settings'),
                'role' => 'MANAGE_APP_SETTINGS'
            ],
            '16' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'log',
                'label' => $this->translator->trans('system.Manage log'),
                'role' => 'MANAGE_LOG'
            ],
            '17' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'log',
                'label' => $this->translator->trans('system.Manage oAuth2'),
                'role' => 'MANAGE_OAUTH'
            ],
            '18' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'user',
                'label' => $this->translator->trans('system.Delete account'),
                'role' => 'ACCOUNT_DELETE'
            ],
            '19' => [
                'id' => uniqid(),
                'default' => 1,
                'section' => 'media',
                'label' => $this->translator->trans('system.Media library'),
                'role' => 'MANAGE_MEDIEN'
            ],
            '20' => [
                'id' => uniqid(),
                'default' => 1,
                'section' => 'media',
                'label' => $this->translator->trans('system.Media library upload'),
                'role' => 'ACCOUNT_UPLOAD'
            ],
            '21' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'media',
                'label' => $this->translator->trans('converter.Image converter'),
                'role' => 'MEDIEN_CONVERTER'
            ],
            '22' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'backup',
                'label' => $this->translator->trans('system.Manage Backup'),
                'role' => 'MANAGE_BACKUP'
            ],
            '23' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'backup',
                'label' => $this->translator->trans('system.Add Backup'),
                'role' => 'ADD_BACKUP'
            ],
            '24' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'page',
                'label' => $this->translator->trans('system.Manage Websites'),
                'role' => 'MANAGE_PAGE'
            ],
            '25' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'page',
                'label' => $this->translator->trans('system.Manage Seo'),
                'role' => 'MANAGE_PAGE_SEO'
            ],
            '26' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'page',
                'label' => $this->translator->trans('system.Manage Sites'),
                'role' => 'MANAGE_PAGE_SITES'
            ],
            '27' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'page',
                'label' => $this->translator->trans('system.Pages Categories Manage'),
                'role' => 'MANAGE_PAGE_CATEGORY'
            ],
            '28' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'page',
                'label' => $this->translator->trans('system.Manage Page-Builder'),
                'role' => 'MANAGE_SITE_BUILDER'
            ],
            '29' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'page',
                'label' => $this->translator->trans('system.Manage Page-Builder layouts'),
                'role' => 'MANAGE_BUILDER_SITES'
            ],
            '30' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'page',
                'label' => $this->translator->trans('system.Manage Page-Builder plugins'),
                'role' => 'MANAGE_BUILDER_PLUGINS'
            ],
            '31' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'posts',
                'label' => $this->translator->trans('system.Manage posts'),
                'role' => 'MANAGE_POST'
            ],
            '32' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'posts',
                'label' => $this->translator->trans('system.Create posts'),
                'role' => 'ADD_POST'
            ],
            '33' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'posts',
                'label' => $this->translator->trans('posts.Category Design'),
                'role' => 'POST_CATEGORY_DESIGN'
            ],
            '34' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'posts',
                'label' => $this->translator->trans('posts.Post Design'),
                'role' => 'POST_DESIGN'
            ],
            '35' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'posts',
                'label' => $this->translator->trans('posts.Post loop') . ' ' . $this->translator->trans('posts.Design'),
                'role' => 'POST_LOOP_DESIGN'
            ],
            '36' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'posts',
                'label' => $this->translator->trans('posts.Delete post'),
                'role' => 'DELETE_POST'
            ],
            '37' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'posts',
                'label' => $this->translator->trans('swal.Delete category'),
                'role' => 'DELETE_POST_CATEGORY'
            ],
            '38' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'tools',
                'label' => $this->translator->trans('system.Manage Gallery'),
                'role' => 'MANAGE_GALLERY_SLIDER'
            ],
            '39' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'tools',
                'label' => $this->translator->trans('mediaSlider.Medien Slider'),
                'role' => 'MEDIEN_SLIDER'
            ],
            '40' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'tools',
                'label' => $this->translator->trans('carousel.Medien Carousel'),
                'role' => 'MEDIEN_CAROUSEL'
            ],
            '41' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'tools',
                'label' => $this->translator->trans('Gallery'),
                'role' => 'MEDIEN_GALLERY'
            ],
            '42' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'menu',
                'label' => $this->translator->trans('system.Manage Menu'),
                'role' => 'MANAGE_MENU'
            ],
            '43' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'menu',
                'label' => $this->translator->trans('system.Add menu'),
                'role' => 'ADD_MENU'
            ],
            '44' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'log',
                'label' => $this->translator->trans('scss.SCSS Compiler Settings'),
                'role' => 'MANAGE_SCSS_COMPILER'
            ],
            '45' => [
                'id' => uniqid(),
                'default' => 1,
                'section' => 'design',
                'label' => $this->translator->trans('builder.Design settings'),
                'role' => 'MANAGE_DESIGN'
            ],
            '46' => [
                'id' => uniqid(),
                'default' => 1,
                'section' => 'design',
                'label' => $this->translator->trans('system.Manage Fonts'),
                'role' => 'MANAGE_FONTS'
            ],
            '47' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'design',
                'label' => $this->translator->trans('system.Delete fonts'),
                'role' => 'DELETE_FONTS'
            ],
            '48' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'design',
                'label' => $this->translator->trans('system.Manage header'),
                'role' => 'MANAGE_HEADER'
            ],
            '49' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'design',
                'label' => $this->translator->trans('system.Manage footer'),
                'role' => 'MANAGE_FOOTER'
            ],
            '50' => [
                'id' => uniqid(),
                'default' => 1,
                'section' => 'tools',
                'label' => $this->translator->trans('system.Manage Tools'),
                'role' => 'MANAGE_TOOLS'
            ],
            '51' => [
                'id' => uniqid(),
                'default' => 1,
                'section' => 'tools',
                'label' => $this->translator->trans('system.Manage Map data protection'),
                'role' => 'MANAGE_MAPS_PROTECTION'
            ],
            '52' => [
                'id' => uniqid(),
                'default' => 1,
                'section' => 'forms',
                'label' => $this->translator->trans('system.Manage forms'),
                'role' => 'MANAGE_FORMS'
            ],
            '53' => [
                'id' => uniqid(),
                'default' => 1,
                'section' => 'forms',
                'label' => $this->translator->trans('forms.Create form'),
                'role' => 'ADD_FORMS'
            ],
            '54' => [
                'id' => uniqid(),
                'default' => 1,
                'section' => 'forms',
                'label' => $this->translator->trans('forms.Delete form'),
                'role' => 'DELETE_FORMS'
            ],
            '55' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'log',
                'label' => $this->translator->trans('system.Manage consumer'),
                'role' => 'MANAGE_CONSUMER'
            ],
            '56' => [
                'id' => uniqid(),
                'default' => 1,
                'section' => 'tools',
                'label' => $this->translator->trans('system.Custom Fields'),
                'role' => 'MANAGE_CUSTOM_FIELDS'
            ],
        ];

        if ($id) {
            foreach ($adminRoles as $tmp) {
                if ($tmp['id'] == $id) {
                    return $tmp;
                }
            }
        }

        if ($default) {
            $defArr = [];
            foreach ($adminRoles as $tmp) {
                if ($default == $tmp['default']) {
                    $defArr[] = $tmp;
                }
            }
            $adminRoles = $defArr;
        }

        if ($role) {
            $roleArr = [];
            foreach ($adminRoles as $tmp) {
                if ($role == $tmp['role']) {
                    $roleArr[] = $tmp;
                }
            }
            $adminRoles = $roleArr;
        }

        return $adminRoles;
    }

    protected function user_voter($id = null, $default = 0, $role = 0): array
    {

        $userRoles = [
            '0' => [
                'id' => uniqid(),
                'default' => 1,
                'section' => 'user',
                'label' => $this->translator->trans('system.Show profile'),
                'role' => 'ACCOUNT_SHOW'
            ],
            '1' => [
                'id' => uniqid(),
                'default' => 1,
                'section' => 'user',
                'label' => $this->translator->trans('system.Edit profile'),
                'role' => 'ACCOUNT_EDIT'
            ],
            '2' => [
                'id' => uniqid(),
                'default' => 0,
                'section' => 'user',
                'label' => $this->translator->trans('system.Delete account'),
                'role' => 'ACCOUNT_DELETE'
            ],
            '3' => [
                'id' => uniqid(),
                'default' => 1,
                'section' => 'media',
                'label' => $this->translator->trans('system.Media library'),
                'role' => 'MANAGE_MEDIEN'
            ],
            '4' => [
                'id' => uniqid(),
                'default' => 1,
                'section' => 'media',
                'label' => $this->translator->trans('system.Media library upload'),
                'role' => 'ACCOUNT_UPLOAD'
            ],
        ];

        if ($id) {
            foreach ($userRoles as $tmp) {
                if ($tmp['id'] == $id) {
                    return $tmp;
                }
            }
        }

        if ($default) {
            $defArr = [];
            foreach ($userRoles as $tmp) {
                if ($default == $tmp['default']) {
                    $defArr[] = $tmp;
                }
            }
            $userRoles = $defArr;
        }

        if ($role) {
            $roleArr = [];
            foreach ($userRoles as $tmp) {
                if ($role == $tmp['role']) {
                    $roleArr[] = $tmp;
                }
            }
            $userRoles = $roleArr;
        }

        return $userRoles;
    }


    protected function getGravatar(): array
    {

        return [
            '0' => [
                'id' => uniqid(),
                'value' => '',
                'url' => 'https://gravatar.com/avatar/00000000000000000000000000000000?s=120',
            ],
            '1' => [
                'id' => uniqid(),
                'value' => 'mp',
                'url' => 'https://gravatar.com/avatar/00000000000000000000000000000000?d=mp&s=120',
            ],
            '2' => [
                'id' => uniqid(),
                'value' => 'identicon',
                'url' => 'https://gravatar.com/avatar/00000000000000000000000000000000?d=identicon&s=120',
            ],
            '3' => [
                'id' => uniqid(),
                'value' => 'monsterid',
                'url' => 'https://gravatar.com/avatar/00000000000000000000000000000000?d=monsterid&s=120',
            ],
            '4' => [
                'id' => uniqid(),
                'value' => 'wavatar',
                'url' => 'https://gravatar.com/avatar/00000000000000000000000000000000?d=wavatar&s=120',
            ],
            '5' => [
                'id' => uniqid(),
                'value' => 'retro',
                'url' => 'https://gravatar.com/avatar/00000000000000000000000000000000?d=retro&s=120',
            ],
            '6' => [
                'id' => uniqid(),
                'value' => 'robohash',
                'url' => 'https://gravatar.com/avatar/00000000000000000000000000000000?d=robohash&s=120',
            ],
        ];

    }

    protected function default_roles($value = null): array
    {
        $arr = [
            '0' => [
                'id' => uniqid(),
                'position' => 1,
                'value' => 'ROLE_USER',
                'label' => 'User'
            ],
            '1' => [
                'id' => uniqid(),
                'position' => 2,
                'value' => 'ROLE_ADMIN',
                'label' => 'Admin'
            ],
            '2' => [
                'id' => uniqid(),
                'position' => 3,
                'value' => 'ROLE_SUPER_ADMIN',
                'label' => 'Super Admin'
            ],
        ];

        if ($value) {
            foreach ($arr as $tmp) {
                if ($tmp['value'] == $value) {
                    return $tmp;
                }
            }
        }

        return $arr;
    }


    protected function default_scopes($value = null): array
    {
        $arr = [
            '0' => [
                'id' => uniqid(),
                'value' => 'PROFILE',
                'label' => 'Profile'
            ],
            '1' => [
                'id' => uniqid(),
                'value' => 'MEDIA',
                'label' => 'Media'
            ],
            '2' => [
                'id' => uniqid(),
                'value' => 'BLOCK_READ',
                'label' => 'Block read'
            ],
            '3' => [
                'id' => uniqid(),
                'value' => 'BLOCK_WRITE',
                'label' => 'Block write'
            ],
        ];

        if ($value) {
            foreach ($arr as $tmp) {
                if ($tmp['value'] == $value) {
                    return $tmp;
                }
            }
        }

        return $arr;
    }

    protected function grant_types($value = null): array
    {
        $arr = [
            '0' => [
                'id' => uniqid(),
                'label' => 'client credentials',
                'value' => 'client_credentials'
            ],
            '1' => [
                'id' => uniqid(),
                'label' => 'Authorization Code',
                'value' => 'authorization_code'
            ],
            '2' => [
                'id' => uniqid(),
                'label' => 'Refresh Token',
                'value' => 'refresh_token'
            ],
            '3' => [
                'id' => uniqid(),
                'label' => 'Password',
                'value' => 'password'
            ],
        ];
        if ($value) {
            foreach ($arr as $tmp) {
                if ($tmp['value'] == $value) {
                    return $tmp;
                }
            }
        }
        return $arr;
    }

    private function default_account_form(): array
    {
        $selects = [
            'grand' => $this->grant_types(),
            'scopes' => $this->default_scopes(),
            'roles' => [],
            'gravatar' => $this->getGravatar()
        ];
        return [
            'account' => [
                "id" => '',
                "registerIp" => "",
                "title" => "",
                "firstName" => "",
                "lastName" => "",
                "company" => "",
                "zip" => "",
                "country" => "",
                "street" => "",
                "hnr" => "",
                "phone" => "",
                "mobil" => "",
                "notiz" => "",
                "changePw" => true,
                "mustValidated" => false,
                "imageFilename" => '',
                "uuid" => "",
                "createdAt" => ""
            ],
            'accountHolder' => [
                'id' => '',
                'email' => '',
                'roles' => [],
                'verified' => true,
                'totpSecret' => '',
                'roles_array' => [],
                'password' => '',
                'repeatPassword' => ''
            ],
            'grands' => [],
            'redirectUris' => [],
            'oAuth' => [
                'name' => '',
                'secret' => '',
                'active' => 0,
                'consentCreated' => '',
                'expires' => '',
                'consentScopes' => '',
                'ipAddress' => ''
            ],
            'scopes' => [],
            'selects' => $selects,
            'user' => 'id',
            'su' => false,
            'account_show' => '',
            'account_edit' => '',
            'account_delete' => '',
            'account_role_edit' => '',
            'account_role_manage' => '',
            'account_role_manage_api' => ''
        ];
    }

    protected function default_slider($get = null, $getField = null): array
    {
        $checked = [
            '0' => [
                'label' => $this->translator->trans('mediaSlider.arrows'),
                'field' => 'arrows',
                'active' => true,
            ],
            '1' => [
                'label' => $this->translator->trans('mediaSlider.cover'),
                'field' => 'cover',
                'active' => true,
            ],
            '2' => [
                'label' => $this->translator->trans('mediaSlider.keyboard'),
                'field' => 'keyboard',
                'active' => true,
            ],
            '3' => [
                'label' => $this->translator->trans('mediaSlider.pauseOnFocus'),
                'field' => 'pauseOnFocus',
                'active' => true,
            ],
            '4' => [
                'label' => $this->translator->trans('mediaSlider.drag'),
                'field' => 'drag',
                'active' => true,
            ],
            '5' => [
                'label' => $this->translator->trans('mediaSlider.rewind'),
                'field' => 'rewind',
                'active' => true,
            ],
            '6' => [
                'label' => $this->translator->trans('mediaSlider.pauseOnHover'),
                'field' => 'pauseOnHover',
                'active' => true,
            ],
            '7' => [
                'label' => $this->translator->trans('mediaSlider.pagination'),
                'field' => 'pagination',
                'active' => false,
            ],
            '8' => [
                'label' => $this->translator->trans('mediaSlider.autoplay'),
                'field' => 'autoplay',
                'active' => false,
            ],
        ];

        $padding = [
            '0' => [
                'label' => $this->translator->trans('mediaSlider.left'),
                'field' => 'left',
                'value' => '1rem',
                'type' => "text",
                'required' => false,
            ],
            '1' => [
                'label' => $this->translator->trans('mediaSlider.right'),
                'field' => 'right',
                'value' => '1rem',
                'type' => "text",
                'required' => false,
            ],
            '2' => [
                'label' => $this->translator->trans('mediaSlider.top'),
                'field' => 'top',
                'value' => '',
                'type' => "text",
                'required' => false,
            ],
            '3' => [
                'label' => $this->translator->trans('mediaSlider.bottom'),
                'field' => 'bottom',
                'value' => '',
                'type' => "text",
                'required' => false,
            ],
        ];

        $fields = [
            '0' => [
                'label' => $this->translator->trans('mediaSlider.type'),
                'field' => 'type',
                'value' => 'splide',
                'type' => "text",
                'required' => true,
            ],
            '2' => [
                'label' => $this->translator->trans('mediaSlider.perPage'),
                'field' => 'perPage',
                'value' => 4,
                'type' => "number",
                'required' => true,
            ],
            '3' => [
                'label' => $this->translator->trans('mediaSlider.perMove'),
                'field' => 'perMove',
                'value' => 4,
                'type' => "number",
                'required' => true,
            ],
            '4' => [
                'label' => $this->translator->trans('mediaSlider.lazyLoad'),
                'field' => 'lazyLoad',
                'value' => 'nearby',
                'type' => "text",
                'required' => false,
            ],
            '5' => [
                'label' => $this->translator->trans('mediaSlider.gap'),
                'field' => 'gap',
                'value' => '0.5rem',
                'type' => "text",
                'required' => false,
            ],
            '6' => [
                'label' => $this->translator->trans('mediaSlider.preloadPages'),
                'field' => 'preloadPages',
                'value' => 1,
                'type' => "number",
                'required' => false,
            ],
            '7' => [
                'label' => $this->translator->trans('mediaSlider.trimSpace'),
                'field' => 'trimSpace',
                'value' => 'move',
                'type' => "text",
                'required' => false,
            ],
            '8' => [
                'label' => $this->translator->trans('mediaSlider.interval'),
                'field' => 'interval',
                'value' => 10000,
                'type' => "number",
                'required' => true,
            ],
            '9' => [
                'label' => $this->translator->trans('mediaSlider.speed'),
                'field' => 'speed',
                'value' => 900,
                'type' => "number",
                'required' => true,
            ],
            '10' => [
                'label' => $this->translator->trans('mediaSlider.rewindSpeed'),
                'field' => 'rewindSpeed',
                'value' => 1200,
                'type' => "number",
                'required' => false,
            ],
            '11' => [
                'label' => $this->translator->trans('mediaSlider.flickPower'),
                'field' => 'flickPower',
                'value' => 500,
                'type' => "number",
                'required' => false,
            ],
            'padding' => $padding
        ];


        $breakpoints = [
            '0' => [
                'label' => $this->translator->trans('mediaSlider.Breakpoint'),
                'value' => 1400,
                'field' => 'breakpoint',
                'type' => "number",
                'required' => true,
            ],
            '1' => [
                'label' => $this->translator->trans('mediaSlider.gap'),
                'field' => 'gap',
                'value' => '1rem',
                'type' => "text",
                'required' => false,
            ],
            '2' => [
                'label' => $this->translator->trans('mediaSlider.perPage'),
                'field' => 'perPage',
                'value' => 4,
                'type' => "number",
                'required' => true,
            ],
            '3' => [
                'label' => $this->translator->trans('mediaSlider.perMove'),
                'field' => 'perMove',
                'value' => 4,
                'type' => "number",
                'required' => true,
            ],
            'padding' => $padding
        ];

        $return = [
            'checked' => $checked,
            'fields' => $fields,
            'breakpoints' => $breakpoints,
            'padding' => $padding
        ];

        if ($get) {
            if ($getField) {
                foreach ($return[$get] as $tmp) {
                    if ($getField == $tmp['fields']) {
                        return $tmp;
                    }
                }
            }
            return $return[$get];
        }

        return $return;
    }

    protected function add_default_slider(): array
    {
        return [
            "type" => "splide",
            "perPage" => "4",
            "container" => false,
            "thumbnail" => false,
            "perMove" => "4",
            "arrows" => true,
            "cover" => true,
            "keyboard" => true,
            "pauseOnFocus" => true,
            "drag" => true,
            "rewind" => true,
            "pauseOnHover" => true,
            "pagination" => false,
            "autoplay" => true,
            "lazyLoad" => "nearby",
            "gap" => "0.75rem",
            "preloadPages" => 1,
            "trimSpace" => "move",
            "interval" => 10000,
            "speed" => 900,
            "rewindSpeed" => 1200,
            "flickPower" => 500,
            "height" => '',
            "width" => '',
            "fixedWidth" => '',
            "fixedHeight" => '',
            "padding" => [
                "left" => "1rem",
                "right" => "1rem",
                "top" => "",
                "bottom" => "",
            ],
            'breakpoints' => [
                '0' => [
                    'id' => uniqid(),
                    "breakpoint" => "1400",
                    "perPage" => "3",
                    "perMove" => "3",
                    "gap" => "0.75rem",
                    "height" => '',
                    "width" => '',
                    "padding" => [
                        "left" => "1rem",
                        "right" => "1rem",
                        "top" => "",
                        "bottom" => "",
                    ]
                ]
            ]
        ];
    }

    protected function add_default_breakpoint(): array
    {
        return [
            'id' => uniqid(),
            "breakpoint" => "1400",
            "perPage" => "3",
            "perMove" => "3",
            "gap" => "0.75rem",
            "height" => '',
            "width" => '',
            "fixedWidth" => '',
            "fixedHeight" => '',
            "padding" => [
                "left" => "1rem",
                "right" => "1rem",
                "top" => "",
                "bottom" => "",
            ]
        ];
    }

    protected function default_carousel(): array
    {
        return [
            'id' => uniqid(),
            'designation' => '',
            'image_size' => 'xl-large',
            'animate' => 'slide',
            'height' => '65vh',
            'static_text' => '',
            'lazy_load' => true,
            'controls' => true,
            'indicator' => true,
            'stop_hover' => true,
            'autoplay' => true,
            'touch_active' => true,
            'keyboard_active' => true,
            'slider' => [
                '0' => $this->default_carousel_slider(),
                '1' => $this->default_carousel_slider(),
                '2' => $this->default_carousel_slider(),
            ]
        ];
    }

    protected function default_carousel_slider(): array
    {
        return [
            'id' => uniqid(),
            'image' => [],
            'active' => true,
            'caption_mobil_active' => false,
            'interval' => 6000,
            'alt' => '',
            'slide_button' => [],
            'title_hover_active' => false,
            'title_tag' => '',
            'first_ani' => '',
            'first_caption' => '',
            'first_css' => '',
            'first_id' => '',
            'headline_ani' => '',
            'headline_caption' => '',
            'headline_css' => '',
            'headline_id' => '',
            'subline_ani' => '',
            'subline_tag' => 'carousel',
            'subline_caption' => '',
            'subline_css' => '',
            'subline_id' => '',
        ];
    }

    protected function default_carousel_slider_button(): array
    {
        return [
            'id' => uniqid(),
            'text' => $this->translator->trans('plugins.Button Text'),
            'action' => '', // url - custom - ''
            'css_class' => '',
            'container_id' => '',
            'disabled' => false,
            'outline' => '',
            'variant' => 'secondary',
            'blank' => false,
            'data' => '',
            'page' => '',
            'external_url' => '',
            'size' => '',
            'block' => false,
        ];
    }

    protected function select_tag_name($carousel = true): array
    {
        $return = [
            '0' => [
                'id' => 'carousel',
                'label' => 'carousel'
            ],
            '1' => [
                'id' => 'h1',
                'label' => 'h1'
            ],
            '2' => [
                'id' => 'h2',
                'label' => 'h2'
            ],
            '3' => [
                'id' => 'h3',
                'label' => 'h3'
            ],
            '4' => [
                'id' => 'h4',
                'label' => 'h4'
            ],
            '5' => [
                'id' => 'h5',
                'label' => 'h5'
            ],
            '6' => [
                'id' => 'h6',
                'label' => 'h6'
            ],
        ];

        if (!$carousel) {
            $arr = [];
            foreach ($return as $tmp) {
                if ($tmp['id'] == 'carousel') {
                    continue;
                }
                $arr[] = $tmp;
            }
            return $arr;
        }

        return $return;
    }

    protected function select_align(): array
    {
        return [
            '0' => [
                'id' => 'start',
                'label' => $this->translator->trans('plugins.left')
            ],
            '1' => [
                'id' => 'center',
                'label' => $this->translator->trans('plugins.center')
            ],
            '2' => [
                'id' => 'end',
                'label' => $this->translator->trans('plugins.right')
            ],
        ];
    }

    protected function select_caption(): array
    {
        return [
            '0' => [
                'id' => '',
                'label' => $this->translator->trans('system.select')
            ],
            '1' => [
                'id' => 'title',
                'label' => $this->translator->trans('carousel.Title Tag')
            ],
            '2' => [
                'id' => 'description',
                'label' => $this->translator->trans('system.Description')
            ],
            '3' => [
                'id' => 'labelling',
                'label' => $this->translator->trans('fm.Labelling')
            ],
            '4' => [
                'id' => 'individuell',
                'label' => $this->translator->trans('builder.Individual')
            ],
        ];
    }

    protected function select_bg_position(): array
    {
        return [
            '0' => [
                'id' => '',
                'label' => $this->translator->trans('structure.Default')
            ],
            '1' => [
                'id' => 'left top',
                'label' => $this->translator->trans('structure.Top left')
            ],
            '2' => [
                'id' => 'center top',
                'label' => $this->translator->trans('structure.Centre top')
            ],
            '3' => [
                'id' => 'right top',
                'label' => $this->translator->trans('structure.Top right')
            ],
            '4' => [
                'id' => 'left center',
                'label' => $this->translator->trans('structure.Centre left')
            ],
            '5' => [
                'id' => 'center center',
                'label' => $this->translator->trans('structure.Centre Centre')
            ],
            '6' => [
                'id' => 'right center',
                'label' => $this->translator->trans('structure.Centre right')
            ],
            '7' => [
                'id' => 'left bottom',
                'label' => $this->translator->trans('structure.Bottom left')
            ],
            '8' => [
                'id' => 'right bottom',
                'label' => $this->translator->trans('structure.Bottom right')
            ],
        ];
    }

    protected function select_bg_style(): array
    {
        return [
            '0' => [
                'id' => '',
                'label' => $this->translator->trans('structure.Default')
            ],
            '1' => [
                'id' => 'cover',
                'label' => 'Cover'
            ],
            '2' => [
                'id' => 'contain',
                'label' => 'Contain'
            ],
            '3' => [
                'id' => 'no-repeat',
                'label' => 'No repeat'
            ],
            '4' => [
                'id' => 'repeat',
                'label' => 'Repeat'
            ],
        ];
    }

    protected function select_align_item(): array
    {
        return [
            '0' => [
                'id' => 'center',
                'label' => $this->translator->trans('builder.Centred')
            ],
            '1' => [
                'id' => 'start',
                'label' => $this->translator->trans('builder.Left-aligned')
            ],
            '2' => [
                'id' => 'end',
                'label' => $this->translator->trans('builder.Right-aligned')
            ],
        ];
    }

    protected function select_border_style(): array
    {
        return [
            '0' => [
                'id' => 'solid',
                'label' => 'Border'
            ],
            '1' => [
                'id' => 'dotted',
                'label' => 'Dotted'
            ],
            '2' => [
                'id' => 'double',
                'label' => 'Double'
            ],
        ];
    }

    protected function select_parallax_type(): array
    {
        return [
            '0' => [
                'id' => 'scroll',
                'label' => 'scroll'
            ],
            '1' => [
                'id' => 'scale',
                'label' => 'scale'
            ],
            '2' => [
                'id' => 'opacity',
                'label' => 'opacity'
            ],
            '3' => [
                'id' => 'scroll-opacity',
                'label' => 'scroll-opacity'
            ],
            '4' => [
                'id' => 'scale-opacity',
                'label' => 'scale-opacity'
            ],
        ];
    }

    protected function select_menu_type(): array
    {
        return [
            '0' => [
                'id' => '',
                'label' => $this->translator->trans('system.select')
            ],
            '1' => [
                'id' => 'main',
                'label' => $this->translator->trans('system.Main menu')
            ],
            '2' => [
                'id' => 'custom',
                'label' => $this->translator->trans('system.Customised')
            ],
        ];
    }

    protected function select_menu_breakpoint(): array
    {
        return [
            '0' => [
                'id' => 'md',
                'label' => 'MD'
            ],
            '1' => [
                'id' => 'lg',
                'label' => 'LG'
            ],
            '2' => [
                'id' => 'xl',
                'label' => 'XL'
            ],
            '3' => [
                'id' => 'xxl',
                'label' => 'XXL'
            ],
        ];
    }

    protected function gallery_default_breakpoints($bezeichnung): array
    {
        return [
            'galleryType' => 'gallery',
            'designation' => $bezeichnung,
            'description' => '',
            'width' => 260,
            'height' => 160,
            'size' => 'medium',
            'animation' => '',
            'crop' => true,
            'show_designation' => false,
            'show_description' => false,
            'lazy_load' => true,
            'lazy_load_animation' => false,
            'animation_repeat' => true,
            'breakpoints' => [
                'xxl' => [
                    'id' => 'xxl',
                    'breakpoint' => 1400,
                    'columns' => 5,
                    'gutter' => 1,
                ],
                'xl' => [
                    'id' => 'xl',
                    'breakpoint' => 1200,
                    'columns' => 5,
                    'gutter' => 1,
                ],
                'lg' => [
                    'id' => 'lg',
                    'breakpoint' => 992,
                    'columns' => 4,
                    'gutter' => 1,
                ],
                'md' => [
                    'id' => 'md',
                    'breakpoint' => 768,
                    'columns' => 3,
                    'gutter' => 1,
                ],
                'sm' => [
                    'id' => 'sm',
                    'breakpoint' => 576,
                    'columns' => 2,
                    'gutter' => 1,
                ],
                'xs' => [
                    'id' => 'xs',
                    'breakpoint' => 450,
                    'columns' => 2,
                    'gutter' => 1,
                ],
            ]
        ];
    }

    protected function gallery_default_image(): array
    {
        return [
            'id' => uniqid(),
            'name' => '',
            'img_id' => '',
            'img_type' => '',
            'img_alt' => '',
            'img_title' => '',
            'img_description',
            'designation' => '',
            'description' => '',
            'width' => 260,
            'height' => 160,
            'size' => 'medium',
            'animation' => '',
            'url_type' => 'lightbox',
            'url' => '',
            'lightbox_type' => 'slide',
            'gallery_settings' => true,
            'crop' => true,
            'show_designation' => false,
            'show_description' => false,
            'new_tab' => false,
            'lazy_load' => true,
            'lazy_load_animation' => false,
        ];
    }

    protected function select_order_by_default(): array
    {
        return [
            '0' => [
                'id' => 'position',
                'label' => $this->translator->trans('posts.Position')
            ],
            '1' => [
                'id' => 'date',
                'label' => $this->translator->trans('posts.Article date')
            ],
            '2' => [
                'id' => 'name',
                'label' => $this->translator->trans('posts.Post title')
            ],
            '3' => [
                'id' => 'category_position',
                'label' => $this->translator->trans('posts.Category position')
            ],
            '4' => [
                'id' => 'category_name',
                'label' => $this->translator->trans('posts.Category name')
            ],
        ];
    }

    protected function select_order_default(): array
    {
        return [
            '0' => [
                'id' => 'asc',
                'label' => 'ASC'
            ],
            '1' => [
                'id' => 'desc',
                'label' => 'DESC'
            ]
        ];
    }

    protected function get_font_weight($weight = ''): array
    {
        $font_weight = [
            'regular' => 'normal',
            'italic' => 'normal',
            'thin' => '100',
            'extralight' => '200',
            'light' => '300',
            'medium' => '500',
            'semibold' => '600',
            'black' => '900',
            'extrabold' => 'bold',
            'bold' => 'bold'
        ];
        if ($weight) {
            foreach ($font_weight as $key => $val) {
                if ($key == $weight) {
                    return ['weight' => $val];
                }
            }
            return [];
        }
        return $font_weight;
    }

    protected function default_map_protection():array
    {
        return [
            'image' => [],
            'page' => '',
            'btn_text' => 'Anfahrtskarte anzeigen',
            'btn_css' => '',
            'btn_uppercase' => false,
            'img_gray' => false,
            'accept_txt' => 'Ich akzeptiere die <a class="text-light" href="{{LINK}}" target="_blank">Datenschutzbestimmungen</a>',
            'link_placeholder' => '{{LINK}}',
        ];
    }
    protected function default_gmaps_pin():array
    {
        return [
            'id' => uniqid(),
            'custom_pin_active' => false,
            'custom_pin' => '',
            'pin_height' => 35,
            'pin_width' => 25,
            'coordinates' => '',
            'info_txt' => '',
        ];
    }

    private function default_custom_field_selects():array
    {
        return [
            '0' => [
                'id' => 'text',
                'label' => $this->translator->trans('plugins.Text')
            ],
            '1' => [
                'id' => 'mailto',
                'label' => 'mailto'
            ],
            '2' => [
                'id' => 'tel',
                'label' => 'tel'
            ],
            '3' => [
                'id' => 'url',
                'label' => 'url'
            ],
        ];
    }

    protected function select_video_extern_types() :array
    {
        return [
            '0' => [
                'id' => 'youtube',
                'label' => 'YouTube'
            ],
            '1' => [
                'id' => 'vimeo',
                'label' => 'Vimeo'
            ],
            '2' => [
                'id' => 'url',
                'label' => 'Url'
            ]
        ];
    }

    private function default_custom_field($designation, $type):array
    {
        return [
            'id' => uniqid(),
            'designation' => $designation,
            'extra_css' => '',
            'show_url' => 'url',
            'new_tab' => false,
            'icon_css' => '',
            'icon' => '',
            'link_type' => $type,
            'value' => ''
        ];
    }

    protected function default_video_entry():array
    {
        return [
            'id' => uniqid(),
            'video_title' => '',
            'video_url' => '',
            'extern_title' => false,
            'extern_type' => '',
            'extern_id' => '',
            'media_id' => '',
            'extern_url' => '',
            'cover_url' => '',
        ];
    }

    protected function select_rtl(): array
    {
        return [
            '0' => [
                'id' => 'ltr',
                'label' => 'ltr'
            ],
            '1' => [
                'id' => 'rtl',
                'label' => 'rtl'
            ],
        ];
    }
}
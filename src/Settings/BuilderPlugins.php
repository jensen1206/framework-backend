<?php

namespace App\Settings;

use stdClass;

trait BuilderPlugins
{
    protected function bp_plugins($group = null, $type = null, $section = null, $builderType = null): array
    {
        $plugins = [
            '0' => [
                'section' => 'contents',
                'designation' => $this->translator->trans('Contents'),
                'id' => uniqid(),
                'plugins' => [
                    '0' => [
                        'id' => uniqid(),
                        'type' => 'tinymce',
                        'section' => 'contents',
                        'active' => true,
                        'designation' => $this->translator->trans('plugins.Text area'),
                        'description' => $this->translator->trans('plugins.A text area with WYSIWYG editor'),
                        'icon' => 'bi bi-text-indent-left',
                        'animation' => [
                            'type' => '',
                            'iteration' => 1,
                            'duration' => '0.5s',
                            'delay' => '0.1s',
                            'count' => 1,
                            'offset' => 5,
                            'no_repeat' => false
                        ],
                        'data' => [
                            'input' => '<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>'
                        ],
                        'backend' => [],
                        'config' => [
                            'css_class' => '',
                            'container_id' => ''
                        ],
                        'options' => [],
                    ],
                    '1' => [
                        'id' => uniqid(),
                        'type' => 'single_image',
                        'section' => 'medien',
                        'active' => true,
                        'designation' => $this->translator->trans('plugins.Single image'),
                        'description' => $this->translator->trans('plugins.Simple image with various options'),
                        'icon' => 'bi bi-card-image',
                        'animation' => [
                            'type' => '',
                            'iteration' => 1,
                            'duration' => '0.5s',
                            'delay' => '0.1s',
                            'count' => 1,
                            'offset' => 5,
                            'no_repeat' => false
                        ],
                        'data' => [
                            'input' => '<div class="d-flex flex-column  align-items-center"><div style="width: 50px; height: 50px" class="placeholder-account-image mt-2 p-1 border rounded"></div><div class="d-block small-lg ms-2">' . $this->translator->trans('plugins.Single image') . '</div></div>'
                        ],
                        'backend' => ['pages', 'sizes', 'link', 'source', 'align', 'dimensions', 'caption'],
                        'config' => [
                            'css_class' => '',
                            'container_id' => '',
                            'size' => 'medium',
                            'page' => '',
                            'caption_type' => '', //title - description - labelling - individuell
                            'custom_caption' => '',
                            'action' => '',
                            'source' => 'mediathek',
                            'external_url' => '',
                            'new_tab' => false,
                            'custom_link' => '',
                            'width' => '',
                            'height' => 'auto',
                            'align' => 'center'
                        ],
                        'images' => [],
                        'options' => [],
                    ],
                    '2' => [
                        'id' => uniqid(),
                        'type' => 'spacer',
                        'section' => 'structure',
                        'active' => true,
                        'designation' => $this->translator->trans('plugins.Spacer'),
                        'description' => $this->translator->trans('plugins.Empty space with user-defined height'),
                        'icon' => 'bi bi-arrows-expand',
                        'data' => [
                            'input' => '25px'
                        ],
                        'backend' => [],
                        'config' => [
                            'css_class' => '',
                            'container_id' => '',
                        ],
                        'options' => [],
                    ],
                    '3' => [
                        'id' => uniqid(),
                        'type' => 'button',
                        'section' => 'contents',
                        'active' => true,
                        'designation' => $this->translator->trans('plugins.Button'),
                        'description' => $this->translator->trans('plugins.Bootstrap Button'),
                        'icon' => 'bi bi-hand-index',
                        'animation' => [
                            'type' => '',
                            'iteration' => 1,
                            'duration' => '0.5s',
                            'delay' => '0.1s',
                            'count' => 1,
                            'offset' => 5,
                            'no_repeat' => false
                        ],
                        'data' => [
                            'input' => $this->translator->trans('plugins.Button Text'),
                        ],
                        'backend' => ['button', 'pages', 'button_action', 'button_size', 'link', 'btn_variant'],
                        'config' => [
                            'css_class' => '',
                            'container_id' => '',
                            'outline' => '',
                            'variant' => 'secondary',
                            'blank' => false,
                            'data' => '',
                            'page' => '',
                            'external_url' => '',
                            'size' => '',
                            'post_button' => false,
                            'block' => false,
                            'disabled' => false,
                            'icon' => ''
                        ],
                        'options' => [],
                    ],
                    '4' => [
                        'id' => uniqid(),
                        'type' => 'dividing-line',
                        'section' => 'structure',
                        'active' => true,
                        'designation' => $this->translator->trans('plugins.Dividing line'),
                        'description' => $this->translator->trans('plugins.Horizontal dividing line'),
                        'icon' => 'bi bi-arrows',
                        'animation' => [
                            'type' => '',
                            'iteration' => 1,
                            'duration' => '0.5s',
                            'delay' => '0.1s',
                            'count' => 1,
                            'offset' => 5,
                            'no_repeat' => false
                        ],
                        'data' => [
                            'input' => '<hr class="bt2"/>'
                        ],
                        'backend' => [],
                        'config' => [
                            'css_class' => '',
                            'container_id' => '',
                            'width' => 100,
                            'height' => '1px',
                            'alignment' => 'center',
                            'style' => 'solid',
                            'color' => [
                                'r' => 0,
                                'g' => 0,
                                'b' => 0,
                                'a' => 0.25],
                        ],
                        'options' => [],
                    ],
                    '5' => [
                        'id' => uniqid(),
                        'type' => 'dividing-with-text',
                        'section' => 'structure',
                        'active' => true,
                        'designation' => $this->translator->trans('plugins.Dividing line with text'),
                        'description' => $this->translator->trans('plugins.Horizontal dividing line with heading'),
                        'icon' => 'bi bi-align-middle',
                        'animation' => [
                            'type' => '',
                            'iteration' => 1,
                            'duration' => '0.5s',
                            'delay' => '0.1s',
                            'count' => 1,
                            'offset' => 5,
                            'no_repeat' => false
                        ],
                        'data' => [
                            'input' => '<hr class="bt2"/>'
                        ],
                        'backend' => [],
                        'config' => [
                            'css_class' => '',
                            'container_id' => '',
                            'width' => 100,
                            'height' => '2px',
                            'alignment' => 'center',
                            'style' => 'solid',
                            'fontStyle' => 'h2',
                            'text' => 'Lorem ipsum',
                            'text_align' => 'center',
                            'text_css' => '',
                            'color' => [
                                'r' => 255,
                                'g' => 160,
                                'b' => 0,
                                'a' => 1],
                        ],
                        'options' => [],
                    ],
                    '6' => [
                        'id' => uniqid(),
                        'type' => 'page-slider',
                        'active' => false,
                        'designation' => $this->translator->trans('mediaSlider.Page Slider'),
                        'description' => $this->translator->trans('mediaSlider.Slider for created websites'),
                        'icon' => 'bi bi-arrow-left-right',
                        'data' => [
                            'input' => '25px'
                        ],
                        'backend' => [],
                        'config' => [
                            'css_class' => '',
                            'container_id' => '',
                        ],
                        'options' => [],
                    ],
                    '7' => [
                        'id' => uniqid(),
                        'type' => 'unfiltered-html',
                        'section' => 'structure',
                        'active' => true,
                        'designation' => $this->translator->trans('plugins.Unfiltered HTML'),
                        'description' => $this->translator->trans('plugins.Output raw HTML code on your page'),
                        'icon' => 'bi bi-filetype-html',
                        'data' => [
                            'input' => '<div class="text-center mt-2"><div><i class="bi fs-5 bi-filetype-html"></i></div> ' . $this->translator->trans('plugins.Unfiltered HTML') . '</div>'
                        ],
                        'backend' => [],
                        'config' => [
                            'css_class' => '',
                            'container_id' => '',
                            'html' => ''
                        ],
                        'options' => [],
                    ],
                    '8' => [
                        'id' => uniqid(),
                        'type' => 'menu',
                        'section' => 'contents',
                        'active' => true,
                        'designation' => $this->translator->trans('plugins.Menu'),
                        'description' => $this->translator->trans('plugins.Output menu with various options'),
                        'icon' => 'bi bi-menu-button-wide',
                        'data' => [
                            'input' => '<div class="text-center d-flex align-items-center flex-column justify-content-center my-3"><i class="fs-1 bi bi-menu-button-wide"></i>' . $this->translator->trans('plugins.Menu') . '</div>'
                        ],
                        'animation' => [
                            'type' => '',
                            'iteration' => 1,
                            'duration' => '0.5s',
                            'delay' => '0.1s',
                            'count' => 1,
                            'offset' => 5,
                            'no_repeat' => false
                        ],
                        'backend' => ['menu'],
                        'config' => [
                            'css_class' => '',
                            'container_id' => '',
                            'ul_css' => '',
                            'li_css' => '',
                            'show_name' => false,
                            'menu' => ''
                        ],
                        'options' => [],
                    ],
                    '9' => [
                        'id' => uniqid(),
                        'type' => 'icon',
                        'section' => 'structure',
                        'active' => true,
                        'designation' => $this->translator->trans('plugins.Icon'),
                        'description' => $this->translator->trans('plugins.Output icon with various options'),
                        'icon' => 'bi bi-bootstrap',
                        'data' => [
                            'input' => '<div class="text-center d-flex align-items-center flex-column justify-content-center my-3"><i class="fs-1 bi bi-bootstrap"></i>' . $this->translator->trans('plugins.Icon') . '</div>'
                        ],
                        'animation' => [
                            'type' => '',
                            'iteration' => 1,
                            'duration' => '0.5s',
                            'delay' => '0.1s',
                            'count' => 1,
                            'offset' => 5,
                            'no_repeat' => false
                        ],
                        'backend' => [],
                        'config' => [
                            'css_class' => '',
                            'container_id' => '',
                            'icon' => '',
                            'extra_css' => ''
                        ],
                        'options' => [],
                    ],
                    '10' => [
                        'id' => uniqid(),
                        'type' => 'gmaps-api',
                        'section' => 'medien',
                        'active' => true,
                        'designation' => $this->translator->trans('plugins.Google Maps-Api'),
                        'description' => $this->translator->trans('plugins.Google API card with options'),
                        'icon' => 'bi bi-pin-map-fill',
                        'data' => [
                            'input' => '<div class="text-center d-flex align-items-center flex-column justify-content-center my-3"><i class="fs-1 bi bi-pin-map-fill"></i>' . $this->translator->trans('plugins.Google Maps-Api') . '</div>'
                        ],
                        'animation' => [
                            'type' => '',
                            'iteration' => 1,
                            'duration' => '0.5s',
                            'delay' => '0.1s',
                            'count' => 1,
                            'offset' => 5,
                            'no_repeat' => false
                        ],
                        'backend' => ['protection'],
                        'config' => [
                            'css_class' => '',
                            'container_id' => '',
                            'api_key' => '',
                            'default_pin' => '',
                            'pin_height' => 35,
                            'pin_width' => 25,
                            'privacy_policy' => '',
                            'colour_scheme_active' => false,
                            'custom_colour_scheme' => '',
                            'zoom' => 15
                         ],
                        'pins' => [
                            '0' => [
                                'id' => uniqid(),
                                'custom_pin_active' => false,
                                'custom_pin' => '',
                                'pin_height' => 35,
                                'pin_width' => 25,
                                'coordinates' => '',
                                'info_txt' => '',
                            ]
                        ],
                        'options' => [],
                    ],
                    '11' => [
                        'id' => uniqid(),
                        'type' => 'gmaps-iframe',
                        'section' => 'medien',
                        'active' => true,
                        'designation' => $this->translator->trans('plugins.Google Maps I-Frame'),
                        'description' => $this->translator->trans('plugins.Google I-Frame map with options'),
                        'icon' => 'bi bi-pin-map',
                        'data' => [
                            'input' => '<div class="text-center d-flex align-items-center flex-column justify-content-center my-3"><i class="fs-1 bi bi-pin-map"></i>' . $this->translator->trans('plugins.Google Maps I-Frame') . '</div>'
                        ],
                        'animation' => [
                            'type' => '',
                            'iteration' => 1,
                            'duration' => '0.5s',
                            'delay' => '0.1s',
                            'count' => 1,
                            'offset' => 5,
                            'no_repeat' => false
                        ],
                        'backend' => ['protection'],
                        'config' => [
                            'css_class' => '',
                            'container_id' => '',
                            'iframe' => '',
                            'height' => '',
                            'width' => '',
                            'privacy_policy' => ''
                        ],
                        'options' => [],
                    ],
                    '12' => [
                        'id' => uniqid(),
                        'type' => 'osm',
                        'section' => 'medien',
                        'active' => true,
                        'designation' => $this->translator->trans('plugins.OpenStreetMap I-Frame'),
                        'description' => $this->translator->trans('plugins.OpenStreetMap with options'),
                        'icon' => 'bi bi-pin',
                        'data' => [
                            'input' => '<div class="text-center d-flex align-items-center flex-column justify-content-center my-3"><i class="fs-1 bi bi-pin"></i>' . $this->translator->trans('plugins.OpenStreetMap I-Frame') . '</div>'
                        ],
                        'animation' => [
                            'type' => '',
                            'iteration' => 1,
                            'duration' => '0.5s',
                            'delay' => '0.1s',
                            'count' => 1,
                            'offset' => 5,
                            'no_repeat' => false
                        ],
                        'backend' => ['protection'],
                        'config' => [
                            'css_class' => '',
                            'container_id' => '',
                            'iframe' => '',
                            'height' => '',
                            'width' => '',
                            'privacy_policy' => '',
                            'link_show_larger_map' => true,
                        ],
                        'options' => [],
                    ],
                    '13' => [
                        'id' => uniqid(),
                        'type' => 'osm-leaflet',
                        'section' => 'medien',
                        'active' => true,
                        'designation' => $this->translator->trans('plugins.OpenStreetMap Leaflet'),
                        'description' => $this->translator->trans('plugins.OpenStreetMap Leaflet with options'),
                        'icon' => 'bi bi-pin-fill',
                        'data' => [
                            'input' => '<div class="text-center d-flex align-items-center flex-column justify-content-center my-3"><i class="fs-1 bi bi-pin-fill"></i>' . $this->translator->trans('plugins.OpenStreetMap Leaflet') . '</div>'
                        ],
                        'animation' => [
                            'type' => '',
                            'iteration' => 1,
                            'duration' => '0.5s',
                            'delay' => '0.1s',
                            'count' => 1,
                            'offset' => 5,
                            'no_repeat' => false
                        ],
                        'backend' => ['protection'],
                        'config' => [
                            'css_class' => '',
                            'container_id' => '',
                            'height' => '',
                            'width' => '',
                            'privacy_policy' => '',
                            'zoom' => 14,
                            'max_zoom' => 18,
                            'min_zoom' => 8,
                            'mini_map_min_zoom' => 5,
                            'mini_map_max_zoom' => 15,
                            'maxClusterRadius' => 20,
                            'mini_map_active' => true,
                            'mini_map_width' => 150,
                            'mini_map_height' => 150,
                            'fill_color' => [
                                'r' => 60,
                                'g' => 130,
                                'b' => 205,
                                'a' => 1],
                            'color' => [
                                'r' => 170,
                                'g' => 170,
                                'b' => 170,
                                'a' => 1],
                            'pin' => ''
                        ],
                        'pins' => [],
                        'options' => [],
                    ],
                    '14' => [
                        'id' => uniqid(),
                        'type' => 'forms',
                        'section' => 'contents',
                        'active' => true,
                        'designation' => $this->translator->trans('forms.Form'),
                        'description' => $this->translator->trans('forms.Output of created forms'),
                        'icon' => 'bi bi-envelope-at',
                        'data' => [
                            'input' => '<div class="text-center d-flex align-items-center flex-column justify-content-center my-3"><i class="fs-1 bi bi-envelope-at"></i>' . $this->translator->trans('forms.Form') . '</div>'
                        ],
                        'animation' => [
                            'type' => '',
                            'iteration' => 1,
                            'duration' => '0.5s',
                            'delay' => '0.1s',
                            'count' => 1,
                            'offset' => 5,
                            'no_repeat' => false
                        ],
                        'backend' => ['forms'],
                        'config' => [
                            'css_class' => '',
                            'container_id' => '',
                            'formular' => ''
                        ],
                        'options' => [],
                    ],
                    '15' => [
                        'id' => uniqid(),
                        'type' => 'bs-accordion',
                        'section' => 'contents',
                        'active' => true,
                        'designation' => $this->translator->trans('plugins.Accordion'),
                        'description' => $this->translator->trans('plugins.Build collapsing accordions'),
                        'icon' => 'bi bi-distribute-vertical',
                        'data' => [
                            'input' => '<div class="text-center d-flex align-items-center flex-column justify-content-center my-3"><i class="fs-1 bi bi-distribute-vertical"></i>' . $this->translator->trans('plugins.Accordion') . '</div>'
                        ],
                        'animation' => [
                            'type' => '',
                            'iteration' => 1,
                            'duration' => '0.5s',
                            'delay' => '0.1s',
                            'count' => 1,
                            'offset' => 5,
                            'no_repeat' => false
                        ],
                        'backend' => [],
                        'config' => [
                            'css_class' => '',
                            'container_id' => '',
                            'header_css' => '',
                            'body_css' => '',
                            'parent_element' => true,
                            'accordion' => []
                        ],
                        'options' => [],
                    ],
                    '16' => [
                        'id' => uniqid(),
                        'type' => 'custom-fields',
                        'section' => 'contents',
                        'active' => true,
                        'designation' => $this->translator->trans('Custom Fields'),
                        'description' => $this->translator->trans('plugins.Output of saved fields'),
                        'icon' => 'bi bi-alt',
                        'data' => [
                            'input' => '<div class="text-center d-flex align-items-center flex-column justify-content-center my-3"><i class="fs-1 bi bi-alt"></i>' . $this->translator->trans('Custom Fields') . '</div>'
                        ],
                        'animation' => [
                            'type' => '',
                            'iteration' => 1,
                            'duration' => '0.5s',
                            'delay' => '0.1s',
                            'count' => 1,
                            'offset' => 5,
                            'no_repeat' => false
                        ],
                        'backend' => ['custom_fields'],
                        'config' => [
                            'css_class' => '',
                            'container_id' => '',
                            'wrapper_css' => '',
                            'fields' => []
                        ],
                        'options' => [],
                    ],
                    '17' => [
                        'id' => uniqid(),
                        'type' => 'video',
                        'section' => 'medien',
                        'active' => true,
                        'designation' => $this->translator->trans('plugins.Video'),
                        'description' => $this->translator->trans('plugins.Output of saved or external videos'),
                        'icon' => 'bi bi-camera-reels',
                        'animation' => [
                            'type' => '',
                            'iteration' => 1,
                            'duration' => '0.5s',
                            'delay' => '0.1s',
                            'count' => 1,
                            'offset' => 5,
                            'no_repeat' => false
                        ],
                        'data' => [
                            'input' => '<div class="text-center d-flex align-items-center flex-column justify-content-center my-3"><i class="fs-1 bi bi-camera-reels"></i>' . $this->translator->trans('plugins.Video') . '</div>'
                        ],
                        'backend' => ['video', 'rtl'],
                        'config' => [
                            'css_class' => '',
                            'container_id' => '',
                            'carousel' => false,
                            'play_icon' => '',
                            'carouselOptions' => [
                                'clearSlides' => true,
                                'toggleControlsOnEnter' => true,
                                'toggleControlsOnSlideClick' => true,
                                'toggleSlideshowOnSpace' => true,
                                'enableKeyboardNavigation' => true,
                                'closeOnEscape' => true,
                                'closeOnSlideClick' => true,
                                'closeOnSwipeUpOrDown' => true,
                                'closeOnHashChange' => true,
                                'emulateTouchEvents' => true,
                                'stopTouchEventsPropagation' => false,
                                'hidePageScrollbars' => false,
                                'disableScroll' => false,
                                'continuous' => true,
                                'unloadElements' => true,
                                'startSlideshow' => false,
                                'slideshowInterval' => 6000,
                                'slideshowDirection' => 'ltr',
                                'transitionDuration' => 300,
                                'slideshowTransitionDuration' => 500,
                                'index' => 0
                            ],
                            'videos' => [],
                        ],
                        'options' => [],
                    ],
                ]
            ],
            '1' => [
                'section' => 'gallery',
                'designation' => $this->translator->trans('Gallery'),
                'id' => uniqid(),
                'plugins' => [
                    '0' => [
                        'id' => uniqid(),
                        'type' => 'medien-slider',
                        'section' => 'medien',
                        'active' => true,
                        'designation' => $this->translator->trans('mediaSlider.Medien Slider'),
                        'description' => $this->translator->trans('mediaSlider.Slider with media library images'),
                        'icon' => 'bi bi-arrow-left-right',
                        'animation' => [
                            'type' => '',
                            'iteration' => 1,
                            'duration' => '0.5s',
                            'delay' => '0.1s',
                            'count' => 1,
                            'offset' => 5,
                            'no_repeat' => false
                        ],
                        'data' => [
                            'input' => '<div class="d-flex flex-column  align-items-center"><div style="width: 50px; height: 50px" class="placeholder-account-image mt-2 p-1 border rounded"></div><div class="d-block small-lg ms-2">' . $this->translator->trans('mediaSlider.Medien Slider') . '</div></div>'
                        ],
                        'backend' => ['sizes', 'slider', 'link-select', 'page-select'],
                        'config' => [
                            'css_class' => '',
                            'container_id' => '',
                            'size' => 'medium',
                            'action' => 'lightbox',
                            'objectPosition' => 'center',
                            'lightboxSingle' => true,
                            'height' => '200px',
                            'slider' => '',
                        ],
                        'images' => [],
                    ],
                    '1' => [
                        'id' => uniqid(),
                        'type' => 'medien-carousel',
                        'section' => 'medien',
                        'active' => true,
                        'designation' => $this->translator->trans('carousel.Medien Carousel'),
                        'description' => $this->translator->trans('carousel.Carousel with media library images'),
                        'icon' => 'bi bi-arrows-expand-vertical',
                        'data' => [
                            'input' => '<div class="d-flex flex-column  align-items-center"><div style="width: 50px; height: 50px" class="placeholder-account-image mt-2 p-1 border rounded"></div><div class="d-block small-lg ms-2">' . $this->translator->trans('carousel.Medien Carousel') . '</div></div>'
                        ],
                        'backend' => ['carousel'],
                        'config' => [
                            'css_class' => '',
                            'container_id' => '',
                            'carousel' => ''
                        ],
                        'images' => []
                    ],
                    '2' => [
                        'id' => uniqid(),
                        'type' => 'medien-gallery',
                        'section' => 'medien',
                        'active' => true,
                        'designation' => $this->translator->trans('gallery.Media gallery'),
                        'description' => $this->translator->trans('mediaSlider.Slider with media library images'),
                        'icon' => 'bi bi-grid-3x3-gap',
                        'data' => [
                            'input' => '<div class="d-flex flex-column  align-items-center"><div style="width: 50px; height: 50px" class="placeholder-account-image mt-2 p-1 border rounded"></div><div class="d-block small-lg ms-2">' . $this->translator->trans('gallery.Media gallery') . '</div></div>'
                        ],
                        'backend' => ['link-select', 'posts-select', 'gallery-select'],
                        'config' => [
                            'css_class' => '',
                            'gallery' => '',
                            'container_id' => '',
                            'size' => 'medium',
                            'action' => 'lightbox',
                            'post_type' => 'medien',
                            'site_id' => '',
                            'custom_link' => '',
                            'lightbox_type' => 'slide',
                            'show_designation' => false,
                            'show_description' => false,
                            'new_tab' => false,
                        ],
                        'images' => [],
                    ],
                ]
            ],
            '2' => [
                'section' => 'loop',
                'designation' => $this->translator->trans('plugins.Post loop'),
                'id' => uniqid(),
                'plugins' => [
                    '0' => [
                        'id' => uniqid(),
                        'type' => 'post-title',
                        'active' => true,
                        'designation' => $this->translator->trans('plugins.Post title'),
                        'description' => $this->translator->trans('plugins.Output of the post title'),
                        'icon' => 'bi bi-text-indent-left',
                        'animation' => [
                            'type' => '',
                            'iteration' => 1,
                            'duration' => '0.5s',
                            'delay' => '0.1s',
                            'count' => 1,
                            'offset' => 5,
                            'no_repeat' => false
                        ],
                        'data' => [
                            'input' => '<div class="text-center fs-5 my-3"><i class="bi bi-text-center me-2"></i>' . $this->translator->trans('plugins.Post title') . '</div>'
                        ],
                        'backend' => ['tag_headline'],
                        'config' => [
                            'css_class' => '',
                            'container_id' => '',
                            'selector' => 'h2',
                            'word_limit' => '',
                            'link_post' => false,
                            'new_tab' => false,
                        ],
                        'options' => [],
                    ],
                    '1' => [
                        'id' => uniqid(),
                        'type' => 'featured-image',
                        'active' => true,
                        'designation' => $this->translator->trans('posts.Featured image'),
                        'description' => $this->translator->trans('posts.Edition Feature image'),
                        'icon' => 'bi bi-image',
                        'animation' => [
                            'type' => '',
                            'iteration' => 1,
                            'duration' => '0.5s',
                            'delay' => '0.1s',
                            'count' => 1,
                            'offset' => 5,
                            'no_repeat' => false
                        ],
                        'data' => [
                            'input' => '<div class="text-center d-flex align-items-center flex-column justify-content-center my-3"><i class="fs-1 bi bi-image"></i>' . $this->translator->trans('posts.Featured image') . '</div>'
                        ],
                        'backend' => ['sizes', 'link', 'align', 'dimensions', 'caption'],
                        'config' => [
                            'css_class' => '',
                            'container_id' => '',
                            'size' => 'medium',
                            'source' => 'mediathek',
                            'caption_type' => 'title',
                            'custom_caption' => '',
                            'custom_link' => '',
                            'action' => '',
                            'page' => '',
                            'width' => '',
                            'height' => '',
                            'url' => '',
                            'external_url' => '',
                            'new_tab' => false,
                            'align' => 'center'
                        ],
                        'options' => [],
                    ],
                    '2' => [
                        'id' => uniqid(),
                        'type' => 'post-excerpt',
                        'active' => true,
                        'designation' => $this->translator->trans('posts.Text excerpt'),
                        'description' => $this->translator->trans('posts.Output Text excerpt'),
                        'icon' => 'bi bi-justify-left',
                        'animation' => [
                            'type' => '',
                            'iteration' => 1,
                            'duration' => '0.5s',
                            'delay' => '0.1s',
                            'count' => 1,
                            'offset' => 5,
                            'no_repeat' => false
                        ],
                        'data' => [
                            'input' => '<div class="text-center fs-6 my-3"><i class="bi bi-justify-left me-2"></i>' . $this->translator->trans('posts.Text excerpt') . '</div>'
                        ],
                        'backend' => [],
                        'config' => [
                            'css_class' => '',
                            'container_id' => '',
                            'word_limit' => ''
                        ],
                        'options' => [],
                    ],
                    '3' => [
                        'id' => uniqid(),
                        'type' => 'post-content',
                        'active' => true,
                        'designation' => $this->translator->trans('posts.Post Content'),
                        'description' => $this->translator->trans('posts.Article Content HTML Output'),
                        'icon' => 'bi bi-paragraph',
                        'animation' => [
                            'type' => '',
                            'iteration' => 1,
                            'duration' => '0.5s',
                            'delay' => '0.1s',
                            'count' => 1,
                            'offset' => 5,
                            'no_repeat' => false
                        ],
                        'data' => [
                            'input' => '<div class="text-center fs-6 my-3"><i class="bi bi-paragraph me-2"></i>' . $this->translator->trans('posts.Post Content') . '</div>'
                        ],
                        'backend' => [],
                        'config' => [
                            'css_class' => '',
                            'container_id' => '',
                        ],
                        'options' => [],
                    ],
                    '4' => [
                        'id' => uniqid(),
                        'type' => 'post-date',
                        'active' => true,
                        'designation' => $this->translator->trans('posts.Article date'),
                        'description' => $this->translator->trans('posts.Date with output options'),
                        'icon' => 'bi bi-calendar-date',
                        'animation' => [
                            'type' => '',
                            'iteration' => 1,
                            'duration' => '0.5s',
                            'delay' => '0.1s',
                            'count' => 1,
                            'offset' => 5,
                            'no_repeat' => false
                        ],
                        'data' => [
                            'input' => '<div class="text-center fs-6 my-3"><i class="bi bi-calendar-date me-2"></i>' . $this->translator->trans('posts.Article date') . '</div>'
                        ],
                        'backend' => [],
                        'config' => [
                            'css_class' => '',
                            'container_id' => '',
                            'format' => 'd.m.Y'
                        ],
                        'options' => [],
                    ],
                    '5' => [
                        'id' => uniqid(),
                        'type' => 'post-gallery',
                        'active' => true,
                        'designation' => $this->translator->trans('gallery.Post gallery'),
                        'description' => $this->translator->trans('plugins.Post gallery with options'),
                        'icon' => 'bi bi-images',
                        'animation' => [
                            'type' => '',
                            'iteration' => 1,
                            'duration' => '0.5s',
                            'delay' => '0.1s',
                            'count' => 1,
                            'offset' => 5,
                            'no_repeat' => false
                        ],
                        'data' => [
                            'input' => '<div class="text-center d-flex align-items-center flex-column justify-content-center my-3"><i class="fs-1 bi bi-images"></i>' . $this->translator->trans('gallery.Post gallery') . '</div>'
                        ],
                        'backend' => ['gallery-select', 'slider', 'sizes'],
                        'config' => [
                            'css_class' => '',
                            'container_id' => '',
                            'gallery_id' => '',
                            'output_type' => 'gallery',
                            'action' => 'lightbox',
                            'lightbox_type' => 'slide',
                            'size' => 'medium',
                            'show_title' => true,
                            'show_caption' => false,
                            'show_description' => false,
                            'height' => '200px',
                            'slider_img_size' => 'medium',
                            'slider_object_position' => 'center'
                        ],
                        'options' => [],
                    ],
                ]
            ],
            '3' => [
                'section' => 'post-category',
                'designation' => $this->translator->trans('posts.Post category'),
                'id' => uniqid(),
                'plugins' => [
                    '0' => [
                        'id' => uniqid(),
                        'type' => 'post-loop',
                        'active' => true,
                        'designation' => $this->translator->trans('posts.Post loop'),
                        'description' => $this->translator->trans('posts.Output posts of a category'),
                        'icon' => 'bi bi-columns-gap',
                        'animation' => [
                            'type' => '',
                            'iteration' => 1,
                            'duration' => '0.5s',
                            'delay' => '0.1s',
                            'count' => 1,
                            'offset' => 5,
                            'no_repeat' => false
                        ],
                        'data' => [
                            'input' => '<div class="text-center d-flex align-items-center flex-column justify-content-center my-3"><i class="fs-1 bi bi-columns-gap"></i>' . $this->translator->trans('posts.Post loop') . '</div>'
                        ],
                        'backend' => ['order_by', 'order', 'post_galleries', 'loop_design'],
                        'config' => [
                            'css_class' => '',
                            'categories' => [],
                            'container_id' => '',
                            'load_limit' => 3,
                            'lazy_load' => 3,
                            'lazy_load_active' => false,
                            'load_more_txt' => $this->translator->trans('posts.Show more'),
                            'load_more_type' => 'lazy',
                            'load_more_css' => '',
                            'order_by' => 'date',
                            'order' => 'desc',
                            'design' => ''
                        ],
                        'options' => [],
                    ],
                    '1' => [
                        'id' => uniqid(),
                        'type' => 'post-slider',
                        'active' => true,
                        'designation' => $this->translator->trans('plugins.Post slider'),
                        'description' => $this->translator->trans('posts.Output posts of a category'),
                        'icon' => 'bi bi-arrow-left-right',
                        'animation' => [
                            'type' => '',
                            'iteration' => 1,
                            'duration' => '0.5s',
                            'delay' => '0.1s',
                            'count' => 1,
                            'offset' => 5,
                            'no_repeat' => false
                        ],
                        'data' => [
                            'input' => '<div class="text-center d-flex align-items-center flex-column justify-content-center my-3"><i class="fs-1 bi bi-arrow-left-right"></i>' . $this->translator->trans('plugins.Post slider') . '</div>'
                        ],
                        'backend' => ['order_by', 'order', 'slider', 'post_categories', 'loop_design'],
                        'config' => [
                            'css_class' => '',
                            'categories' => [],
                            'container_id' => '',
                            'order_by' => 'date',
                            'order' => 'desc',
                            'slider' => '',
                            'design' => ''
                        ],
                        'options' => [],
                    ],
                    '2' => [
                        'id' => uniqid(),
                        'type' => 'post-category',
                        'active' => true,
                        'designation' => $this->translator->trans('posts.Category title'),
                        'description' => $this->translator->trans('posts.Output Category Title'),
                        'icon' => 'bi bi-filter',
                        'animation' => [
                            'type' => '',
                            'iteration' => 1,
                            'duration' => '0.5s',
                            'delay' => '0.1s',
                            'count' => 1,
                            'offset' => 5,
                            'no_repeat' => false
                        ],
                        'data' => [
                            'input' => '<div class="text-center fs-6 my-3"><i class="bi bi-filter me-2"></i>' . $this->translator->trans('posts.Category title') . '</div>'
                        ],
                        'backend' => ['tag_headline', 'post_categories'],
                        'config' => [
                            'css_class' => '',
                            'container_id' => '',
                            'selector' => 'div',
                            'word_limit' => '',
                            'link_category' => false,
                            'new_tab' => false,
                            'category' => ''
                        ],
                        'options' => [],
                    ],
                    '3' => [
                        'id' => uniqid(),
                        'type' => 'post-category-description',
                        'active' => true,
                        'designation' => $this->translator->trans('posts.Category Description'),
                        'description' => $this->translator->trans('posts.Output of the category Description'),
                        'icon' => 'bi bi-filter-left',
                        'animation' => [
                            'type' => '',
                            'iteration' => 1,
                            'duration' => '0.5s',
                            'delay' => '0.1s',
                            'count' => 1,
                            'offset' => 5,
                            'no_repeat' => false
                        ],
                        'data' => [
                            'input' => '<div class="text-center fs-6 my-3"><i class="bi bi-filter-left me-2"></i>' . $this->translator->trans('posts.Category Description') . '</div>'
                        ],
                        'backend' => ['post_categories'],
                        'config' => [
                            'css_class' => '',
                            'container_id' => '',
                            'word_limit' => '',
                            'category' => ''
                        ],
                        'options' => [],
                    ],
                    '4' => [
                        'id' => uniqid(),
                        'type' => 'post-category-image',
                        'active' => true,
                        'designation' => $this->translator->trans('posts.Category picture'),
                        'description' => $this->translator->trans('posts.Output category image with options'),
                        'icon' => 'bi bi-image',
                        'animation' => [
                            'type' => '',
                            'iteration' => 1,
                            'duration' => '0.5s',
                            'delay' => '0.1s',
                            'count' => 1,
                            'offset' => 5,
                            'no_repeat' => false
                        ],
                        'data' => [
                            'input' => '<div class="text-center d-flex align-items-center flex-column justify-content-center my-3"><i class="fs-1 bi bi-image"></i>' . $this->translator->trans('posts.Category picture') . '</div>'
                        ],
                        'backend' => ['post_categories', 'sizes', 'link', 'align', 'dimensions', 'caption'],
                        'config' => [
                            'css_class' => '',
                            'container_id' => '',
                            'size' => 'medium',
                            'source' => 'mediathek',
                            'caption_type' => 'category_title',
                            'custom_caption' => '',
                            'custom_link' => '',
                            'action' => '',
                            'page' => '',
                            'width' => '',
                            'height' => '',
                            'url' => '',
                            'external_url' => '',
                            'new_tab' => false,
                            'align' => 'center',
                            'category' => ''
                        ],
                        'options' => [],
                    ],
                ]
            ]
        ];
        if ($type) {
            foreach ($plugins as $tmp) {
                foreach ($tmp['plugins'] as $t) {
                    if ($t['type'] == $type) {
                        return $t;
                    }
                }
            }
        }
        if ($group) {
            foreach ($plugins as $tmp) {
                if ($tmp['section'] == $group) {
                    $arr=[];
                    foreach ($tmp['plugins'] as $t) {
                        if(!$t['active']) {
                            continue;
                        }
                        $arr[] = $t;
                    }
                    $tmp['plugins'] = $arr;
                    return $tmp;
                }
            }
        }

        if ($section) {
            $sec = [];
            foreach ($plugins as $tmp) {
                foreach ($tmp['plugins'] as $t) {
                    if(!$t['active']) {
                        continue;
                    }
                    $s = $t['section'] ?? null;
                    if ($s && $s == $section) {
                        $sec[] = $t;
                    }
                }
            }
            return $sec;
        }
        $plugArr = [];
        foreach ($plugins as $tmp) {
            $arr = [];
            foreach ($tmp['plugins'] as $t) {
                if(!$t['active']) {
                    continue;
                }
                $arr[] = $t;
            }
            $tmp['plugins'] = $arr;
            $plugArr[] = $tmp;
        }
        return $plugArr;
    }
}
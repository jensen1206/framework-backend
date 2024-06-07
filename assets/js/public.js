import Splide from '@splidejs/splide';
import Lazy from './jquery.lazy';
import './scrollspy.js';

import {jarallax, jarallaxVideo} from "jarallax";
import 'jarallax/dist/jarallax.min.css';
//import WOW from '../../public/js/wow.min';
const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));

const domReady = new Promise(resolve => {
    if (document.readyState === "loading") {
        document.addEventListener('DOMContentLoaded', resolve);
    } else {
        resolve();
    }
});

const windowReady = new Promise(resolve => {
    if (document.readyState === 'complete') {
        resolve('ready');
    } else {
        window.addEventListener('load', resolve);
    }
});
windowReady.then((resolve) => {

})

document.addEventListener('DOMContentLoaded', function () {
    $(function () {

        $('.dropdown-submenu a.dropdown-toggle').on("click", function (e) {
            if (window.innerWidth < 992) {
                $(this).next('ul').toggle();
                e.stopPropagation();
                e.preventDefault();
            }
        });

        let dropDownActive = $('.dropdown-item a.nav-link.active');
        if (dropDownActive) {
            dropDownActive.parent('li').addClass('active')
        }


        let nav = document.getElementById('nav-main-public-menu');
        let publicContent = document.getElementById('public-content');
        let navRect = nav.getBoundingClientRect();
        let navHeight = navRect.height;
       // publicContent.style.paddingTop = `${navHeight}px`

        let scrollTimeOut;
        // window_scroll_resize(window.scrollY, window.innerWidth)
        window.addEventListener('scroll', function (event) {
            const height = window.scrollY;
            const width = event.currentTarget.innerWidth;
            if (nav) {
                window_scroll_resize(height, width)
            }
        });
        window.addEventListener('resize', function (event) {
            const width = event.currentTarget.innerWidth;
            const height = window.pageYOffset;
            clearTimeout(scrollTimeOut);
            scrollTimeOut = setTimeout(function () {

            }, 300);
            if (nav) {
                window_scroll_resize(height, width)
            }
        });


        function window_scroll_resize(height, width) {
            let brandImage = document.querySelector('.brand-image');
            let navImgCenter = document.querySelector('.nav-img-center');
            if (nav && publicContent) {
                let fullHeight = nav.getAttribute('data-height');
                let scrollHeight = nav.getAttribute('data-scroll')
                let mobilHeight = nav.getAttribute('data-mobil')


               // publicContent.style.paddingTop = `${navHeight}px`
                if (width > 768) {
                    if (height > 400) {
                        if (brandImage) {
                            brandImage.style.width = `${scrollHeight}px`;
                            if (navImgCenter) {
                                navImgCenter.style.marginRight = `${scrollHeight}px`;
                            }
                        }

                    } else {
                        if (brandImage) {
                            brandImage.style.width = `${fullHeight}px`;
                            if (navImgCenter) {
                                navImgCenter.style.marginRight = `${fullHeight}px`;
                            }
                        }
                    }
                } else {
                    let nav = document.getElementById('nav-main-public-menu');
                    let publicContent = document.getElementById('public-content');
                    let navRect = nav.getBoundingClientRect();
                    let navHeight = navRect.height;
                    //publicContent.style.paddingTop = `${navHeight}px`
                    if (height > 400) {
                        if (brandImage) {
                            brandImage.style.width = `${scrollHeight}px`;
                            if (navImgCenter) {
                                navImgCenter.style.marginRight = `${scrollHeight}px`;
                            }
                        }
                    } else {
                        if (brandImage) {
                            brandImage.style.width = `${mobilHeight}px`;
                            if (navImgCenter) {
                                navImgCenter.style.marginRight = `${mobilHeight}px`;
                            }
                        }
                    }
                }

            }
        }


        $(document).on('click', '.img-link', function (e) {
            e.preventDefault();
            let control = $(this).attr('data-control');
            let target = e.target
            let options;
            let link = target.src ? target.parentNode : target;
            switch (control) {
                case'slide':
                    options = {
                        container: '#blueimp-gallery-slides',
                        index: link,
                        event: e,
                        toggleControlsOnSlideClick: false,
                        fullscreen: false,
                    }
                    break;
                case'single':
                    options = {
                        container: '#blueimp-gallery-single',
                        index: link,
                        event: e,
                        enableKeyboardNavigation: false,
                        emulateTouchEvents: false,
                        fullscreen: false,
                        displayTransition: false,
                        toggleControlsOnSlideClick: false,
                    }
                    break;
            }

            let links = document.querySelectorAll('a.img-link')
            blueimp.Gallery(links, options)
        });

        let medienSlider = $('.medien-slider')
        if (medienSlider.length !== 0) {
            medienSlider.each(function (index) {
                let slider = parseInt($(this).attr('data-slider'));
                for (let i = 0; i < publicSettings.slideJs.length; i++) {
                    if (publicSettings.slideJs[i]['id'] === slider) {
                        let splide = this.querySelector('.splide');
                        let settings = publicSettings.slideJs[i];
                        if (splide && settings) {
                            splideJsInit(splide, settings)
                        }
                    }
                }
            });
        }
        let thumbnailSlider = $('.thumbnail-slider');
        if (thumbnailSlider.length !== 0) {
            thumbnailSlider.each(function (index) {
                let slider = parseInt($(this).attr('data-slider'));
                for (let i = 0; i < publicSettings.slideJs.length; i++) {
                    if (publicSettings.slideJs[i]['id'] === slider) {
                        let splide = this.querySelector('.thumbnail-splide');
                        let carousel = this.querySelector('.carousel-splide');
                        let settings = publicSettings.slideJs[i];
                        if (splide && carousel && settings) {
                            splideThumbnailJsInit(splide, carousel, settings)
                        }
                    }
                }
            });
        }

        function splideJsInit(target, splideData) {
            let splide = new Splide(target, {
                type: splideData.type,
                perPage: parseInt(splideData.perPage),
                perMove: parseInt(splideData.perMove),
                pagination: splideData.pagination,
                fixedWidth: parseInt(splideData.fixedWidth),
                fixedHeight: parseInt(splideData.fixedHeight),
                //autoWidth: true,
                // autoHeight: false,
                padding: splideData.padding, //{left: '1rem', right: '1rem'},
                arrows: splideData.arrows,
                cover: splideData.cover,
                lazyLoad: splideData.lazyLoad,
                gap: splideData.gap,
                height: splideData.height,
                width: splideData.width,
                heightRatio: 0.5,
                preloadPages: splideData.preloadPages,
                rewind: splideData.rewind,
                pauseOnHover: splideData.pauseOnHover,
                trimSpace: splideData.trimSpace,
                interval: splideData.interval,
                speed: splideData.speed,
                rewindSpeed: splideData.rewindSpeed,
                flickPower: splideData.flickPower,
                autoplay: splideData.autoplay,
                keyboard: splideData.keyboard,
                pauseOnFocus: splideData.pauseOnFocus,
                drag: splideData.drag,
                breakpoints: splideData.breakpoints
            });
            splide.mount();
        }

        function splideThumbnailJsInit(target, carousel, splideData) {

            let thumbnail = new Splide(target, {
                type: splideData.type,
                perPage: parseInt(splideData.perPage),
                perMove: parseInt(splideData.perMove),
                pagination: splideData.pagination,
                fixedWidth: parseInt(splideData.fixedWidth),
                fixedHeight: parseInt(splideData.fixedHeight),
                isNavigation: true,
                autoWidth: false,
                autoHeight: false,
                padding: splideData.padding, //{left: '1rem', right: '1rem'},
                arrows: splideData.arrows,
                cover: splideData.cover,
                lazyLoad: splideData.lazyLoad,
                gap: splideData.gap,
                focus: 'center',
                height: splideData.height,
                width: splideData.width,
                //   heightRatio: 0.5,
                preloadPages: splideData.preloadPages,
                rewind: splideData.rewind,
                pauseOnHover: splideData.pauseOnHover,
                trimSpace: splideData.trimSpace,
                interval: splideData.interval,
                speed: splideData.speed,
                rewindSpeed: splideData.rewindSpeed,
                flickPower: splideData.flickPower,
                autoplay: splideData.autoplay,
                keyboard: splideData.keyboard,
                pauseOnFocus: splideData.pauseOnFocus,
                drag: splideData.drag,
                breakpoints: splideData.breakpoints
            });
            let main = new Splide(carousel, {
                type: 'fade',
                lazyLoad: 'nearby',
                rewind: true,
                pagination: false,
                arrows: false,
                heightRatio: 0.5,
            });
            main.sync(thumbnail);
            main.mount();

            thumbnail.mount()
        }

        /**======================================
         ========== Parallax FUNCTION ===========
         ========================================
         */

        let appParallaxOption = $('.jarallax');

        if (appParallaxOption.length) {
            appParallaxOption.each(function (index, value) {
                jarallax($(this), {
                    speed: $(this).attr('data-speed'),
                    imgPosition: `${$(this).attr('data-left')} ${$(this).attr('data-top')}`,
                    type: $(this).attr('data-type'),
                    keepImg: false,
                })
            });
        }

        const scrollSpy = new bootstrap.ScrollSpy(document.body, {
            target: '.col-column'
        })


        let appColumns = document.querySelectorAll('.app-animation');
        if (appColumns.length !== 0) {
            let nodes = Array.prototype.slice.call(appColumns, 0);
            nodes.forEach(function (nodes) {
                if (nodes.hasAttribute('data-type-animation')) {
                    nodes.classList.add('wow');
                    nodes.classList.add('animate__' + nodes.getAttribute('data-type-animation'));
                }
            });

            WOW.prototype.addBox = function (element) {
                this.boxes.push(element);
            };

            let appWow = new WOW(
                {
                    boxClass: 'wow',
                    animateClass: 'animate__animated',
                    offset: 0,
                    callback: function (box) {

                    },
                    mobile: true,
                    live: true
                }
            )

            appWow.init();

            $('.wow').on('scrollSpy:exit', function (e) {
                if ($(this).attr('data-animation-no-repeat')) {
                    return false;
                }
                $(this).css({
                    'visibility': 'hidden',
                    'animation-name': 'none'
                }).removeClass('animate__animated');
                appWow.addBox(this);
            }).scrollSpy();
        }

        let serve = true;

        function imgLoaded(entry) {
            let builderSelectorGrid = document.querySelectorAll(".builder-selector-grid");
            if (builderSelectorGrid) {
                let msnry;
                let gridNodes = Array.prototype.slice.call(builderSelectorGrid, 0);
                if (serve) {
                    gridNodes.forEach(function (gridNodes) {
                        imagesLoaded(gridNodes, function () {
                            gridNodes.querySelector('.grid-item').classList.remove('img-load-wait')
                            msnry = new Masonry(gridNodes, {
                                itemSelector: '.grid-item',
                                percentPosition: true
                            });
                        });
                    });
                    //serve = false;
                }
            }
        }


        const imageObserver = new IntersectionObserver((entries, imgObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target
                    // show_image(lazyImage)
                    imgLoaded(entry)
                    newImageSrc(lazyImage).then()
                    imgObserver.unobserve(lazyImage);
                }
            })
        });

        const postImgArr = document.querySelectorAll('img.lazy-image');
        if (postImgArr) {
            postImgArr.forEach((postImg) => {
                imageObserver.observe(postImg);
            });
        }


        async function newImageSrc(image) {
            image.src = image.dataset.src;
            await new Promise((resolve) => {
                image.onload = resolve;
            });
            image.classList.remove("lazy-image");
            image.classList.add('image-loaded')

        }

        function scrollToWrapper(target, offset = 50) {
            setTimeout(function () {
                jQuery('html, body').stop().animate({
                    scrollTop: jQuery(target).offset().top - (offset),
                }, 400, "linear", function () {
                });
            }, 350);
        }
    })


    $(function () {
        $('.top-button').on('click', function (e) {
            e.preventDefault();
            $('html, body').stop().animate({
                scrollTop: -55
            }, 1000, 'swing')
        });
        if (window.location.hash) {
            $('html, body').stop().animate({
                scrollTop: $(window.location.hash).offset().top - 55
            }, 1000, 'swing')
        }
    });

    $(window).on("scroll", function (event) {
        let scroll = $(window).scrollTop();
        if (scroll >= 400) {
            $(".top-button").addClass("visible");
        } else {
            $(".top-button").removeClass("visible");
        }
    });

    let videoWrapper = $('.app-video')
    if (videoWrapper.length !== 0) {
        $.each(videoWrapper, function (key, value) {
            let dataContainer = `#app-video-${$(this).attr('data-container')}`
            let data = JSON.parse(window.atob($(this).attr('data-video')));
            let dataOptions = JSON.parse(window.atob($(this).attr('data-options')));
            let isCarousel = $(this).hasClass('app-video-carousel');
            create_blueimp_video_carousel(data, isCarousel, dataContainer, dataOptions)
        })
    }

    function create_blueimp_video_carousel(data, isCarousel, target, options) {
        let videoGroup = [];
        data.map((d, index) => {
            let group = {};
            if (d.extern_type === 'youtube' || d.extern_type === 'vimeo') {
                if (d.extern_cover) {
                    group.poster = d.extern_poster;
                } else {
                    group.poster = d.cover_url;
                }
                if (d.extern_type === 'youtube') {
                    group.youtube = d.extern_id;
                }
                if (d.extern_type === 'vimeo') {
                    group.vimeo = d.extern_id;
                }
            } else {
                group.poster = d.cover_url;
            }
            group.title = d.video_title;
            group.type = d.mime_type;
            group.href = d.video_url;
            videoGroup.push(group)
        })

        blueimp.Gallery(
            videoGroup,
            {
                container: target,
                carousel: true,
                clearSlides: options.clearSlides,
                toggleControlsOnSlideClick: options.toggleControlsOnSlideClick,
                toggleSlideshowOnSpace: options.toggleSlideshowOnSpace,
                enableKeyboardNavigation: options.enableKeyboardNavigation,
                closeOnEscape: options.closeOnEscape,
                closeOnSlideClick: options.closeOnSlideClick,
                closeOnSwipeUpOrDown: options.closeOnSwipeUpOrDown,
                closeOnHashChange: options.closeOnHashChange,
                emulateTouchEvents: options.emulateTouchEvents,
                stopTouchEventsPropagation: options.stopTouchEventsPropagation,
                hidePageScrollbars: options.hidePageScrollbars,
                disableScroll: options.disableScroll,
                continuous: options.continuous,
                unloadElements: options.unloadElements,
                startSlideshow: options.startSlideshow,
                slideshowInterval: options.slideshowInterval,
                videoPlaysInline: true,
                videoCoverClass: 'video-cover toggle',
                index: options.index,
                slideshowTransitionDuration: options.slideshowTransitionDuration,
                transitionDuration: options.transitionDuration,
                slideshowDirection: options.slideshowDirection,
                fullscreen: false,
                displayTransition: false,
                preloadRange: 2,
            })

    }


})



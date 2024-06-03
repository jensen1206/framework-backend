
import * as GlobalFunc from "./global-functions";
import Swal from "sweetalert2";
import {buildOsmMap, check_write_clipboard, swal_alert, swal_message, warning_message} from "./global-functions";
import * as appTools from "./App/AppComponents/AppTools";

document.addEventListener('DOMContentLoaded', function () {



    $(function () {
        let source;
        //tox tox-silver-sink tox-tinymce-aux
       $(document).on('focusin', function(e) {

            if ($(e.target).closest(".tox-tinymce, .tox-tinymce-aux, .moxman-window, .tam-assetmanager-root, .tox-pop__dialog").length) {


                e.stopImmediatePropagation();
               // console.log(e.target.classList, 'IN')
                if($(this).length) {
                 //   console.log(e.target.classList.contains('tox-textarea'))
                  //  $('.form-builder-modal').addClass('d-none')
                }
            }
        });
        $(document).on('focusout', function(e) {
            if ($(e.target).closest(".tox-tinymce, .tox-tinymce-aux, .moxman-window, .tam-assetmanager-root").length) {  }
                e.stopImmediatePropagation();
          //  console.log(e.target.classList, 'OUT')
            if(e.target.classList.contains('tox-textarea')){
             //   document.querySelector('.form-builder-modal').classList.add('d-none')
                //console.log(e.target.classList)
            } else {

              //  document.querySelector('.form-builder-modal').classList.remove('d-none')
            }
                if($(this).length) {
                 //   console.log(e.target.classList.contains('tox-textarea'), 'OPEN')
                 //   console.log(e.target.classList.contains('form-builder-modal'), 'HIDE')
                    if(e.target.classList.contains('tox-textarea')) {
                       // document.querySelector('.form-builder-modal').classList.add('d-none')
                    } else {
                       // console.log(e.target.classList)
                    //    document.querySelector('.form-builder-modal').classList.remove('d-none')
                    }
                    if(e.target.classList.contains('form-builder-modal')) {

                    }


                }

        })

        let dropdown = $('.dropdown');
        dropdown.on('show.bs.dropdown', function () {
            $(this).find('.dropdown-menu').first().addClass('dropdown-menu-slide');
        });

        $(document).on('click', '#menu-toggle', function (e) {
            e.preventDefault();
            $("#wrapper").toggleClass("toggled");
        });

        $(document).on('click', '#menu-toggle-2', function (e) {
            $('.custom-dropdown').removeClass('active');
            $("#wrapper").toggleClass("toggled-2");
            $('#menu ul').hide();
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                sessionStorage.removeItem('sidebarToggle');
            } else {
                $(this).addClass('active')
                sessionStorage.setItem('sidebarToggle', '1');
            }
            e.preventDefault();
        });
        let toggleSidebar = sessionStorage.getItem('sidebarToggle');
        toggle_sidebar_menu(toggleSidebar);

        function toggle_sidebar_menu(session) {
            let wrapper = $("#wrapper");
            let toggle = $('#menu-toggle-2');
            if (session === '1') {
                toggle.addClass('active');
                wrapper.addClass('toggled-2');
            } else {
                toggle.removeClass('active')
                wrapper.removeClass('toggled-2')
            }
        }

        let menuUl = $('#menu ul');
        if (menuUl.length !== 0) {
            //$('#menu li ul:first').show();
            $('#menu li.current ul:first').show();
            $(document).on('click', '#menu li a.drop', function (e) {
                $('#menu li').removeClass('active');
                let checkElement = $(this).next();
                if ((checkElement.is('ul')) && (checkElement.is(':visible'))) {
                    $(this).parent().removeClass('active');
                    checkElement.slideUp('normal');
                } else {
                    $('#menu ul:visible').slideUp('normal');
                    $(this).parent().addClass('active');
                    checkElement.slideDown('normal');
                }
                e.preventDefault();
            });

            $(document).on('click', 'li ul.nav-pills a', function (e) {
                let parent = $(this).parent();
                let isActive = parent.hasClass('active');
                $('li ul.nav-pills li').removeClass('active')
                if (isActive) {
                    parent.removeClass('active');
                } else {
                    parent.addClass('active');
                }
            });
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

        //eventSourceInit()
        function eventSourceInit() {
            if (typeof (EventSource) !== "undefined") {
                let evUrl = `${publicSettings.event_url}`;
                source = new EventSource(evUrl);
                source.addEventListener('systemLog', composerLog, true)
                function composerLog(event) {
                    const data = JSON.parse(event.data);
                    if (data.status) {

                    }
                }

                source.addEventListener('errorLog', function (event) {
                    const data = JSON.parse(event.data);


                });
            }
        }

    });
});
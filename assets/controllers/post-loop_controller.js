import {Controller} from '@hotwired/stimulus';
import axios from "axios";
import SetAjaxData from "../js/App/AppComponents/SetAjaxData";
import * as AppTools from "../js/App/AppComponents/AppTools";

/*
 * This is an example Stimulus controller!
 *
 * Any element with a data-controller="hello" attribute will cause
 * this controller to be executed. The name "hello" comes from the filename:
 * hello_controller.js -> "hello"
 *
 * Delete this file or adapt it for your use!
 */
export default class extends Controller {
    connect() {
        $(document).on('click', '.load-post-btn', function () {
           let formData = {
                'method': 'load_more_post',
                'page': $(this).attr('data-page'),
                'builder': $(this).attr('data-builder'),
                'grid': $(this).attr('data-grid'),
                'form': $(this).attr('data-form'),
                'loop': $(this).attr('data-loop'),
                'handle': 'button'
            }
            xhr_ajax_handle(formData, false, callback_load_post)
        })


        function callback_load_post() {
            let data = JSON.parse(this.responseText);
            if(data.status) {
                let wrapper = document.querySelector('.post-loop-' + data.loop)
                if (data.handle === 'button') {
                    let btn = $('.loop-button-'+data.loop)
                    btn.attr('data-page', data.page)
                    if(!data.next) {
                        btn.prop('disabled', true)
                    }

                    let wrapper = document.querySelector('.post-loop-' + data.loop)
                    wrapper.insertAdjacentHTML('beforeend', data.template)
                    let loopClass = $('.ajx-loop');
                    loopClass.addClass('section-show')

                } else {
                    wrapper.insertAdjacentHTML('beforeend', data.template)
                    if ($('.next-page').length !== 0) {
                    }
                    let loopClass = $('.ajx-loop');
                    loopClass.addClass('section-show')
                    const loadSection = document.querySelectorAll('.next-page');
                    loadSection.forEach(section => {
                        lazyObserver.observe(section)
                    })
                }
            }
        }

        const lazyObserver = new IntersectionObserver((elements) => {
            let formData;
            elements.forEach((element) => {
                if (element.isIntersecting) {
                    if (element.target.classList.contains('next-page')) {
                        formData = {
                            'method': 'load_more_post',
                            'page': element.target.getAttribute('data-page'),
                            'builder': element.target.getAttribute('data-builder'),
                            'grid': element.target.getAttribute('data-grid'),
                            'form': element.target.getAttribute('data-form'),
                            'loop': element.target.getAttribute('data-loop'),
                            'handle': 'lazy'
                        }
                        xhr_ajax_handle(formData, false, callback_load_post)
                        element.target.classList.remove('next-page')
                        element.target.classList.add('section-show')

                    }
                }
            })
        })

        let loadMore = $('.load-more-posts');
        if (loadMore.length !== 0) {
            const loadSection = document.querySelectorAll('.load-more-posts');
            loadSection.forEach(section => {
                lazyObserver.observe(section)
            })
        }

        function xhr_ajax_handle(data, is_formular = true, callback) {
            let xhr = new XMLHttpRequest();
            let formData = new FormData();
            xhr.open('POST', publicSettings.ajax_url, true);
            if (is_formular) {
                let input = new FormData(data);
                for (let [name, value] of input) {
                    formData.append(name, value);
                }
            } else {
                for (let [name, value] of Object.entries(data)) {
                    formData.append(name, value);
                }
            }
            xhr.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    if (typeof callback === 'function') {
                        xhr.addEventListener("load", callback);
                        return false;
                    }
                }
            }
            formData.append('_handle', publicSettings.handle);
            formData.append('token', publicSettings.token);
            xhr.send(formData);
        }
    }
}

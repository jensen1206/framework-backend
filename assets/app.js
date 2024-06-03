/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)

window.$ = window.jQuery = require('jquery');
const $ = require('jquery');
import * as bootstrap from 'bootstrap';
import './styles/app.scss';
import masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
window.imagesLoaded = imagesLoaded
window.Masonry = masonry
window.bootstrap = bootstrap;
//import WOW from 'wowjs/dist/wow.min';
//window.WOW = WOW
//import * as wow from 'wowjs/dist/wow.js';
import './js/public.js';
//import './js/app-public-map';
//import { jarallax, jarallaxVideo } from "jarallax";
//window.jarallax = jarallax
//window.WOW = wow.WOW

//import './js/scrollspy.js';

// start the Stimulus application
import './bootstrap';





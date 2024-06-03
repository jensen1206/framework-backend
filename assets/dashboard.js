/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import './styles/dashboard.scss';
import './js/dashboard.js';
window.$ = window.jQuery = require('jquery');

import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;



// start the Stimulus application
import './bootstrap';

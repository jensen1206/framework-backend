const Encore = require('@symfony/webpack-encore');
const webpack = require('webpack');
// Manually configure the runtime environment if not already configured yet by the "encore" command.
// It's useful when you use tools that rely on webpack.config.js file.
if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}
Encore.enableStimulusBridge('./assets/controllers.json');

new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery'
})
Encore
    // directory where compiled assets will be stored
   // .setOutputPath('public/build/')
   // .setPublicPath('/public/build')
   // .setManifestKeyPrefix('build/')

    //.setOutputPath('public/build/')
    .setOutputPath('public/build/')
    // public path used by the web server to access the output path
    //.setPublicPath('/build')
    .setPublicPath('/build')
  //  .setManifestKeyPrefix('public/build')

    // only needed for CDN's or subdirectory deploy
   // .setManifestKeyPrefix('build/')

    /*
     * ENTRY CONFIG
     *
     * Each entry will result in one JavaScript file (e.g. app.js)
     * and one CSS file (e.g. app.css) if your JavaScript imports CSS.
     */
    .addEntry('app', './assets/app.js')
    .addEntry('dashboard', './assets/dashboard.js')
    .addEntry('install', './assets/install.js')
    .addEntry('react_app_accounts', './assets/js/app_react_accounts.js')
    .addEntry('react_upload', './assets/js/app_media_upload.js')
    .addEntry('react_medien', './assets/js/app_react_medien.js')
    .addEntry('react_medien_category', './assets/js/app_react_medien_category.js')
    .addEntry('react_medien_converter', './assets/js/app_react_medien_converter.js')
    .addEntry('react_accounts_overview', './assets/js/app_react_accounts_overview.js')
    .addEntry('react_sent_emails', './assets/js/app_react_send_email.js')
    .addEntry('react_sending_an_email', './assets/js/app_sending_an_email.js')
    .addEntry('react_backup', './assets/js/app_react_backups.js')
    .addEntry('react_system_settings', './assets/js/app_react_system_settings.js')
    .addEntry('react_register_system_settings', './assets/js/app_react_register_settings.js')
    .addEntry('react_validate_user', './assets/js/app_react_validate_user.js')
    .addEntry('react_activity_log', './assets/js/app_react_activity.js')
    .addEntry('react_sites', './assets/js/app_react_sites.js')
    .addEntry('react_site_categories', './assets/js/app_react_site_categories.js')
    .addEntry('react_page_builder', './assets/js/app_react_page_builder.js')
    .addEntry('react_page_elements', './assets/js/app_react_builder_elements.js')
    .addEntry('react_medien_slider', './assets/js/app_react_medien_slider')
    .addEntry('react_medien_carousel', './assets/js/app_react_medien_carousel')
    .addEntry('react_medien_gallery', './assets/js/app_react_medien_gallery')
    .addEntry('react_site_menu', './assets/js/app_react_menu.js')
    .addEntry('react_app_posts', './assets/js/app_react_posts.js')
    .addEntry('react_app_posts_category', './assets/js/app_react_posts_category.js')
    .addEntry('react_app_fonts', './assets/js/app_react_fonts.js')
    .addEntry('react_app_design', './assets/js/app_react_design.js')
    .addEntry('react_app_header_footer', './assets/js/app_react_header_footer.js')
    .addEntry('react_map_protection', './assets/js/app_react_map_protection.js')
    .addEntry('react_app_forms', './assets/js/app_react_forms.js')
    .addEntry('react_app_public_form', './assets/js/app_react_public_forms.js')
    .addEntry('react_app_custom_fields', './assets/js/app_react_custom_fields.js')
    .addEntry('react_app_install', './assets/js/app_react_install.js')

    // When enabled, Webpack "splits" your files into smaller pieces for greater optimization.
    .splitEntryChunks()

    // enables the Symfony UX Stimulus bridge (used in assets/bootstrap.js)
   // .enableStimulusBridge('./assets/controllers.json')

    // will require an extra script tag for runtime.js
    // but, you probably want this, unless you're building a single-page app
    .enableSingleRuntimeChunk()
    .enableReactPreset()
    /*
     * FEATURE CONFIG
     *
     * Enable & configure other features below. For a full
     * list of features, see:
     * https://symfony.com/doc/current/frontend.html#adding-more-features
     */
    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    // enables hashed filenames (e.g. app.abc123.css)
    .enableVersioning(Encore.isProduction())

    // configure Babel
    // .configureBabel((config) => {
    //     config.plugins.push('@babel/a-babel-plugin');
    // })

    // enables and configure @babel/preset-env polyfills
    .configureBabelPresetEnv((config) => {
        config.useBuiltIns = 'usage';
        config.corejs = '3.23';
    })

    // enables Sass/SCSS support
    .enableSassLoader()

    // uncomment if you use TypeScript
    .enableTypeScriptLoader()
    // uncomment if you use React    // uncomment if you use React
    // uncomment to get integrity="..." attributes on your script & link tags
    // requires WebpackEncoreBundle 1.4 or higher
    .enableIntegrityHashes(Encore.isProduction())

    .cleanupOutputBeforeBuild(['**/*', '!uploads', '!uploads/**/*'])
    .autoProvidejQuery()

;

module.exports = Encore.getWebpackConfig();

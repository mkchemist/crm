const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/js/rep/app.js', 'public/js/rep')
.js('resources/js/admin/admin.js', 'public/js/admin')
.js('resources/js/rm/rm.js', 'public/js/rm')
.js('resources/js/otc-rep/otc-rep.js', 'public/js/otc-rep')
.js('resources/js/otc-manager/otc-manager.js', 'public/js/otc-manager')
.js('resources/js/dm/dm.js', 'public/js/dm')
.sass('resources/sass/rep/app.scss', 'public/css/rep')
.sass('resources/sass/admin/app.scss', 'public/css/admin')
.sass('resources/sass/rm/app.scss', 'public/css/rm')
.sass('resources/sass/otc/otc-team.scss', 'public/css/otc')
.sass('resources/sass/dm/app.scss', 'public/css/dm')
.extract(['vue', 'vuex', 'vue-router','vee-validate','vue-cal'])
.browserSync("http://crm.localhost")

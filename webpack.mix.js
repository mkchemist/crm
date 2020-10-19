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
    .js('resources/js/dm/dm.js', 'public/js/dm')
    .sass('resources/sass/rep/app.scss', 'public/css/rep')
    .sass('resources/sass/admin/app.scss', 'public/css/admin')
    .sass('resources/sass/dm/app.scss', 'public/css/dm')
    .browserSync("http://localhost/projects/crm/public/")

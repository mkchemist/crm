<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * This namespace is applied to your controller routes.
     *
     * In addition, it is set as the URL generator's root namespace.
     *
     * @var string
     */
    protected $namespace = 'App\Http\Controllers';

    /**
     * The path to the "home" route for your application.
     *
     * @var string
     */
    public const HOME = '/home';

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @return void
     */
    public function boot()
    {
        //

        parent::boot();
    }

    /**
     * Define the routes for the application.
     *
     * @return void
     */
    public function map()
    {
        $this->mapApiRoutes();

        $this->mapWebRoutes();

        $this->mapAdminApiRoute();

        $this->mapDMApiRoute();

        $this->mapRMApiRoute();

        $this->mapOTCRepRoutes();

        $this->mapOTCManagerRoutes();
        //
    }

    /**
     * Define the "web" routes for the application.
     *
     * These routes all receive session state, CSRF protection, etc.
     *
     * @return void
     */
    protected function mapWebRoutes()
    {
        Route::middleware('web')
            ->namespace($this->namespace)
            ->group(base_path('routes/web.php'));
    }

    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    protected function mapApiRoutes()
    {
        Route::prefix('api')
            ->middleware('api')
            ->namespace($this->namespace)
            ->group(base_path('routes/api.php'));
    }

    /**
     * Define the "api" routes for admin
     *
     * @return void
     */
    protected function mapAdminApiRoute()
    {
      Route::prefix('api/admin')
        ->middleware(['api', 'auth:api', 'adminOnly'])
        ->namespace('App\Http\Controllers\Api\V1\Admin')
        ->group(base_path('routes/admin-api.php'));
    }

    protected function mapDMApiRoute() {
      Route::prefix("api/dm")
      ->middleware(["api", "auth:api", "dmOnly"])
      ->namespace("App\Http\Controllers\Api\V1\DM")
      ->group(base_path("routes/dm-api.php"));
    }

    protected function mapRMApiRoute()
    {
      Route::prefix('api/rm')
      ->middleware(['api', 'auth:api', 'rmOnly'])
      ->namespace('App\Http\Controllers\Api\V1\RM')
      ->group(base_path('routes/rm-api.php'));
    }

    protected function mapOTCRepRoutes() {
      Route::prefix('api/otc-rep')
      ->middleware(['api','auth:api','otc-rep'])
      ->namespace('App\Http\Controllers\Api\V1\OTCRep')
      ->group(base_path('routes/otc-rep-api.php'));
    }

    protected function mapOTCManagerRoutes() {
      Route::prefix('api/otc-manager')
      ->middleware(['api','auth:api','otc-manager'])
      ->namespace('App\Http\Controllers\Api\V1\OTCManager')
      ->group(base_path('routes/otc-manager-api.php'));
    }
}

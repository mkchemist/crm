<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class OTCManagerOnly
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
      if(Auth::user()->role === "otc-manager") {
        return $next($request);
      } else {
        return redirect("/")->with([
          'auth_err' => "you don't have a permission to view this page, login again"
        ]);
      }
    }
}

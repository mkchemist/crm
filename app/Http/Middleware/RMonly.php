<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class RMonly
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
      if(Auth::user()->role === "rm" || Auth::user()->role === "am") {
        return $next($request);

      } else {
        return redirect("/")->with([
          'auth_err' => 'you do not have a permission to view this page, login first'
        ]);
      }
    }
}

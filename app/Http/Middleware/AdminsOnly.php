<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class AdminsOnly
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
        if(Auth::user()->role === "admin") {
          return $next($request);

        } else {
          return redirect("/")->with([
            'auth_err' => 'you do not have a permission to view Admin page, login first'
          ]);
        }
    }
}

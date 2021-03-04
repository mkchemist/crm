<?php

namespace App\Http\Middleware;

use Closure;

class CanManageRequests
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
        $user = auth()->user();
        if(in_array($user->role, ['admin', 'accountant'])) {
          return $next($request);
        } else {
          return redirect("/")->with([
            'auth_err' => sprintf("%s you don't have a permission to view this page", $user->name)
          ]);
        }
    }
}

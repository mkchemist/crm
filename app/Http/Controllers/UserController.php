<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class UserController extends Controller
{
    /**
     * user login
     *
     * @param Illuminate\Http\Request $request
     * @return Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        // request validation
        $request->validate([
            'username'      =>  'required',
            'password'      =>  'required'
        ]);

        // user credentials
        $credentials = [
            'username'  =>  $request->username,
            'password'  =>  $request->password
        ];

        // user login
        if(Auth::attempt($credentials)) {
            $user = Auth::user();
            $user->api_token = Str::random(15);
            $user->save();
            return $this->redirectUserAccordingToRole($user);
        } else {
            return redirect()->back()->with('login_error', 'Invalid login credentials');
        }
    }

    /**
     * redirect the logged in user according to his role
     *
     * @param object $user
     * @return void
     */
    private function redirectUserAccordingToRole($user)
    {
        switch($user->role) {
            case 'admin' :
                return redirect('/admin');
            case 'dm' :
                return redirect('/dm');
            case 'tm' :
                return redirect('/tm');
            case 'rm' :
                return redirect('/rm');
            case 'gm':
                return redirect('/gm');
            default:
                return redirect('/rep');
        }
    }

    /**
     * Change user password
     *
     * @param Illuminate\Http\Request $request
     * @return Illuminate\Http\Response
     */
    public function changePassword(Request $request)
    {

    }
}

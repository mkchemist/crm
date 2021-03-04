<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
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
            'username' => 'required',
            'password' => 'required',
        ]);

        // user credentials
        $credentials = [
            'username' => $request->username,
            'password' => $request->password,
            "active" => 1,
        ];

        // user login
        if (Auth::attempt($credentials)) {
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
        switch ($user->role) {
            case 'admin':
                return redirect('/admin');
            case 'dm':
                return redirect('/dm');
            case 'tm':
                return redirect('/tm');
            case 'rm':
                return redirect('/rm');
            case 'am':
                return redirect('am');
            case 'gm':
                return redirect('/gm');
            case 'otc-rep':
                return redirect('/otc-rep');
            case 'otc-manager':
                return redirect('/otc-manager');
            case 'accountant':
                return redirect("/acc");
            default:
                return redirect('/rep');
        }
    }

    /**
     * view user change password page
     *
     * @return Illuminate\Http\Response;
     */
    public function changePassword()
    {
        return view('pages.change-password');
    }

    /**
     * Change user password
     *
     * @param Illuminate\Http\Request $request
     * @return Illuminate\Http\Response
     */
    public function updatePassword(Request $request)
    {
        $request->validate([
            'old_password' => 'required',
            'password' => 'required|confirmed',
        ]);

        $user = User::where([
            'id' => Auth::user()->id,
        ])->first();
        if (Hash::check($request->old_password, $user->password)) {
            $user->password = Hash::make($request->password);
            $user->save();
            return redirect(Auth::user()->role);
        } else {
            return redirect()->back()->with([
                'old_pass' => 'Old password is not valid',
            ]);
        }
    }
}

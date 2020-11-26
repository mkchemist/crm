<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
          'name'  =>  'required',
          'username'  =>  'required',
          'password'  =>  'required|min:4',
          'email'     =>  'required|email',
          'role'      =>  'required',
          'line'      =>  'required',
          'area'      =>  'required',
          'district'  =>  'required',
          'territory' =>  'required',
          'region'    =>  'required'
        ];
    }
}

@extends('layouts.app')

@section('content')
<div class="container">
    <div class="my-5 col-lg-4 mx-auto bg-white p-3 rounded shadow">
        <form action="{{ url("/login") }}" method="POST">
            @csrf
            <div class="form-group">
                <img src="{{ asset("images/logo.png") }}" alt="" class="img-fluid">
            </div>
            @if(session()->has('login_error'))
            <p class="alert alert-danger alert-dismissible">
                <button class="close" data-dismiss="alert">&times;</button>
                <span>{{ session()->get('login_error') }}</span>
            </p>
            @endif
            <div class="form-group">
                <label for="username" class="text-muted">Username</label>
                <input type="text" name="username" id="username" class="form-control form-control-sm" placeholder="Enter username" autofocus>
                @error("username")
                <span class="text-danger small">Username required</span>
                @enderror
            </div>
            <div class="form-group">
                <label for="password" class="text-muted">Password</label>
                <input type="password" name="password" id="password" class="form-control form-control-sm" placeholder="Enter password">
                @error('password')
                <span class="text-danger small">Password required</span>
                @enderror
            </div>
            <div class="form-group clearfix">
                <button class="btn btn-sm btn-success float-right">
                    <span><i class="fa fa-lock"></i></span>
                    <span class="ml-2">Login</span>
                </button>
            </div>
        </form>
    </div>
</div>
@endsection

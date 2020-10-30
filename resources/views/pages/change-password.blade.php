@extends('layouts.app')
@section('content')
<div class="container">
  <div class="col-lg-5 mx-auto p-2 my-5">
    <form action="{{ url("change-password") }}" method="POST" class="px-0 bg-white shadow">
      @csrf
      <p class="alert alert-info">
        <span><i class="fa fa-lock"></i></span>
        <span class="font-weight-bold">Change Password</span>
      </p>
      @if(session()->has('old_pass'))
      <p class="p-2 text-danger small">
        {{ session()->get('old_pass') }}
      </p>
      @endif
      <div class="form-group px-2">
        <label for="old_password" class="text-muted small">Old Password</label>
        <input type="password" name="old_password" id="old_password" placeholder="Enter old password"
          class="form-control form-control-sm">
        @error('old_password')
        <span class="text-danger small">you must enter old password</span>
        @enderror
      </div>
      <div class="form-group px-2">
        <label for="password" class="text-muted small">New Password</label>
        <input type="password" name="password" id="password" placeholder="Enter old password"
          class="form-control form-control-sm">
        @error('password')
        <ul class="p-0">
          @foreach($errors->get('password') as $err)
          <li class="nav-item px-1 col-12 p-0 small text-danger list-unstyled">{{ $err }}</li>
          @endforeach
        </ul>
        @enderror
      </div>
      <div class="form-group px-2">
        <label for="password_confirmation" class="text-muted small">Confirm Password</label>
        <input type="password" name="password_confirmation" id="password_confirmation" placeholder="Enter old password"
          class="form-control form-control-sm">
      </div>
      <hr>
      <div class="form-group p-2 text-right">
        <a href="{{ url(Auth::user()->role) }}" class="btn btn-sm btn-dark">
          <span><i class="fa fa-chevron-circle-left"></i></span>
          <span>back</span>
        </a>
        <button class="btn btn-sm btn-primary">
          <span><i class="fa fa-lock"></i></span>
          <span>Update</span>
        </button>
      </div>
    </form>
  </div>
</div>
@endsection

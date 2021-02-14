@extends('layouts.app')
@section('style')
<link rel="stylesheet" href="{{ asset('css/otc/otc-team.css') }}">
@endsection
@section('content')
<input type="hidden" id="token" value="{{ auth()->user()->api_token }}">
<input type="hidden" id="user" value="{{ auth()->user() }}">
<input type="hidden" id="APP_BASE_URI" value="{{ env("APP_BASE_URI") }}">
<input type="hidden" id="APP_API_URL" value="{{ env("APP_API_URL") }}">
<div id="app" class="bg-white"></div>
@endsection
@section('script')
<script src="{{ asset('js/dm/manifest.js?v=').$hash_key }}" ></script>
<script src="{{ asset('js/dm/vendor.js?v=').$hash_key }}" ></script>
<script src="{{ asset('js/otc-rep/otc-rep.js?v=').$hash_key }}" ></script>
@endsection

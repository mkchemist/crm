@extends('layouts.app')

@section('style')
<link rel="stylesheet" href="{{ asset('css/rep/app.css') }}">
<link rel="stylesheet" href="{{ asset('libs/data-tables/datatables.min.css') }}">
<link rel="stylesheet" href="{{ asset('libs/data-tables/Buttons-1.6.2/css/buttons.bootstrap4.min.css') }}">
@endsection

@section('content')
<input type="hidden" id="token" value="{{ auth()->user()->api_token }}">
<div id="app" class="bg-white"></div>
@endsection

@section('script')
<script src="{{ asset('libs/data-tables/datatables.min.js') }}"></script>
<script src="{{ asset('libs/data-tables/Buttons-1.6.2/js/buttons.bootstrap4.min.js') }}"></script>
<script src="{{ asset('js/rep/app.js') }}"></script>
@endsection

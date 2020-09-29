@extends('layouts.app')

@section('style')
<link rel="stylesheet" href="{{ asset('css/rep/app.css') }}">
<link rel="stylesheet" type="text/css" href="{{ asset("libs/data-tables") }}/DataTables-1.10.22/css/dataTables.bootstrap4.min.css"/>
<link rel="stylesheet" type="text/css" href="{{ asset("libs/data-tables") }}/Buttons-1.6.4/css/buttons.bootstrap4.min.css"/>
<link rel="stylesheet" type="text/css" href="{{ asset("libs/data-tables") }}/FixedHeader-3.1.7/css/fixedHeader.bootstrap4.min.css"/>
<link rel="stylesheet" type="text/css" href="{{ asset("libs/data-tables") }}/Select-1.3.1/css/select.bootstrap4.min.css"/>
@endsection

@section('content')
<input type="hidden" id="token" value="{{ auth()->user()->api_token }}">
<input type="hidden" id="user" value="{{ auth()->user() }}">
<div id="app" class="bg-white"></div>
@endsection

@section('script')
<script type="text/javascript" src="{{ asset("libs/data-tables") }}/JSZip-2.5.0/jszip.min.js" ></script>
<script type="text/javascript" src="{{ asset("libs/data-tables") }}/pdfmake-0.1.36/pdfmake.min.js" ></script>
<script type="text/javascript" src="{{ asset("libs/data-tables") }}/pdfmake-0.1.36/vfs_fonts.js" ></script>
<script type="text/javascript" src="{{ asset("libs/data-tables/DataTables-1.10.22/js/jquery.dataTables.min.js") }}" ></script>
<script type="text/javascript" src="{{ asset("libs/data-tables/DataTables-1.10.22/js/dataTables.bootstrap4.min.js") }}" ></script>
<script type="text/javascript" src="{{ asset("libs/data-tables/Buttons-1.6.4/js/dataTables.buttons.min.js") }}" ></script>
<script type="text/javascript" src="{{ asset("libs/data-tables/Buttons-1.6.4/js/buttons.bootstrap4.min.js") }}" ></script>
<script type="text/javascript" src="{{ asset("libs/data-tables/Buttons-1.6.4/js/buttons.flash.min.js") }}" ></script>
<script type="text/javascript" src="{{ asset("libs/data-tables/Buttons-1.6.4/js/buttons.html5.min.js") }}" ></script>
<script type="text/javascript" src="{{ asset("libs/data-tables/Buttons-1.6.4/js/buttons.print.min.js") }}" ></script>
<script type="text/javascript" src="{{ asset("libs/data-tables/FixedHeader-3.1.7/js/dataTables.fixedHeader.min.js") }}" ></script>
<script type="text/javascript" src="{{ asset("libs/data-tables") }}/Select-1.3.1/js/dataTables.select.min.js"></script>

<script src="{{ asset('js/rep/app.js') }}" ></script>
@endsection

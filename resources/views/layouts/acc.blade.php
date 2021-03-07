<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="stylesheet" href="{{ asset("css/app.css") }}">
    <link rel="stylesheet" href="{{ asset("css/shared.css") }}">
    <link rel="stylesheet" href="{{ asset("libs/fontawesome/css/all.min.css") }}">
    <link rel="stylesheet" type="text/css" href="{{ asset("libs/data-tables") }}/DataTables-1.10.22/css/dataTables.bootstrap4.min.css"/>
    <link rel="stylesheet" type="text/css" href="{{ asset("libs/data-tables") }}/Buttons-1.6.4/css/buttons.bootstrap4.min.css"/>
    <link rel="stylesheet" type="text/css" href="{{ asset("libs/data-tables") }}/FixedHeader-3.1.7/css/fixedHeader.bootstrap4.min.css"/>
    <link rel="stylesheet" type="text/css" href="{{ asset("libs/data-tables") }}/Select-1.3.1/css/select.bootstrap4.min.css"/>
    <link rel="stylesheet" href="{{ asset("libs/data-tables") }}/RowGroup-1.1.2/css/rowGroup.bootstrap4.min.css">
    <link rel="stylesheet" href="{{ asset("libs/data-tables") }}/ColReorder-1.5.3/css/colReorder.bootstrap4.min.css">
    <link rel="stylesheet" href="{{ asset("libs/data-tables") }}/RowReorder-1.2.7\css/rowReorder.bootstrap4.css">
    <link rel="stylesheet" href="{{ asset("css/acc/dashboard.css") }}">
   {{--  <link rel="stylesheet" href="{{ asset("libs/data-tables") }}/SearchPanes-1.2.2/css/searchPanes.bootstrap4.css"> --}}
    <link rel="shortcut icon" href="{{ asset("/images/npmt_icon.png") }}" type="image/x-icon">
    <link rel="shortcut icon" href="{{ asset("/images/npmt_icon.png") }}" type="image/png" size="16x16">
    <link rel="shortcut icon" href="{{ asset("/images/npmt_icon.png") }}" type="image/png" size="32x32">
    <link rel="shortcut icon" href="{{ asset("/images/npmt_icon.png") }}" type="image/png" size="64x64">
    <link rel="apple-touch-icon" href="{{ asset("/images/npmt_icon.png") }}">
    @yield("style")
    <title>{{ env("APP_NAME") }}</title>
</head>
<body>
    <div class="px-0">
      <x-accountant-navbar />
    </div>
    <div class="row mx-auto">
      <!-- sidebar -->
      <div class="col-lg-2  col-md-3 sidebar">
        <div class=" d-flex flex-column justify-content-around">
          <!-- website logo -->
          <div class="my-2 text-center">
            <p class="bg-primary text-light mx-auto d-flex align-items-center justify-content-center rounded-circle display-2 shadow" style="width:150px;height:150px">{{ substr(auth()->user()->name,0,1) }}</p>
            <p class="text-light my-1">
              <span>{{ auth()->user()->name }}</span>
              <br>
              <span>{{ ucfirst(auth()->user()->role) }}</span>
            </p>
          </div>
          <!-- sidebar nav -->
          <ul class="px-0 nav dashboard-sidebar-nav">
            <li class="nav-item col-12 px-0 active">
              <a href="{{ url("accountant") }}" class="nav-link text-light small">
                <span class="fa fa-home"></span>
                <span>Home</span>
              </a>
            </li>
            <li class="nav-item col-12 px-0">
              <a href="" class="nav-link text-light small">
                <span class="fa fa-plus-circle"></span>
                <span>Add request</span>
              </a>
            </li>
            <li class="nav-item col-12 px-0">
              <a href="{{ url('accountant/requests') }}" class="nav-link text-light small">
                <span class="fa fa-book-reader"></span>
                <span>Requests list</span>
              </a>
            </li>
            <li class="nav-item col-12 px-0">
              <a href="" class="nav-link text-light small">
                <span class="fa fa-check-circle"></span>
                <span>Approvals</span>
              </a>
            </li>
            <li class="nav-item col-12 px-0">
                <a href="" class="nav-link text-light small">
                  <span class="fa fa-flask"></span>
                  <span>Analysis</span>
                </a>
              </li>
              <li class="nav-item col-12 px-0">
                <a href="" class="nav-link text-light small">
                  <span class="fa fa-coins"></span>
                  <span>Cost Center</span>
                </a>
              </li>
          </ul>
          <div class="d-flex p-2 justify-content-around mt-5 bottom-nav">
            <a href="" class="text-light small text-decoration-none">
              <span class="fa fa-sign-out-alt"></span>
              <span>logout</span>
            </a>
            <a href="" class="text-light small text-decoration-none">
              <span class="fa fa-info-circle"></span>
              <span>info.</span>
            </a>
          </div>
        </div>
      </div>
      <!-- main -->
      <main class="col-lg-10 col-md-9 bg-white p-2">
        @yield("content")
      </main>
    </div>
    <script src="{{ asset("js/app.js") }}"></script>
    <script type="text/javascript" src="{{ asset("libs/data-tables") }}/JSZip-2.5.0/jszip.min.js" ></script>
    <script type="text/javascript" src="{{ asset("libs/data-tables/DataTables-1.10.22/js/jquery.dataTables.min.js") }}" ></script>
    <script type="text/javascript" src="{{ asset("libs/data-tables/DataTables-1.10.22/js/dataTables.bootstrap4.min.js") }}" ></script>
    <script type="text/javascript" src="{{ asset("libs/data-tables/Buttons-1.6.4/js/dataTables.buttons.min.js") }}" ></script>
    <script type="text/javascript" src="{{ asset("libs/data-tables/Buttons-1.6.4/js/buttons.bootstrap4.min.js") }}" ></script>
    <script type="text/javascript" src="{{ asset("libs/data-tables/Buttons-1.6.4/js/buttons.flash.min.js") }}" ></script>
    <script type="text/javascript" src="{{ asset("libs/data-tables/Buttons-1.6.4/js/buttons.html5.min.js") }}" ></script>
    <script type="text/javascript" src="{{ asset("libs/data-tables/Buttons-1.6.4/js/buttons.print.min.js") }}" ></script>
    <script type="text/javascript" src="{{ asset("libs/data-tables/FixedHeader-3.1.7/js/dataTables.fixedHeader.min.js") }}" ></script>
    <script type="text/javascript" src="{{ asset("libs/data-tables/RowGroup-1.1.2/js/rowGroup.bootstrap4.min.js") }}"></script>
    <script type="text/javascript" src="{{ asset("libs/data-tables/RowGroup-1.1.2/js/dataTables.rowGroup.min.js") }}"></script>
    <script type="text/javascript" src="{{ asset("libs/data-tables") }}/Select-1.3.1/js/dataTables.select.min.js"></script>
    <script type="text/javascript" src="{{ asset("libs/data-tables") }}/ColReorder-1.5.3/js/dataTables.colReorder.min.js"></script>
    <script type="text/javascript" src="{{ asset("libs/data-tables") }}/ColReorder-1.5.3/js/colReorder.bootstrap4.min.js"></script>
    <script type="text/javascript" src="{{ asset("libs/data-tables") }}/RowReorder-1.2.7/js/dataTables.rowReorder.min.js"></script>
    <script type="text/javascript" src="{{ asset("libs/data-tables") }}/RowReorder-1.2.7/js/rowReorder.bootstrap4.min.js"></script>
    {{-- <script type="text/javascript" src="{{ asset("libs/data-tables") }}/SearchPanes-1.2.2/js/dataTables.searchPanes.min.js"></script>
    <script type="text/javascript" src="{{ asset("libs/data-tables") }}/SearchPanes-1.2.2/js/searchPanes.bootstrap4.min.js"></script> --}}
    @yield("script")
</body>
</html>

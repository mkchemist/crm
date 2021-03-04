<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <link rel="stylesheet" href="{{ asset("css/app.css") }}">
  <link rel="stylesheet" href="{{ asset("libs/fontawesome/css/all.min.css") }}">
  <link rel="stylesheet" type="text/css"
    href="{{ asset("libs/data-tables") }}/DataTables-1.10.22/css/dataTables.bootstrap4.min.css" />
  <link rel="stylesheet" type="text/css"
    href="{{ asset("libs/data-tables") }}/Buttons-1.6.4/css/buttons.bootstrap4.min.css" />
  <link rel="stylesheet" type="text/css"
    href="{{ asset("libs/data-tables") }}/FixedHeader-3.1.7/css/fixedHeader.bootstrap4.min.css" />
  <link rel="stylesheet" type="text/css"
    href="{{ asset("libs/data-tables") }}/Select-1.3.1/css/select.bootstrap4.min.css" />
  <link rel="stylesheet" href="{{ asset("libs/data-tables") }}/RowGroup-1.1.2/css/rowGroup.bootstrap4.min.css">
  <link rel="stylesheet" href="{{ asset("libs/data-tables") }}/ColReorder-1.5.3/css/colReorder.bootstrap4.min.css">
  <link rel="stylesheet" href="{{ asset("libs/data-tables") }}/RowReorder-1.2.7\css/rowReorder.bootstrap4.css">
  <link rel="stylesheet" href="{{ asset("css/acc/app.css") }}">
  {{--  <link rel="stylesheet" href="{{ asset("libs/data-tables") }}/SearchPanes-1.2.2/css/searchPanes.bootstrap4.css">
  --}}
  <link rel="shortcut icon" href="{{ asset("/images/npmt_icon.png") }}" type="image/x-icon">
  <link rel="shortcut icon" href="{{ asset("/images/npmt_icon.png") }}" type="image/png" size="16x16">
  <link rel="shortcut icon" href="{{ asset("/images/npmt_icon.png") }}" type="image/png" size="32x32">
  <link rel="shortcut icon" href="{{ asset("/images/npmt_icon.png") }}" type="image/png" size="64x64">
  <link rel="apple-touch-icon" href="{{ asset("/images/npmt_icon.png") }}">
  @yield("style")
  <title>{{ env("APP_NAME") }}</title>
</head>

<body>
  <input type="hidden" id="token" value="{{ auth()->user()->api_token }}">
  <input type="hidden" id="user" value="{{ auth()->user() }}">
  <input type="hidden" id="APP_BASE_URI" value="{{ env("APP_BASE_URI") }}">
  <input type="hidden" id="APP_API_URL" value="{{ env("APP_API_URL") }}">
  <div id="app"></div>
  <script src="{{ asset("js/app.js") }}"></script>
  <script type="text/javascript" src="{{ asset("libs/data-tables") }}/JSZip-2.5.0/jszip.min.js"></script>
  <script type="text/javascript" src="{{ asset("libs/data-tables/DataTables-1.10.22/js/jquery.dataTables.min.js") }}">
  </script>
  <script type="text/javascript"
    src="{{ asset("libs/data-tables/DataTables-1.10.22/js/dataTables.bootstrap4.min.js") }}"></script>
  <script type="text/javascript" src="{{ asset("libs/data-tables/Buttons-1.6.4/js/dataTables.buttons.min.js") }}">
  </script>
  <script type="text/javascript" src="{{ asset("libs/data-tables/Buttons-1.6.4/js/buttons.bootstrap4.min.js") }}">
  </script>
  <script type="text/javascript" src="{{ asset("libs/data-tables/Buttons-1.6.4/js/buttons.flash.min.js") }}"></script>
  <script type="text/javascript" src="{{ asset("libs/data-tables/Buttons-1.6.4/js/buttons.html5.min.js") }}"></script>
  <script type="text/javascript" src="{{ asset("libs/data-tables/Buttons-1.6.4/js/buttons.print.min.js") }}"></script>
  <script type="text/javascript"
    src="{{ asset("libs/data-tables/FixedHeader-3.1.7/js/dataTables.fixedHeader.min.js") }}"></script>
  <script type="text/javascript" src="{{ asset("libs/data-tables/RowGroup-1.1.2/js/rowGroup.bootstrap4.min.js") }}">
  </script>
  <script type="text/javascript" src="{{ asset("libs/data-tables/RowGroup-1.1.2/js/dataTables.rowGroup.min.js") }}">
  </script>
  <script type="text/javascript" src="{{ asset("libs/data-tables") }}/Select-1.3.1/js/dataTables.select.min.js">
  </script>
  <script type="text/javascript" src="{{ asset("libs/data-tables") }}/ColReorder-1.5.3/js/dataTables.colReorder.min.js">
  </script>
  <script type="text/javascript" src="{{ asset("libs/data-tables") }}/ColReorder-1.5.3/js/colReorder.bootstrap4.min.js">
  </script>
  <script type="text/javascript" src="{{ asset("libs/data-tables") }}/RowReorder-1.2.7/js/dataTables.rowReorder.min.js">
  </script>
  <script type="text/javascript" src="{{ asset("libs/data-tables") }}/RowReorder-1.2.7/js/rowReorder.bootstrap4.min.js">
  </script>
  <script src="{{ asset('js/dm/manifest.js?v=').$hash_key }}"></script>
  <script src="{{ asset('js/dm/vendor.js?v=').$hash_key }}"></script>
  <script type="text/javascript" src="{{ asset("js/acc/acc.js") }}"></script>
  {{-- <script type="text/javascript" src="{{ asset("libs/data-tables") }}/SearchPanes-1.2.2/js/dataTables.searchPanes.min.js">
  </script>
  <script type="text/javascript"
    src="{{ asset("libs/data-tables") }}/SearchPanes-1.2.2/js/searchPanes.bootstrap4.min.js"></script> --}}
  @yield("script")
</body>

</html>

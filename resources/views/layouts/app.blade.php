<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="stylesheet" href="{{ asset("css/app.css") }}">
    <link rel="stylesheet" href="{{ asset("libs/fontawesome/css/all.min.css") }}">
    <link rel="shortcut icon" href="{{ asset("/images/npmt_icon.png") }}" type="image/x-icon">
    <link rel="shortcut icon" href="{{ asset("/images/npmt_icon.png") }}" type="image/png" size="16x16">
    <link rel="shortcut icon" href="{{ asset("/images/npmt_icon.png") }}" type="image/png" size="32x32">
    <link rel="shortcut icon" href="{{ asset("/images/npmt_icon.png") }}" type="image/png" size="64x64">
    <link rel="apple-touch-icon" href="{{ asset("/images/npmt_icon.png") }}">
    @yield("style")
    <title>{{ env("APP_NAME") }}</title>
</head>
<body>
    <div class="container">
        @yield("content")
    </div>
    <script src="{{ asset("js/app.js") }}"></script>
    @yield("script")
</body>
</html>

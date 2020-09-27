<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="stylesheet" href="{{ asset("css/app.css") }}">
    <link rel="stylesheet" href="{{ asset("libs/fontawesome/css/all.min.css") }}">
    @yield("style")
    <title>{{ env("APP_NAME") }}</title>
</head>
<body class="bg-success">
    <div class="container">
        @yield("content")
    </div>
    <script src="{{ asset("js/app.js") }}"></script>
    @yield("script")
</body>
</html>

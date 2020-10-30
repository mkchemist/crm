<template>
  <div class="bg-success d-flex p-2">
    <div class="col-3 text-center">
      <span class="lead text-light">Admin Dashboard</span>
    </div>
    <div class="col-9 d-flex">
      <ul class="nav ml-auto">
        <li class="nav-item">
          <a :href="`${base_url}logout`" class="nav-link text-light">
            <span><i class="fa fa-door-open"></i></span>
            <span>logout</span>
          </a>
        </li>
        <li class="nav-item dropdown">
          <a
            href=""
            class="nav-link text-light dropdown-toggle"
            data-toggle="dropdown"
          >
            <span><i class="fa fa-cogs"></i></span>
            <span>Actions</span>
          </a>
          <div class="dropdown-menu dropdown-menu-right">
            <a href="" class="dropdown-item">link</a>
          </div>
        </li>
        <li class="nav-item dropdown">
          <a href="" class="nav-link text-light" data-toggle="dropdown">
            <span class=""
              ><i class="fa fa-globe-africa"></i
              ><sup class="text-light"><b>2</b></sup></span
            >
          </a>
          <div class="dropdown-menu">
            <a href="" class="dropdown-item">link</a>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    base_url: document.getElementById('APP_API_URL').value.replace('api/', '')
  })
};
</script>

<style></style>

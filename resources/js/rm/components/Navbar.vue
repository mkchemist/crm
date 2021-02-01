<template>
  <header class="bg-white">
    <nav class="navbar navbar-expand-lg navbar-light">
      <router-link to="/" class="navbar-brand">
        <img :src="baseUrl+'images/logo.png'" alt="" class="img-fluid">
        <br>
        <span class="text-muted">Welcome {{ $store.state.UserModule.user.name }}</span>
      </router-link>
      <button class="navbar-toggler" data-toggle="collapse" data-target="#rm_navbar">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="navbar-collapse collapse" id="rm_navbar">
        <ul class="navbar-nav ml-auto">
          <li v-for="(route, i) in routes" :key="i" class="nav-item">
            <router-link :to="route.link" class="nav-link" active-class="active" exact>
              <span>{{ route.title }}</span>
            </router-link>
          </li>
          <li class="nav-item dropdown">
            <a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown">
              <span class="fa fa-user"></span>
              <span>User</span>
            </a>
            <div class="dropdown-menu dropdown-menu-right">
              <a :href="`${baseUrl}change-password`" class="nav-link dropdown-item small">
                <span class="fa fa-lock"></span>
                <span>change password</span>
              </a>
              <a :href="`${baseUrl}logout`" class="nav-link dropdown-item small">
                <span class="fa fa-door-open"></span>
                <span>logout</span>
              </a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  data:() => ({
    routes: [
      {
        title: 'Home',
        link: '/'
      },
      {
        title: 'Customers',
        link: '/customers'
      },
      {
        title: 'Planner',
        link: '/planner'
      },
      {
        title: 'Reports',
        link: '/reports'
      }
    ],
    baseUrl: document.getElementById('APP_API_URL').value.replace('api/','')
  })
}
</script>

<style lang="scss" scoped>
.navbar-brand{
    img {
      width:100px;
      transition:.5s;
      @media(min-width:992px) {
        width:200px;
      }
    }
  }
  .active {
    @media(min-width:992px) {
      background-color:  #38c172;
      border-radius: 5px;
      color: white !important;
    }
  }
</style>

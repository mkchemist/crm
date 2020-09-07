<template>
  <div class="bg-white px-0">
    <nav class="navbar navbar-expand-lg navbar-light">
      <router-link to="/" class="navbar-brand">
        <img :src="`${base_url}images/logo.png`" alt="" class="img-fluid">
        <br>
        <span class="small text-muted font-italic d-none d-lg-block">Welcome Dr name</span>
      </router-link>
      <button class="navbar-toggler" data-toggle="collapse" data-target="#rep_navbar">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="navbar-collapse collapse" id="rep_navbar">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item" v-for="(link,i) in links" :key="i">
            <router-link :to="link.path" class="nav-link" active-class="active" :exact="link.path === '/' ? true : false">
              <span>{{ link.title }}</span>
            </router-link>
          </li>
          <li class="nav-item dropdown">
            <a href="#user_menu" class="nav-link dropdown-toggle" data-toggle="dropdown">user</a>
            <div class="dropdown-menu dropdown-menu-right" id="user_menu">
              <a href="" class="nav-link dropdown-item small">change password</a>
              <div class="dropdown-divider"></div>
              <a :href="`${base_url}logout`" class="nav-link small dropdown-item">logout</a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
let base_url = process.env.MIX_APP_API_URL.replace('api', '');
export default {
  data() {
    return {
      base_url,
      links: [
        {
          title: 'Home',
          path: '/'
        },
        {
          title: 'Customers',
          path: '/customers'
        },
        {
          title: 'Workplaces',
          path: '/workplaces'
        },
        {
          title: 'Planner',
          path: '/planner'
        },
        {
          title: 'Reports',
          path: '/reports'
        }
      ]
    }
  }
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

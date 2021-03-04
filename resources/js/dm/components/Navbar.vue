<template>
  <div class="bg-white">
    <nav class="navbar navbar-expand-lg navbar-light">
      <router-link to="/" class="navbar-brand">
        <img :src="base_url+'images/logo.png'" alt="NPMT logo">
        <br>
        <span class="px-2 text-success font-weight-bold small">{{ $store.state.user.name }}</span>
        <br>
        <span class="small font-weight-bold px-2"><span>{{ JSON.parse($store.state.user.line).join(" | ") }}</span></span>
      </router-link>
      <button class="navbar-toggler" data-toggle="collapse" data-target="#navbar">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="navbar-collapse collapse" id="navbar">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item" v-for="(link,i) in links" :key="i">
            <router-link :to="link.path" class="nav-link" active-class="active" :exact="link.path === '/' ? true : false">
              {{ link.name }}
            </router-link>
          </li>
          <li class="nav-item dropdown">
            <a href="" class="nav-link dropdown-toggle font-weight-bold" data-toggle="dropdown">
              <span>{{ userFirstName }}</span>
            </a>
            <div class="dropdown-menu dropdown-menu-right">
              <a :href="base_url+'change-password'" class="dropdown-item small">
                <span><i class="fa fa-lock"></i></span>
                <span>Change Password</span>
              </a>
              <div class="dropdown-divider"></div>
              <a :href="base_url+'logout'" class="dropdown-item small">
                <span><i class="fa fa-door-open"></i></span>
                <span>logout</span>
              </a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>

export default {
  computed: {
    userFirstName() {
      return this.$store.state.user.name.split(" ")[0]
    }
  },
  data: () => ({
    base_url : document.getElementById("APP_API_URL").value.replace("api/", ''),
    links: [
      {
        name: 'Home',
        path: '/'
      },
      {
        name: 'Customers',
        path: '/customers'
      },
      {
        name: 'Workplaces',
        path: '/workplaces'
      },
      {
        name: 'Planner',
        path: '/planner'
      },
      {
        name: 'Reports',
        path: '/reports'
      },
      {
        name: 'Approval',
        path: '/approval'
      }
    ]
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

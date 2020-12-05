<template>
  <div class="bg-white px-0">
    <nav class="navbar navbar-expand-lg navbar-light">
      <router-link to="/" class="navbar-brand">
        <img :src="`${base_url}images/logo.png`" alt="" class="img-fluid" />
        <br />
        <span class="small text-muted d-none d-lg-block"
          >Welcome {{ $store.state.AppModule.user.name }}</span
        >
      </router-link>
      <button
        class="navbar-toggler"
        data-toggle="collapse"
        data-target="#rep_navbar"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="navbar-collapse collapse" id="rep_navbar">
        <ul class="navbar-nav ml-auto">
          <!-- new menu -->
          <li class="nav-item dropdown">
            <a
              href="#new_menu"
              class="nav-link dropdown-toggle"
              data-toggle="dropdown"
            >
              <span><i class="fa fa-plus-circle"></i></span>
              <span>New</span>
            </a>
            <div class="dropdown-menu dropdown-menu-left" id="new_menu">
              <router-link to="/customers/new" class="drop-item small nav-link">
                <span><i class="fa fa-user-plus"></i></span>
                <span class="ml-1">New customer</span>
              </router-link>
              <router-link
                to="/workplaces/add-hospital"
                class="drop-item small nav-link"
              >
                <span><i class="fa fa-hospital-user"></i></span>
                <span class="ml-1">New hospital</span>
              </router-link>
              <router-link
                to="/workplaces/add-pharmacy"
                class="drop-item small nav-link"
              >
                <span><i class="fa fa-store-alt"></i></span>
                <span class="ml-1">New pharmacy</span>
              </router-link>
              <router-link
                to="/planner/add-pm"
                class="drop-item small nav-link"
              >
                <span><i class="fa fa-plus-circle"></i></span>
                <span class="ml-1">Plan PM visit</span>
              </router-link>
              <router-link
                to="/planner/add-am"
                class="drop-item small nav-link"
              >
                <span><i class="fa fa-plus-circle"></i></span>
                <span class="ml-1">Plan AM visit</span>
              </router-link>
            </div>
          </li>
          <!-- end new menu -->
          <!-- nav main menu -->
          <li class="nav-item" v-for="(link, i) in links" :key="i">
            <router-link
              :to="link.path"
              class="nav-link"
              active-class="active"
              :exact="link.path === '/' ? true : false"
            >
              <span>{{ link.title }}</span>
            </router-link>
          </li>
          <!-- end nav main menu -->
          <!-- user menu -->
          <li class="nav-item dropdown">
            <a
              href="#user_menu"
              class="nav-link dropdown-toggle"
              data-toggle="dropdown"
              >User</a
            >
            <div class="dropdown-menu dropdown-menu-right" id="user_menu">
              <a
                :href="`${base_url}change-password`"
                class="nav-link dropdown-item small"
              >
                <span><i class="fa fa-lock"></i></span>
                <span>change password</span>
              </a>
              <div class="dropdown-divider"></div>
              <a
                :href="`${base_url}logout`"
                class="nav-link small dropdown-item"
              >
                <span><i class="fa fa-door-open"></i></span>
                <span>logout</span>
              </a>
            </div>
          </li>
          <!-- end user menu -->
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
let base_url = document.getElementById("APP_API_URL").value.replace("api/", "");
export default {
  created() {},
  data() {
    return {
      base_url,
      links: [
        {
          title: "Home",
          path: "/"
        },
        {
          title: "Customers",
          path: "/customers"
        },
        {
          title: "Workplaces",
          path: "/workplaces"
        },
        {
          title: "Planner",
          path: "/planner"
        },
        {
          title: "Reports",
          path: "/reports"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.navbar-brand {
  img {
    width: 100px;
    transition: 0.5s;
    @media (min-width: 992px) {
      width: 200px;
    }
  }
}
.active {
  @media (min-width: 992px) {
    background-color: #38c172;
    border-radius: 5px;
    color: white !important;
  }
}
</style>

<template>
  <div class="bg-white px-0">
    <nav class="navbar navbar-expand-lg navbar-light">
      <router-link to="/" class="navbar-brand">
        <img :src="`${base_url}images/logo.png`" alt="" class="img-fluid" />
        <span class="small text-muted d-none d-lg-block"
          >Welcome
          <span class="font-weight-bold text-success">{{
            $store.state.UserModule.user.name
          }}</span></span
        >
        <span class="small text-muted d-none d-lg-block"
          >Line :
          <span class="font-weight-bold text-success">{{
            $store.getters.userLine
          }}</span></span
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
              <span><i class="fa fa-check-circle"></i></span>
              <span>Actions</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-left" id="new_menu">
              <li class="dropdown-submenu">
                <span class="dropdown-submenu-title nav-link clearfix px-2">
                  <span>Visit</span>
                  <span class="fa fa-chevron-circle-right float-right"></span>
                </span>
                <ul class="dropdown-menu dropdown-menu-left">
                  <li class="px-2">
                    <router-link
                      to="/reports/add/pm"
                      class="drop-item small nav-link"
                    >
                      <span><i class="fa fa-plus-circle"></i></span>
                      <span class="ml-1">PM visit</span>
                    </router-link>
                  </li>
                  <li class="px-2">
                    <router-link
                      to="/reports/add/Am"
                      class="drop-item small nav-link"
                    >
                      <span><i class="fa fa-plus-circle"></i></span>
                      <span class="ml-1">AM visit</span>
                    </router-link>
                  </li>
                  <li class="px-2">
                    <router-link
                      to="/reports/add/pharmacy"
                      class="drop-item small nav-link"
                    >
                      <span><i class="fa fa-plus-circle"></i></span>
                      <span class="ml-1">Pharmacy visit</span>
                    </router-link>
                  </li>
                  <li class="px-2">
                    <router-link
                      to="/reports/add/activity-report?type=field-activity"
                      class="drop-item small nav-link"
                    >
                      <span><i class="fa fa-plus-circle"></i></span>
                      <span class="ml-1">Field activity report</span>
                    </router-link>
                  </li>
                  <li class="px-2">
                    <router-link
                      to="/reports/add/activity-report?type=non-field-activity"
                      class="drop-item small nav-link"
                    >
                      <span><i class="fa fa-plus-circle"></i></span>
                      <span class="ml-1">Non Field activity report</span>
                    </router-link>
                  </li>
                </ul>
              </li>
              <li class="dropdown-submenu">
                <span class="dropdown-submenu-title nav-link clearfix px-2">
                  <span>Plan</span>
                  <span class="fa fa-chevron-circle-right float-right"></span>
                </span>
                <ul class="dropdown-menu dropdown-menu-left">
                  <li>
                    <router-link
                      to="/planner/add-pm"
                      class="drop-item small nav-link"
                    >
                      <span><i class="fa fa-plus-circle"></i></span>
                      <span class="ml-1">Plan PM visit</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link
                      to="/planner/add-am"
                      class="drop-item small nav-link"
                    >
                      <span><i class="fa fa-plus-circle"></i></span>
                      <span class="ml-1">Plan AM visit</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link
                      to="/planner/add-field-activity"
                      class="drop-item small nav-link"
                    >
                      <span><i class="fa fa-plus-circle"></i></span>
                      <span class="ml-1">Plan Field activity</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link
                      to="/planner/add-non-field-activity"
                      class="drop-item small nav-link"
                    >
                      <span><i class="fa fa-plus-circle"></i></span>
                      <span class="ml-1">Plan Non Field activity</span>
                    </router-link>
                  </li>
                </ul>
              </li>
              <li class="dropdown-submenu">
                <span class="dropdown-submenu-title nav-link clearfix px-2">
                  <span>New</span>
                  <span class="fa fa-chevron-circle-right float-right"></span>
                </span>
                <ul class="dropdown-menu dropdown-menu-left">
                  <li>
                    <router-link
                      to="/reports/add/request"
                      class="drop-item small nav-link"
                    >
                      <span><i class="fa fa-dollar-sign"></i></span>
                      <span class="ml-1">New Request</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link
                      to="/customers/new"
                      class="drop-item small nav-link"
                    >
                      <span><i class="fa fa-user-plus"></i></span>
                      <span class="ml-1">New customer</span>
                    </router-link>
                  </li>

                  <li>
                    <router-link
                      to="/workplaces/add-hospital"
                      class="drop-</li>item small nav-link"
                    >
                      <span><i class="fa fa-hospital-user"></i></span>
                      <span class="ml-1">New hospital</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link
                      to="/workplaces/add-pharmacy"
                      class="drop-item small nav-link"
                    >
                      <span><i class="fa fa-store-alt"></i></span>
                      <span class="ml-1">New pharmacy</span>
                    </router-link>
                  </li>
                </ul>
              </li>
            </ul>
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

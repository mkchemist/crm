<template>
  <header>
    <nav class="navbar navbar-expand-md admin-nav navbar-dark shadow">
      <!-- brand -->
      <a href="" class="navbar-brand d-flex" title="Brand view">
        <img
          :src="baseUrl+`images/admin-suit.png`"
          alt="Admin profile picture"
          class="img-fluid admin-nav-pic"
        />
        <div class="d-flex flex-column justify-content-center">
          <span class="small font-weight-bold">{{ user.name }}</span>
          <span class="small font-weight-bold">{{ user.role | upperCase }}</span>
        </div>
      </a>
      <!-- navbar toggler -->
      <button
        class="navbar-toggler"
        data-toggle="collapse"
        data-target="#admin_navbar"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <!-- navbar menu container -->
      <div class="navbar-collapse collapse" id="admin_navbar">
        <!-- desktop nav -->
        <ul class="navbar-nav ml-auto flex-row justify-content-center">
          <li class="nav-item mx-md-0 mx-2 d-md-none d-block">
            <a href="" class="nav-link" title="user profile">
              <span class="far fa-bell"></span>
            </a>
          </li>
          <li class="nav-item notifications d-md-block d-none">
            <a
              href="#notification_menu"
              class="nav-link "
              title="notifications"
              data-toggle="collapse"
            >
              <span class="fa-layers fa-layers-bottom-right">
                <i class="far fa-bell"></i>
                <span class="fa-layers-counter bell-counter small">2</span>
              </span>
            </a>
            <ul
              id="notification_menu"
              class="notification-menu nav collapse col-12 bg-white"
            >
              <li class="nav-item col-12 small border-bottom">
               Under construction
              </li>

            </ul>
          </li>
          <li class="nav-item mx-md-0 mx-2">
            <a href="" class="nav-link" title="user profile">
              <span class="far fa-user"></span>
            </a>
          </li>
          <li class="nav-item mx-md-0 mx-2">
            <a href="" class="nav-link" title="Create broadcast message">
              <span class="fa fa-bullhorn"></span>
            </a>
          </li>
          <li class="nav-item mx-md-0 mx-2">
            <a :href="baseUrl+'change-password'" class="nav-link" title="Change password">
              <span class="fa fa-lock"></span>
            </a>
          </li>

          <li class="nav-item mx-md-0 mx-2">
            <a :href="baseUrl+'logout'" class="nav-link" title="sign out">
              <span class="fa fa-sign-out-alt"></span>
            </a>
          </li>
        </ul>
        <app-menu />
      </div>
    </nav>
  </header>
</template>

<script>
import AppMenu from './AppMenu.vue';
export default {
  components: { AppMenu },
  computed: {
    user() {
      return JSON.parse(document.getElementById("user").value);
    }
  },
  data: () => ({
    baseUrl: document.getElementById("APP_API_URL").value.replace("api/", "")
  }),
  filters: {
    upperCase : (v) => {
      return v[0].toUpperCase()+v.substr(1);
    }
  }
};
</script>

<style></style>

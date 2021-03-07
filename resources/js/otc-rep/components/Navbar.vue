<template>
  <div class="bg-white shadow rounded">
    <nav class="navbar navbar-expand-lg navbar-light">
      <router-link to="/" class="navbar-brand">
        <img :src="logoUrl" alt="NPMT logo" class="img-fluid logo-img" />
        <br />
        <span class="small"
          >Welcome :
          <span class="font-weight-bold text-success">{{
            user.name
          }}</span></span
        >
        <br />
        <span class="small"
          >Line:
          <span class="font-weight-bold text-success">{{
            $store.getters.userLine
          }}</span></span
        >
      </router-link>
      <button
        type="button"
        class="navbar-toggler"
        data-toggle="collapse"
        data-target="#otc_rep_navbar"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="navbar-collapse collapse" id="otc_rep_navbar">
        <ul class="navbar-nav ml-auto">
          <li
            class="nav-item"
            v-for="(link, index) in links"
            :key="`link_${index}`"
          >
            <router-link :to="link.path" class="nav-link" active-class="active" exact>
              <span>{{ link.title }}</span>
            </router-link>
          </li>
          <li class="nav-item dropdown">
            <a href="" class="dropdown-toggle nav-link" data-toggle="dropdown">
              <span>{{ user.name }}</span>
            </a>
            <div class="dropdown-menu dropdown-menu-right">
              <a :href="changePassword" class="small dropdown-item">
                <span class="fa fa-lock mr-1" style="color:purple"></span>
                <span>Change password</span>
              </a>
              <div class="dropdown-divider"></div>
              <a :href="logout" class="small dropdown-item">
                <span class="fa fa-door-open text-danger"></span>
                <span>Logout</span>
              </a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
import { UrlHelper } from "../../helpers/http-service";
export default {
  data: () => ({
    baseUrl: UrlHelper.base(),
    logoUrl: UrlHelper.generate("images/logo.png"),
    changePassword: UrlHelper.generate('change-password'),
    logout: UrlHelper.generate('logout'),
    links: [
      {
        title: "Home",
        path: "/"
      },
      {
        title: "Pharmacies",
        path: "/pharmacies"
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
  }),
  computed: {
    user() {
      return this.$store.getters.user;
    }
  }
};
</script>

<style scoped lang="scss">
.logo-img {
  width: 100px;
  transition: 0.5s;
  @media (min-width: 992px) {
    width: 200px;
  }
}
</style>

<template>
  <div class="bg-blue">
    <nav class="navbar navbar-dark navbar-expand-lg">
      <button
        class="navbar-toggler"
        data-toggle="collapse"
        data-target="#acc_navbar"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="navbar-collapse collapse" id="acc_navbar">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item" v-for="(view, i) in views" :key="`view_${i}`">
            <router-link :to="view.link" class="nav-link text-white" active-class="active-page" exact>
              <span>{{ view.title }}</span>
            </router-link>
          </li>
          <li class="nav-item active">
            <a :href="baseUrl+'logout'" class="nav-link" title="Sign out">
              <span class="fa fa-sign-out-alt fa-2x"></span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
import { UrlHelper } from '../../helpers/http-service';
export default {
  data: () => ({
    views: [
      {
        title: 'Home',
        link: '/'
      },
      {
        title: "Requests",
        link: "/customers-requests"
      }
    ],
    baseUrl: UrlHelper.generate()
  })
};
</script>

<style></style>

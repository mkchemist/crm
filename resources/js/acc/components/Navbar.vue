<template>
  <div class="bg-dark-blue">
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
            <router-link :to="view.link" class="nav-link" active-class="active-page" exact>
              <span>{{ view.title }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
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
    ]
  })
};
</script>

<style></style>

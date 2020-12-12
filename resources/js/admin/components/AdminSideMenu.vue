<template>
  <div class="bg-dark">
    <div class="d-flex justify-content-center align-items-center p-3 bg-white">
      <p
        class="bg-success text-light rounded-circle d-flex align-items-center justify-content-center display-4"
        style="width:200px;height:200px"
      >
        Admin
      </p>
    </div>
    <div class="list-group list-group-flush">
      <router-link
        :to="link.path"
        v-for="(link, i) in links"
        :key="i"
        class="list-group-item list-group-item-action"
        active-class="active-page"
        exact
      >
        <span><i :class="`fa ${link.icon}`"></i></span>
        <span>{{ link.name }}</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    links: [
      {
        name: "Home",
        icon: "fa-home",
        path: "/"
      },
      {
        name: "Users",
        icon: "fa-users",
        path: "/users"
      },
      {
        name: "Customers",
        icon: "fa-user-md",
        path: "/customers"
      },
      {
        name: 'Validation',
        icon: 'fa-check-circle',
        path: '/validation'
      },
      {
        name: 'Setting',
        icon: 'fa-cog',
        path: '/setting'
      }
    ]
  })
};
</script>

<style lang="scss">
$green-color: #38c172;
$grey-color: #ebe6e6;

.list-group-item {
  transition: 0.2s;
  &:hover {
    border-left: 5px solid $green-color;
  }
}

.active-page {
  background-color: $green-color !important;
  color: white;
  transition: 0.2s;
  &:hover {
    background-color: $grey-color !important;
    border-left: 5px solid $green-color;
  }
}
</style>

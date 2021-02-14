<template>
  <ul class="nav nav-tabs">
    <li
      class="nav-item bg-light border rounded small"
      v-for="(tab, i) in tabs"
      :key="`tab_${i}`"
    >
      <router-link
        :to="tab.link"
        class="nav-link text-dark font-weight-bold"
        active-class="active-tab"
        exact
        >{{ tab.title }}</router-link
      >
    </li>
  </ul>
</template>

<script>
export default {
  computed: {
    tabs() {
      let tabs = [
        {
          link: "/customers-requests/list",
          title: "List"
        },
        {
          link: "/customers-requests/list/compact",
          title: "Compact"
        },
        {
          link: "/customers-requests/list/customer",
          title: "Customer"
        }
      ];
      return tabs;
    }
  }
};
</script>

<style lang="scss" scoped>
.active-tab {
  background-color: royalblue;
  color: white !important;
}
</style>

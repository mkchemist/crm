<template>
  <div class="p-2">
    <div class="row mx-auto">
      <div class="col-lg-3 p-2">
        <sidebar-component :links="links" />
      </div>
      <div class="col-lg-9 p-2">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarComponent from '../../components/SidebarComponent.vue'
export default {
  components: { SidebarComponent },
  mounted() {
    this.$store.dispatch('fetchPharmacies');
  },
  data: () => ({
    links: [
      {
        title: 'New Pharmacy',
        icon: 'fa-plus-circle',
        link: '/pharmacies/new'
      },
      {
        title: 'Pharmacies List',
        icon: 'fa-list',
        link: '/pharmacies'
      }
    ]
  })
}
</script>

<style>

</style>

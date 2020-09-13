<template>
  <div>
    <div class="px-0 shadow">
      <p class="alert alert-success">
        <span><i class="fa fa-list-alt"></i></span>
        <span class="font-weight-bold">Pharmacies list</span>
      </p>
      <div class="p-2">
        <div class="text-right">
          <router-link to="/workplaces/add-pharmacy" class="btn btn-sm btn-success">
            <span><i class="fa fa-chevron-circle-left"></i></span>
            <span>new</span>
          </router-link>
        </div>
        <!--pharmacies table --->
        <pharmacies-table v-if="pharmacies.length" :data="pharmacies" />
        <loader-component v-else/>
      </div>
    </div>
  </div>
</template>

<script>
import PharmaciesTable from "../../components/PharmaciesTable"
export default {
  created() {
    this.$store.dispatch('pharmacyGetAll');
  },
  components: {
    PharmaciesTable
  },
  computed: {
    pharmacies() {
      return this.$store.getters.pharmacies;
    }
  }
}
</script>

<style>

</style>

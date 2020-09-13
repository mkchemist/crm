<template>
  <div>
    <div class="px-0 shadow">
      <p class="alert alert-success">
        <span><i class="fa fa-list-alt"></i></span>
        <span class="font-weight-bold">Hospital list</span>
      </p>
      <div class="p-2 text-right">
        <router-link to="/workplaces/add-hospital" class="btn btn-sm btn-success">
          <span><i class="fa fa-plus-circle"></i></span>
          <span>new</span>
        </router-link>
      </div>
      <div v-if="all.length" class="p-2">
        <hospital-table :data="all" />
      </div>
      <loader-component v-else />
    </div>
  </div>
</template>

<script>
import HospitalTable from "../../components/HospitalTable";

export default {
  created(){
    this.$store.dispatch('workplaceGetAll')
  },
  computed: {
    all() {
      return this.$store.getters.allWorkplaces;
    }
  },
  components: {
    HospitalTable
  }
};
</script>

<style>
</style>

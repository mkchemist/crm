<template>
  <div>
    <div class="px-0">
      <p class="alert alert-success">
        <span><i class="fa fa-list"></i></span>
        <span>Active Customer List</span>
      </p>
      <div class="p-2 text-right">
        <router-link to="/customers/new" class="btn btn-sm btn-success">
          <span><i class="fa fa-plus-circle"></i></span>
          <span>New</span>
        </router-link>
      </div>
      <div class="p-2">
        <table-component
          v-if="activeCustomers.length"
          :headers="headers"
          :data="activeCustomers"
        />
        <div
          v-else
          class="text-center d-flex justify-content-center align-items-center"
        >
          <vue-loaders
            name="ball-pulse-rise"
            color="seagreen"
            scale="1"
          ></vue-loaders>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TableComponent from "../../../components/TableComponent.vue";
export default {
  created() {
    this.$store.dispatch("customerGetAll");
  },
  computed: {
    activeCustomers() {
      return this.$store.getters.active;
    }
  },
  data: () => ({
    headers: [
      {
        title: "Name",
        name: "name"
      },
      {
        title: 'Specialty',
        name: 'specialty'
      },
      {
        title: 'Param',
        name: 'parameter'
      },
      {
        title: 'Brick',
        name: 'brick'
      },
      {
        title: 'Area',
        name: 'area'
      }
    ]
  }),
  components: {
    TableComponent
  }
};
</script>

<style></style>

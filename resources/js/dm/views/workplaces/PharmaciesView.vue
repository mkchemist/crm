<template>
  <div>
    <div class="px-0 shadow">
      <p class="alert alert-success">
        <span><i class="fa fa-store"></i></span>
        <span class="font-weight-bold">Pharmacies List</span>
      </p>
      <div class="my-3 p-3">
        <table-component
          :data="pharmacies"
          :heads="heads"
          headClass="bg-success text-light"
          v-if="pharmacies.length"
        />
        <div v-else-if="isFetched">
          <p class="text-center text-dark p-2">No data to show</p>
        </div>
        <div v-else>
          <loader-component />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TableComponent from "../../../components/TableComponent";
export default {
  components: {
    TableComponent
  },
  computed: {
    pharmacies() {
      return this.$store.getters.pharmacies;
    },
    isFetched() {
      return this.$store.getters.isPharmacyFetched;
    }
  },
  data: () => ({
    heads: [
      {
        title: "Name",
        name: "name"
      },
      {
        title: "Area",
        name: "area"
      },
      {
        title: "Brick",
        name: "brick"
      },
      {
        title: "Type",
        name: "type"
      },
      {
        title: "Key Person",
        name: "key_person"
      },
      {
        title: "Adress",
        name: "address"
      }
    ]
  })
};
</script>

<style></style>

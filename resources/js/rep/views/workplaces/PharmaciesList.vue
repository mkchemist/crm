<template>
  <div>
    <div class="px-0 shadow pb-5">
      <p class="alert alert-success">
        <span><i class="fa fa-list-alt"></i></span>
        <span class="font-weight-bold">Pharmacies list</span>
      </p>
      <div class="p-2">
        <div class="text-right">
          <router-link
            to="/workplaces/add-pharmacy"
            class="btn btn-sm btn-success"
          >
            <span><i class="fa fa-chevron-circle-left"></i></span>
            <span>new</span>
          </router-link>
        </div>
        <!--pharmacies table --->
        <!-- <pharmacies-table v-if="pharmacies.length" :data="pharmacies" /> -->
        <div class="p-2" v-if="pharmacies.length">
          <table-component
            :data="pharmacies"
            :heads="heads"
            head-class="bg-success text-light"
          >
            <template v-slot:head:before>
              <th>ID</th>
              <th>Actions</th>
            </template>
            <template v-slot:body:before="{item}">
              <th>{{ item.id }}</th>
               <td>
                <router-link
                  :to="`/workplaces/pharmacy/view/${item.id}`"
                  class="btn btn-sm btn-info"
                >
                  <span><i class="fa fa-eye"></i></span>
                </router-link>
                <router-link
                  :to="`/workplaces/pharmacy/edit/${item.id}`"
                  class="btn btn-sm btn-warning"
                >
                  <span><i class="fa fa-edit"></i></span>
                </router-link>
              </td>
            </template>
            <template v-slot:head>
              <th>Visits</th>
              <th>Address</th>
              <th>Brick</th>
              <th>Area</th>
            </template>
            <template v-slot:body="{ item }">
              <td>{{ item.report.length }}</td>
              <td>{{ item.address }}</td>
              <td>{{ item.brick }}</td>
              <td>{{ item.area }}</td>

            </template>
          </table-component>
        </div>
        <div class="text-center" v-else-if="fetched">
          <no-data-to-show>
            <router-link
              to="/workplaces/add-pharmacy"
              class="btn btn-success btn-sm"
            >
              <span><i class="fa fa-plus-circle"></i></span>
              <span>Add new Pharmacy</span>
            </router-link>
          </no-data-to-show>
        </div>
        <loader-component v-else />
      </div>
    </div>
  </div>
</template>

<script>
import TableComponent from "../../../components/TableComponent";
import NoDataToShow from "../../../components/NoDataToShow";
export default {
  created() {
    this.$store.dispatch("pharmacyGetAll");
  },
  components: {
    TableComponent,
    NoDataToShow
  },
  computed: {
    pharmacies() {
      return this.$store.getters.pharmacies;
    },
    fetched() {
      return this.$store.getters.isPharmacyFetched;
    }
  },
  data: () => ({
    heads: [
      {
        title: "ID",
        name: "id"
      },
      {
        title: "Name",
        name: "name"
      },
      {
        title: "Type",
        name: "type"
      },
      {
        title: "Key Person",
        name: "key_person"
      },

    ]
  })
};
</script>

<style></style>

<template>
  <div>
    <div class="px-0 shadow">
      <p class="alert alert-success">
        <span><i class="fa fa-hospital-symbol"></i></span>
        <span class="font-weight-bold">Hospitals List</span>
      </p>
      <div class="my-2 p-3">
        <table-component
          :data="hospitals"
          :heads="heads"
          headClass="bg-success text-light"
          v-if="hospitals.length"
        >
        <template v-slot:head:before>
          <th>actions</th>
        </template>
        <template v-slot:body:before="{item}">
          <td>
            <router-link :to="`/workplaces/view/hospital/${item.id}`">
              <span class="fa fa-eye"></span>
            </router-link>
          </td>
        </template>
        </table-component>
        <div v-else class="text-center p-3">
          <loader-component />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TableComponent from "../../../components/TableComponent";
export default {
  computed: {
    hospitals() {
      return this.$store.getters.hospitals;
    },
    isFetched() {
      return this.$store.getters.isHospitalsFetched;
    }
  },
  components: {
    TableComponent
  },
  data: () =>({
    heads: [
      {
        title: 'Name',
        name: 'name'
      },
      {
        title: 'Area',
        name: 'area'
      },
      {
        title: 'Brick',
        name: 'brick'
      },
      {
        title:'Address',
        name:'address'
      },
      {
        title:'Pharmacy Type',
        name:'type'
      }
    ]
  })
}
</script>

<style>

</style>

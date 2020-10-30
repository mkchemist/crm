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
        <!-- <hospital-table :data="all" /> -->
        <table-component :heads="heads" :data="all" head-class="bg-success text-light">
          <template v-slot:head>
            <th>Actions</th>
          </template>
          <template v-slot:body="{ item }">
            <td>
              <router-link :to="`/workplaces/hospital/view/${item.id}`" class="btn btn-sm btn-info">
                <span><i class="fa fa-eye"></i></span>
              </router-link>
               <router-link :to="`/workplaces/hospital/edit/${item.id}`" class="btn btn-sm btn-warning">
                <span><i class="fa fa-edit"></i></span>
              </router-link>
            </td>
          </template>
        </table-component>
      </div>
      <loader-component v-else />
    </div>
  </div>
</template>

<script>
import TableComponent from "../../../components/TableComponent";
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
    TableComponent
  },
  data: () => ({
    heads: [
      {
        title: 'ID',
        name: 'id'
      },
      {
        title: 'Name',
        name: 'name'
      },
      {
        title: 'Type',
        name: 'type'
      },
      {
        title: 'Address',
        name: 'address'
      },
      {
        title: 'Phone',
        name: 'phone'
      },
      {
        title: 'Brick',
        name: 'brick'
      },
      {
        title: 'Area',
        name: 'area'
      },
      {
        title: 'State',
        name: 'state'
      }
    ]
  })
};
</script>

<style>
</style>

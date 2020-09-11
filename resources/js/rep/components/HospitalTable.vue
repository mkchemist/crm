<template>
  <table
    class="table table-striped table-sm small table-responsive"
    id="data-table"
  >
    <thead>
      <tr class="bg-success text-light">
        <th>Name</th>
        <th>Type</th>
        <th>Address</th>
        <th>Brick</th>
        <th>Area</th>
        <th>State</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="workplace in data" :key="workplace.id">
        <td>{{ workplace.name }}</td>
        <td>{{ workplace.type }}</td>
        <td>{{ workplace.address }}</td>
        <td>{{ workplace.brick }}</td>
        <td>{{ workplace.area }}</td>
        <td>{{ workplace.state }}</td>
        <td>
          <router-link
            :to="`/workplaces/view/${workplace.id}`"
            class="btn btn-sm btn-info"
          >
            <span><i class="fa fa-eye"></i></span>
          </router-link>
          <router-link
            :to="`/workplaces/edit/${workplace.id}`"
            class="btn btn-sm btn-warning"
          >
            <span><i class="fa fa-edit"></i></span>
          </router-link>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: ["data"],
  data: () =>({
    table: null
  }),
  mounted() {
    this.table = $("#data-table").DataTable({
      order: [[0, "asc"]],
      language: {
        searchPlaceholder: "Search..."
      },
      lengthMenu: [20, 50, 100],
      dom: "Bflrtip",
      fixedHeader: {
        header: true,
        footer: true
      },
      buttons: [
        {
          extend: "excel",
          text: '<i class="fa fa-file-excel"></i> Excel'
        },
        {
          extend: "pdf",
          text: '<i class="fa fa-file-pdf"></i> PDF'
        }
      ]
    });
  },
  destroyed(){
    this.table.destroy();
  }
};
</script>

<style lang="scss" scoped>
  td,th,tr {
    white-space: nowrap;
  }
</style>

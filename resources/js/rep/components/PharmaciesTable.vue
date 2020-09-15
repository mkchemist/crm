<template>
  <div>
    <table class="table table-sm table-striped small table-responsive" id="data-table">
      <thead>
        <tr class="bg-success text-light">
          <th>Name</th>
          <th>Type</th>
          <th>Key Person</th>
          <th>Address</th>
          <th>Brick</th>
          <th>Area</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.key_person }}</td>
          <td>{{ item.address }}</td>
          <td>{{ item.brick }}</td>
          <td>{{ item.area }}</td>
          <td>
            <router-link :to="`/workplaces/pharmacy/view/${item.id}`" class="btn btn-sm btn-info">
              <span><i class="fa fa-eye"></i></span>
            </router-link>
            <router-link :to="`/workplaces/pharmacy/edit/${item.id}`" class="btn btn-sm btn-warning">
              <span><i class="fa fa-edit"></i></span>
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: ['data'],
  data: () => ({
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
  destroyed() {
    this.table.destroy();
  }
}
</script>

<style lang="scss" scoped>
</style>

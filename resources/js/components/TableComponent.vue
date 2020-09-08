<template>
  <div>
    <table class="table table-striped table-sm small shadow" id="data-table">
      <thead>
        <tr class="bg-success text-white">
          <th v-for="(head, i) in headers" :key="i">{{ head.title }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row , i) in formattedData" :key="i">
          <td v-for="(item, i) in row" :key="i">{{ item }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: ['headers', 'data'],
  computed: {
    formattedData() {
      let tableData = [];
      this.data.forEach((item) => {
        let single = [];
        this.headers.forEach((head) => {
          let {title, name} = head;
          if(item[name]) {
            single.push(item[name]);
          }
        });
        tableData.push(single);
      });
      return tableData;
    }
  },
  mounted() {
    $('#data-table').DataTable({
      order: [[0,'asc']],
      language: {
        searchPlaceholder: 'Search...'
      },
      lengthMenu:[20,50,100],
      buttons: [
        {
          extend: 'excel',
          text: '<i class="fa fa-file-excel"></i> Excel'
        },
        {
          extend: 'pdf',
          text: '<i class="fa fa-file-pdf"></i> PDF'
        }
      ],
      dom: 'Bflrtip'
    });
  }
}
</script>

<style>

</style>

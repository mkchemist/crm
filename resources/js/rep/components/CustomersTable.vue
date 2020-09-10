<template>
  <div class="p-2 shadow table-wrapper">
    <table class="table table-striped table-sm small" id="customers-table">
      <thead>
        <tr>
          <th>id</th>
          <th>Name</th>
          <th>Specialty</th>
          <th>title</th>
          <th>Param</th>
          <th>Current Freq.</th>
          <th>Next Freq.</th>
          <th>Address</th>
          <th>Brick</th>
          <th>Area</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="customer in data" :key="customer.id">
          <td>{{ customer.id }}</td>
          <td>{{ customer.name }}</td>
          <td>{{ customer.specialty }}</td>
          <td>{{ customer.title ? customer.title : "------" }}</td>
          <td>{{ customer.parameter }}</td>
          <td>{{ customer.current_freq }}</td>
          <td>{{ customer.next_freq }}</td>
          <td>{{ customer.address }}</td>
          <td>{{ customer.brick }}</td>
          <td>{{ customer.area }}</td>
          <td>
            <router-link
              :to="`/customers/view/${customer.id}`"
              class="btn btn-sm btn-info"
            >
              <span><i class="fa fa-eye"></i></span>
            </router-link>
            <router-link
              :to="`/customers/edit/${customer.id}`"
              class="btn btn-sm btn-warning"
            >
              <span><i class="fa fa-edit"></i></span>
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { httpCall } from '../helpers/http-service';
export default {
  props: ["data", "withFavorite"],
  data: () => ({
    table: null
  }),
  mounted() {
    let buttons = [
      {
        extend: "excel",
        text: '<i class="fa fa-file-excel"></i> Excel'
      },
      {
        extend: "pdf",
        text: '<i class="fa fa-file-pdf"></i> PDF'
      }
    ];
    buttons = this.addFavoriteButton(buttons);
    this.table = $("#customers-table").DataTable({
      columnDefs: [{ targets: 0, visible: false }],
      order: [[1, "asc"]],
      language: {
        searchPlaceholder: "Search..."
      },
      lengthMenu: [20, 50, 100],
      buttons,
      dom: "Bflrtip",
      select: {
        style: 'single'
      }
    });
  },
  methods: {
    addFavoriteButton(buttons) {
      let _this = this;
      if (this.withFavorite) {
        buttons.push({
          text: '<i class="fa fa-star"></i> Favorite',
          action: function(e, dt, node, config) {
            let cId = dt.row({selected: true}).data()[0];
            httpCall.post('rep/v1/customers-favorite-list',{id:cId})
            .then(({data}) => {
              if(data.code === 400) {
                data.data.errors.forEach((err) => {
                  _this.$toasted.show(err, {
                    icon : 'exclamation',
                    duration: 10000
                  })
                });
                return;
              }
              if(data.code === 203) {
                data.data.errors.forEach((err) => {
                  _this.$toasted.show(err, {
                    icon : 'exclamation',
                    duration: 10000
                  })
                })
                return;
              }
              _this.$toasted.show(data.data, {
                type: 'success',
                icon: 'check'
              });
            });
          }
        });
      }
      return buttons;
    }
  },
  destroyed() {
    this.table.destroy()
  }
};
</script>

<style lang="scss" scoped>
td,
tr,
th {
  white-space: nowrap;
}
.table-wrapper {
  overflow: auto;
}
</style>

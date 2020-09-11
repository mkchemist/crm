<template>
  <div class="p-2 shadow table-wrapper">
    <table class="table table-striped table-sm small" id="customers-table">
      <thead>
        <tr class="bg-success text-light">
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
import { httpCall } from "../helpers/http-service";
export default {
  props: ["data", "withFavorite", "withUnlink", "onUnlink"],
  data: () => ({
    table: null
  }),
  mounted() {
    this.createTable();
  },
  methods: {
    /**
     * create datatable instance
     *
     *
     */
    createTable() {
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
      buttons = this.addUnlinkButton(buttons);
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
          style: "single"
        },
        fixedHeader: {
          header: true,
          footer: true
        }
      });
    },
    /**
     * add favorite button
     *
     * @param {array} buttons [buttons container]
     * @return {array}
     */
    addFavoriteButton(buttons) {
      /**
       * Vue component instance
       */
      let _this = this;
      /**
       * check if props of withFavorite is true
       * if true add favorite button
       * set button action to call favorite list api
       * and selected customer to favorite list
       *
       *
       */
      if (this.withFavorite) {
        buttons.push({
          text: '<i class="fa fa-star"></i> Favorite',
          action: function(e, dt, node, config) {
            /** get selected customer id from datatable api  */
            let cId = dt.row({ selected: true }).data()[0];
            /** call favorite list api */
            httpCall
              .post("rep/v1/customers-favorite-list", { id: cId })
              .then(({ data }) => {
                /**
                 * handle  response
                 *
                 * if the sent id is not numeric
                 */
                if (data.code === 400) {
                  data.data.errors.forEach(err => {
                    _this.$toasted.show(err, {
                      icon: "exclamation",
                      duration: 10000
                    });
                  });
                  return;
                }
                /**
                 * handle reponse
                 *
                 * if customer id is invalid
                 */
                if (data.code === 203) {
                  data.data.errors.forEach(err => {
                    _this.$toasted.show(err, {
                      icon: "exclamation",
                      duration: 10000
                    });
                  });
                  return;
                }
                /**
                 * success response
                 *
                 * show taost
                 */
                _this.$toasted.show(data.data, {
                  type: "success",
                  icon: "check"
                });
              });
          }
        });
      }
      return buttons;
    },
    addUnlinkButton(buttons) {
      /** vue component instance */
      let _this = this;
      /**
       * if withUnlink props is true
       *
       */
      if (this.withUnlink) {
        buttons.push({
          text: '<i class="fa fa-unlink"></i> unlink',
          action: function(e, dt) {
            /** get selected customer id */
            let id = dt.row({ selected: true }).data()[0];
            httpCall
              .post("rep/v1/customers-favorite-list/" + id, {
                _method: "DELETE"
              })
              .then(({ data }) => {
                /**
                 * handle response
                 *
                 * if bad request input
                 */
                if (data.code === 400) {
                  data.data.errors.forEach(err => {
                    _this.$toasted.show(err, {
                      icon: "exclamation",
                      duration: 10000
                    });
                  });
                  return;
                }
                /**
                 * handle success response
                 */
                _this.$toasted.show(data.data, {
                  type: "info",
                  icon: "check",
                  theme: "outline"
                });
                /**
                 * if there is onUnlink props that is must be
                 * a function to make any changes after http success
                 *
                 */
                if (_this.onUnlink) {
                  if (typeof _this.onUnlink === "function") {
                    _this.onUnlink.call();
                  }
                }
              });
          }
        });
      }
      return buttons;
    }
  },
  /**
   * when component destroyed
   * it will destroy DataTable instance
   *
   */
  destroyed() {
    this.table.destroy();
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

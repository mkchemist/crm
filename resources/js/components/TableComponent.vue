<template>
  <table
    :class="`table table-striped table-sm small bg-white ${notResponsive ?'' :'table-responsive'}`"
    id="data-table"
  >
    <thead>
      <tr :class="headClass">
        <th v-for="(head, i) in heads" :key="i">{{ head.title }}</th>
        <slot name="head"></slot>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, i) in data" :key="i">
        <!-- <td v-for="(head, i) in heads" :key="i">{{ item[head.name] }}</td> -->
        <td v-for="(head, i) in heads" :key="i">{{ _notation(item, head.name)}}</td>
        <slot name="body" :item="item"></slot>
      </tr>
    </tbody>
  </table>
</template>

<script>
import {httpCall} from "../rep/helpers/http-service";
import { ObjectNotation } from "../rep/helpers/helpers"
export default {
  props: ["heads", "data", "headClass",'withFavorite', 'withUnlink','onUnlink', 'orderBy', 'notResponsive'],
  data: () => ({
    table: null
  }),
  mounted() {
    this.createTable();
  },
  methods: {
    _notation(container, key){
      return ObjectNotation(container, key)
    },
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
      this.table = $("#data-table").DataTable({
        order: this.ordering(),
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
    },
    /**
     * ordering table header
     *
     */
    ordering() {
      if(!this.orderBy) {
        return [[1, 'asc']]
      }
      let $orderBy=this.orderBy;
      let order = [];
      $orderBy = $orderBy.split('|');
      $orderBy.forEach((item) => {
        let parts = item.split(',');
        this.heads.forEach((head, i) => {
          if(head.title === parts[0]) {
            let dir = parts[1] ? parts[1] : 'asc'
            order.push([i,dir])
          }
        })
      });
      return order;
    }
  },
  destroyed() {
    this.table.destroy();
  }
};
</script>

<style>
</style>

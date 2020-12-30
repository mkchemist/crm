<template>
  <div>
    <table
      :class="
        `table table-striped table-sm small bg-white ${
          notResponsive ? '' : 'table-responsive'
        }`
      "
      :id="id ? id:`data-table`"
      v-if="rows.length"
    >
      <thead>
        <tr :class="headClass">
          <slot name="head:before"></slot>
          <th v-for="(head, i) in heads" :key="i">{{ head.title }}</th>
          <slot name="head"></slot>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in rows" :key="i">
          <!-- <td v-for="(head, i) in heads" :key="i">{{ item[head.name] }}</td> -->
          <slot name="body:before" :item="item"></slot>
          <td v-for="(head, i) in heads" :key="i" :class="`${head.style ? head.style : ''}`">
            {{ _notation(item, head.name, head.fallback) }}
          </td>
          <slot name="body" :item="item"></slot>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { httpCall } from "../helpers/http-service";
import { ObjectNotation } from "../helpers/helpers";
export default {
  props: [
    "heads",
    "data",
    "headClass",
    "withFavorite",
    "withUnlink",
    "onUnlink",
    "orderBy",
    "notResponsive",
    "actionCell",
    "unselectable",
    "id"
  ],
  data: () => ({
    table: null
  }),
  mounted() {
    this.createTable();
  },
  computed: {
    rows() {
      return this.data;
    }
  },
  methods: {
    _notation(container, key, $default) {
      return ObjectNotation(container, key, $default);
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
      let select = this.unselectable ? false : {style: 'single'}
      this.table = $(`#${this.id ? this.id : 'data-table'}`).DataTable({
        order: this.ordering(),
        language: {
          searchPlaceholder: "Search..."
        },
        lengthMenu: [20, 50, 100],
        buttons,
        dom: "Bflirtp",
        select,
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
            let index = _this.actionCell ? _this.actionCell : 0;
            /** get selected customer id from datatable api  */
            let cId = dt.row({ selected: true }).data()[index];
            /** call favorite list api */
            httpCall
              .post("customers-favorite-list", { id: cId })
              .then(({ data }) => {
                data.message = data.data;
                _this.handleResponse(data);
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
              .post("customers-favorite-list/" + id, {
                _method: "DELETE"
              })
              .then(({ data }) => {
                data.message = data.data;
                _this.handleResponse(data, data => {
                  if (_this.onUnlink) {
                    if (typeof _this.onUnlink === "function") {
                      _this.onUnlink.call();
                    }
                  }
                });
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
      if (!this.orderBy) {
        return [[1, "asc"]];
      }
      let $orderBy = this.orderBy;
      let order = [];
      $orderBy = $orderBy.split("|");
      $orderBy.forEach(item => {
        let parts = item.split(",");
        this.heads.forEach((head, i) => {
          if (head.title === parts[0]) {
            let dir = parts[1] ? parts[1] : "asc";
            order.push([i, dir]);
          }
        });
      });
      return order;
    }
  },
  destroyed() {
    this.table.destroy();
  }
};
</script>

<style></style>

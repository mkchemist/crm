<template>
  <div>
    <table
      :class="
        `table table-striped table-sm small bg-white ${
          notResponsive ? '' : 'table-responsive'
        }`
      "
      :id="id ? id : `data-table`"
      v-if="rows.length"
    >
      <thead>
        <tr :class="headClass">
          <slot name="head:before"></slot>
          <th v-for="(head, i) in heads" :key="i">{{ head.title }}</th>
          <slot name="head"></slot>
        </tr>
      </thead>
      <tbody style="max-height:600px;overflow:auto">
        <tr v-for="(item, i) in rows" :key="i">
          <!-- <td v-for="(head, i) in heads" :key="i">{{ item[head.name] }}</td> -->
          <slot name="body:before" :item="item"></slot>
          <td
            v-for="(head, i) in heads"
            :key="i"
            :class="`${head.style ? head.style : ''}`"
          >
            {{ _notation(item, head.name, head.fallback) }}
          </td>
          <slot name="body" :item="item"></slot>
        </tr>
      </tbody>
    </table>
    <div class="modal" id="group_by_modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <span class="">Group data</span>
            <button class="close" data-dismiss="modal">&times;</button>
          </div>
          <div class="modal-body">
            <div class="border p-2">
              <ul class="nav">
                <li
                  v-for="(col, i) in heads"
                  :key="`col_${i}`"
                  class="nav-item small col-lg-6"
                >
                  <input type="checkbox" :value="i+1" v-model="groupBy" />
                  <span>{{ col.title }}</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="modal-footer">
            <button
              class="btn btn-sm btn-primary"
              type="button"
              @click="saveNewGroupBy"
            >
              <span class="fa fa-check-circle"></span>
              <span>Ok</span>
            </button>
            <button class="btn btn-sm btn-danger" data-dismiss="modal">
              <span class="fa fa-times"></span>
              <span>cancel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
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
    "id",
    "responsive"
  ],
  data: () => ({
    table: null,
    groupBy: []
  }),
  mounted() {
    this.createTable();
  },
  computed: {
    rows() {
      return this.data;
    },
    hasGroupByExt() {
      if (!this.groupBy.length) {
        return {};
      }
      return {
        rowGroup: {
          dataSrc: this.groupBy
        }
      };
    },
    generateExportFileName() {
      try {
        let user = document.getElementById("user").value;
        user = JSON.parse(user);
        user = user.name;
        let route = this.$route.path.split("/").join("_");
        return `${user}_${route}_${new Date()
          .toLocaleDateString()
          .replace(/\//gm, "_")}`;
      } catch (e) {
        console.log(e);
        return "";
      }
    }
  },
  methods: {
    _notation(container, key, $default) {
      return ObjectNotation(container, key, $default);
    },
    /**
     * create data table instance
     *
     *
     */
    createTable() {
      let buttons = [
        {
          extend: "excel",
          text: '<i class="fa fa-file-excel"></i> Excel',
           filename: this.generateExportFileName,
          messageTop: "This Table Export From NPMT CRM System",
          title: this.generateExportFileName,
          sheetName: 'Export'
        },
        {
          extend: "pdf",
          text: '<i class="fa fa-file-pdf"></i> PDF'
        },
        {
          text: "Group By",
          action: () => {
            $("#group_by_modal").modal({ show: true });
          }
        }
      ];

      buttons = this.addFavoriteButton(buttons);
      buttons = this.addUnlinkButton(buttons);
      let select = this.unselectable ? false : { style: "single" };
      this.table = $(`#${this.id ? this.id : "data-table"}`).DataTable({
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
        },
        responsive: this.responsive,
        colReorder: true,
        ...this.hasGroupByExt,
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
    },
    saveNewGroupBy() {
      this.table.destroy();
      this.createTable();
      $("#group_by_modal").modal("hide");
    }
  },
  destroyed() {
    /* this.table.destroy(); */
  }
};
</script>

<style></style>

<template>
  <div class="data-table__container">
    <table :class="tableClass" :id="tableId">
      <thead :class="tableHeadClass">
        <tr>
          <th v-for="(col, i) in cols" :key="`col_${i}`">{{ col.title }}</th>
        </tr>
      </thead>
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
                  v-for="(col, i) in cols"
                  :key="`col_${i}`"
                  class="nav-item small col-lg-6"
                >
                  <input type="checkbox" :value="col.name" v-model="groupBy" />
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
export default {
  props: {
    data: {
      type: Array | Object,
      required: true
    },
    cols: {
      type: Array,
      required: true
    },
    tableClass: {
      type: String,
      default: () =>
        "table table-striped table-sm small bg-white table-responsive"
    },
    tableId: {
      type: String,
      default: () => "myTable"
    },
    tableHeadClass: {
      type: String,
      default: () => "bg-success text-light"
    },
    tableResponsive: {
      type: Boolean,
      default: () => true
    },
    buttons: {
      type: Array,
      default: () => []
    },
    notSearchCols: {
      type: Array,
      default: () => []
    },
    selectable: {
      type: Boolean,
      default: () => true
    },
    exportFileName: {
      type: String,
      default: () => null
    }
  },

  data: () => ({
    table: null,
    groupBy: []
  }),
  computed: {
    defaultButtons() {
      let defaultButtons = [
        {
          extend: "excel",
          text: '<i class="fa fa-file-excel"></i> Excel',
          filename: this.generateExportFileName,
          messageTop: "This Table Export From NPMT CRM System",
          title: this.generateExportFileName,
          sheetName: 'Export'
        }
      ];
      return defaultButtons;
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
  watch: {
    data: function($new, $old) {
      this.table.destroy();
      this.createTable();
    }
  },
  mounted() {
    this.createTable();
  },
  methods: {
    createTable() {
      let cols = this.prepareDataColumns(this.cols);
      let groupByBtn = this.createGroupByButton;
      let buttons = [...this.defaultButtons, groupByBtn, ...this.buttons];

      let select = this.detectSelectionBehavior();

      this.table = $(`#${this.tableId}`).DataTable({
        data: this.data,
        columns: cols,
        buttons,
        select,
        dom: "Bflirtp",
        lengthMenu: [20, 50, 100,150,200],
        deferRender: true,
        language: {
          searchPlaceholder: "Search ..."
        },
        ...this.hasGroupByExt,
        colReorder: true
      });
    },
    prepareDataColumns(data) {
      let cols = [];
      this.cols.map(col => {
        let data = {
          data: col.name,
          searchable: true,
          className: col.style || "",
          visible: col.visible,
          defaultContent: "--------------"
        };
        if (this.notSearchCols.includes(col.nam)) {
          data["searchable"] = false;
        }
        if (col.renderAs) {
          data["fnCreatedCell"] = col.renderAs;
        }
        cols.push(data);
      });
      return cols;
    },
    detectSelectionBehavior() {
      let select = false;
      if (this.selectable) {
        select = {
          style: "single"
        };
      }
      return select;
    },
    createGroupByButton() {
      return {
        text: "<span class='fa fa-layer-group mx-1'></span>Group By",
        action: () => {
          $("#group_by_modal").modal({ show: true });
        }
      };
    },
    saveNewGroupBy() {
      this.table.destroy();
      this.createTable();
      $("#group_by_modal").modal("hide");
    }
  },
  destroyed() {
    this.table.destroy();
  }
};
</script>

<style lang="scss">
.data-table__container {
  overflow-x: auto !important;
}
.dtrg-group {
  td {
    font-weight: bold !important;
    color: royalblue !important;
  }
}
</style>

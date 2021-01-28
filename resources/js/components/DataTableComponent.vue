<template>
  <div class="data-table__container">
    <table :class="tableClass" :id="tableId">
      <thead :class="tableHeadClass">
        <tr>
          <th v-for="(col, i) in cols" :key="`col_${i}`">{{ col.title }}</th>
        </tr>
      </thead>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
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
    }
  },
  data: () => ({
    defaultButtons: [
      {
        extend: "excel",
        text: '<i class="fa fa-file-excel"></i> Excel'
      }
    ]
  }),
  mounted() {
    let cols = this.prepareDataColumns(this.cols);
    let buttons = [...this.defaultButtons, ...this.buttons];

    let select = this.detectSelectionBehavior();

    $(`#${this.tableId}`).DataTable({
      data: this.data,
      columns: cols,
      buttons,
      select,
      dom: "Bflirtp",
      lengthMenu: [20, 50, 100],
      deferRender: true,
      language: {
        searchPlaceholder: 'Search ...'
      }
    });
  },
  methods: {
    prepareDataColumns(data) {
      let cols = [];
      this.cols.map(col => {
        let data = {
          data: col.name,
          searchable: true,
          className: col.style || "",
          visible: col.visible
        };
        if (this.notSearchCols.includes(col.nam)) {
          data["searchable"] = false;
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
    }
  }
};
</script>

<style lang="scss" scoped>
.data-table__container {
  overflow-x: scroll !important;
}
</style>

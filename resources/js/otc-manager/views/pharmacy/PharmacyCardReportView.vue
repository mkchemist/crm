<template>
  <div class="px-0 shadow rounded">
    <p class="alert alert-success">
      <span>Pharmacy Reports</span>
    </p>
    <div class="p-2">
      <data-table-component :cols="cols" :data="reports" :selectable="false" />
    </div>
  </div>
</template>

<script>
const {
  default: DataTableComponent
} = require("../../../components/DataTableComponent.vue");

export default {
  components: { DataTableComponent },
  computed: {
    reports() {
      let data = this.$attrs.data;
      let reports = data.otc_report.filter(item => item.type === "regular");
      reports.forEach(item => {
        item.name = data.name;
        item.address = data.address;
        item.brick = data.brick;
        item.area = data.area;
        item.district = data.district;
        item.territory = data.territory;
      });
      return reports;
    }
  },
  data: () => ({
    cols: [
      {
        title: "Name",
        name: "name"
      },
      {
        title: "Date",
        name: "visit_date"
      },
      {
        title: "Product",
        name: "product"
      },
      {
        title: "Rate",
        name: "rate"
      },
      {
        title: "Stock",
        name: "stock"
      },
      {
        title: "Order",
        name: "order"
      },
      {
        title: "Distributor",
        name: "distributor"
      },
      {
        title: "Competitor 1",
        name: "competitor1"
      },
      {
        title: "Competitor 1 Rate",
        name: "competitor1_rate"
      },
      {
        title: "Competitor 1 Stock",
        name: "competitor1_stock"
      },
      {
        title: "Competitor 2",
        name: "competitor2"
      },
      {
        title: "Competitor 2 Rate",
        name: "competitor2_rate"
      },
      {
        title: "Competitor 2 Stock",
        name: "competitor2_stock"
      },
      {
        title: "Competitor 3",
        name: "competitor3"
      },
      {
        title: "Competitor 3 Rate",
        name: "competitor3_rate"
      },
      {
        title: "Competitor 3 Stock",
        name: "competitor3_stock"
      },
      {
        title: "Feedback",
        name: "general_feedback"
      },
      {
        title: "Address",
        name: "address"
      },
      {
        title: "Brick",
        name: "brick"
      },
      {
        title: "Area",
        name: "area"
      },
      {
        title: "District",
        name: "district"
      },
      {
        title: "Territory",
        name: "territory"
      }
    ]
  })
};
</script>

<style></style>

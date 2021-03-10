<template>
  <div>
    <div class="px-0 shadow rounded">
      <page-title-component :title="`Table View`" :icon="`fa-table`" />

      <div class="p-2" v-if="reports.length">
        <data-table-component :data="reports" :cols="cols" :buttons="buttons" />
      </div>
      <div class="p-5 text-center " v-else>
        <no-data-to-show />
        <button type="button" class="btn btn-sm btn-dark" @click="onReset">
          <span class="fa fa-redo"></span>
          <span>Reset Filter</span>
        </button>
      </div>
      <data-filter-box
        :show="showFilterBox"
        :data="reports"
        :queryOnly="false"
        :onReset="onReset"
        :onFilter="onFilter"
        :onClose="closeFilterBox"
        :queryKeys="queryKeys"
      />
    </div>
  </div>
</template>

<script>
import DataFilterBox from "../../../../components/DataFilterBox.vue";
import DataTableComponent from "../../../../components/DataTableComponent.vue";
import NoDataToShow from '../../../../components/NoDataToShow.vue';
import PageTitleComponent from "../../../../components/PageTitleComponent.vue";
import { asyncDataFlow } from "../../../../helpers/http-service";
export default {
  components: { PageTitleComponent, DataTableComponent, DataFilterBox, NoDataToShow },
  computed: {
    reports() {
      if (this.shouldRenderFilter) {
        return this.filteredList;
      }
      return this.$attrs.data;
    },
    user() {
      return this.$store.getters.user;
    },
    buttons() {
      let refreshList = {
        text: `<i class="fa fa-redo"></i>`,
        action: () => {
          if (this.user.role === "otc-manager") {
            this.$store.dispatch("fetchReports", { force: true });
          } else {
            this.$store.dispatch("fetchPharmacyReports", { force: true });
          }
        }
      };

      let editButton = {
        text: `<i class="fa fa-edit"></i>`,
        action: (e, dt) => {
          let row = dt.rows({ selected: true }).data()[0];
          if (!row) {
            this.$toasted.info("Select Report first");
            return;
          }
          this.$router.push("/reports/edit/pharmacy/" + row.id);
        }
      };

      let removeButton = {
        text: `<i class="fa fa-trash"></i>`,
        action: (e, dt) => {
          let row = dt.rows({ selected: true }).data()[0];
          if (!row) {
            this.$toasted.info("Select Report first");
            return;
          }
          let confirmation = confirm("Do you want to delete this report");
          if (confirmation) {
            httpCall
              .post("otc-rep/v1/reports/pharmacy/" + row.id, {
                _method: "DELETE"
              })
              .then(({ data }) => {
                this.handleResponse(data, data => {
                  this.$store.dispatch("fetchPharmacyReports", { force: true });
                });
              })
              .catch(err => console.log(err));
          }
        }
      };

      let filterButton = {
        text: `<i class="fa fa-filter"></i>`,
        action: () => this.openFilterBox()
      };

      let buttons = [refreshList];
      if (this.user.role !== "otc-manager") {
        buttons.push(editButton, removeButton);
      }
      buttons.push(filterButton);
      return buttons;
    }
  },
  data: () => ({
    cols: [
      {
        title: "Rep",
        name: "user"
      },
      {
        title: "Pharmacy",
        name: "pharmacy"
      },
      {
        title: "Date",
        name: "date"
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
        title: "Consumption Type",
        name: "product_type"
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
        title: "Order Distributor",
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
        title: "Competitor 1 consumption type",
        name: "competitor1_type"
      },
      {
        title: "Competitor 2 stock",
        name: "competitor2_stock"
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
        title: "Competitor 2 consumption type",
        name: "competitor2_type"
      },
      {
        title: "Competitor 2 stock",
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
        title: "Competitor 3 consumption type",
        name: "competitor3_type"
      },
      {
        title: "Competitor 3 stock",
        name: "competitor3_stock"
      },
      {
        title: "Comment",
        name: "comment"
      },
      {
        title: "Feedback",
        name: "feedback"
      },
      {
        title: "Pharmacy Type",
        name: "type"
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
    ],
    queryKeys: [
      {
        title: "Rep",
        name: "user"
      },
      {
        title: "Date",
        name: "date"
      },
      {
        title: "Product",
        name: "product"
      },
      {
        title: "Product Rate",
        name: "rate"
      },
      {
        title: "Consumption Type",
        name: "product_type"
      },
      {
        title: "Order",
        name: "order"
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
    ],
    showFilterBox: false,
    shouldRenderFilter: false,
    filteredList: []
  }),
  methods: {
    openFilterBox() {
      this.showFilterBox = true;
    },
    closeFilterBox() {
      this.showFilterBox = false;
    },
    onFilter(q, data) {
      this.filteredList = [];
        this.shouldRenderFilter = true;
      asyncDataFlow(data, data => {
        this.shouldRenderFilter = true;
        this.filteredList = data;
      });
    },
    onReset() {
      this.filteredList = [];
      asyncDataFlow(this.$attrs.data, data => {
        setTimeout(() => {
          this.filteredList = data;
        }, 100)
      });
    }
  }
};
</script>

<style></style>

<template>
  <div>
    <div class="px-0 shadow rounded pb-5">
      <page-title-component title="Health Day Reports" icon="fa-medical" />
      <div class="row mx-auto">
        <div class="col-lg-3">
          <cycle-selection :onSelect="onCycleSelect" :onReset="onCycleReset" />
          <button type="button" class="btn btn-sm btn-block btn-primary my-1" @click="onCycleSelect">
            <span class="fa fa-redo"></span>
            <span>Refresh list</span>
          </button>
          <router-link to="/reports" class="btn btn-sm btn-block btn-dark">
            <span class="fa fa-chevron-circle-left"></span>
            <span>Back</span>
          </router-link>
        </div>
        <div class="col-lg-9">
          <div class="p-2">
            <div v-if="reports.length && fetched">
              <data-table-component
                :cols="cols"
                :data="reports"
                :buttons="buttons"
              />
            </div>
            <div v-else-if="fetched">
              <no-data-to-show :title="`No health day reports found`" />
            </div>
            <loader-component v-else></loader-component>
          </div>
        </div>
      </div>
    </div>
    <data-filter-box
      :show="showFilterBox"
      :onClose="closeFilterBox"
      :onFilter="onFilter"
      :onReset="onResetFilter"
      :queryOnly="false"
      :queryKeys="queryKeys"
      :data="reports"
    />
  </div>
</template>

<script>
import CycleSelection from "../../../components/CycleSelection.vue";
import DataFilterBox from "../../../components/DataFilterBox.vue";
import DataTableComponent from "../../../components/DataTableComponent.vue";
import NoDataToShow from "../../../components/NoDataToShow.vue";
import PageTitleComponent from "../../../components/PageTitleComponent.vue";
import { asyncDataFlow } from "../../../helpers/http-service";
export default {
  mounted() {
    Promise.all([this.$store.dispatch("fetchReports")]);
  },
  components: {
    PageTitleComponent,
    CycleSelection,
    NoDataToShow,
    DataTableComponent,
    DataFilterBox
  },
  computed: {
    activeCycle() {
      return this.$store.getters.activeCycle;
    },
    reports() {
      if (this.shouldRenderFilter) {
        return this.filteredList;
      }
      return this.$store.getters.healthDayReports;
    },
    fetched() {
      return this.$store.getters.isReportsFetched;
    },
    buttons() {
      return [
        {
          text: `<i class="fa fa-redo"></i>`,
          action: () => this.onCycleSelect()
        },
        {
          text: `<i class="fa fa-filter"></i>`,
          action: () => this.openFilterBox()
        }
      ];
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
        title: "Total cases",
        name: "comment.no_cases"
      },
      {
        title: "Total consumed boxes",
        name: "comment.consumed"
      },
      {
        title: "Comment",
        name: "comment.summery"
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
    showFilterBox: false,
    shouldRenderFilter: false,
    filteredList: [],
    queryKeys: [
      {
        title: "Rep",
        name: "user"
      },
      {
        title: "Pharmacy",
        name: "pharmacy"
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
        title: "Pharmacy Type",
        name: "type"
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
  }),
  methods: {
    onCycleSelect() {
      let { start, end } = this.activeCycle;
      this.$store.dispatch("fetchReports", { force: true, start, end });
    },
    onCycleReset() {
      this.$store.commit("resetActiveCycle");
      this.onCycleSelect();
    },
    openFilterBox() {
      this.showFilterBox = true;
    },
    closeFilterBox() {
      this.showFilterBox = false;
    },
    onFilter(q, data) {
      this.filteredList = [];
      asyncDataFlow(data, data => {
        this.filteredList = data;
        this.shouldRenderFilter = true;
      });
    },
    onResetFilter() {
      this.filteredList = [];
      asyncDataFlow([], d => {
        this.filteredList = [];
        this.shouldRenderFilter = false;
      });
    }
  }
};
</script>

<style></style>

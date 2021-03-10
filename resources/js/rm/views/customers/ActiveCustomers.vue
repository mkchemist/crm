<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-success">
      <span class="fa fa-book-reader"></span>
      <span class="font-weight-bold">Active Customers</span>
    </p>
    <div class="p-2">
      <div v-if="isFetched">
        <data-table-component
          :data="customers"
          :cols="cols"
          :buttons="buttons"
        />
      </div>
      <loader-component
        :text="`Loading customers list`"
        v-else
      ></loader-component>
      <data-filter-box
        :show="showFilterBox"
        :onClose="closeFilterBox"
        :queryOnly="false"
        :queryKeys="queryKeys"
        :onFilter="onFilter"
        :onReset="onReset"
        :data="customers"
      />
    </div>
  </div>
</template>

<script>
import DataFilterBox from "../../../components/DataFilterBox.vue";
import DataTableComponent from "../../../components/DataTableComponent.vue";
import { asyncDataFlow } from "../../../helpers/http-service";
export default {
  components: {
    DataTableComponent,
    DataFilterBox
  },
  computed: {
    customers() {
      if (this.shouldRenderFilter) {
        return this.filteredList;
      }
      return this.rowCustomers;
    },
    rowCustomers() {
      let customers = this.$store.getters.activeCustomers;
      customers.forEach(customer => {
        customer["workplace"] = customer.workplace
          ? customer.workplace.name
          : null;
        customer['line'] = JSON.parse(customer.line).join(" | ")
        customer["missed"] = customer.reports - customer.plans;
        let { flag, style } = this.calculateCustomerStatus(customer);
        customer["status"] = flag;
        customer["style"] = style;
      });
      return customers;
    },
    isFetched() {
      return this.$store.getters.isActiveCustomersFetched;
    },

    buttons() {
      return [
        {
          text: '<i class="fa fa-book-reader"></i> View',
          action: (e, dt) => {
            let row = dt.rows({ selected: true }).data()[0];
            if (!row) {
              this.$toasted.error("You must select customer First");
              return;
            }
            this.$router.push("/customers/view/" + row.id);
          }
        },
        {
          text: `<i class="fa fa-filter"></i> filter`,
          action: () => this.openFilterBox()
        }
      ];
    }
  },
  data: () => ({
    cols: [
      {
        title: "ID",
        name: "id",
        visible: false
      },
      {
        title: "Rep",
        name: "rep"
      },
      {
        title: "Line",
        name: "line"
      },
      {
        title: "Name",
        name: "name"
      },
      {
        title: "Specialty",
        name: "specialty"
      },
      {
        title: "Workplace",
        name: "workplace"
      },
      {
        title: "Parameter",
        name: "parameter"
      },
      {
        title: "Frequency",
        name: "frequency"
      },
      {
        title: "Plans",
        name: "plans"
      },
      {
        title: "Reports",
        name: "reports"
      },
      {
        title: "Missed",
        name: "missed"
      },
      {
        title: "Status",
        name: "status",
        renderAs: (node, value, row) => {
          return $(node).html(`<span class="${row.style} p-1">${value}</span>`);
        }
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
        name: "rep"
      },
      {
        title: "Line",
        name: "line"
      },
      {
        title: "Specialty",
        name: "specialty"
      },
      {
        title: "Workplace",
        name: "workplace"
      },
      {
        title: "Parameter",
        name: "parameter"
      },
      {
        title: "Frequency",
        name: "frequency"
      },
      {
        title: "Plans",
        name: "plans"
      },
      {
        title: "Reports",
        name: "reports"
      },
      {
        title: "Missed",
        name: "missed"
      },
      {
        title: "Status",
        name: "status",
        renderAs: (node, value, row) => {
          return $(node).html(`<span class="${row.style} p-1">${value}</span>`);
        }
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
    calculateCustomerStatus(row) {
      let diff = row.reports - row.plans;
      let flag, style;
      if (diff === row.plans) {
        flag = "Uncovered";
        style = "bg-danger text-light";
      } else if (diff > 0) {
        flag = "Over";
        style = "bg-info text-dark";
      } else if (diff === 0) {
        flag = "Accomplished";
        style = "bg-success text-light";
      } else {
        flag = "Under";
        style = "bg-warning text-dark";
      }
      return { flag, style };
    },
    openFilterBox() {
      this.showFilterBox = true;
    },
    closeFilterBox() {
      this.showFilterBox = false;
    },
    onFilter(q, data) {
      this.shouldRenderFilter = true;
      asyncDataFlow(data, d => {
        this.filteredList = d;
      });
    },
    onReset() {
      this.filteredList = [];
      asyncDataFlow([], () => (this.shouldRenderFilter = false));
    }
  }
};
</script>

<style></style>

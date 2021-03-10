<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-success">
      <span class="fa fa-book-reader"></span>
      <span class="font-weight-bold">Inactive Customers</span>
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
        :text="`Loading inactive customers list`"
        v-else
      ></loader-component>
    </div>
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
</template>

<script>
import DataFilterBox from "../../../components/DataFilterBox.vue";
import DataTableComponent from "../../../components/DataTableComponent.vue";
import { asyncDataFlow } from "../../../helpers/http-service";
export default {
  mounted() {
    this.$store.dispatch("fetchInactiveCustomers");
  },
  components: {
    DataTableComponent,
    DataFilterBox
  },
  computed: {
    customers() {
      if (this.shouldRenderFilter) {
        return this.filteredList;
      }
      return this.rawCustomers;
    },
    rawCustomers() {
      let customers = this.$store.getters.inactiveCustomers;

      customers.forEach(customer => {
        customer["workplace"] = customer.workplace ? customer.workplace.name : null;
      });
      return customers;
    },
    isFetched() {
      return this.$store.getters.isInactiveCustomersFetched;
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
        title: "Specialty",
        name: "specialty"
      },
      {
        title: "Workplace",
        name: "workplace"
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
    shouldRenderFilter: false,
    filteredList: [],
    showFilterBox: false
  }),
  methods: {
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

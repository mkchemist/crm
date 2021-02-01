<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-success">
      <span class="fa fa-book-reader"></span>
      <span class="font-weight-bold">All Customers</span>
    </p>
    <div class="p-2">
      <div v-if="isFetched">
        <data-table-component :data="customers" :cols="cols" :buttons="buttons" />
      </div>
      <loader-component
        :text="`Loading page ${currentPage} of ${lastPage}`"
        v-else
      ></loader-component>
    </div>
  </div>
</template>

<script>
import DataTableComponent from "../../../components/DataTableComponent.vue";
export default {
  components: {
    DataTableComponent
  },
  computed: {
    customers() {
      return this.$store.getters.allCustomers;
    },
    isFetched() {
      return this.$store.getters.isCustomersFetched;
    },
    currentPage() {
      return this.$store.getters.customersCurrentPageLoading;
    },
     lastPage() {
      return this.$store.getters.customersLoadingLastPage;
    },
    buttons() {
      return [
        {
          text: 'View',
          className: 'view-btn',
          action: (e,dt) => {
            let row  = dt.rows({selected: true}).data()[0];
            if(!row) {
              this.$toasted.error('You must select customer First');
              return;
            }
            this.$router.push('/customers/view/'+row.id)
          }
        }
      ]
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
        title: "Parameter",
        name: "params[0].current"
      },
      {
        title: "Frequency",
        name: "frequency[0].current"
      },
      {
        title: "Plans",
        name: "planner.length"
      },
      {
        title: "Reports",
        name: "report.length"
      },
      {
        title: "Missed",
        name: row => {
          return row.report.length - row.planner.length;
        }
      },
      {
        title: "Status",
        name: row => {
          let diff = row.report.length - row.planner.length;
          let flag, style;
          if (diff === row.planner.length) {
            flag = "Uncovered";
            style = "bg-danger text-light";
          } else if (diff > 0) {
            flag = "Uncovered";
            style = "bg-danger text-light";
          } else if (diff === 0) {
            flag = "Uncovered";
            style = "bg-danger text-light";
          } else {
            flag = "Uncovered";
            style = "bg-danger text-light";
          }
          return `<span class="${style} p-1">${flag}<span>`;
        }
      },
      {
        title:'Address',
        name: 'address'
      },
      {
        title: 'Brick',
        name: 'brick'
      },
      {
        title: "Area",
        name: 'area'
      },
      {
        title: 'District',
        name: 'district'
      },
      {
        title: 'Territory',
        name: 'territory'
      }
    ]
  })
};
</script>

<style></style>

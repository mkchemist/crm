<template>
  <div class="px-0 shadow rounded pb-5">
    <page-title-component :title="`Shared Requests`" />
    <div class="p-2">
      <div v-if="requests.length">
        <data-table-component :data="requests" :cols="cols" :buttons="buttons" />
      </div>
      <div v-else-if="fetched">
        <no-data-to-show :title="`No Shared Requests Found`" />
      </div>
      <loader-component v-else></loader-component>
    </div>
  </div>
</template>

<script>
import DataTableComponent from "../../../../components/DataTableComponent.vue";
import NoDataToShow from "../../../../components/NoDataToShow.vue";
import PageTitleComponent from "../../../../components/PageTitleComponent.vue";
import { httpCall } from "../../../../helpers/http-service";
export default {
  components: {
    PageTitleComponent,
    NoDataToShow,
    DataTableComponent
  },
  mounted() {
    this.fetchRequests();
  },
  computed: {
    cols() {
      let cols = [
        {
          title: "Submitted",
          name: row => {
            let status;
            switch (row.state) {
              case "created":
                status = '<i class="fa fa-times text-danger"></i>';
                break;
              case "canceled":
                status = `<i class="fa fa-trash text-muted"></i>`;
                break;
              default:
                status = `<i class="fa fa-check text-success"></i>`;
            }
            return status;
          }
        },
        {
          title: "Status",
          name: "state"
        },
        {
          title: "Request",
          name: "type"
        },
        {
          title: "Serial",
          name: "serial"
        },
        {
          title: "Item",
          name: "comment.item"
        },
        {
          title: "Description",
          name: "comment.desc"
        },
        {
          title: "Others",
          name: "others"
        },
        {
          title: "Cost",
          name: row => row.cost / row.quantity
        },
        {
          title: "Quantity",
          name: "quantity"
        },
        {
          title: "Total Cost",
          name: row => row.cost
        },
        {
          title: "User",
          name: "user.name"
        },
        {
          title: "Role",
          name: "user.role"
        },
        {
          title: "Line",
          name: row => JSON.parse(row.user.line).join(" | ")
        },
        {
          title: "Query Date",
          name: "query_date"
        },
        {
          title: "Apply Date",
          name: "apply_date"
        },
        {
          title: "Customer",
          name: "customer.name"
        },
        {
          title: "Specialty",
          name: "customer.specialty"
        },
        {
          title: "Parameter",
          name: row => {
            return row.customer.params && row.customer.params.length
              ? row.customer.params[0].length
              : "NN";
          }
        },
        {
          title: "Product",
          name: "product"
        },
        {
          title: "Rx per months",
          name: "rx"
        },
        {
          title: "Rx duration",
          name: "rx_months"
        },
        {
          title: "Total Rx",
          name: row => row.rx * row.rx_months
        },
        {
          title: "Pharmacy 1",
          name: "pharmacy_1.name"
        },
        {
          title: "Pharmacy 2",
          name: "pharmacy_2.name"
        },
        {
          title: "Pharmacy 3",
          name: "pharmacy_3.name"
        },
        {
          title: "Pharmacy 4",
          name: "pharmacy_4.name"
        },
        {
          title: "Area Manager Approval",
          name: row => (row.am_approval ? "Yes" : "No")
        },
        {
          title: "Business Unit Approval",
          name: row => (row.rm_approval ? "Yes" : "No")
        },

        {
          title: "Brick",
          name: "customer.brick"
        },
        {
          title: "Area",
          name: "customer.area"
        },
        {
          title: "District",
          name: "customer.district"
        },
        {
          title: "Territory",
          name: "customer.territory"
        }
      ];
      return cols;
    },
    buttons() {
      let buttons = [
        {
          text: `<i class="fa fa-book-reader"></i> view`,
          action: (e, dt) => {
            let row = dt.rows({selected: true}).data()[0];
            if(!row) {
              this.$swal({
                title: "Warning",
                text: "Select a request to view",
                toast: true,
                icon: "warning"
              });
              return;
            }
            this.$router.push("/customers-requests/view/"+row.serial+"?withEdit=false&shared=true")
          }
        }
      ]
      return buttons;
    }
  },
  data: () => ({
    requests: [],
    fetched: false
  }),
  methods: {
    fetchRequests() {
      return httpCall
        .get("v1/requests/shared/list")
        .then(({ data }) => {
          data.data.forEach(item => {
            item.comment = JSON.parse(item.comment);
          });
          this.requests = data.data;
          this.fetched = true;
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style></style>

<template>
  <div>
    <div class="px-0 shadow">
      <p class="alert alert-success">
        <span><i class="fa fa-wave-square"></i></span>
        <span class="font-weight-bold">Frequency Approval</span>
      </p>
      <div class="p-2">
        <div class="p-2">
          <div class="">
            <button
              class="btn btn-sm btn-secondary"
              @click="approveFrequencyRequest"
              :disabled="!selected_customers.length"
            >
              <span>Approve</span>
              <span
                v-if="selected_customers.length"
                class="text-primary bg-light px-1 rounded-circle"
                >{{ selected_customers.length }}</span
              >
            </button>
            <button
              class="btn btn-sm btn-secondary"
              @click="rejectedFrequencyRequest"
              :disabled="!selected_customers.length"
            >
              <span>Reject</span>
              <span
                v-if="selected_customers.length"
                class="text-primary bg-light px-1 rounded-circle"
                >{{ selected_customers.length }}</span
              >
            </button>
          </div>
        </div>
        <div class="p-2 my-3 border rounded" id="request_table_container">
          <div  v-if="customers.length">
            <table-component
              :heads="heads"
              :data="customers"
              headClass="bg-success text-light"
            >
              <template v-slot:head:before>
                <th><input type="checkbox" @click="selectAll" /></th>
              </template>
              <template v-slot:head>
                <th>Date</th>
              </template>
              <template v-slot:body:before="{ item }">
                <td>
                  <input
                    type="checkbox"
                    :value="item.customer.id"
                    @click="selectCustomer(item.id)"
                  />
                </td>
              </template>
              <template v-slot:body="{ item }">
                <td>
                  {{ item.modified_at ? item.updated_at : item.created_at }}
                </td>
              </template>
            </table-component>
          </div>
          <div v-else-if="isFetched">
            <p class="text-dark lead text-center">No data to show</p>
          </div>
          <div v-else>
            <loader-component></loader-component>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { httpCall } from "../../../helpers/http-service";
import TableComponent from "../../../components/TableComponent";

export default {
  created() {
    this.fetchRequestList();
  },

  data: () => ({
    customers: [],
    isFetched: false,
    heads: [
      {
        title: "Rep",
        name: "user.name"
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
        name: "customer.get_user_params.0.current"
      },
      {
        title: "Area",
        name: "user.area"
      },
      {
        title: "Brick",
        name: "customer.brick"
      },
      {
        title: "From",
        name: "current"
      },
      {
        title: "To",
        name: "next"
      },
      {
        title: "Address",
        name: "customer.address"
      }
    ],
    selected_customers: [],
    request_state: null
  }),

  methods: {
    /**
     * fetching request frequency list
     *
     */
    fetchRequestList() {
      httpCall.get("dm/v1/approval/frequency").then(({ data }) => {
        data.message = "list loaded";
        this.handleResponse(data, data => {
          this.customers = data.data;
          this.isFetched = true;
        });
      });
    },
    /**
     * collect all customers request
     *
     */
    selectAll() {
      let checked = event.target.checked;
      let _inputs = Array.from(
        document.querySelectorAll(
          '#request_table_container input[type="checkbox"]'
        )
      );
      _inputs.map(input => {
        if (checked) {
          input.checked = true;
        } else {
          input.checked = false;
        }
      });
      if (checked) {
        this.selected_customers = this.customers.map(customer => customer.id);
      } else {
        this.selected_customers = [];
      }
    },
    /**
     * select customer
     *
     * @param {int} id
     */
    selectCustomer(id) {
      /** target element [clicked input] */
      let _target = event.target;
      let checked = _target.checked;
      if (checked) {
        if (!this.selected_customers.includes(id)) {
          this.selected_customers.push(id);
        }
      } else {
        if (this.selected_customers.includes(id)) {
          this.selected_customers.splice(
            this.selected_customers.indexOf(id),
            1
          );
        }
      }
    },
    /**
     * Approve Frequency
     */
    frequencyRequest() {
      if (!this.selected_customers.length) {
        this.$toasted.error("Error: select customers first");
        return;
      }
      if(!['approved', 'rejected'].includes(this.request_state)) {
        this.$toasted.error('Error: Request state in unkown');
        return;
      }
      let data = {
        ids: JSON.stringify(this.selected_customers),
        state: this.request_state
      };
      httpCall.post("dm/v1/approval/frequency", data).then(({ data }) => {
        data.message =data.data;
        this.handleResponse(data, data => {
          document.querySelectorAll('#table_request_container input[type="checkbox"]')
          .forEach((input) => {
            input.checked = false;
          })
        })
      }).finally(() => {
        this.customers = [];
        this.selected_customers = [];
        this.fetchRequestList();
      })
    },
    approveFrequencyRequest() {
      this.request_state = "approved";
      this.frequencyRequest();
    },
    rejectedFrequencyRequest() {
      this.request_state = "rejected";
      this.frequencyRequest();
    }
  },
  components: {
    TableComponent
  }
};
</script>

<style></style>

<template>
  <div>
    <customer-filter
        :data="customers"
        v-if="showFilter"
        :onClose="closeFilterModal"
        :onFilter="onFilter"
        :onReset="onReset"
      />
    <div class="px-0 shadow">
      <div class="custom-loader" v-if="isLoading">
        <div class="spinner-border"></div>
      </div>
      <p class="alert alert-success">
        <span><i class="fa fa-wave-square"></i></span>
        <span class="font-weight-bold">Customer Frequency list</span>
      </p>
      <div class="p-2">
        <div class="p-2 text-right">
          <router-link to="/customers" class="btn btn-sm btn-dark">
            <span><i class="fa fa-chevron-circle-left"></i></span>
            <span>back</span>
          </router-link>
          <button
            class="btn btn-sm btn-primary"
            @click="$store.dispatch('customerGetAll', true)"
          >
            <span><i class="fa fa-redo"></i></span>
            <span>refresh list</span>
          </button>
          <button class="btn btn-sm btn-secondary" type="button" @click="showFilterModal">
          <span><i class="fa fa-filter"></i></span>
          <span>Filter</span>
        </button>
          <button
            class="btn btn-sm btn-success"
            v-if="updated.length"
            @click="saveFrequency"
          >
            <span class="bg-light rounded-circle text-success px-1">{{
              updated.length
            }}</span>
            <span>update</span>
          </button>

          <button class="btn btn-primary btn-sm" @click="submitFrequency">
            <span><i class="fa fa-paper-plane"></i></span>
            <span>Submit</span>
          </button>
        </div>
        <div v-if="customers.length">
          <table-component
            :heads="heads"
            :data="customers"
            head-class="bg-success text-light"
            order-by="Name,asc|Specialty,asc"
          >
            <template v-slot:head>
              <th>Next</th>
              <th>Locked</th>
              <th>Submitted</th>
              <th>Freqeuncy state</th>
              <th>Address</th>
              <th>Last update</th>
            </template>
            <template v-slot:body="{ item }">
              <td>
                <input
                  type="number"
                  :value="item.next_freq"
                  class="form-control form-control-sm"
                  :disabled="
                    (item.freq && item.freq.submitted === 1) ||
                      (item.freq && item.freq.locked === 1)
                  "
                  @change="updateCustomerFrequency(item.id)"
                />
                <span class="d-none">{{ item.next_freq }}</span>
              </td>
              <td class="text-center">
                <input
                  type="checkbox"
                  :disabled="
                    (item.freq && item.freq.locked === 1) ||
                      (item.freq && item.freq.submitted === 1)
                  "
                  :checked="item.freq && item.freq.locked === 1"
                  :value="item.freq && item.freq.locked === 1"
                  @click="lockFrequency(item.id)"
                />
                <span class="d-none">{{
                  item.freq && item.freq.locked === 1 ? "true" : "false"
                }}</span>
              </td>
              <td>
                <span v-if="item.freq && item.freq.submitted === 1"
                  ><i class="fa fa-check text-success"></i
                ></span>
                <span v-else><i class="fa fa-times text-danger"></i></span>
                <span class="d-none">{{
                  item.freq && item.freq.submitted === 1 ? "true" : "false"
                }}</span>
              </td>
              <td>
                {{ item.freq && item.freq.state ? item.freq.state : null }}
              </td>
              <td>{{ item.address }}</td>
              <td>{{ item.last_freq_update }}</td>
            </template>
          </table-component>
        </div>
        <div v-else-if="isFetched">
          <p class="text-center">
            You must have a active customers to update frequencies
          </p>
        </div>
        <div v-else>
          <loader-component />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//FIXME this module need some refactor
import TableComponent from "../../../components/TableComponent";
import { httpCall } from "../../../helpers/http-service";
import CustomerFilter from '../../components/CustomerFilter';


/**
 * updated object item
 *
 */
let updateObject = {
  id: null,
  frequency: null,
  locked: false
};

export default {
  components: {
    TableComponent,
    CustomerFilter

  },
  computed: {
    customers() {
      return this.$store.getters.active;
    },
    isFetched() {
      return this.$store.getters.fetched;
    }
  },
  data: () => ({
    heads: [
      {
        title: "Name",
        name: "name"
      },
      {
        title: "Specialty",
        name: "specialty"
      },
      {
        title: "Brick",
        name: "brick"
      },
      {
        title: "Parameter",
        name: "parameter"
      },
      {
        title: "Current",
        name: "current_freq"
      }
    ],
    updated: [],
    isLoading: false,
    fetched: false,
    showFilter: false
  }),
  methods: {
    /**
     * update customer frequency
     *
     * @param {int} id
     * @return {void}
     */
    updateCustomerFrequency(id) {
      let val = parseInt(event.target.value);
      let i = this.isExist(id);
      if (i !== false) {
        this.updated[i].frequency = val;
      } else {
        let customer = this.createUpdateObject(id, val);
        /*  customer.frequency = val;
        customer.id = id */
        this.updated.push(customer);
      }
    },
    /**
     * lock customer frequency
     *
     * @param {int} id
     * @return {void}
     */
    lockFrequency(id) {
      let val = event.target.checked;
      let i = this.isExist(id);
      if (i !== false) {
        this.updated[i].locked = val;
      } else {
        let freq = this.getSelectedCustomerFrequency(id);
        let customer = this.createUpdateObject(id, freq, val);
        this.updated.push(customer);
      }
    },
    /**
     * create update object
     *
     * @param {int} id [customer id]
     * @param {int} frequency [customer frequency]
     * @param {boolean} locked [is customer frequenct is locked]
     * @return {object}
     */
    createUpdateObject(id = null, frequency = null, locked = false) {
      let customer = {
        id,
        frequency,
        locked
      };
      return customer;
    },
    /**
     * check if customer is exists in upadate container
     *
     * @param {int} id
     */
    isExist(id) {
      let exist = false;
      if (!this.updated.length) {
        return exist;
      }
      this.updated.forEach((item, i) => {
        if (item.id === id) {
          exist = i;
        }
      });
      return exist;
    },
    /**
     * get frequency of selected customer
     *
     * @param {int} id [customer id]
     * @return {int} [customer next freq]
     */
    getSelectedCustomerFrequency(id) {
      let freq = 0;
      this.customers.forEach(customer => {
        if (customer.id === id) {
          freq = customer.next_freq;
        }
      });
      return freq;
    },
    /**
     * save Updated Frequency
     *
     * @return {void}
     */
    saveFrequency() {
      this.isLoading = true;
      httpCall
        .post("rep/v1/customer-frequency", {
          customers: JSON.stringify(this.updated)
        })
        .then(({ data }) => {
          data.message = "customers frequency updated";
          this.handleResponse(data, data => {
            this.updated = [];
            this.$store.dispatch("customerGetAll", true).then(() => {
              this.isLoading = false;
            });
          });
        });
    },
    /**
     * Submit Frequnecy
     * which will make frequency not avaliable to update
     *
     * @return {void}
     */
    submitFrequency() {
      httpCall.post("rep/v1/customer-frequency/submit").then(({ data }) => {
        data.message = "Frequency submitted";
        this.handleResponse(data, data => {
          this.$store.dispatch("customerGetAll", true);
        });
      });
    },
    closeFilterModal() {
      this.showFilter = false;
    },
    showFilterModal() {
      this.showFilter = true;
    },
    onFilter(data) {
      this.$store.commit('filterCustomers', {name: 'activeCustomers', data});
      this.showFilter = false;
    },
    onReset() {
      let data = this.$store.getters.all.filter(c => !['NN','XX'].includes(c.parameter));
      this.$store.commit('filterCustomers', {name: 'activeCustomers', data});
      this.updated = [];
      this.showFilter = false;
    }
  }
};
</script>

<style></style>

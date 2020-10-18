<template>
  <div>
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
            class="btn btn-sm btn-success"
            v-if="updated.length"
            @click="saveFrequency"
          >
            <span class="bg-light rounded-circle text-success px-1">{{
              updated.length
            }}</span>
            <span>update</span>
          </button>
          <button
            class="btn btn-primary btn-sm"
            @click="submitFrequency"
          >
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
            </template>
            <template v-slot:body="{ item }">
              <td>
                <input
                  type="number"
                  :value="item.next_freq"
                  class="form-control form-control-sm"
                  :disabled="item.freq.submitted===1||item.freq.locked === 1"
                  @change="updateCustomerFrequency(item.id)"
                />
                <span class="d-none">{{ item.next_freq }}</span>
              </td>
              <td class="text-center">
                <input
                  type="checkbox"
                  :disabled="item.freq.locked===1 || item.freq.submitted === 1"
                  :checked="item.freq.locked===1 "
                  :value="item.freq.locked===1"
                  @click="lockFrequency(item.id)"
                />
                <span class="d-none">{{ item.freq.locked === 1 ? 'true' : 'false'}}</span>
              </td>
              <td>
                <span v-if="item.freq.submitted ===1"><i class="fa fa-check text-success"></i></span>
                <span v-else><i class="fa fa-times text-danger"></i></span>
                <span class="d-none">{{ item.freq.submitted === 1 ? 'true' : 'false'}}</span>
              </td>
              <td>{{ item.freq.state | uppercase }}</td>
              <td>{{ item.address }}</td>
            </template>
          </table-component>
        </div>
        <div v-else-if="fetched">
          <p class="text-center">You must have a active customers to update frequencies</p>
        </div>
        <div v-else>
          <loader-component />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TableComponent from "../../../components/TableComponent";
import { httpCall } from "../../../helpers/http-service";

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
    TableComponent
  },
  computed: {
    customers() {
      let fetched = this.$store.getters.fetched;
      if(fetched) {
        this.fetched = true;
      }
      return this.$store.getters.active;
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
    fetched: false
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
          if (data.code === 201) {
            this.$toasted.show("customers frequency updated", {
              type: "success",
              icon: "check"
            });
            this.$store.dispatch("customerGetAll", true).finally(() => {
              this.isLoading = false;
            });
            this.updated = [];
          }
        });
    },
    /**
     * Submit Frequnecy
     * which will make frequency not avaliable to update
     *
     * @return {void}
     */
    submitFrequency() {
      httpCall.post('rep/v1/customer-frequency/submit')
      .then(({data}) => {
        if(data.code === 201) {
          this.$toasted.show('Frequency submitted', {
            type: 'success',
            icon: 'check'
          });
          this.$store.dispatch('customerGetAll', true);
        }
      });
    }
  },
  filters: {
    uppercase(str) {
      return str[0].toUpperCase()+str.substr(0);
    }
  }
};
</script>

<style></style>

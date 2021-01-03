<template>
  <div class="p-2 my-2 border rounded">
    <p class="lead text-muted">Workplace Doctors</p>
    <div class="p-2">
      <div class="p-2">
        <div class="row mx-auto">
          <div class="col-lg">
            <select
              name="customer"
              id="customer"
              v-model="attachedCustomer"
              class="form-control form-control-sm"
              :disabled="!customers.length"
            >
              <option :value="null">select customer</option>
              <option
                v-for="customer in customers"
                :key="customer.id"
                :value="customer"
                >{{ customer.name }}</option
              >
            </select>
          </div>
          <div class="col-lg-auto my-lg-0 my-1">
            <customer-select-filter :data="$store.getters.all" />
          </div>
          <div class="col-lg-3  px-0 my-lg-0 my-1">
            <button class="btn btn-sm btn-success btn-block" @click="bindCustomer">
              <span class="fa fa-link"></span>
              <span>bind</span>
            </button>
          </div>
        </div>
      </div>
      <div class="p-2" v-if="related_customers.length">
        <table-component
          :heads="heads"
          :data="related_customers"
          :notResponsive="true"
          :unselectable="true"
        >
          <template v-slot:head:before>
            <th>Unlink</th>
          </template>
          <template v-slot:body:before="{item}">
            <td>
              <button class="btn btn-sm btn-danger" @click="unlinkCustomer(item.id)">
                <span class="fa fa-unlink"></span>
              </button>
            </td>
          </template>
        </table-component>
      </div>
      <div v-else-if="isFetched">
        <no-data-to-show :title="`No customer related to this workplace`" />
      </div>
    </div>
  </div>
</template>

<script>
import NoDataToShow from "../../components/NoDataToShow.vue";

import TableComponent from "../../components/TableComponent.vue";
import { httpCall } from "../../helpers/http-service";
import CustomerSelectFilter from "./CustomerSelectFilter.vue";
export default {
  props: {
    workplace: {
      required: true,
      id: Number
    }
  },
  mounted() {
    this.getRelatedCustomers()
  },
  components: {
    TableComponent,
    NoDataToShow,
    CustomerSelectFilter
  },
  computed: {
    customers() {
      return this.$store.getters.customerFilter;
    }
  },
  data: () => ({
    related_customers: [],
    isFetched: false,
    attachedCustomer: null,
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
        title: "Title",
        name: "title"
      }
    ]
  }),
  methods: {
    getRelatedCustomers() {
      this.related_customers = [];
      this.isFetched = false;
      return httpCall
        .get("rep/v1/workplace-customers/" + this.workplace)
        .then(({ data }) => {
          this.related_customers = data.data;
          this.isFetched = true;
        })
        .catch(err => console.log(err));
    },
    bindCustomer() {
      httpCall.post('rep/v1/workplace-customers/add/'+this.workplace, this.attachedCustomer)
      .then(({data}) => {
        this.handleResponse(data);
      }).catch(err => console.log(err))
    },
    unlinkCustomer(id) {
      httpCall.post('rep/v1/workplace-customers/unlink',{customer: id})
      .then(({data}) => {
        this.handleResponse(data)
      }).catch(err => console.log(err))
    }
  }
};
</script>

<style></style>

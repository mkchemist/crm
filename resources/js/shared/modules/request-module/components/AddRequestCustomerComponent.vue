<template>
  <div :class="asRow ? 'row mx-auto' : 'p-2'">
    <div
      class="col-lg form-inline justify-content-between"
      v-if="!['share', 'view'].includes(mode)"
    >
      <select
        name="customers"
        id="customers"
        :class="
          `form-control form-control-sm ${
            canSearchCustomers ? 'col-8' : 'col-10'
          } mx-2`
        "
        v-model="selected"
        :disabled="!customers.length"
      >
        <option :value="null">Select Customer</option>
        <option
          v-for="customer in customers"
          :key="customer.id"
          :value="customer"
          >{{ customer.name }} ({{ customer.specialty }}) ({{
            customer.params.length ? customer.params[0].current : "NN"
          }})</option
        >
      </select>
      <button
        type="button"
        class="btn btn-sm btn-primary rounded-circle float-lg-none float-right"
        :disabled="!selected"
        @click="addCustomer"
      >
        <span class="fa fa-plus"></span>
      </button>
      <button
        type="button"
        class="btn btn-sm btn-primary rounded-circle float-lg-none float-right"
        v-if="canSearchCustomers"
        @click="openSearchBox"
      >
        <span class="fa fa-search"></span>
      </button>
    </div>
    <div v-else class="">
      <p class="font-weight-bold small text-muted">Request Customers</p>
    </div>

    <div class="col-lg" style="max-height:200px;overflow:auto">
      <div v-for="(c, ci) in view" :key="c.id" class="my-1">
        <p class="small mb-1 font-weight-bold">{{ c.name }}</p>
        <table class="table-sm table small">
          <tbody>
            <tr>
              <td>{{ c.specialty }}</td>
              <td>
                {{ c.params && c.params.length ? c.params[0].current : "NN" }}
              </td>
              <td>{{ c.area }}</td>
              <td>
                <a
                  href=""
                  class="btn btn-sm btn-danger"
                  @click.prevent="removeCustomer(ci)"
                  v-if="!['share', 'view'].includes(mode)"
                >
                  <span class="fa fa-times"></span>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <search-box
      :show="showSearchBox"
      :ajaxUrl="`v1/user-customers/search/customers`"
      :paginate="20"
      :onClose="closeSearchBox"
      :searchBrick="searchBrick"
    >
      <template v-slot:view="{data}">
        <table class="table table-sm table-striped small table-responsive text-left">
          <thead>
            <tr>
              <th>Action</th>
              <th>Name</th>
              <th>Specialty</th>
              <th>Parameter</th>
              <th>Brick</th>
              <th>Area</th>
              <th>District</th>
              <th>Territory</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="customer in data"
              :key="customer.id"
            >
              <td>
                <button class="btn btn-sm btn-primary" type="button" @click="addCustomerFromSearch(customer)">
                  <span class="fa fa-check"></span>
                </button>
              </td>
              <td>{{ customer.name }}</td>
              <td>{{ customer.specialty }}</td>
              <td>{{
                customer.params.length ? customer.params[0].current : "NN"
              }}</td>
              <td>{{ customer.brick }}</td>
              <td>{{ customer.area }}</td>
              <td>{{ customer.district }}</td>
              <td>{{ customer.territory }}</td>
            </tr>
          </tbody>
        </table>
      </template>
    </search-box>
  </div>
</template>

<script>
import SearchBox from '../../../../components/SearchBox.vue';
import { httpCall } from '../../../../helpers/http-service';
export default {
  components: { SearchBox },
  props: {
    customers: {
      type: Array,
      required: true
    },
    requestCustomers: {
      type: Array,
      required: true
    },
    mode: {
      type: String,
      default: "edit",
      validator: v => ["edit", "view", "share"].indexOf(v) !== -1
    },
    asRow: {
      type: Boolean,
      default: () => false
    },
    viewCustomers: {
      type: Array,
      default: () => []
    },
    searchBrick: {
      type: String
    }
  },
  created() {
    this.view = this.viewCustomers;
  },
  computed: {
    user() {
      let user =  this.$store.getters["UserModule/user"];
      return user;
    },
    canSearchCustomers() {
      return ["admin", "accountant"].includes(this.user.role);
    }
  },
  data: () => ({
    selected: null,
    view: [],
    search: null,
    showSearchBox: false,
    searchResult: [],
    searchStart: false,
  }),
  methods: {
    addCustomer() {
      if (this.requestCustomers.includes(this.selected.id)) {
        this.$swal({
          title: "Warning",
          text: `customer already added`,
          icon: "warning"
        });
        return;
      }
      this.requestCustomers.push(this.selected.id);
      this.view.push(this.selected);
      this.selected = null;
    },
    removeCustomer(i) {
      this.requestCustomers.splice(i, 1);
      this.view.splice(i, 1);
    },
    openSearchBox() {
      this.showSearchBox = true;
    },
    closeSearchBox() {
      this.showSearchBox = false;
    },
    startSearch() {
      this.searchStart = true;
      return httpCall.post("v1/user-customers/search/customers", {name: this.search})
      .then(({data}) => {
        this.searchResult = data.data
        this.searchStart = false;
      }).catch(err => console.log(err))
    },
    addCustomerFromSearch(customer) {
      this.selected = customer;
      this.addCustomer();
      this.$toasted.success(`${customer.name} added to list`)
    }
  }
};
</script>

<style></style>

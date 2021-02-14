<template>
  <div class="p-2">
    <div class="form-inline justify-content-between">
      <select
        name="customers"
        id="customers"
        class="form-control form-control-sm col-10 mx-2"
        v-model="selected"
        :disabled="!customers.length"
      >
        <option :value="null">Select Customer</option>
        <option
          v-for="customer in customers"
          :key="customer.id"
          :value="customer"
          >{{ customer.name }} ({{ customer.specialty }}) ({{ customer.params.length?customer.params[0].current: 'NN' }})</option
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
    </div>

    <div class="" style="max-height:200px;overflow:auto">
      <div v-for="(c, ci) in view" :key="c.id" class="my-1">
        <p class="small mb-1 font-weight-bold">{{ c.name }}</p>
        <table class="table-sm table small">
          <tbody>
            <tr>
              <td>{{ c.specialty }}</td>
              <td>{{ c.params.length ? c.params[0].current : "NN" }}</td>
              <td>{{ c.area }}</td>
              <td>
                <a
                  href=""
                  class="btn btn-sm btn-danger"
                  @click.prevent="removeCustomer(ci)"
                >
                  <span class="fa fa-times"></span>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    customers: {
      type: Array,
      required: true
    },
    requestCustomers: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    selected: null,
    view: []
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
    }
  }
};
</script>

<style></style>

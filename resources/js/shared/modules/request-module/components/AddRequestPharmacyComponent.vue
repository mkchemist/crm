<template>
  <div class="p-2">
    <div class="form-inline justify-content-between">
      <select
        name="pharmacies"
        id="pharmacies"
        class="form-control form-control-sm col-10 mx-2"
        v-model="selected"
        :disabled="!pharmacies.length"
      >
        <option :value="null">Select Pharmacy</option>
        <option
          v-for="customer in pharmacies"
          :key="customer.id"
          :value="customer"
          >{{ customer.name }}</option
        >
      </select>
      <button
        type="button"
        class="btn btn-sm btn-primary rounded-circle float-lg-none float-right"
        :disabled="!selected || view.length >= 4"
        @click="addPharmacy"
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
              <td>{{ c.address }}</td>
              <td>{{ c.area }}</td>
              <td>
                <a
                  href=""
                  class="btn btn-sm btn-danger"
                  @click.prevent="removePharmacy(ci)"
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
    pharmacies: {
      type: Array,
      required: true
    },
    requestPharmacies: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    selected: null,
    view: []
  }),
  methods: {
    addPharmacy() {
      if (this.requestPharmacies.includes(this.selected.id)) {
        this.$swal({
          title: "Warning",
          text: `Pharmacy already added`,
          icon: "warning"
        });
        return;
      }
      this.requestPharmacies.push(this.selected.id);
      this.view.push(this.selected);
      this.selected = null;
    },
    removePharmacy(i) {
      this.requestPharmacies.splice(i, 1);
      this.view.splice(i, 1);
    }
  }
};
</script>

<style></style>

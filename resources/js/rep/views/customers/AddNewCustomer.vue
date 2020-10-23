<template>
  <div>
    <div class="px-0 shadow">
      <p class="alert alert-success">
        <span><i class="fa fa-plus-circle"></i></span>
        <span class="font-weight-bold">Add new customer</span>
      </p>
      <div class="p-2">
        <ValidationObserver v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(onSubmit)">
            <!-- customer information part -->
            <p>Customer Info.</p>
            <hr />
            <div class="row mx-auto">
              <div class="form-group col-lg">
                <label for="title" class="text-muted">Title</label>
                <select
                  name="title"
                  id="title"
                  class="form-control form-control-sm"
                  v-model="customer.title"
                >
                  <option value="">Select title</option>
                  <option v-for="(item, i) in title" :key="i" :value="item">{{ item }}</option>
                </select>
              </div>
              <div class="form-group col-lg">
                <label for="name" class="text-muted">Name</label>
                <ValidationProvider name="name" rules="required" v-slot="{ errors }">
                  <span class="text-danger small">{{ errors[0] }}</span>
                  <input
                    type="text"
                    class="form-control form-control-sm"
                    id="name"
                    name="name"
                    placeholder="Customer name"
                    v-model="customer.name"
                  />
                </ValidationProvider>
              </div>
            </div>

            <div class="row mx-auto">
              <div class="form-group col-lg">
                <label for="specialty" class="text-muted">Specialty</label>
                <ValidationProvider name="specialty" rules="required" v-slot="{ errors }">
                <span class="text-danger small">{{  errors[0]  }}</span>
                <select
                  name="specialty"
                  id="specialty"
                  class="form-control form-control-sm"
                  v-model="customer.specialty"
                >
                  <option value="">Select specialty</option>
                  <option v-for="(item,i) in specialty"  :key="i" :value="item">{{ item }}</option>
                </select>
                </ValidationProvider>
              </div>
              <div class="form-group col-lg">
                <label for="workplace" class="text-muted">Workplace</label>
                <select
                  name="workplace"
                  id="workplace"
                  class="form-control form-control-sm"
                  v-model="customer.workplace_id"
                >
                  <option value="">Select workplace</option>
                  <option
                      v-for="workplace in workplaces"
                      :key="workplace.id"
                      :value="workplace.id"
                      >{{ workplace.name }}</option
                    >
                </select>
              </div>
              <div class="form-group col-lg">
                <label for="brick" class="text-muted">Brick</label>
                <ValidationProvider name="brick" rules="required" v-slot="{ errors }">
                  <span class="text-danger small">{{  errors[0]  }}</span>
                  <input
                    type="text"
                    name="brick"
                    id="brick"
                    class="form-control form-control-sm"
                    placeholder="Enter customer brick"
                    v-model="customer.brick"
                  />
                </ValidationProvider>
              </div>
            </div>

            <div class="row mx-auto">
              <div class="form-group col-lg">
                <label for="specialty" class="text-muted">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  class="form-control form-control-sm"
                  placeholder="Enter customer address"
                  v-model="customer.address"
                />
              </div>
              <div class="form-group col-lg">
                <label for="phone" class="text-muted">Phone</label>
                <input
                  type="phone"
                  id="phone"
                  name="phone"
                  class="form-control form-control-sm"
                  placeholder="Enter customer phone"
                  v-model="customer.phone"
                />
              </div>
            </div>

            <hr />
            <div class="form-group text-right">
              <router-link to="/customers" class="btn btn-dark">
                <span><i class="fa fa-chevron-circle-left"></i></span>
                <span>back</span>
              </router-link>
              <button class="btn btn-success" type="submit">
                <span><i class="fa fa-save"></i></span>
                <span>add</span>
              </button>
            </div>
          </form>
        </ValidationObserver>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data: () => ({
    customer: {
      name: "",
      title: "",
      specialty: "",
      workplace_id: "",
      brick: "",
      address: "",
      phone: "",
    }
  }),
  methods: {
    onSubmit() {
      this.$store.dispatch('addNewCustomer',this.customer);
    }
  },
  created(){
    this.$store.dispatch("workplaceGetAll");
  },
  computed: {
    specialty() {
      return this.$store.getters.specialty;
    },
    param() {
      return this.$store.getters.param;
    },
    title() {
      return this.$store.getters.title;
    },
     workplaces() {
      return this.$store.getters.allWorkplaces;
    }
  }
};
</script>

<style></style>

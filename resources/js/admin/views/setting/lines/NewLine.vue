<template>
  <div class="px-0 shadow rounded">
    <p class="alert alert-success">
      <span class="fa fa-plus-circle"></span>
      <span class="font-weight-bold">Add New Line</span>
    </p>
    <div class="p-2">
      <ValidationObserver v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(saveLine)">
          <!-- Line name -->
          <div class="row mx-auto my-2">
            <div class="col-lg-4">
              <label for="name" class="text-muted">Name : </label>
            </div>
            <div class="col-lg-8">
              <ValidationProvider
                name="name"
                rules="required"
                v-slot="{ errors }"
              >
                <input
                  type="text"
                  name="name"
                  id="name"
                  v-model="line.name"
                  :class="
                    `form-control form-control-sm ${
                      errors[0] ? 'border border-danger' : ''
                    }`
                  "
                  placeholder="write line name"
                />
                <span class="text-danger small">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>
          </div>
          <!-- line description -->
          <div class="row mx-auto my-2">
            <div class="col-lg-4">
              <label for="desc" class="text-muted">Description : </label>
            </div>
            <div class="col-lg-8">
              <textarea
                name="desc"
                id="desc"
                cols="30"
                rows="4"
                class="form-control form-control-sm"
                placeholder="write line description"
                v-model="line.desc"
              ></textarea>
            </div>
          </div>
          <!-- line specialties -->
          <div class="row mx-auto my-2">
            <div class="col-lg-4">
              <label for="desc" class="text-muted">Specialties : </label>
            </div>
            <div class="col-lg-8">
              <ValidationProvider
                rules="required"
                name="specialties"
                v-slot="{ errors }"
              >
                <select
                  name="specialties"
                  id="specialties"
                  v-model="line.specialties"
                  multiple
                  :class="
                    `form-control form-control-sm ${
                      errors[0] ? 'border border-danger' : ''
                    }`
                  "
                >
                  <option value="all">All</option>
                  <option
                    v-for="(val, key) in specialties"
                    :key="`specialties_${key}`"
                    :value="val.specialty"
                    >{{ val.specialty }}</option
                  >
                </select>
                <span class="text-danger small" v-if="errors[0]"
                  >You must select at least one product</span
                >
              </ValidationProvider>
            </div>
          </div>
          <!-- line  Products -->
          <div class="row mx-auto my-2">
            <div class="col-lg-4">
              <label for="desc" class="text-muted">Products : </label>
            </div>
            <div class="col-lg-4">
              <input
                type="text"
                class="form-control form-control-sm"
                v-model="product"
                placeholder="write product name"
              />
              <button
                type="button"
                class="btn btn-sm btn-block btn-primary my-1"
                :disabled="!product"
                @click="addProduct"
              >
                <span class="fa fa-plus-circle"></span>
                <span>add</span>
              </button>
            </div>
            <div class="col-lg-4 border p-2 rounded">
              <ul class="nav">
                <li
                  class="nav-item col-12 bg-light my-1 clearfix"
                  v-for="(val, key) in line.products"
                  :key="`product_${key}`"
                >
                  <span>{{ val }}</span>
                  <button
                    type="button"
                    class="close"
                    @click="deleteProduct(key)"
                  >
                    &times;
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <hr />
          <!-- Form control -->
          <div class="form-group text-right">
            <router-link to="/setting/lines" class="btn btn-sm btn-dark">
              <span class="fa fa-chevron-circle-left"></span>
              <span>back</span>
            </router-link>
            <button
              type="reset"
              class="btn btn-sm btn-secondary"
              @click="resetProducts"
            >
              <span class="fa fa-redo"></span>
              <span>reset</span>
            </button>
            <button type="submit" class="btn btn-sm btn-primary">
              <span class="fa fa-save"></span>
              <span>save</span>
            </button>
          </div>
        </form>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import { httpCall } from "../../../../helpers/http-service";
export default {
  mounted() {
    httpCall
      .get("admin/v1/specialties")
      .then(({ data }) => {
        this.specialties = data.data;
      })
      .catch(err => {
        console.log(err);
      });
  },
  computed: {
    lines() {
      return this.$store.getters.allLines;
    }
  },
  data: () => ({
    line: {
      name: "",
      desc: "",
      products: [],
      specialties: []
    },
    product: null,
    specialties: []
  }),
  methods: {
    saveLine() {
      let lines = [...this.lines];
      let line ={
        ...this.line
      }
      lines.push(line);
      let id = lines.length -1;
      lines.map(line => {
        if(line.specialties.includes('all')) {
          line.specialties = JSON.stringify([]);
        } else {
          line.specialties = JSON.stringify(line.specialties);
        }
        line.products = JSON.stringify(line.products);
      })
      httpCall.post('admin/v1/setting/lines',{lines: JSON.stringify(lines), line, id})
      .then(({data}) => {
        this.handleResponse(data, data => {
          this.$store.dispatch('getAllLines', true);
          this.$router.push("/setting/lines")
        })
      }).catch(err => {
        console.log(err)
      });
    },
    addProduct() {
      if (
        this.product === null ||
        this.product === "" ||
        this.product === " "
      ) {
        this.$toasted.show("Product name cannot be empty");
        return;
      }
      if (!this.line.products.includes(this.product)) {
        this.line.products.push(this.product);
        this.product = "";
      } else {
        this.$toasted.show(`${this.product} is already exist`);
        return;
      }
    },
    deleteProduct(i) {
      this.line.products.splice(i, 1);
    },
    resetProducts() {
      this.line.products = [];
      this.line.specialties = [];
    }
  }
};
</script>

<style></style>

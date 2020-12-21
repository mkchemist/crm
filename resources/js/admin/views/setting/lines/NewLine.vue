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
          <!-- New line product control -->
          <div class="p-2 border rounded">
            <div >
              <button class="btn btn-sm btn-primary" type="button" @click="createNewDosage">
                <span class="fa fa-plus-circle"></span>
                <span>Add new dosage</span>
              </button>
            </div>
            <div v-if="products.length" class="my-1">
              <div class="row mx-auto p-2 border rounded my-2" v-for="(product, i) in products" :key="`product_${i}`">
                <div class="col-lg-5">
                  <label for="" class="text-muted">Product {{ product.name ? `: ${product.name}` : `Name`}}</label>
                  <input type="text" class="form-control form-control-sm" placeholder="Product name" v-model="product.name">
                   <button class="btn btn-sm btn-block btn-danger my-2" @click="removeProduct(i)">
                    <span class="fa fa-trash"></span>
                  </button>
                </div>
                <div class="row mx-auto col-lg-7">
                  <div class="col-lg-6">
                    <input type="text" class="form-control form-control" placeholder="Competitor name" v-model="competitors[i]">
                    <button class="btn btn-sm btn-block btn-primary my-1" @click="createCompetitor(i)" type="button" :disabled="!competitors[i]">
                      <span class="fa fa-plus"></span>
                    </button>
                  </div>
                  <div class="col-lg-6 border rounded">
                    <ul class="nav">
                      <li class="nav-item col-12 clearfix bg-light small" v-for="(val,key) in product.competitors" :key="`product_${i}_competitor_${key}`">
                        <span>{{ val }}</span>
                        <button class="close float-right" @click="removeCompetitor(key, i)" type="button">&times;</button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
            <!-- end new line product control -->
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
    specialties: [],
    products: [],
    competitors: []
  }),
  methods: {
    saveLine() {
      let lines = new Array;
      lines = Array.from(this.lines)
      let line ={
        ...this.line
      }
      line.products = this.products
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
    resetProducts() {
      this.products = [];
      this.line.specialties = [];
      this.competitors = [];
    },
    createNewDosage() {
      this.products.push({
        name: '',
        competitors: []
      });
      this.competitors.push('')
    },
    /**
     * add new competitor
     *
     * @param {int} i [product index]
     */
    createCompetitor(i) {
      this.products[i].competitors.push(this.competitors[i]);
      this.competitors[i] = null;
    },
    /**
     * remove product from dosage form
     *
     * @param {int} key [competitor index]
     * @param {int} i [product index]
     */
    removeCompetitor(key, i) {
      this.products[i].competitors.splice(key, 1);
    },
    /**
     * remove product from products list
     *
     * @param {int} i [product index]
     */
    removeProduct(i) {
      this.products.splice(i, 1);
    }
  }
};
</script>

<style></style>

<template>
  <div>
    <ValidationObserver v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(saveRequest)">
        <!-- Request owner & serial -->
        <div class="form-group row mx-auto border rounded p-2">
          <!-- Owner -->
          <div class="col-lg border rounded p-2">
            <label for="" class="text-muted font-weight-bold small"
              >Requested by</label
            >
            <input
              type="text"
              disabled
              class="form-control form-control-sm"
              :value="request.creator"
            />
          </div>

          <!-- serial -->
          <div class="col-lg border rounded p-2">
            <label for="" class="text-muted font-weight-bold small"
              >Serial</label
            >
            <input
              type="text"
              disabled
              class="form-control form-control-sm"
              :value="request.serial"
            />
          </div>
          <!-- Brick Selection -->
          <div class="col-lg" v-if="mode === 'edit'">
            <label for="brick" class="font-weight-bold small">Brick</label>
            <select
              name="brick"
              id="brick"
              class="form-control form-control-sm"
              v-model="fetch_brick"
              v-if="isBricksFetched"
            >
              <option :value="null">Select Brick</option>
              <option
                v-for="(brick, _bi) in bricks"
                :key="`brick_${_bi}`"
                :value="brick.brick"
                >{{ brick.brick }}</option
              >
            </select>
            <div v-else class="text-center p-0 mb-0">
              <div class="spinner-border text-info small spin"></div>
              <span class="mx-1 text-muted">Loading Bricks</span>
            </div>
            <button
              class="btn btn-sm btn-block btn-primary my-1"
              :disabled="!fetch_brick"
              @click="fetchBrickCustomersAndPharmacies"
              type="button"
            >
              <span class="fa fa-check-circle"></span>
              <span>ok</span>
            </button>
          </div>
        </div>
        <!-- end of owner  and serial -->
        <!-- query date and apply date -->
        <div class="row mx-auto border rounded p-2 my-2">
          <!-- query date -->
          <div class="col-lg border rounded p-2">
            <label for="" class="text-muted font-weight-bold small"
              >Query Date</label
            >
            <input
              type="date"
              class="form-control form-control-sm"
              :disabled="true"
              :value="request.query_date"
            />
          </div>
          <!-- apply date -->
          <div class="col-lg border rounded p-2">
            <label for="" class="text-muted font-weight-bold small"
              >Apply Date</label
            >
            <div class="form-inline justify-content-between">
              <input
                type="date"
                class="form-control form-control-sm col-11"
                :disabled="!canEditApplyDate"
                v-model="request.apply_date"
              />
              <a
                href=""
                class="text-decoration-none"
                @click.prevent="allowEditApplyDate"
                v-if="!canEditApplyDate && mode === 'edit'"
                title="open apply date for editing"
              >
                <span class="fa fa-edit text-dark"></span>
              </a>
              <a
                href=""
                class="text-decoration-none"
                @click.prevent="lockEditApplyDate"
                v-if="canEditApplyDate && mode === 'edit'"
                title="save edited apply date"
              >
                <span class="fa fa-check text-success"></span>
              </a>
            </div>
          </div>
        </div>
        <!-- end of query date and apply date -->
        <!-- customers and pharmacies -->
        <div class="row mx-auto my-2 border rounded p-2">
          <div class="col-lg-6 p-2 border rounded">
            <add-request-customer-component
              :requestCustomers="request.customers"
              :customers="customers"
              :viewCustomers="request.view_customers"
              :mode="mode"
            />
          </div>
          <div class="col-lg-6 p-2 border rounded">
            <add-request-pharmacy-component
              :pharmacies="pharmacies"
              :requestPharmacies="request.pharmacies"
              :viewPharmacies="request.view_pharmacies"
              :mode="mode"
            />
          </div>
        </div>
        <!-- end of customer and pharmacies -->
        <!-- share in customer -->
        <div
          class="row mx-auto my-2 border rounded p-2"
          v-if="mode === 'share'"
        >
          <div class="col-12">
            <p class="mb-0 font-weight-bold small text-muted">
              Share In Customers
            </p>
            <span class="text-muted small"
              >select customer to share in from this request customers</span
            >
          </div>
          <div class="col-12">
            <add-request-customer-component
              :requestCustomers="request.add_customers"
              :customers="request.view_customers"
              :viewCustomers="[]"
              :mode="`edit`"
              :asRow="true"
            />
          </div>
        </div>
        <!-- end of share in customers -->
        <!-- Request Products -->
        <div class="row mx-auto my-2 border p-2 rounded">
          <add-request-product-selection
            :requestProducts="request.products"
            :mode="mode"
          />
        </div>
        <!-- added request products -->
        <!-- share in request products -->
        <div class="row mx-auto border p-2 rounded" v-if="mode === 'share'">
          <p class="font-weight-bold text-muted small">Share In products</p>
          <add-request-product-selection
            :requestProducts="request.add_products"
          />
        </div>
        <!-- end of share in request products -->
        <!-- Request type  -->
        <div class="row mx-auto border rounded p-2">
          <div class="col-lg p-2 border rounded p-2">
            <label for="" class="text-muted font-weight-bold small"
              >Request Type</label
            >
            <input
              type="text"
              disabled
              class="form-control form-control-sm"
              :value="request.type"
            />
          </div>
          <div class="col-lg p-2 border rounded p-2">
            <ul class="nav">
              <li class="nav-item col-12 small">
                <span>Item</span>
                <span class="font-weight-bold">{{ request.comment.item }}</span>
              </li>
              <li class="nav-item col-12 small">
                <span>Desc.</span>
                <span class="font-weight-bold">{{ request.comment.desc }}</span>
              </li>
              <li class="nav-item col-12 small">
                <span>Others</span>
                <span class="font-weight-bold">{{
                  request.others !== null ? request.others : "-----------"
                }}</span>
              </li>
            </ul>
          </div>
        </div>
        <!-- end of request type -->
        <!-- Request cost -->
        <div class="row mx-auto my-2 p-2 rounded border">
          <div class="row mx-auto col-lg p-2 rounded border">
            <div class="col-lg">
              <label for="" class="text-muted small font-weight-bold"
                >Cost</label
              >
              <input
                type="number"
                :disabled="['share', 'view'].includes(mode)"
                class="form-control form-control-sm"
                v-model="request.cost"
              />
            </div>
            <!-- <div class="col-lg" v-if="mode === 'share'">
              <label for="" class="text-muted small font-weight-bold"
                >Added cost</label
              >
              <input
                type="number"
                class="form-control form-control-sm"
                v-model.number="request.added_cost"
              />
            </div> -->
            <div class="col-lg" v-if="mode !== 'share'">
              <label for="" class="text-muted small font-weight-bold"
                >Quantity</label
              >
              <input
                type="number"
                class="form-control form-control-sm"
                v-model.number="request.quantity"
                :disabled="mode === 'view'"
              />
            </div>
            <div class="col-lg" v-if="['admin','accountant'].includes(user.role)">
              <label for="" class="text-muted small font-weight-bold"
                >Total cost</label
              >
              <input
                type="number"
                disabled
                class="form-control form-control-sm bg-primary text-light"
                :value="request.cost + request.added_cost"
                v-if="mode === 'share'"
              />
              <input
                type="number"
                disabled
                class="form-control form-control-sm bg-primary text-light"
                :value="request.cost * request.quantity"
                v-else
              />
            </div>
          </div>
          <div class="col-lg p-2 border rounded">
            <p>
              Total Benefits:
              <span class="badge badge-primary">
                {{ request.total_benefits }} L.E</span
              >
            </p>
            <p>
              Total Cost:
              <span class="badge badge-primary"> {{ request.cost *request.quantity }} L.E</span>
            </p>
            <p>
              Cost Benefit Ratio:
              <span class="badge badge-primary">
                {{
                  Math.ceil(((request.cost*request.quantity) / request.total_benefits) * 100)
                }}
                %</span
              >
            </p>
            <p>Analysis : <span v-html="getSystemRecommendation()"></span></p>
          </div>
        </div>
        <!-- end of request cost -->
        <!-- Request controller -->
        <div class="form-group text-right p-2 border rounded bg-light">
          <button
            class="btn btn-sm btn-dark"
            @click="$router.back()"
            type="button"
          >
            <span class="fa fa-chevron-circle-left"></span>
            <span>back</span>
          </button>
          <slot name="extra-btn"></slot>
          <button
            class="btn btn-sm btn-primary"
            v-if="!['share', 'view'].includes(mode)"
            type="submit"
          >
            <span class="fa fa-save"></span>
            <span>Update</span>
          </button>
          <button
            class="btn btn-sm btn-success"
            v-if="mode === 'share'"
            type="submit"
          >
            <span class="fa fa-save"></span>
            <span>Save</span>
          </button>
        </div>
        <!-- end of request controller -->
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import { sortBy } from "../../../../helpers/helpers";
import { httpCall } from "../../../../helpers/http-service";
import AddRequestCustomerComponent from "./AddRequestCustomerComponent.vue";
import AddRequestPharmacyComponent from "./AddRequestPharmacyComponent.vue";
import AddRequestProductSelection from "./AddRequestProductSelection.vue";
export default {
  props: {
    data: {
      type: Array,
      required: true
    },
    mode: {
      type: String,
      default: () => "view",
      validator: v => {
        return ["view", "share", "edit"].indexOf(v) !== -1;
      }
    },
    onSave: {
      type: Function,
      default: () => null
    },
    priceList: {
      type: Object,
      default: () => {}
    }
  },
  created() {
    this.request = this.formattingRequest(this.data);
  },
  components: {
    AddRequestCustomerComponent,
    AddRequestPharmacyComponent,
    AddRequestProductSelection
  },
  computed: {
    bricks() {
      return sortBy(this.$store.getters["LocationsModule/bricks"], "brick");
    },
    isBricksFetched() {
      return this.$store.getters["LocationsModule/isBricksFetched"];
    },
     user() {
      return this.$store.getters["UserModule/user"];
    },
  },
  data: () => ({
    request: null,
    fetch_brick: null,
    customers: [],
    pharmacies: [],
    canEditApplyDate: false
  }),
  methods: {
    /* fetching brick customers and pharmacies */
    fetchBrickCustomersAndPharmacies() {
      httpCall
        .get("v1/user-customers/customers/" + this.fetch_brick, {
          withRequests: true
        })
        .then(({ data }) => {
          this.customers = data.data;
        })
        .then(() => {
          httpCall
            .get("v1/user-customers/pharmacies/" + this.fetch_brick)
            .then(({ data }) => {
              this.pharmacies = data.data;
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    },
    saveRequest() {
      if (this.onSave) {
        this.onSave(this.request);
      }
    },
    formattingRequest(data, priceList) {
      let request = {
          customers: [],
          view_customers: [],
          pharmacies: [],
          view_pharmacies: [],
          products: [],
          add_products: [],
          add_customers: [],
          cost: 0,
          added_cost: 0,
          total_benefits: 0
        },
        customers = [],
        pharmacies = [],
        products = [];
      data.map(item => {
        request.total_benefits +=
          item.rx * item.rx_months * this.priceList[item.product];
        if (!customers.includes(item.customer.name)) {
          customers.push(item.customer.name);
          request.view_customers.push(item.customer);
          request.customers.push(item.customer.id);
        }
        for (let i = 1; i <= 4; i++) {
          if (
            item[`pharmacy_${i}`] &&
            !pharmacies.includes(item[`pharmacy_${i}`].name)
          ) {
            pharmacies.push(item[`pharmacy_${i}`].name);
            request.pharmacies.push(item[`pharmacy_${i}`].id);
            request.view_pharmacies.push(item[`pharmacy_${i}`]);
          }
        }

        if (!products.includes(item.product)) {
          products.push(item.product);
          request.products.push({
            name: item.product,
            rx: item.rx,
            rx_months: item.rx_months
          });
        }

        request.cost += item.cost/item.quantity;
        request.apply_date = item.apply_date;
        request.query_date = item.query_date;
        request.creator = item.user.name;
        request.user_id = item.user_id;
        request.type = item.type;
        request.comment = JSON.parse(item.comment);
        request.others = item.others;
        request.serial = item.serial;
        request.quantity = item.quantity;
        request.state = item.state;
      });

      return request;
    },
    allowEditApplyDate() {
      this.canEditApplyDate = true;
    },
    lockEditApplyDate() {
      this.canEditApplyDate = false;
    },
    getSystemRecommendation() {
      let ratio = ((this.request.cost*this.request.quantity) / this.request.total_benefits) * 100;
      ratio = ratio.toFixed(1);
      console.log(ratio)
      let tag = "";
      let color = "";
      let icon = "";
      if (ratio <= 10) {
        tag = "Recommended";
        color = "success";
        icon = "check-circle";
      } else if (ratio > 10 && ratio <= 20) {
        tag = "Risky";
        color = "warning";
        icon = "exclamation";
      } else{
        tag = "Should be avoided";
        color = "danger";
        icon = "times-circle";
      }

      return `</span><span class="${
        color === "warning" ? "text-dark" : "text-light"
      } bg-${color} p-1 font-weight-bold rounded lead"><span class="fa fa-${icon} mx-1"> ${tag}</span>`;
    }
  }
};
</script>

<style></style>

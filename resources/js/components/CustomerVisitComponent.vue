<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-success">
      <span :class="`fa ${editMode ? `fa-edit` : `fa-plus-circle`}`"></span>
      <span class="font-weight-bold"
        >{{ editMode ? "Edit" : "Add" }} {{ visitType }} visit Report</span
      >
    </p>
    <div class="p-2">
      <div class="row mx-auto">
        <div class="col-lg-3">
          <user-filter-box
            :users="users"
            :data="[]"
            :onFilter="onFilterUsers"
            :onReset="onResetUsers"
            :singleUser="true"
            v-if="!editMode"
          />
          <div class="border rounded p-2" v-else-if="editMode && rep">
            <label for="">Creator</label>
            <input
              type="text"
              :disabled="true"
              class="form-control form-control-sm"
              :value="rep.name"
            />
          </div>
          <!-- brick select -->
          <div class="p-2 my-2 border rounded">
            <div class="form-group">
              <label for="">Brick</label>
              <select
                name=""
                id=""
                v-model="brick"
                :disabled="!bricks.length || editMode"
                class="form-control form-control-sm"
              >
                <template v-if="!editMode">
                  <option
                    v-for="(brick, id) in bricks"
                    :key="id"
                    :value="brick.brick"
                    >{{ brick.brick }}</option
                  >
                </template>
                <template v-else>
                  <option :value="brick">{{ brick }}</option>
                </template>
              </select>
            </div>

            <div class="form-group" v-if="!editMode">
              <button
                class="btn btn-sm btn-block btn-primary"
                @click="fetchCustomers"
              >
                <span class="fa fa-check-circle"></span>
                <span>select</span>
              </button>
            </div>
          </div>
          <!-- end of brick select -->
          <!-- customer select -->
          <div class="p-2 my-2 border rounded">
            <div class="form-group">
              <label for="">{{
                visitType === "pharmacy" ? "Pharmacy" : "Customer"
              }}</label>
              <select
                name=""
                id=""
                v-model="customer"
                :disabled="!customers.length"
                class="form-control form-control-sm"
                v-if="!editMode"
              >
                <option
                  v-for="customer in customers"
                  :key="customer.id"
                  :value="customer"
                  >{{ customer.name }} ({{
                    visitType === "pharmacy"
                      ? customer.type
                      : customer.specialty
                  }})</option
                >
              </select>
              <input
                type="text"
                v-else-if="editMode&& customer"
                class="form-control form-control-sm"
                :disabled="true"
                :value="customer.name"
              />
            </div>

            <div class="form-group" v-if="!editMode">
              <button
                class="btn btn-sm btn-block btn-primary"
                @click="viewReport"
              >
                <span class="fa fa-check-circle"></span>
                <span>select</span>
              </button>
            </div>
          </div>
          <!-- end of customer select -->
          <div class="my-2 border rounded">
            <router-link :to="backUrl" class="btn btn-sm btn-block btn-dark">
              <span class="fa fa-chevron-circle-left"></span>
              <span>back</span>
            </router-link>
          </div>
        </div>
        <div class="col-lg-9">
          <div v-if="showReport">
            <visit-component
              :customer="customer"
              :user="user"
              :rep="rep"
              :type="visitType"
              :backUrl="backUrl"
              :onSave="saveReport"
              :editMode="editMode"
              :presetReport="editReport"
            />
          </div>
          <div v-else class="py-5 text-center shadow rounded">
            <div>
              <span class="fa fa-check-circle text-primary fa-4x"></span>
            </div>
            <div>
              <p class="lead text-muted pt-2" v-if="!rep">Select Rep</p>
              <p class="lead text-muted pt-2" v-else-if="!brick">
                Select Brick
              </p>
              <p class="lead text-muted pt-2" v-else-if="!customer">
                Select Customer
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { httpCall } from "../helpers/http-service";
import VisitComponent from "./VisitComponent.vue";
import UserFilterBox from "./UserFilterBox.vue";

export default {
  props: {
    users: {
      type: Array,
      required: true
    },
    visitType: {
      type: String,
      default: () => "single"
    },
    user: {
      type: Object,
      required: true
    },
    backUrl: {
      type: String,
      default: () => "/reports"
    },
    onSave: {
      type: Function
    },
    editMode: {
      type: Boolean,
      default: () => false
    }
  },
  components: {
    VisitComponent,
    UserFilterBox
  },
  mounted() {
    this.fetchEditReport();
  },
  computed: {
    collection() {
      return this.visitType === "pharmacy" ? "pharmacy" : "customer";
    }
  },
  data: () => ({
    rep: null,
    brick: null,
    bricks: [],
    customers: [],
    customer: null,
    showReport: false,
    editReport: null
  }),
  methods: {
    fetchEditReport() {
      if (this.editMode) {
        let id = this.$route.params.id;
        return httpCall
          .get(`v1/single/${this.collection}/${id}`)
          .then(({ data }) => {
            let report = data.data;
            let customer;
            if (this.visitType === "pharmacy") {
              customer = report.pharmacy;
            } else {
              customer = report.customer;
            }
            this.brick = customer.brick;
            this.customer = customer;
            this.rep = report.user;
            this.showReport = true;
            this.editReport = report;
          })
          .catch(err => console.log(err));
      }
    },
    fetchCustomers() {
      let pharmacy = false;
      if (this.visitType === "pharmacy") {
        pharmacy = true;
      }
      return httpCall
        .get("v1/user-customers/customers/" + this.brick, { pharmacy })
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.customers = data.data;
          });
        })
        .catch(err => console.log(err));
    },
    fetchLocations() {
      let id = this.rep.id;
      let pharmacy = false;
      if (this.visitType === "pharmacy") {
        pharmacy = true;
      }
      return httpCall
        .get("v1/user-customers/bricks/" + id, { pharmacy })
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.bricks = data.data;
          });
        })
        .catch(err => console.log(err));
    },
    viewReport() {
      this.showReport = true;
    },
    onFilterUsers(d, q, u) {
      this.rep = u;
      this.fetchLocations();
    },
    onResetUsers() {
      this.rep = null;
    },
    saveReport(data) {
      if (this.visitType === "coaching") {
        this.saveCoachingVisit({
          coach: JSON.stringify(data.coach),
          rep_id: this.rep.id,
          coach_id: this.user.id,
          visit_date: data.date,
          customer_id: this.customer.id
        });
      }
      if (this.visitType === "single") {
        if (this.editMode) {
          this.editSingleVisit({
            collection_type: this.visitType,
            products: JSON.stringify(data.products),
            comment: data.comment,
            feedback: data.feedback,
            date: data.date
          });
        } else {
          this.saveSingleVisit({
            customer_id: this.customer.id,
            products: JSON.stringify(data.products),
            date: data.date,
            comment: data.comment,
            feedback: data.feedback
          });
        }
      }
      if (this.visitType === "pharmacy") {
        this.savePharmacyVisit({
          pharmacy_id: this.customer.id,
          products: JSON.stringify(data.products),
          date: data.date,
          feedback: data.feedback
        });
      }
    },
    saveCoachingVisit(data) {
      return httpCall
        .post("v1/coach-reports", data)
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.onSave();
          });
        })
        .catch(err => console.log(err));
    },
    saveSingleVisit(data) {
      return httpCall.post("v1/single/customer", data).then(({ data }) => {
        this.handleResponse(data, data => {
          this.onSave();
        });
      });
    },
    savePharmacyVisit(data) {
      let url = "v1/single/pharmacy";
      if(this.editMode) {
        url += `/${this.editReport.id}`;
        data["_method"] = "PUT"
      }
      console.log(url)
      return httpCall
        .post(url, data)
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.onSave();
          });
        })
        .catch(err => console.log(err));
    },
    editSingleVisit(data) {
      return httpCall
        .post("v1/single/customer/" + this.editReport.id, {
          ...data,
          _method: "PUT"
        })
        .then(({ data }) => {
          if (data.code === 200) {
            this.$swal({
              title: "Success",
              icon: "success",
              text: data.message,
              showCancelButton: true,
              confirmButtonText: `<i class="fa fa-chevron-circle-left"></i> back to list`,
              cancelButtonText: `<i class="fa fa-times"></i> Keep in this page`
            }).then(res => {
              if (res.isConfirmed) {
                this.$router.push("/single-visit");
              }
            });
          }
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style></style>

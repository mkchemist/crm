<template>
  <div class="px-0 shadow rounded pb-5 mb-5 bg-white">
    <p class="alert alert-success">
      <span class="fa fa-plus-circle"></span>
      <span class="font-weight-bold">Plan field activity</span>
    </p>
    <div class="p-2">
      <ValidationObserver v-slot="{ handleSubmit }">
        <p class="alert alert-warning" v-if="isSubmittedPlans">
            <span class="fa fa-exclamation-triangle"></span>
            Plan is already submitted
          </p>
        <form @submit.prevent="handleSubmit(savePlan)">
          <div class="row mx-auto">
            <div class="col-lg">
              <label for="" class="text-muted">From</label>
              <validationProvider
                name="date_from"
                rules="required"
                v-slot="{ errors }"
              >
                <span v-if="errors[0]" class="text-danger small">you must pick a start date</span>
                <input
                  type="date"
                  name="date_from"
                  id="date_from"
                  :class="
                    `form-control form-control-sm ${
                      errors[0] ? 'border border-danger' : ''
                    }`
                  "
                  v-model="plan.from"
                  :disabled="isSubmittedPlans"
                  :min="today"
                />
              </validationProvider>
            </div>
            <div class="col-lg">
              <label for="" class="text-muted">To</label>
              <validationProvider
                name="date_to"
                rules="required"
                v-slot="{ errors }"
              >
                <span v-if="errors[0]" class="text-danger small">you must pick end date</span>
                <input
                  type="date"
                  name="date_to"
                  id="date_to"
                  :class="
                    `form-control form-control-sm ${
                      errors[0] ? 'border border-danger' : ''
                    }`
                  "
                  v-model="plan.to"
                  :disabled="isSubmittedPlans||!plan.from"
                  :min="plan.from"
                />
              </validationProvider>
            </div>
            <div class="col-lg">
              <label for="" class="text-muted">Type</label>
              <validationProvider
                name="plan_type"
                rules="required"
                v-slot="{ errors }"
              >
                <span v-if="errors[0]" class="text-danger small">Activity type is not valid</span>
                <select
                  name="plan_type"
                  id="plan_type"
                  :class="
                    `form-control form-control-sm ${
                      errors[0] ? 'border border-danger' : ''
                    }`
                  "
                  v-model="plan.content" :disabled="isSubmittedPlans"
                >
                  <option
                    v-for="(type, i) in types"
                    :key="`type_${i}`"
                    :value="type"
                    >{{ type }}</option
                  >
                </select>
              </validationProvider>
            </div>
          </div>
          <hr>
          <div class="form-group text-right">
            <router-link to="/planner" class="btn btn-sm btn-dark">
              <span class="fa fa-chevron-circle-left"></span>
              <span>back</span>
            </router-link>
            <button class="btn btn-sm btn-primary" :disabled="isSubmittedPlans">
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
import { httpCall } from "../helpers/http-service";
export default {
  mounted() {
    this.getTypes();
  },
  data: () => ({
    plan: {
      from: null,
      to: null,
      content: "",
      type: 'field-activity'
    },
    types: [],
    today: new Date().format()
  }),
  computed: {
    isSubmittedPlans() {
      if(this.$store.getters.isSubmittedPlans) {
        return this.$store.getters.isSubmittedPlans;
      }
      return false
    }
  },
  methods: {
    savePlan() {
      if(this.isSubmittedPlans) {
        return;
      }
      httpCall.post('activity-planner', this.plan)
      .then(({data}) => {
        this.handleResponse(data, data => {
          this.$store.dispatch('getNonFieldActivityPlans', true);
        })
      }).catch(err => console.log(err))
    },
    getTypes() {
      return httpCall
        .get("field-activity-types")
        .then(({ data }) => {
          this.types = data.data;
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style></style>

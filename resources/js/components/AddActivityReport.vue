<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-success">
      <span class="fa fa-plus-circle"></span>
      <span class="font-weight-bold">Add {{ pageTitle }} report</span>
    </p>
    <div class="p-2">
      <ValidationObserver v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(saveReport)">
          <!-- Report date controller -->
          <div class="row mx-auto">
            <div class="col-lg">
              <label class="text-muted">From</label>
              <ValidationProvider
                name="date_from"
                rules="required"
                v-slot="{ errors }"
              >
                <span class="text-danger small" v-if="errors[0]"
                  >you must choose a starting date</span
                >
                <input
                  type="date"
                  name="date_from"
                  id="date_from"
                  :class="
                    `form-control form-control-sm ${
                      errors[0] ? 'border border-danger' : ''
                    }`
                  "
                  v-model="report.from"
                  :max ="new Date().format()"
                />
              </ValidationProvider>
            </div>
            <div class="col-lg">
              <label class="text-muted">To</label>
              <ValidationProvider
                name="date_to"
                rules="required"
                v-slot="{ errors }"
              >
                <span class="text-danger small" v-if="errors[0]"
                  >you must choose a ending date</span
                >
                <input
                  type="date"
                  name="date_to"
                  id="date_to"
                  :class="
                    `form-control form-control-sm ${
                      errors[0] ? 'border border-danger' : ''
                    }`
                  "
                  v-model="report.to"
                  :disabled="!report.from"
                  :max="new Date().format()"
                />
              </ValidationProvider>
            </div>
          </div>
          <!-- Report details -->
          <div class="row mx-auto my-2">
            <div class="col-lg">
              <label class="text-muted">Type</label>
              <ValidationProvider name="report_type" rules="required" v-slot="{errors}">
                <span class="text-danger small" v-if="errors[0]">select {{ pageTitle }} type</span>
                <select
                  name="report_type"
                  id="report_type"
                  :class="
                    `form-control form-control-sm ${
                      errors[0] ? 'border border-danger' : ''
                    }`
                  "
                  v-model="report.content"
                >
                  <option
                    v-for="(type, i) in reportTypes"
                    :key="`report_type_${i}`"
                    :value="type"
                    >{{ type }}</option
                  >
                </select>
              </ValidationProvider>
            </div>
            <div class="col-lg">
              <label class="text-muted">Content</label>
              <textarea
                name=""
                id=""
                cols="30"
                rows="8"
                class="form-control form-control-sm"
                placeholder="write comment about this activity"
                v-model="report.comment"
              ></textarea>
            </div>
          </div>
          <hr />
          <div class="form-group text-right">
            <router-link to="/reports" class="btn btn-sm btn-dark">
              <span class="fa fa-chevron-circle-left"></span>
              <span>back</span>
            </router-link>
            <button class="btn btn-sm btn-secondary" type="reset">
              <span class="fa fa-redo"></span>
              <span>reset</span>
            </button>
            <button class="btn btn-sm btn-primary" type="submit">
              <span class="fa fa-save"></span>
              <span>Save</span>
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
    let type = this.$route.query.type;
    if (!type) {
      this.$router.push("/reports/add/activity-report?type=field-activity");
    }
    this.type = type;
    this.getReportTypes();
  },
  data: () => ({
    report: {
      from: null,
      to: null,
      content: null,
      comment: null
    },
    reportTypes: []
  }),
  computed: {
    pageTitle() {
      if (this.$route.query.type === "non-field-activity") {
        return "Non Field activity";
      }
      return "Field Activity";
    }
  },
  methods: {
    /**
     * save activity report
     */
    saveReport() {
      let request = Object.assign({}, this.report);
      request['type'] = this.type;
      httpCall.post('activity-reports', request)
      .then(({data}) => {
        this.handleResponse(data, data => {
          this.$router.push('/reports/activity-report?type='+this.type);
        });
      }).catch(err => console.log(err))
    },
    /**
     * get activity reports
     */
    getReportTypes() {
      let url = this.type + "-types";
      httpCall
        .get(url)
        .then(({ data }) => {
          this.reportTypes = data.data;
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style></style>

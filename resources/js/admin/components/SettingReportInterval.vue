<template>
  <div class="p-2 border rounded">
    <div class="p-2 row mx-auto">
      <div class="col-lg-8">
        <h4 class="text-primary mb-0">Report Interval</h4>
        <small class="text-muted"
          >Duration between today date and visit date</small
        >
      </div>
      <div class="col-lg-4">
        <input
          type="number"
          class="form-control form-control-sm"
          name="app_report_interval"
          min="0"
          placeholder="Number of days"
          v-model="reportInterval"
          v-if="reportInterval"
        />
        <loader-component v-else></loader-component>
      </div>
    </div>
    <hr />
    <div class="p-2 text-right">
      <button class="btn btn-sm btn-primary" @click="saveReportInterval">
        <span class="fa fa-save"></span>
        <span>Save</span>
      </button>
    </div>
  </div>
</template>

<script>
import { httpCall } from '../../helpers/http-service';
export default {
  mounted() {
    this.getReportInterval()
  },
  data: () => ({
     reportInterval: null,
    isReportIntervalFetched: false,
  }),
  methods: {
    getReportInterval() {
      this.reportInterval = null;
      this.isReportIntervalFetched = false;
      return httpCall.get('admin/v1/setting/report-interval')
      .then(({data}) => {
        this.reportInterval = data.data;
        this.isReportIntervalFetched = true;
      }).catch(err => {
        console.log(err);
        this.$toasted.error('Something went wrong');
      })
    },
    /**
     * save report interval
     */
    saveReportInterval() {
      let request = {
        interval : this.reportInterval
      };
      httpCall.post('admin/v1/setting/report-interval', request)
      .then(({data}) => {
        this.handleResponse(data , data => {
          this.getReportInterval();
        })
      }).catch(err => {
        console.log(err);
        this.$toasted.error('Something went wrong');
      });
    },
  }
};
</script>

<style></style>

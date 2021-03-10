<template>
  <div class="shadow px-0 rounded pb-5 pt-2">
    <p class="alert alert-success">
      <span class="fa fa-calendar-check"></span>
      <span>Planner</span>
    </p>
    <div class="p-2">
      <div class="p-2 text-center shadow-sm rounded my-2">
        <button
          class="btn btn-sm btn-primary"
          @click="refreshPlans"
        >
          <span class="fa fa-redo"></span>
          <span>Refresh planner</span>
        </button>
        <button
          class="btn btn-sm btn-success"
          @click="approvalRequest"
          :disabled="!$attrs.user || approved"
          v-if="submitted"
        >
          <span class="fa fa-check-circle"></span>
          <span v-if="approved">Already Approved</span>
          <span v-else>Approve</span>
        </button>
        <button
          class="btn btn-sm btn-secondary"
          @click="rejectRequest"
          :disabled="!$attrs.user"
          v-if="submitted && approved === false"
        >
          <span class="fa fa-times-circle"></span>
          <span>reject</span>
        </button>
      </div>
      <div>
        <vue-cal
          :selectedDate="$attrs.date"
          :activeView="'week'"
          :disableViews="['years', 'year']"
          :startWeekOnSunday="true"
          :events="plans"
          :time="false"
          class="vuecal--green-theme"
          style="max-height:400px;overflow:auto"
          :hide-weekdays="[5]"
        />
      </div>
    </div>
  </div>
</template>

<script>
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import { httpCall } from "../../../helpers/http-service";

export default {
  components: {
    VueCal
  },
  computed: {
    plans() {
      return this.$attrs.data;
    },
    submitted() {
      let locked = this.$store.getters.lockedPlans;
      let lock = false;
      if (!this.$attrs.user) {
        return lock;
      }
      locked.forEach(item => {
        if (item.user_id === this.$attrs.user && item.submitted === 1) {
          lock = true;
        }
      });
      return lock;
    },
    approved() {
      let locked = this.$store.getters.lockedPlans;
      let lock = false;
      if (!this.$attrs.user) {
        return lock;
      }
      locked.forEach(item => {
        if (item.user_id === this.$attrs.user && item.approved === 1) {
          lock = true;
        }
      });
      return lock;
    }
  },
  data: () => ({
    request_state: null
  }),
  methods: {
    approvalRequest() {
      this.request_state = "approve";
      this.sendRequest();
    },
    rejectRequest() {
      this.request_state = "reject";
      this.sendRequest();
    },
    sendRequest() {
      let confirmSubmit = confirm(`Do yo want to ${this.request_state} plan`);
      if (confirmSubmit) {
        return httpCall
          .post("otc-manager/v1/planner/submit", {
            state: this.request_state,
            user: this.$attrs.user
          })
          .then(({ data }) => {
            this.handleResponse(data, data =>
              this.$store.dispatch("fetchPlans", { force: true })
            );
          })
          .catch(err => console.log(err));
      }
      this.$toasted.success("Plan is not submitted");
      return;
    },
    refreshPlans() {
      this.$store.dispatch('fetchPlans', {force: true});
    },

  }
};
</script>

<style></style>

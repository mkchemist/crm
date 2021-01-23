<template>
  <div class="p-2 bg-white shadow" style="min-height:500px">
    <div class="p-2 text-center">
      <router-link class="btn btn-secondary btn-sm" to="/planner/add">
        <span class="fa fa-plus-circle"></span>
        <span>Add Plan</span>
      </router-link>
      <router-link
        class="btn btn-warning btn-sm"
        to="/planner/add-field-activity"
      >
        <span class="fa fa-plus-circle"></span>
        <span>Plan Field activity</span>
      </router-link>
      <router-link
        class="btn btn-dark btn-sm"
        to="/planner/add-non-field-activity"
      >
        <span class="fa fa-plus-circle"></span>
        <span>Plan Non-Field activity</span>
      </router-link>
      <button
        :class="
          `btn btn-sm ${isRepPlanApproved() ? 'btn-success' : `btn-primary`}`
        "
        v-if="!isOwnerPlans && isRepPlansNeedToApproval() === true"
        @click="approveCurrentUserPlans"
        :disabled="isRepPlanApproved()"
      >
        <span class="fa fa-check-circle"></span>
        <span>{{ isRepPlanApproved() ? "Already approved" : "approve" }} </span>
      </button>
      <button
        class="btn btn-sm btn-secondary"
        v-if="
          !isOwnerPlans &&
            !isRepPlanApproved() &&
            isRepPlansNeedToApproval() === true
        "
        @click="rejectCurrentUserPlans"
      >
        <span class="fa fa-check-circle"></span>
        <span>Reject </span>
      </button>
      <!-- <button class="btn btn-sm btn-success">
        <span><i class="fa fa-paper-plane"></i></span>
        <span>submit</span>
      </button> -->
    </div>
    <div class="p-2 border p-2 rounded my-1">
      <p class="clearfix">
        <span>Planner Summery</span>
        <span
          class="float-right text-primary fa fa-chevron-circle-down rotated"
          style="cursor:pointer"
          data-toggle="collapse"
          data-target="#plan_summery"
          ref="planSummeryBtn"
          @click="togglePlanSummeryIcon"
        ></span>
      </p>
      <div v-if="planSummery" id="plan_summery" class="collapse">
        <hr />
        <p class="mb-0">
          Total planner days :
          <span class="text-primary font-weight-bold">{{
            planSummery.total_days
          }}</span>
        </p>
        <p class="mb-0">
          Total {{ planSummery["is_dm"] ? "Reps" : "customers" }} :
          <span class="font-weight-bold text-primary">{{
            planSummery["total_customers"]
          }}</span>
        </p>
        <p class="mb-0">
          Total Plans:
          <span class="font-weight-bold text-primary">{{
            planSummery.total_plans
          }}</span>
        </p>
      </div>
    </div>
    <div class="">
      <vue-cal
        class="vuecal--green-theme p-2"
        :selectedDate="$attrs.date"
        active-view="week"
        :disable-views="['years', 'year']"
        :time="false"
        :hide-weekdays="[5]"
        today-button
        :events="plans"
        :startWeekOnSunday="true"
        :onEventClick="onEventClick"
      >
        <template v-slot:arrow-prev>
          <i class="fa fa-chevron-circle-left text-success"></i>
        </template>
        <template v-slot:arrow-next>
          <i class="fa fa-chevron-circle-right text-success"></i>
        </template>
        <template v-slot:today-button>
          <button class="btn btn-sm btn-success">
            <span>today</span>
          </button>
        </template>
      </vue-cal>
    </div>
    <modal-fade
      id="owner_plans_control"
      :show="show_owner_control_modal"
      @onClose="closeOwnerControlModal"
      :headerStyle="`bg-success text-light`"
    >
      <template v-slot:header v-if="selected_event">
        <span>Plan manipulation </span>
      </template>
      <template v-slot:body v-if="selected_event">
        <div class="p-2">
          <label>{{
            selected_event.type !== "coach-plan" ? "Activity" : "Rep"
          }}</label>
          <input
            type="text"
            class="form-control form-control-sm"
            disabled
            :value="
              `${selected_event.type.replace(/-/g, ' ').toUpperCase()} | ${
                selected_event.title
              }`
            "
          />
        </div>
        <div class="p-2">
          <label>{{
            selected_event.type !== "coach-plan" ? "From" : "Date"
          }}</label>
          <input
            type="date"
            class="form-control form-control-sm"
            v-model="selected_event.date_start"
          />
        </div>
        <div class="p-2" v-if="selected_event.type !== 'coach-plan'">
          <label>To</label>
          <input
            type="date"
            class="form-control form-control-sm"
            v-model="selected_event.date_end"
          />
        </div>
        <hr />
        <div class="form-group text-right">
          <button
            type="button"
            class="btn btn-sm btn-primary"
            @click="updatePlannedVisit"
          >
            <span class="fa fa-edit"></span>
            <span>edit</span>
          </button>
          <button
            type="button"
            class="btn btn-sm btn-danger"
            @click="deletePlannedVisit"
          >
            <span class="fa fa-trash"></span>
            <span>delete</span>
          </button>
        </div>
      </template>
    </modal-fade>
  </div>
</template>

<script>
import VueCal from "vue-cal";
import { filterData } from "../../../helpers/helpers";
import ModalFade from "../../../components/ModalFade.vue";
import { httpCall } from "../../../helpers/http-service";
export default {
  components: {
    VueCal,
    ModalFade
  },
  data: () => ({
    /** toggle event manipulation */
    show_owner_control_modal: false,
    /** selected event to be manipulated */
    selected_event: null
  }),
  computed: {
    /**
     * all plans
     * including [rep plans, dm plan]
     */
    plans() {
      return this.$store.getters.plans;
    },
    /** generating plan summery */
    planSummery() {
      let summery = {};
      if (!this.plans.length) {
        return;
      }
      summery["total_plans"] = this.plans.length;
      summery["total_customers"] = Object.keys(
        filterData(this.plans, "title")
      ).length;
      summery["total_days"] = Object.keys(
        filterData(this.plans, "start")
      ).length;
      summery["is_dm"] = this.plans[0].user_id === this.$store.state.user.id;
      return summery;
    },
    /** get current view user id */
    currentPlannerUserId() {
      return this.$store.getters.currentUserId;
    },
    planValidationData() {
      return this.$store.getters.planValidationData;
    },
    /**
     * check if this view is owner view
     */
    isOwnerPlans() {
      return this.$store.state.user.id === this.currentPlannerUserId;
    }
  },
  methods: {
    /**
     * toggle plan summery accordion icon
     */
    togglePlanSummeryIcon() {
      let downIcon = "fa-chevron-circle-down";
      let upIcon = "fa-chevron-circle-up";
      let el = this.$refs.planSummeryBtn;
      el.classList.toggle("rotateIcon180");
    },
    /**
     * action that will be raised when click on
     * single event
     * that is owner event
     */
    onEventClick(e) {
      let { user_id } = e;
      if (user_id === this.$store.state.user.id) {
        this.show_owner_control_modal = true;
        this.selected_event = e;
      }
    },
    /**
     * get select event for manipulation url
     *
     * check event type
     * generate url
     *
     * @return {string}
     */
    getSelectedEventUrl() {
      let url;
      if (this.selected_event.type === "coach-plan") {
        url = "dm/v1/planner/";
      } else {
        url = "activity-planner/";
      }
      return url;
    },
    /**
     * close event actions modal
     */
    closeOwnerControlModal() {
      this.show_owner_control_modal = false;
      this.selected_event = null;
    },
    /**
     * update single event
     */
    updatePlannedVisit() {
      let url = this.getSelectedEventUrl();
      let request = {
        start: this.selected_event.date_start,
        end: this.selected_event.date_end,
        date: this.selected_event.date_start,
        _method: "PUT"
      };
      httpCall
        .post(url + this.selected_event.id, request)
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.$store
              .dispatch("getPlans", true)
              .then(() => {
                this.$store.dispatch("getNonFieldActivityPlans", true);
              })
              .finally(() => {
                this.show_owner_control_modal = false;
              });
          });
        })
        .catch(err => console.log(err));
    },
    /**
     * delete single event
     */
    deletePlannedVisit() {
      let url = this.getSelectedEventUrl();
      let request = {
        _method: "DELETE"
      };
      httpCall
        .post(url + this.selected_event.id, request)
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.$store
              .dispatch("getPlans", true)
              .then(() => {
                this.$store.dispatch("getNonFieldActivityPlans", true);
              })
              .finally(() => {
                this.show_owner_control_modal = false;
              });
          });
        })
        .catch(err => console.log(err));
    },
    approveCurrentUserPlans() {
      this.sendCurrentUserPlansAction("approved");
    },
    rejectCurrentUserPlans() {
      this.sendCurrentUserPlansAction("rejected");
    },
    sendCurrentUserPlansAction(type) {
      let user = this.currentPlannerUserId;
      let request = {
        user,
        type
      };
      httpCall
        .post("dm/v1/planner/submit", request)
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.$store.dispatch("getPlans", true).then(() => {
              this.$store.dispatch("getNonFieldActivityPlans", true);
            });
          });
        })
        .then(() => {
          httpCall
            .post("dm/v1/workplace-planner/submit", request)
            .then(({ data }) => {
              this.handleResponse(data);
            });
        })
        .catch(err => console.log(err));
    },
    isRepPlansNeedToApproval() {
      if (this.isOwnerPlans) {
        return;
      }
      let userId = this.currentPlannerUserId;
      let userValidation = this.planValidationData.filter(
        plan => plan.user_id === userId
      )[0];
      if (userValidation && userValidation.submitted === 1) {
        return true;
      }
      return false;
    },
    isRepPlanApproved() {
      if (this.isOwnerPlans) {
        return;
      }
      let userId = this.currentPlannerUserId;
      let userValidation = this.planValidationData.filter(
        plan => plan.user_id === userId
      )[0];
      if (userValidation && userValidation.approved === 1) {
        return true;
      }
      return false;
    }
  }
};
</script>

<style></style>

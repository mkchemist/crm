<template>
  <div>
    <p class="alert alert-success">
      <span><i class="fa fa-calendar-check"></i></span>
      <span>Planner</span>
    </p>
    <!-- planner home navbar -->
    <div class="p-2 text-center">
      <router-link to="/planner/add-pm" class="btn btn-info btn-sm">
        <span><i class="fa fa-calendar-plus"></i></span>
        <span>Add PM Plans</span>
      </router-link>
      <router-link to="/planner/add-am" class="btn btn-secondary btn-sm">
        <span><i class="fa fa-hospital-alt"></i></span>
        <span>Add Am Plans</span>
      </router-link>
      <router-link
        to="/planner/add-field-activity"
        class="btn btn-warning btn-sm"
      >
        <span><i class="fa fa-plus"></i></span>
        <span>Plan field activity</span>
      </router-link>
      <router-link
        to="/planner/add-non-field-activity"
        class="btn btn-warning btn-sm"
      >
        <span><i class="fa fa-plus"></i></span>
        <span>Plan non field activity</span>
      </router-link>

      <button class="btn btn-success btn-sm" @click="submitPlan" :disabled="isSubmittedPlans|| !isPlansFetched">
        <span><i :class="`fa  ${isSubmittedPlans ? 'fa-check' :`fa-calendar-check`}`"></i></span>
        <span>{{ isSubmittedPlans ? 'Already submitted' :'Submit' }}</span>
      </button>
    </div>
    <!-- end planner home navbar -->
    <!-- total plan summery-->
    <div class="p-2">
      <div class="border my-2 rounded p-2">
        <p class="text-muted clearfix">
          <span class="lead">Planner Summery </span>
          <button
            class="btn float-right"
            data-toggle="collapse"
            data-target="#planner_summery"
            @click="flipIcon"
          >
            <span><i :class="`fa ${summery_icon}`"></i></span>
          </button>
        </p>
        <div class="row mx-auto collapse" id="planner_summery">
          <div class="col">
            <p class="mb-0 text-muted">Total planned : {{ plans.length }}</p>
            <p class="mb-0 text-muted">
              Total P.M. plans : {{ $store.getters.plans.length }}
            </p>
            <p class="mb-0 text-muted">
              Total A.M. plans : {{ $store.getters.amPlans.length }}
            </p>
          </div>
          <div class="col">
            <p class="mb-0 text-muted">
              Total planned Days : {{ Object.keys(planSummery.days).length }}
            </p>
            <p class="mb-0 text-muted">
              Total P.M. planned Customers :
              {{ Object.keys(planSummery.customers).length }}
            </p>
            <p class="mb-0 text-muted">
              Total A.M. planned Workplaces :
              {{ Object.keys(planSummery.workplaces).length }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- end of total plan summery -->
    <div class="p-2">
      <!-- planner -->
      <vue-cal
        active-view="week"
        :selectedDate="$attrs.date"
        :disable-views="['years', 'year']"
        class="vuecal--green-theme"
        ref="planner"
        :events="plans"
        :time="false"
        v-if="isPlansFetched"
        :on-event-click="onEventClick"
        @cell-click="onDayClick"
        :startWeekOnSunday="true"
        :hide-weekdays="[5]"
      >
        <template v-slot:arrow-prev>
          <i class="fa fa-chevron-circle-left text-success"></i>
        </template>
        <template v-slot:arrow-next>
          <i class="fa fa-chevron-circle-right text-success"></i>
        </template>
      </vue-cal>
      <loader-component v-else />
    </div>
    <modal-fade
      id="event_modal_fade"
      :show="show_event_modal"
      :centered="true"
      header-style="bg-primary text-light"
      @onClose="closeEventModal"
    >
      <template v-slot:header v-if="selected_event">
        <span v-if="!is_selected_event_is_submitted"
          >Edit
          {{ selected_event.title }} plan on date
          {{ selected_event.start }}</span
        >
        <span v-else>View {{ selected_event.title }} Plan</span>
      </template>
      <template v-slot:body v-if="selected_event">
        <div>
          <p>{{ selected_event.title }}</p>
          <div
            class="form-group row mx-auto"
          >
            <label for="replan_date" class="text-muted col-auto">Date</label>
            <input
              type="date"
              class="form-control form-control-sm col"
              id="replan_date"
              v-model="selected_event.start"
              :disabled="isSubmittedPlans || !Object.keys(activeCycle).length"
              :min="activeCycle.start"
              :max="activeCycle.end"

            />
          </div>
          <div class="Form-group text-right">
            <button
              class="btn btn-dark btn-sm"
              @click="
                () => {
                  show_event_modal = false;
                }
              "
            >
              <span><i class="fa fa-times"></i></span>
              <span>cancel</span>
            </button>
            <button @click="generateVisitLink" class="btn btn-sm btn-primary">
              <span class="fa fa-hands-helping"></span>
              <span>visit</span>
            </button>
            <button
              class="btn btn-sm btn-success"
              @click="updateEvent"
              v-if="!isSubmittedPlans"
            >
              <span><i class="fa fa-save"></i></span>
              <span>save</span>
            </button>
            <button
              class="btn btn-sm btn-danger"
              @click="deleteEvent"
              v-if="!isSubmittedPlans"
            >
              <span><i class="fa fa-trash"></i></span>
              <span>remove</span>
            </button>
          </div>
        </div>
      </template>
    </modal-fade>
    <modal-fade
      id="cell_modal_fade"
      :show="show_day_modal"
      @onClose="closeCellModal"
      :centered="true"
    >
      <template v-slot:header v-if="selected_day">
        <span>Edit Date {{ selected_day }}</span>
      </template>
      <template v-slot:body>
        <div class="form-group">
          <input
            type="date"
            v-model="duplicate_date"
            class="form-control form-control-sm"
            :min="activeCycle.start"
            :max="activeCycle.end"
            :disabled="!Object.keys(activeCycle).length"
          />
        </div>
        <div class="form-group text-right">
          <button class="btn btn-primary btn-sm" @click="duplicateDay">
            <span><i class="fa fa-redo"></i></span>
            <span>Duplicate</span>
          </button>
          <button class="btn btn-danger btn-sm" @click="clearDay">
            <span><i class="fa fa-trash"></i></span>
            <span>Clear</span>
          </button>
        </div>
      </template>
    </modal-fade>
    <modal-fade
      :show="active_non_field_modal"
      id="non-field-modal"
      @onClose="closeNonFieldActivityModal"
      headerStyle="bg-warning text-dark"
    >
      <template v-slot:header v-if="selected_event">
        <span>Non field activity {{ selected_event.title }}</span>
      </template>
      <template v-slot:body v-if="selected_event">
        <div class="form-group">
          <label for="">From</label>
          <input
            type="date"
            name="date_from"
            id="date_from"
            v-model="selected_event.date_start"
            class="form-control form-controls-m"
            :min="new Date().format()"
          />
        </div>
        <div class="form-group">
          <label for="">To</label>
          <input
            type="date"
            name="date_to"
            id="date_to"
            v-model="selected_event.date_end"
            :min="new Date().format()"
            class="form-control form-controls-m"
          />
        </div>
        <hr />
        <div class="form-group text-right">
          <button class="btn btn-sm btn-primary" type="button" @click="editNonFieldActivity" v-if="!isSubmittedPlans">
            <span class="fa fa-edit"></span>
            <span>Edit</span>
          </button>
          <button type="button" class="btn btn-success btn-sm" @click="goToActivityReport">
            <span class="fa fa-sticky-note"></span>
            <span>Report</span>
          </button>
          <button class="btn btn-sm btn-danger" type="button" @click="deleteNonFieldActivity" v-if="!isSubmittedPlans">
            <span class="fa fa-times"></span>
            <span>Delete</span>
          </button>
        </div>
      </template>
    </modal-fade>
  </div>
</template>

<script>
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import ModalFade from "../../../components/ModalFade";
import { httpCall } from "../../../helpers/http-service";
import { filterData } from "../../../helpers/helpers";
export default {
  components: {
    VueCal,
    ModalFade
  },
  data: () => ({
    show_event_modal: false,
    show_day_modal: false,
    selected_event: null,
    selected_day: null,
    duplicate_date: null,
    summery_icon: "fa-chevron-circle-down",
    is_selected_event_is_submitted: false,
    active_non_field_modal: false
  }),
  methods: {
    isSubmittedDay(date) {
      if (this.submitted.includes(date)) {
        return true;
      }
      return false;
    },
    /**
     * handle event click
     *
     * update or delete plan
     *
     * @param {object} e [event]
     */
    onEventClick(e) {
     /*  if(this.isSubmittedPlans) {
        this.$toasted.show('Plans is already submitted, you cant change plan after submit');
        return;
      } */
      if (e.type === "non-field-activity" || e.type=== 'field-activity') {
        this.active_non_field_modal = true;
        this.selected_event = e;
        return;
      }
      let date = new Date(e.start).format("YYYY-MM-DD");
      this.selected_event = e;
      this.selected_event.start = new Date(e.start).format("YYYY-MM-DD");
      this.show_event_modal = true;
    },
    /**
     * handle day event click
     * update date or clear date
     *
     * @param {object} e [date]
     */
    onDayClick(e, x) {
      if(this.isSubmittedPlans) {
        this.$toasted.show('Plans is already submitted, you cant change plan after submit');
        return;
      }
      let date;
      if (e.date) {
        date = new Date(e.date).format("YYYY-MM-DD");
      } else {
        date = new Date(e).format("YYYY-MM-DD");
      }
      this.selected_day = this.duplicate_date = date;
      this.show_day_modal = true;
    },
    closeEventModal() {
      this.show_event_modal = false;
      this.is_selected_event_is_submitted = false;
    },
    closeCellModal() {
      this.show_day_modal = false;
    },
    /**
     * update event
     *
     */
    updateEvent() {
      if(this.isSubmittedPlans) {
        return;
      }
      let eventDetails = this.getEventDetails();
      if (!eventDetails) {
        return;
      }
      httpCall.post(eventDetails.url, eventDetails.data).then(({ data }) => {
        data.message = data.data;
        this.handleResponse(data, data => {
          this.show_event_modal = false;
          eventDetails.model();
        });
      });
    },
    /**
     * delete selected event
     */
    deleteEvent() {
      if(this.isSubmittedPlans) {
        return;
      }
      let eventDetails = this.getEventDetails();
      if (!eventDetails) {
        return;
      }
      eventDetails.data._method = "DELETE";
      httpCall.post(eventDetails.url, eventDetails.data).then(({ data }) => {
        //data.message = data.data;
        this.handleResponse(data, data => {
          this.show_event_modal = false;
          eventDetails.model();
        });
      });
    },
    /**
     * get event details
     * is event is am event or pm event
     * return :
     *  - event id
     *  - event data
     *  - api url
     *  - event model
     *
     * @return {object}
     */
    getEventDetails() {
      if (!this.selected_event) {
        return null;
      }
      let url, data, id, model;
      id = this.selected_event.id;

      url =
        this.selected_event.class === "PM"
          ? "rep/v1/planner/" + id
          : "rep/v1/workplace-planner/" + id;
      model = () => {
        if (this.selected_event.class === "PM") {
          this.$store.dispatch("getPlanner", true);
          this.$store.dispatch("customerGetAll", true);
        } else {
          this.$store.dispatch("getWorkplacePlanner", true);
          this.$store.dispatch("workplaceGetAll", true);
        }
      };

      data = {
        date: this.selected_event.start,
        _method: "PUT"
      };
      return {
        id,
        url,
        data,
        model
      };
    },
    /**
     * duplicate date plans
     *
     */
    duplicateDay() {
      if(this.isSubmittedPlans) {
        return;
      }
      let data = {
        date: this.selected_day,
        replan_date: this.duplicate_date,
        _method: "PUT"
      };
      httpCall.post("rep/v1/planner/duplicate", data).then(({ data }) => {
        data.message = data.data;
        this.handleResponse(data, data => {
          data.rejected.forEach(item => {
            this.$toasted.error(item);
          });
          this.$store.dispatch("customerGetAll", true);
          this.$store.dispatch("getPlanner", true);
          this.show_day_modal = false;
        });
      });
    },
    /**
     * Clear date plan
     *
     */
    clearDay() {
      if(this.isSubmittedPlans) {
        return;
      }
      let data = {
        date: this.selected_day,
        _method: "DELETE"
      };
      httpCall.post("rep/v1/planner/clear-day", data).then(({ data }) => {
        data.message = data.data;
        this.handleResponse(data, data => {
          this.$store.dispatch("customerGetAll", true);
          this.$store.dispatch("getPlanner", true);
          this.show_day_modal = false;
        });
      });
    },
    /**
     * flip summery section icon effect
     *
     */
    flipIcon() {
      if (this.summery_icon === "fa-chevron-circle-down") {
        this.summery_icon = "fa-chevron-circle-up";
      } else {
        this.summery_icon = "fa-chevron-circle-down";
      }
    },
    /**
     * generate visit link
     */
    generateVisitLink() {
      if (!this.selected_event) {
        return;
      }
      if (this.selected_event.class === "AM") {
        let link = `/reports/add/am/${this.selected_event.workplace.id}`;
        this.show_event_modal = false;
        setTimeout(() => {
          this.$router.push(link);
        }, 300);
      } else {
        let link = `/reports/add/pm/${this.selected_event.customer_id}`;
        this.show_event_modal = false;
        setTimeout(() => {
          this.$router.push(link);
        }, 300);
      }
    },
    /**
     * submit all plan
     *
     */
    submitPlan() {
      httpCall
        .post("rep/v1/planner/submit")
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.$store.dispatch("getPlanner", true);
          });
        })
        .then(() => {
          httpCall.post("rep/v1/workplace-planner/submit").then(({ data }) => {
            this.handleResponse(data, data => {
              this.$store.dispatch("getWorkplacePlanner", true);
            });
          });
        })
        .catch(err => console.log(err));
    },
    /**
     * close non field activity modal
     */
    closeNonFieldActivityModal() {
      this.active_non_field_modal = false;
    },
    /**
     * edit field activity modal
     */
    editNonFieldActivity() {
      if(this.isSubmittedPlans) {
        return;
      }
      let request = {
        start : this.selected_event.date_start,
        end: this.selected_event.date_end,
        _method: 'PUT'
      };
      let id = this.selected_event.id;
      httpCall.post('activity-planner/'+id,request)
      .then(({data}) => {
        this.handleResponse(data, data => {
          this.$store.dispatch('getNonFieldActivityPlans', true);
          this.active_non_field_modal = false;
        });
      }).catch(err => {
        console.log(err)
      });
    },
    /**
     * delete field activity modal
     *
     */
    deleteNonFieldActivity() {
      if(this.isSubmittedPlans) {
        return;
      }
      let id = this.selected_event.id;
      httpCall.post('activity-planner/'+id,{_method: 'DELETE'})
      .then(({data}) => {
        this.handleResponse(data, data => {
          this.active_non_field_modal = false;
          this.$store.dispatch('getNonFieldActivityPlans', true);
        })
      }).catch(err => console.log(err))
    },
    /**
     * redirect to activity report page
     *
     */
    goToActivityReport() {
      this.active_non_field_modal = false;
      setTimeout(() => {
        this.$router.push(`/reports/add/activity-report?type=${this.selected_event.type}`);
      },300)
    }
  },
  computed: {
    /**
     * get all plans am and pm
     */
    plans() {
      return this.$store.getters.allPlans;
    },
    /**
     * is plan is already fetched
     */
    isPlansFetched() {
      return this.$store.getters.isPlansFetched;
    },
    /**
     * get plan summery
     *
     * @return {object}
     */
    planSummery() {
      let amPlans = this.$store.getters.amPlans;
      let pmPlans = this.$store.getters.plans;
      let workplaces = filterData(amPlans, "workplace.name");
      let customers = filterData(pmPlans, "title");
      let days = filterData(this.plans, "start");
      return {
        workplaces,
        customers,
        days
      };
    },
    isSubmittedPlans() {
      return this.$store.getters.isSubmittedPlans;
    },
    activeCycle() {
      return this.$store.getters.activeCycle;
    }
  }
};
</script>

<style></style>

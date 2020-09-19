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
      <button class="btn btn-success btn-sm">
        <span><i class="fa  fa-calendar-minus"></i></span>
        <span>Submit</span>
      </button>
    </div>
    <!-- end planner home navbar -->
    <div class="p-2">
      <!-- planner -->
      <vue-cal
        active-view="week"
        :selectedDate="$attrs.date"
        :disable-views="['years']"
        class="vuecal--green-theme"
        ref="planner"
        :events="plans"
        :time="false"
        v-if="isPlansFetched"
        :on-event-click="onEventClick"
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
      @onClose="
        () => {
          show_event_modal = false;
        }
      "
    >
      <template v-slot:header v-if="selected_event">
        <span
          >Edit {{ selected_event.class === "PM" ? "Customer" : "Hospital" }}
          {{ selected_event.title }} plan on date
          {{ selected_event.start }}</span
        >
      </template>
      <template v-slot:body v-if="selected_event">
        <div>
          <p>{{ selected_event.title }}</p>
          <div class="form-group row mx-auto">
            <label for="replan_date" class="text-muted col-auto">Date</label>
            <input
              type="date"
              class="form-control form-control-sm col"
              id="replan_date"
              v-model="selected_event.start"
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
            <button class="btn btn-sm btn-success" @click="updateEvent">
              <span><i class="fa fa-save"></i></span>
              <span>save</span>
            </button>
            <button class="btn btn-sm btn-danger" >
              <span><i class="fa fa-trash"></i></span>
              <span>remove</span>
            </button>
          </div>
        </div>
      </template>
    </modal-fade>
  </div>
</template>

<script>
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import ModalFade from "../../../components/ModalFade";
import { httpCall } from "../../helpers/http-service";
export default {
  components: {
    VueCal,
    ModalFade
  },
  data: () => ({
    show_event_modal: false,
    show_cell_modal: false,
    selected_event: null,
    selected_cell: null
  }),
  methods: {
    /**
     * handle event click
     *
     * update or delete plan
     *
     * @param {object} e [event]
     */
    onEventClick(e) {
      let id = e.id;
      let date = new Date(e.start).format("YYYY-MM-DD");
      this.selected_event = e;
      this.selected_event.start = new Date(e.start).format("YYYY-MM-DD");
      this.show_event_modal = true;
    },
    /**
     * update event
     *
     */
    updateEvent() {
      let eventDetails = this.getEventDetails();
      if (!eventDetails) {
        return;
      }
      httpCall
        .post(eventDetails.url, eventDetails.data)
        .then(({ data }) => {
          if (data.code === 400 || data.code === 301) {
            this.handlResponseError(data);
          } else {
            this.$toasted.success(data.data, {
              icon: {
                name: "check",
                after: true
              }
            });
          }
        })
        .finally(() => {
          this.show_event_modal = false;
          if (eventDetails.model === "customers") {
            this.$store.dispatch("getPlanner", true);
            this.$store.dispatch("customerGetAll", true);
          } else {
            this.$store.dispatch("getWorkplacePlanner", true);
            this.$store.dispatch("workplaceGetAll", true);
          }
        });
    },
    /**
     * get event details
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
      model = this.selected_event.class === "PM" ? "customers" : "workplace";

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
    }
  },
  computed: {
    plans() {
      let am = this.$store.getters.amPlans;
      let pm = this.$store.getters.plans;
      let plans = [...am, ...pm];
      return plans;
    },
    isPlansFetched() {
      return this.$store.getters.isPlansFetched;
    }
  }
};
</script>

<style></style>

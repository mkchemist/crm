<template>
  <div class="px-0 shadow rounded pb-5 my-2 bg-light">
    <p class="alert alert-warning">
      <span class="fa fa-calendar-plus"></span>
      <span class="font-weight-bold">Plan a health day</span>
    </p>
    <div class="p-2">
      <p v-if="locked" class="alert alert-warning">
        <span class="fa fa-exclamation-triangle"></span>
        <span class="font-weight-bold">You cannot add or update plans while plan is submitted or approved</span>
      </p>
      <div class="row mx-auto">
        <!-- Pharmacy list -->
        <div class="col-lg-6 px-2">
          <div class="px-0 shadow-sm">
            <div class="bg-primary text-light p-2">
              <p class="mb-0">
                <span> Date : {{ $attrs.date }}</span>
                <span class="float-right badge badge-light">
                  selected
                  <span class="fa fa-check" v-if="selected.length"></span>
                  <span v-else class="fa fa-times"></span>
                </span>
              </p>
            </div>
            <div class="p-2 bg-white">
              <button
                class="btn btn-sm btn-primary"
                type="button"
                @click="openFilterBox"
              >
                <span class="fa fa-filter"></span>
                <span>Filter</span>
              </button>
              <data-filter-box
                :show="showFilterBox"
                :onClose="closeFilterBox"
                :onReset="onReset"
                :onFilter="onFilter"
                :data="pharmacies"
                :queryOnly="false"
                :queryKeys="['area', 'brick', 'type']"
              />
            </div>
            <div style="height:200px;overflow:auto" class="bg-white p-2">
              <ul class="nav" v-if="pharmacies.length" id="pharmacy_list">
                <li
                  class="nav-item col-12 border-bottom"
                  v-for="(pharmacy, i) in pharmacies"
                  :key="`location_${i}`"
                >
                  <input type="checkbox" @click="togglePlan(pharmacy)" />
                  <span class="form-check-label text-muted small">{{
                    pharmacy.name
                  }}</span>
                </li>
              </ul>
              <loader-component v-else></loader-component>
            </div>
          </div>
        </div>
        <!-- planned list -->
        <div class="col-lg-6 px-0 px-2">
          <div class="px-0 shadow-sm">
            <div class="bg-primary text-light p-2">
              <p class="mb-0">
                <span> Date : {{ $attrs.date }}</span>
                <span class="float-right badge badge-light">
                  Planned: {{ updated.length }}</span
                >
              </p>
            </div>
            <div style="height:200px;overflow:auto" class="bg-white p-2">
              <ul class="nav" v-if="planned.length">
                <li
                  class="nav-item col-12 border-bottom clearfix"
                  v-for="plan in planned"
                  :key="plan.id"
                >
                  <input type="checkbox" @click="selectPlanToRemove(plan.id)" />
                  <span class="form-check-label text-muted small"
                    ><span v-html="plan.title"></span
                  ></span>
                  <span class="float-right badge badge-info">{{
                    plan.type === "regular" ? "Brick" : "Health Day"
                  }}</span>
                </li>
              </ul>
              <div class="py-5" v-else>
                <no-data-to-show />
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <planner-actions
        :date="$attrs.date"
        :type="type"
        :store="selected"
        :update="updated"
      />
    </div>
  </div>
</template>

<script>
import DataFilterBox from "../../../components/DataFilterBox.vue";
import { checkerSelect } from "../../../helpers/helpers";
import { asyncDataFlow, httpCall } from "../../../helpers/http-service";
import PlannerActions from "../../components/PlannerActions.vue";

export default {
  components: { DataFilterBox, PlannerActions },
  mounted() {
    this.$store.dispatch("fetchPharmacies");
  },
  computed: {
    planned() {
      this.resetUpdatedPlans();
      return this.$store.getters.allPlans.filter(
        plan => plan.start === this.$attrs.date
      );
    },
    pharmacies() {
      if (this.shouldRenderFilter) {
        return this.filteredList;
      }
      return this.$store.getters.allPharmacies;
    },
    locked() {
      return this.$store.getters.isPlannerLocked;
    }
  },
  data: () => ({
    selected: [],
    updated: [],
    shouldRenderFilter: false,
    filteredList: [],
    showFilterBox: false,
    type: "health_day"
  }),
  methods: {
    /* open filter box */
    openFilterBox() {
      this.showFilterBox = true;
    },
    /**
     * close filter box
     */
    closeFilterBox() {
      this.showFilterBox = false;
    },
    /**
     * filter list
     *
     * @param {Array} data [list of pharmacies]
     */
    onFilter(query, data) {
      asyncDataFlow(data, data => {
        this.shouldRenderFilter = true;
        this.filteredList = data;
      });
    },
    /**
     * Reset filter
     *
     *
     */
    onReset() {
      asyncDataFlow([], data => {
        this.shouldRenderFilter = false;
        this.filteredList = [];
      });
    },
    /**
     * toggle plan
     *
     * @param {String} brick
     */
    togglePlan(pharmacy) {
      let inputs = document.querySelectorAll(
        '#pharmacy_list input[type="checkbox"]'
      );
      if (event.target.checked) {
        inputs.forEach(input => (input.checked = false));
        event.target.checked = true;
        this.selected = [];
        this.selected.push(pharmacy);
      } else {
        this.selected = [];
      }
    },
    /**
     * add or remove plan to updated container
     *
     * @param {int} id
     */
    selectPlanToRemove(id) {
      this.updated = checkerSelect(this.updated, id, event);
    },
    resetUpdatedPlans() {
      this.updated = [];
    }
  }
};
</script>

<style></style>

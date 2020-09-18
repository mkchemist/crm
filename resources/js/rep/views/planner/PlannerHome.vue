<template>
  <div>
    <p class="alert alert-success">
      <span><i class="fa fa-calendar-check"></i></span>
      <span>Planner</span>
    </p>
    <!-- planner home navbar -->
    <div class="p-2 text-center">
      <router-link to="/planner/add" class="btn btn-info btn-sm">
        <span><i class="fa fa-calendar-plus"></i></span>
        <span>Add Plan</span>
      </router-link>
      <router-link to="/planner/replan" class="btn btn-secondary btn-sm">
        <span><i class="fa  fa-redo"></i></span>
        <span>Replan</span>
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
  </div>
</template>

<script>
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
export default {
  components: {
    VueCal
  },
  data: () => ({}),
  methods: {},
  computed: {
    plans() {
      return this.$store.getters.plans;
    },
    isPlansFetched() {
      return this.$store.getters.isPlansFetched;
    }
  }
};
</script>

<style></style>

<template>
  <div class="shadow rounded p-2">
    <div class="p-2">
      <vue-cal
        :events="$attrs.data"
        :startWeekOnSunday="true"
        :hide-weekdays="[5]"
        :min-date="activeCycle.start"
        class="vuecal--green-theme bg-white"
        :time="false"
        :selectedDate="$attrs.date"
        :activeView="'week'"
        :disableViews="['years', 'year']"
        style="max-height:500px;overflow:auto"
      />
    </div>
  </div>
</template>

<script>
import VueCal from "vue-cal";
import { filterData } from '../../../helpers/helpers';
export default {
  components: {
    VueCal
  },
  computed: {
    activeCycle() {
      return this.$store.getters.activeCycle;
    },
    summery() {
      return filterData(this.$attrs.data,['start', 'title', 'class'])
    }
  }
};
</script>

<style></style>

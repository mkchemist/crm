<template>
  <div>
    <div class="row mx-auto">
      <div class="col-lg-3" id="side_datepicker">
        <vue-cal
          class="vuecal--date-picker vuecal--rounded-theme vuecal--green-theme"
          xsmall
          :time="false"
          active-view="month"
          :disable-views="['years', 'year', 'week', 'day']"
          hide-view-selector
          :selectedDate="date"
          @cell-click="onDayClick"
          style="max-height:250px"
        >
          <template v-slot:arrow-prev>
            <i class="fa fa-chevron-circle-left text-success"></i>
          </template>
          <template v-slot:arrow-next>
            <i class="fa fa-chevron-circle-right text-success"></i>
          </template>
        </vue-cal>
      </div>
      <div class="col-lg-9">
        <div class="px-0 shadow pb-3">
          <router-view class="page-fade" :date="date"></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
export default {
  created() {
    this.$store.dispatch("customerGetAll").then(() => {
      this.$store.dispatch("getPlanner");
    });
  },
  components: {
    VueCal
  },
  data: () => ({
    date: new Date().format('YYYY-MM-DD')
  }),
  methods: {
    onDayClick(date) {
      this.date = new Date(date).format("YYYY-MM-DD");
    }
  }
};
</script>

<style></style>

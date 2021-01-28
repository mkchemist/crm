<template>
  <div class="px-0 shadow rounded">
    <p class="alert alert-success">
      <span>Pharmacy Info.</span>
    </p>
    <div class="p-2">
      <h3 class="text-primary">{{ $attrs.data.name }}</h3>
      <div class="row mx-auto p-2 border rounded">
        <div class="col-lg">
          <p class="mb-0 small border-bottom p-1">
            <span>Address : </span
            ><span class="font-weight-bold text-primary">{{
              $attrs.data.address
            }}</span>
          </p>
          <p class="mb-0 small border-bottom p-1">
            <span>Brick : </span
            ><span class="font-weight-bold text-primary">{{
              $attrs.data.brick
            }}</span>
          </p>
          <p class="mb-0 small border-bottom p-1">
            <span>Area : </span
            ><span class="font-weight-bold text-primary">{{
              $attrs.data.area
            }}</span>
          </p>
          <p class="mb-0 small border-bottom p-1">
            <span>District : </span
            ><span class="font-weight-bold text-primary">{{
              $attrs.data.district
            }}</span>
          </p>
          <p class="mb-0 small border-bottom p-1">
            <span>Territory : </span
            ><span class="font-weight-bold text-primary">{{
              $attrs.data.territory
            }}</span>
          </p>
        </div>
        <div class="col-lg">
          <p class="mb-0 small border-bottom p-1">
            <span>Type : </span
            ><span class="font-weight-bold text-primary">{{
              $attrs.data.type
            }}</span>
          </p>
          <p class="mb-0 small border-bottom p-1">
            <span>Key Person : </span
            ><span class="font-weight-bold text-primary">{{
              $attrs.data.key_person
            }}</span>
          </p>
          <p class="mb-0 small border-bottom p-1">
            <span>Visits : </span
            ><span class="font-weight-bold text-primary">{{ visits }}</span>
          </p>
          <p class="mb-0 small border-bottom p-1">
            <span>Health Days: </span
            ><span class="font-weight-bold text-primary">{{ healthDays }}</span>
          </p>
          <p class="mb-0 small border-bottom p-1">
            <span>Last visit : </span
            ><span class="font-weight-bold text-primary">{{ lastVisit }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { filterData } from "../../../helpers/helpers";
export default {
  computed: {
    healthDays() {
      try {
        let healthDays = this.$attrs.data.otc_report.filter(
          item => item.type === "health-day"
        );
        let dates = filterData(healthDays, "visit_date");
        return Object.keys(dates).length;
      } catch (e) {
        console.log(e);
      }
    },
    visits() {
      try {
        let visits = this.$attrs.data.otc_report.filter(
          item => item.type === "regular"
        );
        let dates = filterData(visits, "visit_date");
        return Object.keys(dates).length;
      } catch (e) {
        console.log(e);
      }
    },
    lastVisit() {
      try {
        let visits = this.$attrs.data.otc_report.filter(
          item => item.type === "regular"
        );
        return visits[visits.length - 1].visit_date;
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>

<style></style>

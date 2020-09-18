<template>
  <div>
    <div class="row mx-auto">
      <div class="col-lg-3">
        <planner-filter />
      </div>
      <div class="col-lg-9">
        <div class="px-0 shadow">
          <p class="alert alert-success">
            <span><i class="fa fa-redo"></i></span>
            <span class="font-weight-bold">Replanning</span>
          </p>
          <div class="p-2 text-right">
            <router-link to="/planner" class="btn btn-sm btn-dark">
              <span><i class="fa fa-chevron-circle-left"></i></span>
              <span>Back</span>
            </router-link>
            <router-link to="/planner/replan" class="btn btn-sm btn-info">
              <span><i class="fa fa-redo"></i></span>
              <span>Add Plan</span>
            </router-link>
          </div>
          <div class="p-2">
            <p>
              Replanning goes here
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PlannerFilter from "../../components/PlannerFilter"
export default {
  components:{
    PlannerFilter
  }
}
</script>

<style>

</style>

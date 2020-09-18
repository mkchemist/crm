<template>
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
</template>

<script>
export default {};
</script>

<style></style>

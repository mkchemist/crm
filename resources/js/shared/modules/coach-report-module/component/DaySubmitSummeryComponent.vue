<template>
  <div style="min-height:300px">
    <!-- Performance Summery -->
    <div class="p-2 my-2 border rounded">
      <p class="mb-0 text-muted font-italic font-weight-bold">Performance Summery</p>

      <ul class="nav">
        <li
          class="nav-item text-muted small col-12 border-bottom p-1 form-inline justify-content-between"
        >
          <span>Pre-Call</span>
          <select name="" id="" v-model="summery.performance_summery.pre_call">
            <option :value="null"></option>
            <option value="S">S</option>
            <option value="U">U</option>
          </select>
        </li>
        <li
          class="nav-item text-muted small col-12 border-bottom p-1 form-inline justify-content-between"
        >
          <span>Opening</span>
          <select name="" id="" v-model="summery.performance_summery.opening">
            <option :value="null"></option>
            <option value="S">S</option>
            <option value="U">U</option>
          </select>
        </li>
        <li
          class="nav-item text-muted small col-12 border-bottom p-1 form-inline justify-content-between"
        >
          <span>Initial Probe</span>
          <select
            name=""
            id=""
            v-model="summery.performance_summery.initial_probe"
          >
            <option :value="null"></option>
            <option value="S">S</option>
            <option value="U">U</option>
          </select>
        </li>
        <li
          class="nav-item text-muted small col-12 border-bottom p-1 form-inline justify-content-between"
        >
          <span>Promotional Message</span>
          <select
            name=""
            id=""
            v-model="summery.performance_summery.promotional_message"
          >
            <option :value="null"></option>
            <option value="S">S</option>
            <option value="U">U</option>
          </select>
        </li>
        <li
          class="nav-item text-muted small col-12 border-bottom p-1 form-inline justify-content-between"
        >
          <span>Close</span>
          <select name="" id="" v-model="summery.performance_summery.close">
            <option :value="null"></option>
            <option value="S">S</option>
            <option value="U">U</option>
          </select>
        </li>
        <li
          class="nav-item text-muted small col-12 border-bottom p-1 form-inline justify-content-between"
        >
          <span>Post Call Analysis</span>
          <select
            name=""
            id=""
            v-model="summery.performance_summery.post_call_analysis"
          >
            <option :value="null"></option>
            <option value="S">S</option>
            <option value="U">U</option>
          </select>
        </li>
        <li
          class="nav-item text-muted small col-12 border-bottom p-1 form-inline justify-content-between"
        >
          <span>Resource Optimization</span>
          <select
            name=""
            id=""
            v-model="summery.performance_summery.resource_optimization"
          >
            <option :value="null"></option>
            <option value="S">S</option>
            <option value="U">U</option>
          </select>
        </li>
      </ul>
    </div>
    <!-- End of Performance Summery -->
    <!-- Action Plan -->
    <div class="p-2 my-2 border rounded">
      <p class="mb-0 text-muted font-italic font-weight-bold">Action Plan</p>

      <ul class="nav">
        <li
          class="nav-item text-muted small col-12 border-bottom p-1 form-inline justify-content-between"
        >
          <span>Action By FSR</span>
          <select name="" id="" v-model="summery.action_plan.action_by_fsr">
            <option :value="null"></option>
            <option value="Reading assignment">Reading assignment</option>
            <option value="Field Assignment">Field Assignment</option>
          </select>
        </li>
        <li
          class="nav-item text-muted small col-12 border-bottom p-1 form-inline justify-content-between"
        >
          <span>Action by FLM</span>
          <select name="" id="" v-model="summery.action_plan.action_by_flm">
            <option :value="null"></option>
            <option value="Coaching">Coaching</option>
            <option value="Role Play">Role Play</option>
          </select>
        </li>
        <li
          class="nav-item text-muted small col-12 border-bottom p-1 form-inline justify-content-between"
        >
          <span>Action by Others</span>
          <select
            name=""
            id=""
            v-model="summery.action_plan.action_by_others"
          >
            <option :value="null"></option>
            <option value="Training">Training</option>
            <option value="Quiz">Quiz</option>
          </select>
        </li>
      </ul>
    </div>
    <!-- End of action plan -->
    <!-- Next Visit Target -->
    <div class="p-2 my-2 border rounded">
      <p class="mb-0 text-muted font-italic font-weight-bold">Next Visit Target</p>

      <ul class="nav">
        <li
          class="nav-item text-muted small col-12 border-bottom p-1 form-inline justify-content-between"
        >
          <span>Selling Skills</span>
          <select name="" id="" v-model="summery.next_visit_target.selling_skills">
            <option :value="null"></option>
            <option value="Opening">Opening</option>
            <option value="Initial Probe">Initial Probe</option>
            <option value="Promotional Message">Promotional Message</option>
            <option value="Close">Close</option>
          </select>
        </li>
        <li
          class="nav-item text-muted small col-12 border-bottom p-1 form-inline justify-content-between"
        >
          <span>Product Knowledge</span>
          <select name="" id="" v-model="summery.next_visit_target.product_knowledge">
            <option :value="null"></option>
            <option value="Product Knowledge">Product Knowledge</option>
            <option value="Pre/ Post-Call Planning">Pre/ Post-Call Planning</option>
            <option value="Competition">Competition</option>
            <option value="Market Dynamics">Market Dynamics</option>
          </select>
        </li>
        <li
          class="nav-item text-muted small col-12 border-bottom p-1 form-inline justify-content-between"
        >
          <span>Territory Management</span>
          <select name="" id="" v-model="summery.next_visit_target.territory_management">
            <option :value="null"></option>
            <option value="Routing / Tracking">Routing / Tracking</option>
            <option value="Pre/ Post-Call Planning">Pre/ Post-Call Planning</option>
            <option value="Resource Optimization">Resource Optimization</option>
            <option value="Business Planning">Business Planning</option>
          </select>
        </li>
      </ul>
    </div>
    <!-- End of Next Visit Target -->

  </div>
</template>

<script>
export default {
  props: {
    summery: {
      type: Object,
      required: true
    }
  }
};
</script>

<style></style>

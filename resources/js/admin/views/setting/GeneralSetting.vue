<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-success">
      <span><i class="fa fa-cogs"></i></span>
      <span class="font-weight-bold">General Setting</span>
    </p>
    <div class="p-2">
      <!-- Report Interval -->
      <setting-report-interval />
      <!-- End of Report Interval -->
      <!-- Active Cycle -->
      <setting-active-cycle />
      <!--  End of active cycle -->
      <!-- field activity types -->
      <setting-field-activity-types />
      <!-- end of field activity types -->
      <!-- Non field activity types -->
      <setting-non-field-activity-types />
      <!-- end of non field activity types -->
      <!-- Force assets refresh -->
      <setting-force-refresh />
      <!-- end Force assets refresh -->
    </div>
  </div>
</template>

<script>
import SettingFieldActivityTypes from '../../components/SettingFieldActivityTypes';
import SettingNonFieldActivityTypes from '../../components/SettingNonFieldActivityTypes';
import SettingReportInterval from '../../components/SettingReportInterval.vue';
import SettingActiveCycle from '../../components/SettingActiveCycle.vue';
import SettingForceRefresh from '../../components/SettingForceRefresh.vue';
export default {

  components: {
    SettingFieldActivityTypes,
    SettingNonFieldActivityTypes,
    SettingReportInterval,
    SettingActiveCycle,
    SettingForceRefresh,
  },

};
</script>

<style></style>

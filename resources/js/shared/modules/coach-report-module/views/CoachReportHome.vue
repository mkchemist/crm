<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-success">
      <span class="fa fa-handshake"></span>
      <span class="font-weight-bold">Coach Reports</span>
    </p>
    <div class="p-2">
      <div class="row mx-auto">
        <!-- Filter boxes -->
        <div class="col-lg-3">
          <!-- District Filter -->
          <div class="my-2 border rounded p-2" v-if="coaches.length">
            <div class="form-group">
              <label for="" class="text-muted">Coach</label>
              <select name="district" id="district" v-model="coach" class="form-control form-control-sm">
                <option :value="null">All</option>
                <option v-for="dm in coaches" :key="dm.id"  :value="dm.id">{{ dm.name }}</option>
              </select>
            </div>
            <div class="form-group text-right">
              <button type="button" class="btn btn-sm btn-primary" @click="selectCoach">
                <span class="fa fa-check-circle"></span>
                <span>select</span>
              </button>
            </div>
          </div>

        </div>
        <!-- End of filter boxes -->
        <div class="col-lg-9">
          <div v-if="Object.keys(reports).length">
            <router-view :data="reports"></router-view>
          </div>
          <div v-else-if="!loadingStarted">
            <div class="jumbotron text-center">
              <h2 class="text-primary">Select District Manager to start loading</h2>
            </div>
          </div>
          <div v-else-if="fetched">
            <no-data-to-show />
          </div>
          <loader-component v-else></loader-component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DateFilterBox from '../../../../components/DateFilterBox.vue';
import NoDataToShow from '../../../../components/NoDataToShow.vue';
import { sortBy } from '../../../../helpers/helpers';
export default {
  components: { DateFilterBox, NoDataToShow },
  mounted() {
    this.$store.dispatch('fetchCoachReportModuleUserRelations')
    this.$store.dispatch('fetchCoachReportsModuleReports')
  },
  computed: {
    reps() {
      return this.$store.getters.coachModuleReps;
    },
    coaches() {
      return sortBy(this.$store.getters.coachModuleCoaches, "name")
    },
    reports() {
      return this.$store.getters.coachModuleReports;
    },
    fetched() {
      return this.$store.getters.isCoachReportModuleReportsFetched
    },
    loadingStarted() {
      return this.$store.getters.isCoachReportModuleLoadingStarted;
    }
  },
  data: () => ({
    coach: null
  }),
  methods: {
    onFilter(data) {

    },
    onReset() {

    },
    selectCoach() {
      this.$store.commit('setCoachModuleFetchingCoach', this.coach);
      this.$store.dispatch('fetchCoachReportsModuleReports', {force: true})
    }
  }
}
</script>

<style>

</style>

<template>
  <div class="px-0 shadow rounded">
    <p class="alert alert-success">
      <span class="fa fa-book-reader"></span>
      <span class="font-weight-bold">View Coaching visit</span>
    </p>
    <div class="p-2">
      <div class="p-2" v-if="report">
        <div class="p-2">
          <button class="btn btn-sm btn-dark" @click="$router.back()">
            <span class="fa fa-chevron-circle-left"></span>
            <span>back</span>
          </button>
          <button class="btn btn-sm btn-danger" @click="deleteVisit" :disabled="!this.isOwner && currentUser.role !== 'admin'">
            <span class="fa fa-trash"></span>
            <span>Remove</span>
          </button>
          <template class="p-2 my-2" v-if="isOwner && isOpened">
            <button class="btn btn-sm btn-warning" @click="toggleMode" v-if="!editMode">
              <span class="fa fa-edit"></span>
              <span>Edit</span>
            </button>
            <button class="btn btn-sm btn-success" v-if="editMode" @click="saveReport">
              <span class="fa fa-save"></span>
              <span>Save</span>
            </button>
            <button class="btn btn-sm btn-danger" @click="toggleMode" v-if="editMode" >
              <span class="fa fa-times"></span>
              <span>Cancel</span>
            </button>
            <button class="btn btn-sm btn-secondary" v-if="editMode" @click="resetReport">
              <span class="fa fa-redo"></span>
              <span>Reset</span>
            </button>
          </template>
        </div>
        <coach-report-component :report="report" :editMode="editMode"/>
      </div>
    </div>
  </div>
</template>

<script>
import CoachReportComponent from '../../../../components/CoachReportComponent.vue';
import { COACH_REPORT } from '../../../../helpers/constants';
import { httpCall } from '../../../../helpers/http-service'
export default {
  mounted() {
    this.fetchReportRequest();
  },
  computed:{
    currentUser() {
      let user = this.$store.state.CoachReportModule.moduleUser;
      return user;
    },
    isOwner() {
      if(!this.report) {
        return false;
      }
      try {
        let user = this.currentUser.id;
        let coachId = this.report.coach_id;
        return user === coachId;

      }catch(e) {
        console.log(e)
        return false;
      }
    },
    isOpened() {
      return this.report.day_submitted === 0;
    }
  },
  components: {
    CoachReportComponent

  },
  data: () => ({
    report: null,
    fetched: false,
    editMode: false
  }),
  methods: {
    fetchReportRequest() {
      let id = this.$route.params.id;
      return httpCall.get('v1/coach-reports/'+parseInt(id))
      .then(({data}) => {
        this.report = data.data;
        try {
          this.report['data'] = JSON.parse(this.report['data']);
        } catch(e) {
          this.report['data'] = Object.assign({}, COACH_REPORT)
        }
        this.fetched = true;
      }).catch(err => console.log(err))
    },
    toggleMode() {
      this.editMode= !this.editMode
    },
    saveReport() {
      let id = this.$route.params.id;
      let request = {
        data: JSON.stringify(this.report.data),
        date: this.report.visit_date,
        _method: "PUT"
      };

      httpCall.post("v1/coach-reports/"+id, request)
      .then(({data}) => {
        this.handleResponse(data, data => {
          this.fetchReportRequest();
          this.$store.dispatch('fetchCoachReportsModuleReports', {force: true})
          this.editMode = false;
        });
      }).catch(err => console.log(err))
    },
    resetReport(){
      for(let key in this.report.data) {
        for(let i in this.report.data[key]) {
          this.report.data[key][i] = "";
        }
      }
    },
    deleteVisit(){
      this.$swal({
        title: 'Are you sure ?',
        text: 'you want to delete this visit',
        icon: 'warning',
        showCancelButton: true
      }).then(res => {
        if(res.isConfirmed) {
          let id = this.report.id;
          return httpCall.post('v1/coach-reports/'+id, {
            _method: 'DELETE'
          }).then(({data}) => {
            this.handleResponse(data, data => {
              this.$store.dispatch('fetchCoachReportsModuleReports', {force: true})
              this.$router.back()
              this.$swal({
                title: "Deleted",
                icon: "success"
              })
            });
          }).catch(err => console.log(err))
        }
      })
    }
  }
}
</script>

<style>

</style>

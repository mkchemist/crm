<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-success">
      <span class="fa fa-user-cog"></span>
      <span class="font-weight-bold">Planner Approval</span>
    </p>
    <div class="p-2">
      <div>
        <div class="form-group">
          <label for="">Rep</label>
          <select
            name="rep"
            id="rep"
            class="form-control form-control-sm"
            v-model="rep"
            :disabled="!reps.length"
          >
            <option :value="null">Select Rep</option>
            <option v-for="rep in reps" :key="rep.id" :value="rep.id">{{
              rep.name
            }}</option>
          </select>
        </div>
        <div class="form-group text-right">
          <button
            class="btn btn-sm btn-primary"
            @click="selectRep"
            :disabled="!rep"
          >
            <span class="fa fa-check-circle"></span>
            <span>ok</span>
          </button>
          <button
            class="btn btn-sm btn-secondary"
            @click="reset"
            :disabled="!rep"
          >
            <span class="fa fa-redo"></span>
            <span>reset</span>
          </button>
        </div>
      </div>
      <div class="p-2">
        <div class="p-2" v-if="plans.length">
          <div class="p-2 text-right">
            <button class="btn btn-sm btn-primary" @click="approvePlans">
              <span class="fa fa-check-circle"></span>
              <span>Approve</span>
            </button>
            <button class="btn btn-sm btn-secondary" @click="rejectPlans">
              <span class="fa fa-times-circle"></span>
              <span>Reject</span>
            </button>
            <button class="btn btn-sm btn-danger" @click="resetPlans">
              <span class="fa fa-calendar"></span>
              <span>Reset</span>
            </button>
          </div>
          <table-component
            :data="plans"
            :heads="heads"
            :unselectable="true"
            :headClass="`bg-success text-light`"
          ></table-component>
        </div>
        <div class="" v-else-if="isPlanFetched">
          <no-data-to-show :title="`Select Rep First`" />
        </div>
        <loader-component v-else></loader-component>
      </div>
    </div>
  </div>
</template>

<script>
import NoDataToShow from "../../../components/NoDataToShow.vue";
import TableComponent from "../../../components/TableComponent.vue";

import { sortBy } from "../../../helpers/helpers";
import { httpCall } from "../../../helpers/http-service";
export default {
  components: {
    NoDataToShow,
    TableComponent
  },
  mounted() {
    this.$store.dispatch("getAllUsers");
  },
  data: () => ({
    rep: null,
    plans: [],
    isPlanFetched: true,
    approvalAction: null,
    heads: [
      {
        title: "Date",
        name: "Date"
      },
      {
        title: "Rep",
        name: "Rep"
      },
      {
        title: "Customer",
        name: "Customer"
      },
      {
        title: "Specialty",
        name: "Specialty"
      },
      {
        title: "Parameter",
        name: "Parameter",
        fallback: "NN"
      },
      {
        title: "Frequency",
        name: "Frequency",
        fallback: 0
      },
      {
        title: "Submitted",
        name: "submitted"
      },
      {
        title: 'Approved',
        name: 'approved'
      },
      {
        title: "Brick",
        name: "Brick"
      },
      {
        title: "Area",
        name: "Area"
      },
      {
        title: "District",
        name: "District"
      },
      {
        title: "Territory",
        name: "Territory"
      }
    ]
  }),
  computed: {
    reps() {
      let users = this.$store.getters.users;
      let reps = users.filter(user => user.role === "rep");
      return sortBy(reps, "name");
    },
    isRepsFetched() {
      return this.$store.getters.allUsersFetched;
    },
    planUser() {
      return this.$store.getters.planUser;
    }
  },
  methods: {
    /**
     * select rep and get rep plans
     *
     */
    selectRep() {
      this.isPlanFetched = false;
      this.plans = [];
      httpCall
        .get("admin/v1/planner", { user: this.rep })
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.plans = data.data.pm;
            this.isPlanFetched = true;
          });
        })
        .catch(err => console.log(err));
    },
    reset() {
      this.plans = [];
      this.isPlanFetched = true;
    },
    approvePlans() {
      this.approvalAction = "approved";
      this.sendApprovalRequest();
    },
    rejectPlans() {
      this.approvalAction = "rejected";
      this.sendApprovalRequest();
    },
    resetPlans() {
      this.approvalAction = "reset";
      this.sendApprovalRequest();
    },
    sendApprovalRequest() {
      let request = {
        user: this.rep,
        action: this.approvalAction
      }
      httpCall.post('admin/v1/planner/approval', request)
      .then(({data}) => {
        this.handleResponse(data, data => {
          this.selectRep();
        });
      }).catch(err => console.log(err));
    }
  }
};
</script>

<style></style>

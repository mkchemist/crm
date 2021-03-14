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
            class="btn btn-sm skin-btn"
            @click="selectRep"
            :disabled="!rep"
          >
            <span class="fa fa-check-circle"></span>
            <span>Select</span>
          </button>
          <button
            class="btn btn-sm btn-secondary"
            @click="reset"
            :disabled="!rep"
          >
            <span class="fa fa-redo"></span>
            <span>reset</span>
          </button>
          <button class="btn btn-sm skin-btn" @click="approveAllPlans">
            <span class="fa fa-check-circle"></span>
            <span>Approve All</span>
          </button>
          <button class="btn btn-sm btn-danger" @click="resetAllPlans">
            <span class="fa fa-calendar"></span>
            <span>Reset All</span>
          </button>
        </div>
      </div>
      <div class="p-2">
        <div class="p-2" v-if="plans.length">
          <div class="p-2 text-right">
            <button class="btn btn-sm skin-btn" @click="approvePlans">
              <span class="fa fa-check-circle"></span>
              <span>Approve</span>
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
            :headClass="`skin-table`"
          >
            <template v-slot:head:before>
              <th>Business Unit</th>
              <th>Area Manager</th>
              <th>District Manager</th>
            </template>
            <template v-slot:body:before="{ item }">
              <td>{{ getRegionalManagerName(item.user_id) }}</td>
              <td>{{ getAreaManagerName(item.user_id) }}</td>
              <td>{{ getDistrictManagerName(item.user_id) }}</td>
            </template>
          </table-component>
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
 async mounted() {
    await this.$store.dispatch("getAllUsers");
  },
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
    },
    dms() {
      return this.$store.getters.dms;
    },
    ams() {
      return this.$store.getters.ams;
    },
    rms() {
      return this.$store.getters.rms;
    }
  },
  data: () => ({
    rep: null,
    plans: [],
    isPlanFetched: true,
    approvalAction: null,
    heads: [
      {
        title: "Rep",
        name: "Rep"
      },
      {
        title: "Date",
        name: "Date"
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
        title: "Approved",
        name: "approved"
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
    /* reset plans data */
    reset() {
      this.plans = [];
      this.isPlanFetched = true;
    },
    /* approve plans */
    approvePlans() {

      this.approvalAction = "approved";
      this.sendApprovalRequest();
    },
    /* reset plans approval */
    resetPlans() {
      this.approvalAction = "reset";
      this.sendApprovalRequest();
    },
    approveAllPlans() {
      this.approvalAction = "approved-all";
      this.sendApprovalRequest();
    },

    resetAllPlans() {
      this.approvalAction = "reset-all";
      this.sendApprovalRequest();
    },
    /* send approval request */
    sendApprovalRequest() {
      let request = {
        user: this.rep,
        action: this.approvalAction
      };
      httpCall
        .post("admin/v1/planner/approval", request)
        .then(({ data }) => {
          this.handleResponse(data, data => {
            if(this.rep) {
              this.selectRep();
            }
          });
        })
        .catch(err => console.log(err));
    },
    getDistrictManagerName(id) {
      let name = "----";
      this.dms.map(user => {
        let reps = user.relations.reps;
        if (reps.includes(id)) {
          name = user.name;
        }
      });
      return name;
    },
    getAreaManagerName(id) {
      let name = "----";
      this.ams.map(user => {
        let reps = user.relations.reps;
        if (reps.includes(id)) {
          name = user.name;
        }
      });
      return name;
    },
    getRegionalManagerName(id) {
      let name = "----";
      this.rms.map(user => {
        let reps = user.relations.reps;
        if (reps.includes(id)) {
          name = user.name;
        }
      });
      return name;
    }
  }
};
</script>

<style></style>

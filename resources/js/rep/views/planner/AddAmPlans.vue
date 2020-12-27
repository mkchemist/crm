<template>
  <div>
    <p class="alert alert-success">
      <span><i class="fa fa-plus-circle"></i></span>
      <span class="font-weight-bold">Add Workplace Plans</span>
    </p>
    <!-- plans control -->
    <div class="p-2 row mx-auto">
      <!-- add plans controller -->
      <div class="col-lg-6 p-2 border rounded" id="workplace_list">
        <p class="bg-warning text-dark p-2" v-if="isSubmittedPlans">This day is submitted , you can't add or delete</p>
        <p class="bg-dark text-light p-2" v-if="selected_workplaces.length">
          Selected : {{ selected_workplaces.length }}
        </p>
        <div class="p-2 text-right">
          <button class="btn btn-sm btn-primary" @click="openFilterModal">
            <span class="fa fa-filter"></span>
            <span>filter</span>
          </button>
        </div>
        <modal-fade :show="show_filter_modal" @onClose="closeFilterModal">
          <template v-slot:header>
            <span class="lead">Filter A.M. workplaces</span>
          </template>
          <template v-slot:body>
            <div>
              <div class="p-2">
                <label>Brick</label>
                <select name="brick" id="brick" class="form-control form-control-sm" :disabled="!filterBricks.length" v-model="selectedBrick">
                  <option v-for="(brick, i) in filterBricks" :key="`brick_${i}`" :value="brick">{{ brick }}</option>
                </select>
              </div>
              <div class="p-2 text-right">
                <button class="btn btn-sm btn-primary" @click="filterWorkplaces">
                  <span class="fa fa-check-circle"></span>
                  <span>ok</span>
                </button>
                <button class="btn btn-sm btn-dark" @click="reset">
                  <span class="fa fa-redo"></span>
                  <span>reset</span>
                </button>
              </div>
            </div>
          </template>
        </modal-fade>
        <div
          v-if="workplaces.length"
          class="border"
          style="height:200px;overflow:auto"
        >
          <table class="table table-striped table-sm small">
            <thead>
              <tr>
                <th></th>
                <th>Workplace</th>
                <th>Address</th>
                <th>Brick</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="workplace in workplaces" :key="workplace.id">
                <td>
                  <input type="checkbox" @click="addToSelected(workplace.id)" :disabled="isSubmittedPlans" />
                </td>
                <td>{{ workplace.name }}</td>
                <td>{{ workplace.address }}</td>
                <td>{{ workplace.brick }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else-if="isWorkplaceFetched" class="text-center pt-5">
          <p class="font-weight-bold">No workplaces found</p>
          <router-link to="/workplaces/add-hospital" class="btn btn-sm btn-primary">
            <span><i class="fa fa-plus-circle"></i></span>
            <span>add workplace</span>
          </router-link>
        </div>
        <div
          class="d-flex justify-content-center align-items-center h-100"
          v-else
        >
          <loader-component></loader-component>
        </div>
      </div>
      <!-- planned workplacess controller -->
      <div class="col-lg-6 p-2 rounded border" id="plans_list">
        <p class="bg-warning text-dark p-2" v-if="isSubmittedPlans">This day is submitted , you can't add or delete</p>
        <p class="bg-dark text-light p-2" v-if="deleted_workplaces.length">
          Selected : {{ deleted_workplaces.length }}
        </p>
        <div class="p-2 border rounded">
          <table class="table table-striped table-sm small table-responsive">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Address</th>
                <th>Brick</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="plan in amPlans" :key="plan.id">
                <td>
                  <input type="checkbox" @click="addToDeleted(plan.id)" :disabled="isSubmittedPlans" />
                </td>
                <td>{{ plan.name }}</td>
                <td>{{ plan.workplace.address }}</td>
                <td>{{ plan.workplace.brick }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- end of planner controller -->
    <hr />
    <!-- plans control -->
    <div class="text-right p-2">
      <router-link to="/planner" class="btn btn-dark btn-sm">
        <span><i class="fa fa-chevron-circle-left"></i></span>
        <span class="font-weight-bold">back</span>
      </router-link>
      <button class="btn btn-sm btn-success" @click="addPlans" :disabled="isSubmittedPlans">
        <span
          class="px-1 text-success bg-light rounded-circle font-weight-bold"
          v-if="selected_workplaces.length"
          >{{ selected_workplaces.length }}</span
        >
        <span class="font-weight-bold">add</span>
      </button>
      <button class="btn btn-sm btn-danger" @click="deletePlans" :disabled="isSubmittedPlans">
        <span
          class="px-1 text-danger bg-light rounded-circle font-weight-bold"
          v-if="deleted_workplaces.length"
          >{{ deleted_workplaces.length }}</span
        >
        <span class="font-weight-bold">delete</span>
      </button>
    </div>
  </div>
</template>

<script>
import { httpCall } from "../../../helpers/http-service";
import ModalFade from "../../../components/ModalFade";

export default {
  created() {
    this.$store.dispatch("workplaceGetAll");
  },
  data: () => ({
    selected_workplaces: [],
    deleted_workplaces: [],
    show_filter_modal: false,
    activeFilter: false,
    selectedBrick: null,
    filteredList:[]
  }),
  components: {
    ModalFade
  },
  computed:{
    amPlans() {
      let data = this.$store.getters.amPlans.filter(
        plan => plan.start === this.$attrs.date
      );
      return data;
    },
    rowWorkplaces() {
      return this.$store.getters.allWorkplaces;

    },
    workplaces() {
      if(this.activeFilter) {
        return this.filteredList;
      }
      return this.$store.getters.allWorkplaces;
    },
    isPlansFetched() {
      return this.$store.getters.isAmPlansFetched;
    },
    isWorkplaceFetched() {
      return this.$store.getters.isWorkplacesFetched;
    },
    filterBricks() {
      let workplaces = this.rowWorkplaces;
      let bricks = [];
      if(workplaces.length) {
        workplaces.forEach(workplace => {
          if(!bricks.includes(workplace.brick)) {
            bricks.push(workplace.brick);
          }
        })
      }
      return bricks;
    },
    isSubmittedPlans() {
      return this.$store.getters.isSubmittedPlans;
    }
  },
  methods: {
    /**
     * add workplace to selected container
     *
     * @param {int} id
     */
    addToSelected(id) {
      let checked = event.target.checked;
      if (checked) {
        if (!this.selected_workplaces.includes(id)) {
          this.selected_workplaces.push(id);
        }
      } else {
        if (this.selected_workplaces.includes(id)) {
          let index = this.selected_workplaces.indexOf(id);
          this.selected_workplaces.splice(index, 1);
        }
      }
    },
    /**
     * add workplace to deleted container
     *
     * @param {int} id
     */
    addToDeleted(id) {
      let checked = event.target.checked;
      if (checked) {
        if (!this.deleted_workplaces.includes(id)) {
          this.deleted_workplaces.push(id);
        }
      } else {
        if (this.deleted_workplaces.includes(id)) {
          let index = this.deleted_workplaces.indexOf(id);
          this.deleted_workplaces.splice(index, 1);
        }
      }
    },
    /**
     * store workplace plans
     *
     */
    addPlans() {
      /** request payload */
      let data = {
        workplaces: JSON.stringify(this.selected_workplaces),
        date: this.$attrs.date
      };
      /**
       * calling API
       *
       * handle repsonse error in case of code 400
       * looping through rejected and accepted plans
       * if response code  201
       */
      httpCall
        .post("rep/v1/workplace-planner", data)
        .then(({ data }) => {
          this.handleResponse(data, (data) => {
            data.rejected.forEach(item => {
              this.$toasted.error(item)
            });
          })
        })
        .finally(() => {
          /** get new workplace planner */
          this.$store.dispatch("getWorkplacePlanner", true);
          /** uncheck all workplace list checkbox */
          document
            .querySelectorAll('#workplace_list input[type="checkbox"]')
            .forEach(input => {
              input.checked = false;
            });
          this.selected_workplaces = [];
        });
    },
    /**
     * delete plans
     */
    deletePlans() {
      let data = {
        workplaces: JSON.stringify(this.deleted_workplaces),
        date: this.$attrs.date,
        _method: "DELETE"
      };
      httpCall
        .post("rep/v1/workplace-planner/delete", data)
        .then(({ data }) => {
          data.message = data.data;
          this.handleResponse(data);
        })
        .finally(() => {
          this.$store.dispatch("getWorkplacePlanner", true);
          document
            .querySelectorAll('#plans_list input[type="checkbox"]')
            .forEach(input => {
              input.checked = false;
            });
          this.deleted_workplaces = [];
        });
    },
    /** open filter modal */
    openFilterModal() {
      this.show_filter_modal = true;
    },
    /** close filter modal */
    closeFilterModal() {
      this.show_filter_modal = false;
    },
    filterWorkplaces() {
      this.activeFilter = true;
      let res = [];
      this.rowWorkplaces.map(workplace => {
        if(workplace.brick === this.selectedBrick) {
          res.push(workplace)
        }
      });
     this.filteredList = res;
     this.show_filter_modal = false;
    },
    reset() {
      this.activeFilter = false;
      this.selectedBrick = null;
    }
  }
};
</script>

<style></style>

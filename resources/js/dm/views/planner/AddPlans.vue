<template>
  <div class="px-0 shadow bg-white mb-5 rounded">
    <p class="alert alert-success">
      <span><i class="fa fa-plus-circle"></i></span>
      <span>Add new plan</span>
    </p>
    <div class="p-2" style="min-height:400px">
      <div class="row mx-auto">
        <div class="col-lg-6 px-0" style="overflow:auto">
          <div class="border px-0">
            <p class="mb-0 px-2 bg-dark text-light">Selected </p>
            <table class="table table-sm small table-responsive" v-if="reps" id="reps_table">
              <thead>
                <tr>
                  <th><i class="fa fa-check"></i></th>
                  <th>Rep Name</th>
                  <th>Planned Brick</th>
                  <th>Plans</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="rep in reps" :key="rep.id">
                  <td> <input type="checkbox" @click="setSelectedPlanRep(rep.id)"> </td>
                  <td>{{ rep.name }}</td>
                  <td class="font-weight-bold text-primary">{{ repPlanBrick(rep.id) }}</td>
                  <td><span class="badge badge-primary p-1">{{ totalRepPlans(rep.id) }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="col-lg-6" style="overflow:auto">
          <p class="mb-0 px-2 bg-dark text-light">Total date {{ $attrs.date }} plans : {{ plans.length }}</p>
          <div class="px-0 border">
            <table class="table table-sm small table-responsive" id="plans_table">
              <thead>
                <tr>
                  <th><i class="fa fa-check"></i></th>
                  <th>Rep Name</th>
                  <th>Planned Brick</th>
                  <th>Plans</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="plan in plans" :key="plan.id">
                  <td> <input type="checkbox" @click="setRemovePlanRep(plan.id)"> </td>
                  <td>{{ plan.title }}</td>
                  <td class="font-weight-bold text-primary">{{ repPlanBrick(plan.rep_id) }}</td>
                  <td><span class="badge badge-primary p-1">{{ totalRepPlans(plan.rep_id) }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <hr>
      <div class="p-2 text-right">
        <router-link to="/planner" class="btn btn-sm btn-dark">
          <span><i class="fa fa-chevron-circle-left"></i></span>
          <span>back</span>
        </router-link>
        <button class="btn btn-success btn-sm" @click="storePlan">
          <span><i class="fa fa-plus-circle"></i></span>
          <span>Add</span>
        </button>
        <button class="btn btn-danger btn-sm" @click="removePlan">
          <span><i class="fa fa-trash-alt"></i></span>
          <span>Remove</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { sortBy } from '../../../helpers/helpers';
import { httpCall } from '../../../helpers/http-service';
export default {
  created() {
    this.$store.commit('setCurrentUserId', this.$store.state.user.id);
  },
  data: () => ({
    selected_plan_rep : null,
    selected_remove_rep : null
  }),
  computed:{
    reps(){
      return sortBy(this.$store.getters.dmReps, 'name');
    },
    isRepsFetched() {
      return this.$store.getters.isRepsFetched;
    },
    plans() {
      let plans = this.$store.getters.plans;
      let dayPlans = [];
      dayPlans = plans.filter(plan => plan.start === this.$attrs.date);
      return dayPlans
    },
    repPlans() {
      return this.$store.getters.repPlans;
    },
    coachPlans() {
      return this.$store.getters.coachPlans
    }
  },
  methods: {
    /**
     * select rep to add to plan
     *
     * @param {int} id
     */
    setSelectedPlanRep(id) {
      let target =event.target;
      if(target.checked) {
        this.selected_plan_rep = id;
        this.toggleSelectCheckbox('#reps_table', target)
      } else {
        this.selected_plan_rep = null;
      }
    },
    /**
     * store plan
     *
     * @return {void}
     */
    storePlan() {
      if(!this.selected_plan_rep) {
        this.$toasted.error('No Rep. selected, select Rep. first', {
          icon : 'exclamation'
        })
        return;
      }
      let data = {
        rep_id : this.selected_plan_rep,
        date : this.$attrs.date
      }

      httpCall.post('dm/v1/planner', data)
      .then(({data}) => {
        data.message ="Plan added";
        this.handleResponse(data, data => {
          this.$store.dispatch('getPlans', true)
        });
      });
    },
    /**
     * select plan to remove
     *
     * @param {int} id
     */
    setRemovePlanRep(id) {
      let target = event.target;
      if(target.checked) {
        this.selected_remove_rep = id;
        this.toggleSelectCheckbox('#plans_table', target)
      } else {
        this.selected_remove_rep = null;
      }
    },
    /**
     * remove plan
     *
     * @retrun {void}
     */
    removePlan() {
      if(!this.selected_remove_rep) {
        this.$toasted.error('No Plan selected, select plan first', {
          icon: 'exclamation'
        })
        return;
      }
      let id = this.selected_remove_rep;
      let data = {
        _method : 'DELETE'
      };

      httpCall.post(`dm/v1/planner/${id}`,data)
      .then(({data}) => {
        data.message =data.data;
        this.handleResponse(data, data => {
          this.$store.dispatch('getPlans', true);
        });
      })

    },
    toggleSelectCheckbox(id, el) {
      let inputs = document.querySelectorAll(`${id} input[type="checkbox"]`);
      inputs.forEach(input => input.checked = false);
      el.checked = true;
    },
    repPlanBrick(id) {
      let plan =  this.repPlans.filter(plan => plan.user_id ===id && plan.start === this.$attrs.date)[0];
      if(plan) {
        return plan.brick;
      }
      return "--------";
    },
    totalRepPlans(id) {
      return this.repPlans.filter(plan => plan.user_id === id && plan.start === this.$attrs.date).length
    }
  }
}
</script>

<style>

</style>

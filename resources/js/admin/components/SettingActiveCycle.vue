<template>
  <div class="p-2 my-2 border rounded">
    <div class="p-2 row mx-auto">
      <div class="col-lg-8">
        <h4 class="text-primary mb-0">Active Cycle</h4>
        <small class="text-muted"
          >Active cycle that control plan and report date boundries</small
        >
      </div>
      <div class="col-lg-4">
        <select
          name="app_active_cycle"
          class="form-control form-control-sm"
          v-model="activeCycle"
          v-if="cycles.length"
        >
          <option v-for="(cycle, i) in cycles" :key="i" :value="cycle">{{
            cycle.name
          }}</option>
        </select>
        <div class="p-2 text-center" v-else-if="isCyclesFetched">
          <p class="text-muted mb-0">No cycles found</p>
          <router-link to="/setting/cycle" class="badge badge-primary">
            <span class="fa fa-plus-circle"></span>
            <span>add new cycle</span>
          </router-link>
        </div>
        <loader-component v-else></loader-component>
      </div>
    </div>
    <hr />
    <div class="p-2 text-right">
      <button class="btn btn-primary btn-sm" @click="saveActiveCycle">
        <span class="fa fa-save"></span>
        <span>Save</span>
      </button>
    </div>
  </div>
</template>

<script>
import { httpCall } from '../../helpers/http-service';
import {sortBy} from '../../helpers/helpers';
export default {
  mounted() {
    this.getCycles()
    .then(() => {
      this.getActiveCycle();
    })
  },
  data: () => ({
    activeCycle: null,
    isActiveCycleFetched: false,
    cycles: [],
    isCyclesFetched: false,
  }),
  methods: {
    /**
     * get active cycle
     *
     */
    getActiveCycle() {
      this.activeCycle = null;
      this.isActiveCycleFetched = false;
      return httpCall
        .get("admin/v1/setting/active-cycle")
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.activeCycle = data.data;
            this.fetched = true;
          });
        })
        .catch(err => {
          console.log(err);
          this.$toasted.error(err.message);
        });
    },
    /**
     * get all cycles
     *
     *
     */
    getCycles() {
      this.cycles = [];
      this.isCyclesFetched = false;
      return httpCall
        .get("admin/v1/setting/cycles")
        .then(({ data }) => {
          try {
            if (data.data instanceof Array === false) {
              throw new TypeError("Cycles data is not valid type");
            }
            if(data.data) {
              this.cycles = sortBy(data.data, 'name');
            } else {
              this.cycles = [];
            }
            this.isCyclesFetched = true;
          } catch (e) {
            console.log(e);
            this.$toasted.error("Something went error");
          }
        })
        .catch(err => {
          console.log(err);
          this.$toasted.error(err.message);
        });
    },
    /**
     * Saving active cycle setting
     *
     *
     */
    saveActiveCycle() {
      if (!this.activeCycle) {
        this.$toasted.error("you must select cycle", {
          icon: "exclamation"
        });
        return;
      }
      let request = {
        cycle: JSON.stringify(this.activeCycle),
        cycle_name: this.activeCycle.name
      };
      httpCall
        .post("admin/v1/setting/active-cycle", request)
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.getActiveCycle();
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
  }
};
</script>

<style></style>

<template>
  <div class="px-0 shadow">
    <p class="alert alert-success">
      <span><i class="fa fa-book-open"></i></span>
      <span class="font-weight-bold">View All Plans</span>
    </p>
    <div class="p-2">
      <div class="row mx-auto">
        <div class="col-lg-3">
          <cycle-selection :onSelect="onSelectCycle" :onReset="onResetCycle" />

          <data-filter
            :data="$store.state.PlannerModule.repPlans"
            :onReset="onReset"
            :onUpdate="onUpdate"
            :keys="{
              rep: 'user_id',
              date: 'start'
            }"
          />
          <div class="p-2 my-2 border rounded">
            <router-link to="/planner" class="btn btn-sm btn-block btn-primary">
              <span><i class="fa fa-book-reader"></i></span>
              <span>view planner</span>
            </router-link>
            <router-link to="/reports" class="btn btn-sm btn-block btn-dark">
              <span class="fa fa-chevron-circle-left"></span>
              <span>back</span>
            </router-link>
          </div>
        </div>
        <div class="col-lg-9 shadow p-2">
          <div class="p-2" v-if="repPlans.length">
            <table-component
              :heads="heads"
              :data="repPlans"
              :unselectable="true"
              head-class="bg-success text-light"
              order-by="Date,asc"
            >
              <template v-slot:head>
                <th>Difference</th>
                <th>State</th>
              </template>
              <template v-slot:body="{ item }">
                <td>
                  {{ item.freq-item.plans_count }}
                </td>
                <td :class="getPlanState(item).style">
                  {{ getPlanState(item).text }}
                </td>
              </template>
            </table-component>
          </div>
          <div class="" v-else-if="fetched">
            <no-data-to-show :title="`No Plans found`" />
          </div>
          <loader-component v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CycleSelection from "../../../components/CycleSelection.vue";

import NoDataToShow from "../../../components/NoDataToShow.vue";
import TableComponent from "../../../components/TableComponent";
import DataFilter from "../../components/DataFilter";
export default {
  mounted() {
    this.$store.dispatch("getPlans")
  },
  components: {
    TableComponent,
    DataFilter,
    NoDataToShow,
    CycleSelection,

  },
  computed: {
    repPlans() {
      return this.$store.getters.repPlans;
    },
    fetched() {
      return this.$store.getters.isPlanFetched;
    },
     activeCycle() {
      return this.$store.getters.activeCycle;
    }
  },
  data: () => ({
  /*   repPlans: [], */
    heads: [
      {
        title: "Rep",
        name: "user_name",
        style: "font-weight-bold"
      },
      {
        title: "Date",
        name: "start",
        style: "font-weight-bold"
      },
      {
        title: "Customer",
        name: "title",
        style: "font-weight-bold"
      },
      {
        title: "Specialty",
        name: "specialty",
        style: "font-weight-bold"
      },
      {
        title: "Parameter",
        name: "param",
        style: "font-weight-bold"
      },

      {
        title: "Address",
        name: "address"
      },
      {
        title: "Brick",
        name: "brick"
      },
      {
        title: "Area",
        name: "area"
      },
  {
        title: "Freq.",
        name: "freq"
      },
      {
        title: "Plans",
        name: "plans_count"
      },

    ]
  }),
  methods: {
    onUpdate(resolve) {
      this.repPlans = [];
      resolve.then(data => (this.repPlans = data));
    },
    onReset() {
      this.replans = [];
      let reset = () =>
        new Promise((res, err) => {
          res(this.$store.state.PlannerModule.repPlans);
        });
      reset().then(data => (this.repPlans = data));
    },
    getPlanState(item) {
      let freq = item.freq;
      let plans = item.plans_count;
      let diff = freq-plans;
      let result = {};
      if(diff === 0) {
        result =  {
          style: 'bg-success text-light',
          text: 'Accomplished'
        }
      } else if(diff > 0 && diff === freq) {
        result =  {
          style: 'bg-dark text-light',
          text: 'Uncovered'
        }
      }else if(diff > 0 && diff !== freq) {
        console.log(item)
        result =  {
          style: 'bg-warning text-dark',
          text: 'Missed'
        }
      } else if(diff < 0) {
        result =  {
          style: 'bg-info text-dark',
          text: 'over'
        }
      }
      return result;
    },
     onSelectCycle() {
      this.$store.dispatch("getPlans", {
        cycle: this.activeCycle
      });
    },
    onResetCycle() {
      this.$store.commit("resetActiveCycle");
      this.$store.dispatch("getPlans", {
        cycle: this.activeCycle
      });
    }
  }
};
</script>

<style></style>

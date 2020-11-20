<template>
  <div class="row mx-auto">
    <div class="col-lg-3"></div>
    <div class="col-lg-9 px-0">
      <p class="alert alert-success">
        <span><i class="fa fa-book-reader"></i></span>
        <span class="font-weight-bold">View Plan analysis report</span>
      </p>
      <div class="p-2">
        <div class="p-2">
          <button class="btn btn-sm btn-success" @click="exportToExcel">
            <span><i class="fa fa-file-excel"></i></span>
            <span>Export</span>
          </button>
        </div>
        <div class="p-2">
          <table
            class="table table-responsive table-sm small table-bordered"
            id="plan_analysis"
          >
            <thead>
              <tr>
                <th rowspan="2">Rep</th>
                <th rowspan="2">Total Planned Visits</th>
                <th rowspan="2">Total Planned Days</th>
                <th rowspan="2">Total Planned Customers</th>
                <th :colspan="specialtiesList.length" class="bg-success">
                  Specialties
                </th>
                <th :colspan="paramsList.length" class="bg-info">
                  Parameters
                </th>
                <th :colspan="freqsList.length" class="bg-success">
                  Frequencies
                </th>
                <th :colspan="plansCountList.length" class="bg-info">
                  Count of Planned visits
                </th>
              </tr>
              <tr>
                <th
                  v-for="(item, i) in specialtiesList"
                  :key="`specialty_${i}`"
                  class="bg-success text-light"
                >
                  {{ item }}
                </th>
                <th
                  v-for="(item, i) in paramsList"
                  :key="`param_${i}`"
                  class="bg-info text-light"
                >
                  {{ item }}
                </th>
                <th
                  v-for="(item, i) in freqsList"
                  :key="`freq_${i}`"
                  class="bg-success text-light"
                >
                  {{ item }}
                </th>
                <th
                  v-for="(item, i) in plansCountList"
                  :key="`plan_count_${i}`"
                  class="bg-info text-light"
                >
                  {{ item }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(rep, i) in data" :key="`rep_${i}`">
                <td>{{ i }}</td>
                <td>{{ rep.total_plans }}</td>
                <td>{{ Object.keys(rep.start).length }}</td>
                <td>{{ Object.keys(rep.title).length }}</td>
                <td
                  v-for="(item, i) in specialtiesList"
                  :key="`rep_specialty_${i}`"
                >
                  {{ rep.specialty[item] ? rep.specialty[item].length : 0 }}
                </td>
                <td v-for="(item, i) in paramsList" :key="`rep_param_${i}`">
                  {{ rep.param[item] ? rep.param[item].length : 0 }}
                </td>
                <td v-for="(item, i) in freqsList" :key="`rep_freq_${i}`">
                  {{ rep.freq[item] ? rep.freq[item].length : 0 }}
                </td>
                <td
                  v-for="(item, i) in plansCountList"
                  :key="`rep_plan_count_${i}`"
                >
                  {{ rep.plans_count[item] ? rep.plans_count[item].length : 0 }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ExportToExcel, filterData } from "../../../../helpers/helpers";
export default {
  mounted() {
    this.$store.dispatch("getPlans");
  },
  data: () => ({
    specialtiesList: [],
    paramsList: [],
    freqsList: [],
    plansCountList: []
  }),
  computed: {
    plans() {
      return this.$store.getters.repPlans;
    },
    fetched() {
      return this.$store.getters.isPlanFetched;
    },
    data() {
      let repsPlans = this.collectPlanReps(this.plans);
      let analysis = {};
      Object.keys(repsPlans).map(rep => {
        let data = repsPlans[rep];
        analysis[rep] = filterData(data, [
          "param",
          "specialty",
          "freq",
          "plans_count",
          "start",
          "title"
        ]);
        analysis[rep]["total_plans"] = data.length;
      });
      this.collectFullLists(this.plans);
      return analysis;
    }
  },
  methods: {
    collectPlanReps(data) {
      return filterData(data, "user_name");
    },
    collectFullLists(data) {
      data.map(item => {
        if (!this.specialtiesList.includes(item.specialty)) {
          this.specialtiesList.push(item.specialty);
        }
        if (!this.paramsList.includes(item.param)) {
          this.paramsList.push(item.param);
        }
        if (!this.freqsList.includes(item.freq)) {
          this.freqsList.push(item.freq);
        }
        if (!this.plansCountList.includes(item.plans_count)) {
          this.plansCountList.push(item.plans_count);
        }
      });
    },
    exportToExcel() {
      ExportToExcel('#plan_analysis', `${this.$store.state.user.name} rep plans analysis`);
    }
  }
};
</script>

<style></style>

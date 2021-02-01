<template>
  <div class="px-0 shadow rounded" style="min-height:200px">
    <p class="bg-success text-light p-2">Today Plan</p>
    <div class="p-2">
      <div class="row mx-auto justify-content-between">
        <input
          type="date"
          class="form-control form-control-sm col-lg"
          v-model="today"
        />
      </div>
      <div v-if="plans.length" class="my-2">
        <ul class="nav">
          <li
            class="nav-item small col-12 clearfix border-bottom my-1 py-1 todo-item"
            v-for="plan in plans"
            :key="plan.id"
          >
            <span v-html="plan.title"></span>
            <span
              :class="
                `badge badge-${
                  plan.type === 'regular' ? 'primary' : 'success'
                } float-right`
              "
              >{{ plan.type === "regular" ? "Pharmacy" : "Health day" }}</span
            >
          </li>
        </ul>
      </div>
      <div v-else-if="fetched" class="my-2 py-2">
        <no-data-to-show :title="`${plan_error ? plan_error : `No plans`}`" />
      </div>
      <loader-component v-else></loader-component>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch("fetchPlans");
  },
  computed: {
    plans() {
      return this.$store.getters.allPlans.filter(
        plan => plan.start === this.today
      );
    },
    fetched() {
      let fetched = this.$store.getters.isPlannerFetched || this.$store.getters.isPlansFetched;
      return fetched;
    }
  },
  data: () => ({
    today: new Date().format(),
    plan_error: null
  }),
  watch: {
    today: function(_new, _old) {
      let _newDate = new Date(_new);
      if (_newDate.getDay() === 5) {
        this.plan_error = "It's Weekend";
      } else {
        this.plan_error = null;
      }
    }
  },
};
</script>

<style lang="scss" scoped>
  .todo-item {
    transition: .5s;
    &:hover{
      background-color: #1111;
    }
  }
</style>

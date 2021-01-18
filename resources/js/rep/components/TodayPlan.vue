<template>
  <div>
    <div class="px-0 border">
      <p class="alert alert-info mb-0 text-center p-1">
        <span>Today Plan</span>
      </p>
      <div
        class="row mx-auto align-items-center justify-content-around my-1 p-2"
      >
        <input
          type="date"
          class="form-control form-control-sm col"
          v-model="today"
        />
      </div>
      <hr class="my-1" />
      <div>
        <div v-if="plannedCustomers.length">
          <ul class="nav">
            <li
              class="nav-item col-12 border-bottom clearfix"
              v-for="(customer, i) in plannedCustomers"
              :key="customer.id + '_' + i"
            >
              <span :class="generateVisitLink(customer).icon"></span>
              <span class="text-muted">{{ customer.title }}</span>
              <router-link
                :to="generateVisitLink(customer).link"
                class="float-right"
              >
                <span
                  ><i
                    :class="
                      `fa fa-hands-helping ${generateVisitLink(customer).color}`
                    "
                  ></i
                ></span>
              </router-link>
            </li>
          </ul>
        </div>
        <div v-else-if="fetched" class="text-center p-3">
          <p class="text-muted small">No plans found</p>
          <router-link to="/planner" class="btn btn-sm btn-primary">
            <span><i class="fa fa-plus-circle"></i></span>
            <span>plan</span>
          </router-link>
        </div>
        <loader-component v-else></loader-component>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch("getNonFieldActivityPlans").finally(() => {
      this.$store.dispatch("getWorkplacePlanner").finally(() => {
        this.$store.dispatch("getPlanner");
      });
    });
  },
  data: () => ({
    isLoading: false,
    isFetched: false,
    today: new Date().format("YYYY-MM-DD")
  }),
  computed: {
    plannedCustomers() {
      let all = this.$store.getters.allPlans;
      let dayPlans = [];
      dayPlans = all.filter(day => day.start === this.today);
      if (all.length) {
        this.isFetched = true;
      }
      return dayPlans;
    },
    fetched() {
      return this.$store.getters.isPlansFetched;
    }
  },
  methods: {
    loadPlans() {
      this.isLoading = true;
      this.$store
        .dispatch("getPlanner")
        .then(() => {
          this.$store.dispatch("getWorkplacePlanner");
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    generateVisitLink(customer) {
      let data = {
        icon: "",
        link: "",
        color: ""
      };
      if (["AM", "submitted AM"].includes(customer.class)) {
        data.icon = "fa fa-hospital text-success";
        data.link = `/reports/add/am/${customer.workplace_id}`;
        data.color = "text-success";
      } else if (["PM", "submitted PM"].includes(customer.class)) {
        data.icon = "fa fa-user-md text-primary";
        data.link = `/reports/add/pm/${customer.customer_id}`;
        data.color = "text-primary";
      } else {
        data.icon = "fa fa-user-plus text-dark";
        data.link = `/reports/add/activity-report?type=${customer.class}`;
        data.color = "text-dark";
      }
      return data;
    }
  }
};
</script>

<style></style>

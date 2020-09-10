import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import CustomersRoutes from "./customers-route";
import Planner from "../views/Planner.vue";
import Workplaces from "../views/Workplaces.vue";
import Reports from "../views/Reports.vue";

Vue.use(VueRouter);

export default new VueRouter({
  mode: "history",
  base: process.env.MIX_APP_BASE_URL + "rep",
  routes: [
    {
      path: "/",
      component: Home
    },
    CustomersRoutes,
    {
      path: "/planner",
      component: Planner
    },
    {
      path: "/workplaces",
      component: Workplaces
    },
    {
      path: "/reports",
      component: Reports
    }
  ]
});

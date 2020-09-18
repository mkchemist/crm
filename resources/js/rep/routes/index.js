import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import CustomersRoutes from "./customers-route";
import WorkplaceRoutes from './workplace-route';
import PlannerRoutes from "./planner-route";
//import Planner from "../views/Planner.vue";
import Reports from "../views/Reports.vue";
import ErrorPage from "../../components/ErrorPage";

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
    PlannerRoutes,
    WorkplaceRoutes,
    {
      path: "/reports",
      component: Reports
    },
    {
      path: '*',
      component: ErrorPage
    }
  ]
});

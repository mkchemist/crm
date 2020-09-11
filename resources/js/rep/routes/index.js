import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import CustomersRoutes from "./customers-route";
import WorkplaceRoutes from './workplace-route';
import Planner from "../views/Planner.vue";
import Workplaces from "../views/Workplaces.vue";
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
    {
      path: "/planner",
      component: Planner
    },
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

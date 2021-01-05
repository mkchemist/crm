import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import CustomersRoutes from "./customers-route";
import WorkplaceRoutes from './workplace-route';
import PlannerRoutes from "./planner-route";
import ReportRoutes from "./report-route";
import ErrorPage from "../../components/ErrorPage";

Vue.use(VueRouter);

export default new VueRouter({
  mode: "history",
  base: document.getElementById('APP_BASE_URI').value + "rep",
  routes: [
    {
      path: "/",
      component: Home
    },
    CustomersRoutes,
    PlannerRoutes,
    WorkplaceRoutes,
    ReportRoutes,
    {
      path: '*',
      component: ErrorPage
    }
  ]
});

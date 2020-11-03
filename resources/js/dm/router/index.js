import Vue from "vue";
import VueRouter from "vue-router";
import HomePage from "../views/Home.vue";
import CustomersRoutes from "./customers-routes";
import WorkplacesRoutes from "./workplaces-routes";
import ApprovalRoutes from "./approval-routes";
import PlannerRoutes from "./planner-routes";
import ErrorPage from "../../components/ErrorPage";
Vue.use(VueRouter);

export default new VueRouter({
  base: document.getElementById("APP_BASE_URI").value + "dm",
  mode: "history",
  routes: [
    {
      path: "/",
      component: HomePage
    },
    CustomersRoutes,
    WorkplacesRoutes,
    ApprovalRoutes,
    PlannerRoutes,
    {
      path: "*",
      component: ErrorPage
    }
  ]
});

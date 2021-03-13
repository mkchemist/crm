import Vue from "vue"
import VueRouter from "vue-router";
import HomePage from "../views/Home.vue";
import CustomersPage from "../views/Customers"
import ErrorPage from "../../components/ErrorPage.vue";
import UsersRoutes from './users-routes';
import ValidationRoutes from "./validation-routes";
import SettingsRoutes from "./setting-routes";
import broadcastingRoutes from "./broadcasting-routes";
import CustomerRoutes from './customers-routes'
import PlannerRoutes from './planner-routes'
import ReportsRoutes from './reports-routes'
Vue.use(VueRouter)


export default new VueRouter({
  mode: 'history',
  base: document.getElementById('APP_BASE_URI').value+'admin',
  routes: [
    {
      path: '/',
      component: HomePage
    },
    UsersRoutes,
    ValidationRoutes,
    SettingsRoutes,
    broadcastingRoutes,
    CustomerRoutes,
    PlannerRoutes,
    ReportsRoutes,
    {
      path: '*',
      component: ErrorPage
    }
  ],
  scrollBehavior(to,from,savePosition) {
    return {x:0, y:0}
  }
});

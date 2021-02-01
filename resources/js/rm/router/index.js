import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '../views/HomePage.vue';
import ReportRoutes from './reports-routes'
import PlannerRouter from './planner-router';
import CustomersRouter from './customers-router';
import ErrorPage from "../../components/ErrorPage";


Vue.use(VueRouter);

let baseUrl = document.getElementById('APP_BASE_URI').value+"rm";

export default new VueRouter({
  base: baseUrl,
  mode: 'history',
  routes: [
    {
      path: '/',
      component: HomePage
    },
    ReportRoutes,
    PlannerRouter,
    CustomersRouter,
    {
      path: '*',
      component: ErrorPage
    }
  ]
})

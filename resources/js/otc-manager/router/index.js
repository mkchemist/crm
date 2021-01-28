import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import PharmacyRouter from './PharmacyRoutes';
import PlannerRouter from './PlannerRouter';
import ReportRouter from './ReportRoutes';
import ErrorPage from '../../components/ErrorPage.vue'


Vue.use(VueRouter);

let base = document.getElementById('APP_BASE_URI').value+'otc-manager';
export default new VueRouter({
  base,
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home
    }
    ,
    PharmacyRouter,
    PlannerRouter,
    ReportRouter,
    {
      path: '*',
      component: ErrorPage
    }
  ],
});

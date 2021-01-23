import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import PharmacyRoutes from './pharmacies-routes'
import PlannerRoutes from './planner-routes';
import ReportRoutes from './report-routes';
import ErrorPage from '../../components/ErrorPage.vue'

Vue.use(VueRouter)

let base = document.getElementById('APP_BASE_URI').value+'otc-rep';



export default new VueRouter({
  mode: 'history',
  base,
  routes: [
    {
      path: '/',
      component: Home
    },
    PharmacyRoutes,
    PlannerRoutes,
    ReportRoutes,
    {
      path: '*',
      component: ErrorPage
    }
  ]
})

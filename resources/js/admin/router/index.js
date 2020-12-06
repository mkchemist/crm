import Vue from "vue"
import VueRouter from "vue-router";
import HomePage from "../views/Home.vue";
import CustomersPage from "../views/Customers"
import ErrorPage from "../../components/ErrorPage.vue";
import UsersRoutes from './users-routes';
import ValidationRoutes from "./validation-routes";
import SettingsRoutes from "./setting-routes";

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
    {
      path: '/customers',
      component: CustomersPage
    },
    {
      path: '*',
      component: ErrorPage
    }
  ]
});

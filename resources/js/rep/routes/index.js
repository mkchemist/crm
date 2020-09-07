import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Customers from "../views/Customers.vue";
import Planner from "../views/Planner.vue";
import Workplaces from "../views/Workplaces.vue";
import Reports from "../views/Reports.vue";
// customers pages
import ActiveCustomers from "../views/customers/ActiveCustomers.vue";
import InactiveCustomers from "../views/customers/InactiveCustomers.vue";
import AllCustomers from "../views/customers/AllCustomers.vue";
import FavoriteList from "../views/customers/FavoriteList.vue";
import AddNewCustomer from "../views/customers/AddNewCustomer.vue";

Vue.use(VueRouter);

export default new VueRouter({
  mode: "history",
  base: process.env.MIX_APP_BASE_URL + "rep",
  routes: [
    {
      path: "/",
      component: Home
    },
    {
      path: "/customers",
      component: Customers,
      children: [
        {
          path: '',
          component: ActiveCustomers
        },
        {
          path: 'inactive',
          component: InactiveCustomers
        },
        {
          path:'all',
          component: AllCustomers
        },
        {
          path: 'favorite',
          component: FavoriteList
        },
        {
          path:'new',
          component: AddNewCustomer
        }
      ]
    },
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

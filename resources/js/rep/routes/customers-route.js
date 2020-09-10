import Customers from "../views/Customers.vue";

import ActiveCustomers from "../views/customers/ActiveCustomers.vue";
import InactiveCustomers from "../views/customers/InactiveCustomers.vue";
import AllCustomers from "../views/customers/AllCustomers.vue";
import FavoriteList from "../views/customers/FavoriteList.vue";
import AddNewCustomer from "../views/customers/AddNewCustomer.vue";
import ViewCustomer from '../views/customers/ViewCustomer.vue';
import EditCustomer from "../views/customers/EditCustomer.vue";
export default {
  path: "/customers",
  component: Customers,
  children: [
    {
      path: "",
      component: ActiveCustomers
    },
    {
      path: "inactive",
      component: InactiveCustomers
    },
    {
      path: "all",
      component: AllCustomers
    },
    {
      path: "favorite",
      component: FavoriteList
    },
    {
      path: "new",
      component: AddNewCustomer
    },
    {
      path: "view/:id",
      component: ViewCustomer
    },
    {
      path: "edit/:id",
      component: EditCustomer
    }
  ]
};

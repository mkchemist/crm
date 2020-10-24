import CustomersPage from "../views/Customers.vue"
import ActiveCustomers from "../views/customers/ActiveCustomers.vue"
import InActiveCustomers from "../views/customers/InActiveCustomers.vue"
import CustomerFavoriteList from "../views/customers/CustomersFavoriteList.vue";
import CustomerCard from "../views/customers/CustomerCard.vue";

export default {
  path: '/customers',
  component: CustomersPage,
  children: [
    {
      path:'',
      component: ActiveCustomers
    },
    {
      path:'inactive',
      component: InActiveCustomers
    },
    {
      path: 'favorite-list',
      component: CustomerFavoriteList
    },
    {
      path: 'view/:id',
      component: CustomerCard
    }
  ]
}

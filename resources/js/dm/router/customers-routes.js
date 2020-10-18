import CustomersPage from "../views/Customers.vue"
import ActiveCustomers from "../views/customers/ActiveCustomers.vue"
import InActiveCustomers from "../views/customers/InActiveCustomers.vue"
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
    }
  ]
}

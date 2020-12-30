import Customers from "../views/Customers"
import DuplicateCustomers from '../views/customers/DuplicateCustomers.vue';

export default {
  path: '/customers',
  component: Customers,
  children: [
    {
      path: 'duplicate-customers',
      component: DuplicateCustomers
    }
  ]
}

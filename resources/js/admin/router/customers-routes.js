import Customers from "../views/Customers"
import AllCustomers from '../views/customers/AllCustomers.vue';
import DuplicateCustomers from '../views/customers/DuplicateCustomers.vue';

export default {
  path: '/customers',
  component: Customers,
  children: [
    {
      path: '',
      component: AllCustomers
    },
    {
      path: 'duplicate-customers',
      component: DuplicateCustomers
    }
  ]
}

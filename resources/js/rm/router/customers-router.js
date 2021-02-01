import Customers from '../views/Customers.vue';
import ActiveCustomers from '../views/customers/ActiveCustomers.vue';
import InactiveCustomers from '../views/customers/InactiveCustomers.vue';
import AllCustomers from '../views/customers/AllCustomers.vue';
import CustomerCard from '../views/customers/CustomerCard.vue';
import CustomerInfoCard from '../views/customers/card/CustomerInfoCard.vue';
import CustomerReportsCard from '../views/customers/card/CustomerReportsCard.vue';
import CustomerPlannerCard from '../views/customers/card/CustomerPlannerCard.vue';

export default {
  path: '/customers',
  component: Customers,
  children: [
    {
      path: '',
      component: ActiveCustomers
    },
    {
      path:'inactive',
      component: InactiveCustomers
    },
    {
      path: 'all',
      component: AllCustomers
    },
    {
      path: 'view/:id',
      component: CustomerCard,
      children: [
        {
          path: '',
          component: CustomerInfoCard
        },
        {
          path: 'planner',
          component: CustomerPlannerCard
        },
        {
          path: 'reports',
          component: CustomerReportsCard
        },
      ]
    }
  ]
}

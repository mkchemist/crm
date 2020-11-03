import Planner from '../views/Planner.vue'
import PlannerHome from '../views/planner/PlannerHome.vue'
import AddPlans from '../views/planner/AddPlans.vue';

export default {
  path: '/planner',
  component: Planner,
  children: [
    {

      path: '',
      component: PlannerHome
    },
    {
      path: 'add',
      component: AddPlans
    }
  ]
}

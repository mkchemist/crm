import Planner from '../views/Planner.vue';
import PlannerHome from '../views/planner/PlannerHomer.vue'
export default {
  path: '/planner',
  component: Planner,
  children: [
    {
      path: '',
      component: PlannerHome
    }
  ]
}

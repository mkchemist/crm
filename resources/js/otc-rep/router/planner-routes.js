import Planner from '../views/Planner.vue';
import PlannerHome from '../views/planner/PlannerHome.vue'
import AddPlan from '../views/planner/AddPlan.vue'
import HealthDayPlan from '../views/planner/HealthDayPlan.vue'

export default {
  path: '/planner',
  component: Planner,
  children: [
    {
      path: '',
      component: PlannerHome
    },
    {
      path: 'add/day',
      component: AddPlan
    },
    {
      path: 'add/health-day',
      component: HealthDayPlan
    }

  ]
}

import Planner from '../views/Planner.vue'
import PlannerHome from '../views/planner/PlannerHome.vue'
import AddPlans from '../views/planner/AddPlans.vue';
import NonFieldActivityPlanner from '../../components/NonFieldActivityPlanner.vue'
import FieldActivityPlanner from '../../components/FieldActivityPlanner.vue'

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
    },
    {
      path: 'add-non-field-activity',
      component: NonFieldActivityPlanner
    },
    {
      path: 'add-field-activity',
      component: FieldActivityPlanner
    }
  ]
}

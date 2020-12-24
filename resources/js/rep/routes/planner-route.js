import Planner from '../views/Planner';
import PlannerHome from '../views/planner/PlannerHome';
import AddPmPlans from "../views/planner/AddPmPlans";
import AddAmPlans from "../views/planner/AddAmPlans";
import NonFieldActivityPlanner from "../../components/NonFieldActivityPlanner.vue";
import FieldActivityPlanner from "../../components/FieldActivityPlanner.vue";

export default {
  path: '/planner',
  component: Planner,
  children: [
    {
      path: '',
      component: PlannerHome
    },
    {
      path: 'add-pm',
      component: AddPmPlans
    },
    {
      path: 'add-am',
      component: AddAmPlans
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

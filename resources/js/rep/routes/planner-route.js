import Planner from '../views/Planner';
import PlannerHome from '../views/planner/PlannerHome';
import AddPmPlans from "../views/planner/AddPmPlans";
import AddAmPlans from "../views/planner/AddAmPlans";

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
    }
  ]
}

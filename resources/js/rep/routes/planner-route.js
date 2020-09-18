import Planner from '../views/Planner';
import PlannerHome from '../views/planner/PlannerHome';
import AddPlan from "../views/planner/AddPlan";
import RePlanning from "../views/planner/RePlanning";

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
      component: AddPlan
    },
    {
      path: 'replan',
      component: RePlanning
    }
  ]
}

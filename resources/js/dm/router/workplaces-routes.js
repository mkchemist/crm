import Workplaces from "../views/Workplaces";
import HospitalsView from "../views/workplaces/HospitalsView";
import PharmaciesView from "../views/workplaces/PharmaciesView";
export default {
  path:'/workplaces',
  component: Workplaces,
  children: [
    {
      path: '',
      component: HospitalsView
    },
    {
      path:'pharmacies',
      component: PharmaciesView
    }
  ]
}

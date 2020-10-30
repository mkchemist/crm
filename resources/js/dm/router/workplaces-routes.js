import Workplaces from "../views/Workplaces";
import HospitalsView from "../views/workplaces/HospitalsView";
import HospitalCard from "../views/workplaces/HospitalCard";
import PharmacyCard from "../views/workplaces/PharmacyCard";
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
    },
    {
      path: "view/hospital/:id",
      component: HospitalCard
    },
    {
      path: 'view/pharmacy/:id',
      component:PharmacyCard
    }
  ]
}

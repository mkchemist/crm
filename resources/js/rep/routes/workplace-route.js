import Workplace from '../views/Workplaces';
import HospitalsList from "../views/workplaces/HospitalsList"
import PharmaciesList from "../views/workplaces/PharmaciesList"
import AddHospital from "../views/workplaces/AddHospital"
import AddPharmacy from "../views/workplaces/AddPharmacy"

export default {
  path: '/workplaces',
  component: Workplace,
  children: [
    {
      path: '',
      component: HospitalsList
    },
    {
      path: 'add-hospital',
      component: AddHospital
    },
    {
      path: 'pharmacies',
      component:PharmaciesList
    },
    {
      path: 'add-pharmacy',
      component: AddPharmacy
    }
  ]
}

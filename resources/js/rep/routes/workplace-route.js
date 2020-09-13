import Workplace from '../views/Workplaces';
import HospitalsList from "../views/workplaces/HospitalsList"
import PharmaciesList from "../views/workplaces/PharmaciesList"
import AddHospital from "../views/workplaces/AddHospital"
import AddPharmacy from "../views/workplaces/AddPharmacy"
import EditHospital from "../views/workplaces/EditHospital"
import ViewHospital from "../views/workplaces/ViewHospital"
import EditPharmacy from "../views/workplaces/EditPharmacy"
import ViewPharmacy from "../views/workplaces/ViewPharmacy"
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
    },
    {
      path: 'hospital/edit/:id',
      component: EditHospital
    },
    {
      path: 'hospital/view/:id',
      component: ViewHospital
    },
    {
      path: 'pharmacy/edit/:id',
      component: EditPharmacy
    },
    {
      path: 'pharmacy/view/:id',
      component: ViewPharmacy
    }
  ]
}

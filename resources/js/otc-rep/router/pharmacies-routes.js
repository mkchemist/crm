import Pharmacies from '../views/Pharmacies.vue'
import PharmaciesList from '../views/pharmacies/PharmaciesList.vue'
import CreatePharmacy from '../views/pharmacies/CreatePharmacy.vue'
import EditPharmacy from '../views/pharmacies/EditPharmacy.vue'
import ViewPharmacy from '../views/pharmacies/ViewPharmacy.vue'
import ViewPharmacyInfo from "../views/pharmacies/ViewPharmacyInfo.vue"
import ViewPharmacyReport from "../views/pharmacies/ViewPharmacyReport.vue";
import ViewPharmacyHealthDayReport from "../views/pharmacies/ViewPharmacyHealthDayReport.vue";
import PharmacyFavoriteList from "../../components/PharmacyFavoriteList.vue"

export default {
  path: '/pharmacies',
  component: Pharmacies,
  children: [
    {
      path: '',
      component: PharmaciesList
    },
    {
      path: 'new',
      component: CreatePharmacy
    },
    {
      path: 'edit/:id',
      component: EditPharmacy
    },
    {
      path: "view/:id",
      component: ViewPharmacy,
      children: [
        {
          path: '',
          component: ViewPharmacyInfo
        },
        {
          path: 'report',
          component: ViewPharmacyReport
        },
        {
          path: 'health-day',
          component: ViewPharmacyHealthDayReport
        }
      ]
    },
    {
      path: "favorite",
      component: PharmacyFavoriteList
    }
  ]
}

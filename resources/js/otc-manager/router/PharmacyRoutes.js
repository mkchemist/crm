import Pharmacies from '../views/Pharmacies.vue';
import PharmacyList from '../views/pharmacy/PharmacyList.vue';
import PharmacyCard from '../views/pharmacy/PharmacyCard.vue';
import PharmacyCardInfoView from '../views/pharmacy/PharmacyCardInfoView.vue';
import PharmacyCardReportView from '../views/pharmacy/PharmacyCardReportView.vue';
import PharmacyCardHealthDayView from '../views/pharmacy/PharmacyCardHealthDayView';

export default {
  path: '/pharmacies',
  component: Pharmacies,
  children: [
    {
      path: '',
      component: PharmacyList
    },
    {
      path: 'view/:id',
      component: PharmacyCard,
      children: [
        {
          path: '',
          component: PharmacyCardInfoView
        },
        {
          path: 'reports',
          component: PharmacyCardReportView
        },
        {
          path: 'health-day',
          component: PharmacyCardHealthDayView
        }
      ]
    }
  ]
}

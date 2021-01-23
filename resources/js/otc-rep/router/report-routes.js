import Report from '../views/Report.vue'
import ReportHome from '../views/reports/ReportHome.vue';
import AddPharmacyReport from '../views/reports/AddPharmacyReport.vue';
import PharmacyReportList from '../views/reports/PharmacyReportList.vue';
import PharmacyView from '../views/reports/pharmacy/PharmacyView.vue';
import DateView from '../views/reports/pharmacy/DateView.vue';
import ProductView from '../views/reports/pharmacy/ProductView.vue';

export default {
  path: '/reports',
  component: Report,
  children: [
    {
      path: '',
      component: ReportHome
    },
    {
      path: 'add/pharmacy',
      component: AddPharmacyReport
    },
    {
      path: 'view/pharmacy',
      component: PharmacyReportList,
      children: [
        {
          path: '',
          component: PharmacyView
        },
        {
          path: 'date',
          component: DateView
        },
        {
          path: 'product',
          component: ProductView
        }
      ]
    }
  ]
}

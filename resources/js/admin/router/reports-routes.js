import ReportsPage from '../views/ReportPage';
import ReportHome from '../views/reports/ReportHome.vue'
import MissedVisitReport from '../views/reports/MissedVisitReport.vue'
import PmReport from '../views/reports/PmVisitReport.vue';
import AmReport from '../views/reports/AmVisitReport.vue';
import PharmacyReport from '../views/reports/PharmacyVisitReport.vue';
export default {
  path: '/reports',
  component: ReportsPage,
  children: [
    {
      path: '',
      component: ReportHome
    },
    {
      path: 'view/pm',
      component: PmReport
    },
    {
      path: 'view/am',
      component: AmReport
    },
    {
      path: 'view/pharmacy',
      component: PharmacyReport
    },
    {
      path: 'view/missed',
      component: MissedVisitReport
    }
  ]
}

import ReportsPage from '../views/ReportPage';
import ReportHome from '../views/reports/ReportHome.vue'
import MissedVisitReport from '../views/reports/MissedVisitReport.vue'
export default {
  path: '/reports',
  component: ReportsPage,
  children: [
    {
      path: '',
      component: ReportHome
    },
    {
      path: 'view/missed',
      component: MissedVisitReport
    }
  ]
}

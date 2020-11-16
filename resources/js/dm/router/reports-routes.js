import Reports from '../views/Reports.vue'
import ReportHome from '../views/reports/ReportHome.vue'
import ViewCoachAssign from '../views/reports/ViewCoachAssign.vue';
import FullfilCoachReport from '../views/reports/FullfilCoachReport.vue';
import ViewPmReports from '../views/reports/ViewPmReports.vue';
import ViewPlanReports from '../views/reports/ViewPlanReports.vue';
import ViewHospitalReport from '../views/reports/ViewHospitalReport.vue'
import ViewPharmacyReport from '../views/reports/VIewPharmacyReport.vue';
import ViewPmAnalysis from '../views/reports/analysis/ViewPmAnalysis.vue';


export default {
  path: '/reports',
  component: Reports,
  children: [
    {
      path: '',
      component: ReportHome
    },
    {
      path: 'view/coach-report',
      component: ViewCoachAssign
    },
    {
      path: 'add/coach-report/:id',
      component: FullfilCoachReport
    },
    {
      path: 'view/pm',
      component: ViewPmReports
    },
    {
      path: 'view/plans',
      component: ViewPlanReports
    },
    {
      path: 'view/am',
      component: ViewHospitalReport
    },
    {
      path: 'view/pharmacy',
      component: ViewPharmacyReport
    },
    {
      path: 'analysis/pm',
      component: ViewPmAnalysis
    }
  ]
}

import ReportPage from '../views/ReportPage.vue';
import ReportHome from '../views/reports/ReportHome.vue';
import ViewPmReport from '../views/reports/ViewPmReport.vue';
import ViewAmReport from '../views/reports/ViewAmReport.vue';
import ViewPharmacyReport from '../views/reports/ViewPharmacyReport.vue';
import ViewPlanReport from '../views/reports/ViewPlanReport.vue';
import ViewCoachReport from '../views/reports/ViewCoachReport.vue';
import PmAnalysisReport from '../views/reports/PmAnalysisReport.vue';
import AmAnalysisReport from '../views/reports/AmAnalysisReport.vue';
import PlanAnalysisReport from '../views/reports/PlanAnalysisReport.vue';
import ActivityReportContainer from '../views/reports/ActivityReportContainer.vue';
import RequestReportContainer from '../views/reports/RequestReportContainer.vue'
import CreateActivityReport from '../views/reports/CreateActivityReport.vue';
import CreateRequestReport from '../views/reports/CreateRequestReport.vue';

export default {
  path: '/reports',
  component: ReportPage,
  children: [
    {
      path: '',
      component: ReportHome
    },
    {
      path: 'add/activity-report',
      component: CreateActivityReport
    },
    {
      path: 'add/request',
      component: CreateRequestReport
    },
    {
      path: 'view/coach-report',
      component: ViewCoachReport
    },
    {
      path: 'view/pm',
      component: ViewPmReport
    },
    {
      path: 'view/am',
      component: ViewAmReport
    },
    {
      path: 'view/pharmacy',
      component: ViewPharmacyReport
    },
    {
      path: 'view/plan',
      component: ViewPlanReport
    },
    {
      path: 'analysis/pm',
      component: PmAnalysisReport
    },
    {
      path: 'analysis/am',
      component: AmAnalysisReport
    },
    {
      path: 'analysis/plan',
      component: PlanAnalysisReport
    },
    {
      path: 'activity',
      component: ActivityReportContainer
    },
    {
      path: 'requests',
      component: RequestReportContainer
    }
  ]
}

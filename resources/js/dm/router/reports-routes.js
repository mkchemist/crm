import Reports from '../views/Reports.vue'
import ReportHome from '../views/reports/ReportHome.vue'
import ViewCoachAssign from '../views/reports/ViewCoachAssign.vue';
import FullfilCoachReport from '../views/reports/FullfilCoachReport.vue';
import ViewPmReports from '../views/reports/ViewPmReports.vue';
import ViewPlanReports from '../views/reports/ViewPlanReports.vue';
import ViewAmPlanReports from '../views/reports/ViewAmPlanReports.vue';
import ViewHospitalReport from '../views/reports/ViewHospitalReport.vue'
import ViewPharmacyReport from '../views/reports/VIewPharmacyReport.vue';
import ViewPmAnalysis from '../views/reports/analysis/ViewPmAnalysis.vue';
import ViewPlanAnalysis from "../views/reports/analysis/ViewPlanAnalysis.vue"
import ViewMissedCustomers from '../views/reports/ViewMissedCustomers.vue';
import CreateCoachReport from "../views/reports/CreateCoachReport.vue";
import ActivityReportContainer from '../views/reports/ActivityReportContainer.vue';
import AddActivityReport from '../../components/AddActivityReport.vue';
import AddPmVisit from '../views/reports/AddPmVisit.vue';
import EditPmVisit from '../views/reports/EditPmVisit.vue';
import RequestReportContainer from '../views/reports/RequestReportContainer.vue'
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
      path: 'add/activity-report',
      component: AddActivityReport
    },
    {
      path : 'add/pm',
      component: AddPmVisit
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
      path: 'view/am-plans',
      component: ViewAmPlanReports
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
      path: 'view/missed-customers',
      component:ViewMissedCustomers
    },
    {
      path: 'analysis/pm',
      component: ViewPmAnalysis
    },
    {
      path: 'analysis/plans',
      component: ViewPlanAnalysis
    },
    {
      path: 'add/coach',
      component: CreateCoachReport
    },
    {
      path: 'activity-report',
      component: ActivityReportContainer
    },
    {
      path: 'requests',
      component: RequestReportContainer,
    },
    {
      path: 'edit/pm/:id',
      component: EditPmVisit
    }
  ]
}

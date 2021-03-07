import Report from "../views/Report.vue";
import ReportHome from "../views/reports/ReportHome.vue";
import AddPharmacyReport from "../views/reports/AddPharmacyReport.vue";
import AddHealthDayReport from "../views/reports/AddHealthDayReport.vue";
import EditHealthDayReport from "../views/reports/EditHealthDayReport.vue";
import PharmacyReportList from "../views/reports/PharmacyReportList.vue";
import PharmacyView from "../views/reports/pharmacy/PharmacyView.vue";
import DateView from "../views/reports/pharmacy/DateView.vue";
import ProductView from "../views/reports/pharmacy/ProductView.vue";
import EditPharmacyReport from "../views/reports/EditPharmacyReport.vue";
import HealthDayReportList from "../views/reports/HealthDayReportList.vue";
import MarketShareAnalysis from '../views/reports/MarketShareAnalysis.vue';
import ViewPlanReport from '../views/reports/ViewPlanReport.vue';
import ViewPharmacyPlan from '../components/ViewPharmacyPlan.vue';
import ViewHealthDayPlan from '../components/ViewHealthDayPlan.vue';
import AddActivityReport from "../../components/AddActivityReport.vue";
import ActivityReportContainer from "../views/reports/ActivityReportContainer.vue";
import CoverageReport from "../views/reports/CoverageReport.vue";
export default {
  path: "/reports",
  component: Report,
  children: [
    {
      path: "",
      component: ReportHome
    },
    {
      path: "add/pharmacy/:id?",
      component: AddPharmacyReport
    },
    {
      path: "view/pharmacy",
      component: PharmacyReportList,
      children: [
        {
          path: "",
          component: PharmacyView
        },
        {
          path: "date",
          component: DateView
        },
        {
          path: "product",
          component: ProductView
        }
      ]
    },
    {
      path: "edit/pharmacy/:id",
      component: EditPharmacyReport
    },
    {
      path: "add/health-day",
      component: AddHealthDayReport
    },
    {
      path: "view/health-day",
      component: HealthDayReportList
    },
    {
      path: 'edit/health-day/:id',
      component: EditHealthDayReport
    },
    {
      path: 'analysis/market',
      component: MarketShareAnalysis
    },
    {
      path: 'view/plan',
      component: ViewPlanReport,
      children: [
        {
          path: '',
          component: ViewPharmacyPlan
        },
        {
          path: 'health-day',
          component: ViewHealthDayPlan
        }
      ]
    },
    {
      path: "add/activity",
      component: AddActivityReport
    },
    {
      path: "activity-report",
      component: ActivityReportContainer
    },
    {
      path: "coverage",
      component: CoverageReport
    }
  ]
};

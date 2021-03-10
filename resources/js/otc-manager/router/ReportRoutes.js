import Reports from '../views/Reports.vue';
import ReportHome from '../views/reports/ReportHome.vue'
import PharmacyReportList from '../views/reports/PharmacyReportList.vue'
import PharmacyReportsPharmacyView from '../../otc-rep/views/reports/pharmacy/PharmacyView.vue';
import PharmacyReportsDateView from '../../otc-rep/views/reports/pharmacy/DateView.vue';
import PharmacyReportsProductView from '../../otc-rep/views/reports/pharmacy/ProductView.vue';
import PharmacyReportTableView from "../../otc-rep/views/reports/pharmacy/TableView.vue";
import MarketFeedbackAnalysis from '../views/reports/MarketFeedbackAnalysis';
import PlanReportList from '../views/reports/PlanReportList.vue'
import ViewHealthDayPlan from '../../otc-rep/components/ViewHealthDayPlan.vue';
import ViewPharmacyPlan from '../../otc-rep/components/ViewPharmacyPlan.vue';
import healthDayReports from "../views/reports/HealthDayReports.vue";
import CoverageAnalysis from "../../otc-rep/views/reports/CoverageReport.vue";
import ActivityReportContainer from "../views/reports/ActivityReportContainer.vue";
import OrderAnalysis from "../../otc-rep/views/reports/OrderAnalysis.vue"

export default {
  path: '/reports',
  component: Reports,
  children:[
    {
      path: '',
      component: ReportHome
    },
    {
      path: "view/health-day",
      component: healthDayReports
    },
    {
      path: 'view/pharmacy',
      component : PharmacyReportList,
      children: [
        {
          path: '',
          component: PharmacyReportsPharmacyView
        },
        {
          path: 'date',
          component: PharmacyReportsDateView
        },
        {
          path: 'product',
          component: PharmacyReportsProductView
        },
        {
          path: 'table',
          component: PharmacyReportTableView
        }

      ]
    },
    {
      path: 'view/plan',
      component: PlanReportList,
      children: [
        {
          path: '',
          component: ViewPharmacyPlan
        },
        {
          path:'health-day',
          component: ViewHealthDayPlan
        }
      ]
    },
    {
      path: "view/orders",
      component: OrderAnalysis
    },
    {
      path: 'market-feedback',
      component: MarketFeedbackAnalysis
    },
    {
      path: 'coverage',
      component: CoverageAnalysis
    },
    {
      path: 'activity',
      component: ActivityReportContainer
    }
  ]
}

import Reports from '../views/Reports.vue';
import ReportHome from '../views/reports/ReportHome.vue'
import PharmacyReportList from '../views/reports/PharmacyReportList.vue'
import PharmacyReportsPharmacyView from '../../otc-rep/views/reports/pharmacy/PharmacyView.vue';
import PharmacyReportsDateView from '../../otc-rep/views/reports/pharmacy/DateView.vue';
import PharmacyReportsProductView from '../../otc-rep/views/reports/pharmacy/ProductView.vue';
import MarketFeedbackAnalysis from '../views/reports/MarketFeedbackAnalysis';
import PlanReportList from '../views/reports/PlanReportList.vue'
import ViewHealthDayPlan from '../../otc-rep/components/ViewHealthDayPlan.vue';
import ViewPharmacyPlan from '../../otc-rep/components/ViewPharmacyPlan.vue';
export default {
  path: '/reports',
  component: Reports,
  children:[
    {
      path: '',
      component: ReportHome
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
      path: 'market-feedback',
      component: MarketFeedbackAnalysis
    }
  ]
}

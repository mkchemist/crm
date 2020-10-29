import Report from "../views/Reports";
import ReportHome from "../views/reports/ReportHome";
import AddAmReport from "../views/reports/AddAmReport";
import AddPmReport from "../views/reports/AddPmReport";
import AddPharmacyReport from "../views/reports/AddPharmacyReport";
import ViewAmReport from "../views/reports/ViewAmReport";
import ViewPmReport from "../views/reports/ViewPmReport";
import ViewPharmacyReport from "../views/reports/ViewPharmacyReport";
import EditPmReport from "../views/reports/EditPmReport";
import EditAmReport from "../views/reports/EditAmReport";
import EditPharmacyReport from "../views/reports/EditPharmacyReport";
import PmReportAnalysis from "../views/reports/PmReportAnalysis";
import ViewPlansReport from '../views/reports/ViewPlansReport';
import PmPlansReport from '../views/reports/plans/PmPlansReport'
import AmPlansReport from '../views/reports/plans/AmPlansReport'

export default {
  path: "/reports",
  component:Report,
  children: [
    {
      path: '',
      component: ReportHome
    },
    {
      path: 'view/am',
      component: ViewAmReport
    },
    {
      path: 'view/pm',
      component: ViewPmReport
    },
    {
      path: "view/pharmacy",
      component: ViewPharmacyReport
    },
    {
      path: 'view/plans',
      component: ViewPlansReport,
      children: [
        {
          path: '',
          component: PmPlansReport
        },
        {
          path: 'am',
          component: AmPlansReport
        }
      ]
    },
    {
      path: "add/am/:id?",
      component: AddAmReport
    },
    {
      path: "add/pm/:id?",
      component: AddPmReport
    },
    {
      path: "add/pharmacy/:id?",
      component: AddPharmacyReport
    },
    {
      path: "edit/pm/:id",
      component: EditPmReport
    },
    {
      path: "edit/am/:id",
      component: EditAmReport
    },
    {
      path: 'edit/pharmacy/:id',
      component: EditPharmacyReport
    },
    {
      path: 'analysis/pm',
      component: PmReportAnalysis
    }
  ]
}

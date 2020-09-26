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
      path: "add/am",
      component: AddAmReport
    },
    {
      path: "add/pm",
      component: AddPmReport
    },
    {
      path: "add/pharmacy",
      component: AddPharmacyReport
    },
    {
      path: "edit/pm/:id",
      component: EditPmReport
    },
    {
      path: "edit/am/:id",
      component: EditAmReport
    }
  ]
}
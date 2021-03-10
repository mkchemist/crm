import SingleVisitHome from "./views/SingleVisitHome.vue";
import PmReportList from "./views/PmReportList.vue";
import AddPmVisit from "./views/AddPmVisit.vue";
import EditPmVisit from "./views/EditPmVisit.vue";
import PharmacyReportList from "./views/PharmacyReportList.vue";
import AddPharmacyVisit from "./views/AddPharmacyVisit.vue";
import EditPharmacyVisit from "./views/EditPharmacyVisit.vue" ;

export default [{
  path: '/single-visit',
  component: SingleVisitHome,
  children: [
    {
      path: "",
      component: PmReportList
    },
    {
      path: "pm/add",
      component:AddPmVisit
    },
    {
      path: 'pm/edit/:id',
      component: EditPmVisit
    },
    {
      path: "pharmacy/list",
      component: PharmacyReportList
    },
    {
      path: "pharmacy/add",
      component: AddPharmacyVisit
    },
    {
      path: "pharmacy/edit/:id",
      component: EditPharmacyVisit
    }
  ]
}]

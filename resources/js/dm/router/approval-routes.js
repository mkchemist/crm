import ApprovalPage from '../views/ApprovalPage';
import FrequencyApproval from "../views/approval/FrequencyApproval";
import ParameterApproval from "../views/approval/ParameterApproval"
import CustomersApproval from "../views/approval/CustomersApproval"
import WorkplacesApproval from "../views/approval/WorkplacesApproval"
import PharmaciesApproval from "../views/approval/PharmaciesApproval";
import CustomerDetailsApproval from "../views/approval/CustomerDetailsApproval"

export default {
  path:'/approval',
  component: ApprovalPage,
  children: [
    {
      path: '',
      component: FrequencyApproval
    },
    {
      path:'parameter',
      component: ParameterApproval
    },
    {
      path: 'customers',
      component: CustomersApproval
    },
    {
      path: 'workplaces',
      component: WorkplacesApproval
    },
    {
      path: 'pharmacies',
      component: PharmaciesApproval
    },
    {
      path: 'customer-details',
      component:CustomerDetailsApproval
    }
  ]
}

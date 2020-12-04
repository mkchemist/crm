import ApprovalPage from '../views/ApprovalPage';
import FrequencyApproval from "../views/approval/FrequencyApproval";
import ParameterApproval from "../views/approval/ParameterApproval"
import CustomersApproval from "../views/approval/CustomersApproval"
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
      path: 'customer-details',
      component:CustomerDetailsApproval
    }
  ]
}

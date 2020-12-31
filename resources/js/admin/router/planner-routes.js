import PlannerPage from '../views/PlannerPage.vue';
import PlannerListView from '../views/planner/PlannerListView.vue';
import PlannerApprovalControl from '../views/planner/PlannerApprovalControl.vue';

export default {
  path: '/planner',
  component:PlannerPage,
  children: [
    {
      path: '',
      component: PlannerListView
    },
    {
      path: 'approval',
      component: PlannerApprovalControl
    }
  ]
}


import PlannerPage from '../views/PlannerPage.vue';
import PlannerListView from '../views/planner/PlannerListView.vue';
import PlannerApprovalControl from '../views/planner/PlannerApprovalControl.vue';
import PmListView from '../views/planner/PmListView.vue';
import AmListView from '../views/planner/AmListView.vue';

export default {
  path: '/planner',
  component:PlannerPage,
  children: [
    {
      path: '',
      component: PlannerListView,
      children: [
        {
          path: '',
          component: PmListView
        },
        {
          path: 'am',
          component: AmListView
        }
      ]
    },
    {
      path: 'approval',
      component: PlannerApprovalControl
    }
  ]
}


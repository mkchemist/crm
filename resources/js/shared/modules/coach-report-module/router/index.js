import CoachReportHome from '../views/CoachReportHome.vue';
import ModuleHome from "../views/ModuleHome.vue";
import CoachDayList from '../views/CoachDayList.vue'
import CoachTableView from '../views/CoachTableView.vue'
import CoachDayView from '../views/CoachDayView.vue'
import CoachingReportContainer from '../views/CoachReportContainer.vue'
import CoachFollowUpContainer from '../views/CoachFollowUpContainer.vue'
import CoachReportAnalysis from '../views/CoachReportAnalysis.vue';
import AddCoachReport from "../views/AddCoachReport.vue"

export default [{
  path: '/coach',
  component: CoachReportHome,
  children: [
    {
      path: '',
      component: ModuleHome
    },
    {
      path: 'list',
      component: CoachDayList
    },
    {
      path: 'view',
      component: CoachDayView
    },
    {
      path: 'report/:id',
      component: CoachingReportContainer
    },
    {
      path: 'follow-up',
      component: CoachFollowUpContainer
    },
    {
      path: 'analysis',
      component: CoachReportAnalysis
    },
    {
      path: 'add',
      component: AddCoachReport
    },
    {
      path: 'table',
      component: CoachTableView
    }
  ]
}]

import CoachReportHome from '../views/CoachReportHome.vue';
import CoachDayView from '../views/CoachDayView.vue'
export default [{
  path: '/coach/reports',
  component: CoachReportHome,
  children: [
    {
      path: '',
      component: CoachDayView
    }
  ]
}]

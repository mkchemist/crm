import Setting from "../views/Setting.vue";
import GeneralSetting from "../views/setting/GeneralSetting";
import CycleSetting from "../views/setting/CycleSetting";
import LineSetting from "../views/setting/LineSetting.vue";
import NewLine from '../views/setting/lines/NewLine.vue';
import LineHome from '../views/setting/lines/LineHome.vue';
import EditLine from "../views/setting/lines/EditLine.vue";
export default {
  path: '/setting',
  component: Setting,
  children : [
    {
      path: '',
      component: GeneralSetting
    },
    {
      path: 'cycle',
      component: CycleSetting
    },
    {
      path: 'lines',
      component: LineSetting,
      children: [
        {
          path: '',
          component: LineHome
        },
        {
          path: 'new',
          component: NewLine
        },
        {
          path: ':id/edit',
          component: EditLine
        }
      ]
    }
  ]
}

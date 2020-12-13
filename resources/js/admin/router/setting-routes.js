import Setting from "../views/Setting.vue";
import GeneralSetting from "../views/setting/GeneralSetting";
import CycleSetting from "../views/setting/CycleSetting";

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
    }
  ]
}

import Vue from "vue"
import VueRouter from "vue-router"
import HomePage from "../views/Home.vue";
import ErrorPage from "../../components/ErrorPage";
Vue.use(VueRouter);


export default new VueRouter({
  base: document.getElementById('APP_BASE_URI').value+'dm',
  mode:'history',
  routes: [
    {
      path: '/',
      component: HomePage
    },
    {
      path: '*',
      component: ErrorPage
    }
  ]
})

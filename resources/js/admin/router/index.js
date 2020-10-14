import Vue from "vue"
import VueRouter from "vue-router";
import HomePage from "../views/Home.vue";
import ErrorPage from "../../components/ErrorPage.vue";

Vue.use(VueRouter)


export default new VueRouter({
  mode: 'history',
  base: document.getElementById('APP_BASE_URI').value+'admin',
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
});
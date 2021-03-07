import Vue from "vue"
import VueRouter from "vue-router"
import HomePage from "../views/HomePage.vue"
import ErrorPage from "../../components/ErrorPage.vue"

Vue.use(VueRouter)

let base = document.getElementById("APP_BASE_URI").value + "accountant";
export default new VueRouter({
  mode: 'history',
  base,
  routes: [
    {
      path: "/",
      component: HomePage
    },
    {
      path: "*",
      component: ErrorPage
    },
    {
      path: "/reports",
      redirect: "/"
    }
  ]
})

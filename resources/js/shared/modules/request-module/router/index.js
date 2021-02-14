import CustomersRequestsModule from "../views/CustomersRequestsModule.vue"
import ModuleHome from "../views/ModuleHome.vue";
import AddRequest from "../views/AddRequest";
import RequestList from "../views/RequestList.vue";
import ViewRequest from "../views/ViewRequest.vue";
import Analysis from "../views/Analysis.vue";

export default [
  {
    path: '/customers-requests',
    component: CustomersRequestsModule,

    children: [
      {
        path: '',
        component: ModuleHome
      },
      {
        path: 'add',
        component: AddRequest
      },
      {
        path: 'list',
        component: RequestList,
      },
      {
        path: 'view/:serial',
        component: ViewRequest
      },
      {
        path: "analysis",
        component: Analysis
      }
    ]
  }
]

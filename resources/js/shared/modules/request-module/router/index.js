import CustomersRequestsModule from "../views/CustomersRequestsModule.vue"
import ModuleHome from "../views/ModuleHome.vue";
import AddRequest from "../views/AddRequest";
import RequestList from "../views/RequestList.vue";
import ViewRequest from "../views/ViewRequest.vue";
import Analysis from "../views/Analysis.vue";
import SharedRequests from "../views/SharedRequestList.vue";
import ShareInRequest from "../views/ShareInRequest.vue";
import Events from "../views/Events.vue";
import CostCenter from "../views/CostCenter.vue";

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
      },
      {
        path: "shared/list",
        component: SharedRequests
      },
      {
        path: "shared/create",
        component: ShareInRequest
      },
      {
        path: "events",
        component: Events
      },
      {
        path: "cost-center",
        component: CostCenter
      }
    ]
  }
]

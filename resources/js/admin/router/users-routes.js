import UsersPage from '../views/UsersPage.vue';
import ViewAllUsers from '../views/users/ViewAllUsers.vue';
import AddNewUser from '../views/users/AddNewUser.vue';
import EditUser from '../views/users/EditUser.vue';
import ViewUser from "../views/users/ViewUser.vue";
export default {
  path: '/users',
  component: UsersPage,
  children: [
    {
      path: '',
      component: ViewAllUsers
    },
    {
      path: 'add',
      component: AddNewUser
    },
    {
      path: 'edit/:id',
      component: EditUser
    },
    {
      path: "view",
      component: ViewUser
    }
  ]
}

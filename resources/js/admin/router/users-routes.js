import UsersPage from '../views/UsersPage.vue';
import ViewAllUsers from '../views/users/ViewAllUsers.vue';
import AddNewUser from '../views/users/AddNewUser.vue';
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
    }
  ]
}

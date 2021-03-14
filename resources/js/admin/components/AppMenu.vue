<template>
  <!-- mobile nav -->
  <ul :class="`nav  ${navStyle}`">
    <li class="nav-item mx-md-0 mx-2">
      <router-link to="/" class="nav-link small">
        <span class="fa fa-home"></span>
        <span>Home</span>
      </router-link>
    </li>
    <!-- Setting menu -->
    <li class="nav-item mx-md-0 mx-2">
      <a href="#setting_menu" class="nav-link small" data-toggle="collapse">
        <span class="fa fa-tools"></span>
        <span>Settings</span>
        <span class="fa fa-chevron-down float-right"></span>
      </a>
      <!-- setting menu -->
      <ul class="collapse nav bg-white rounded" id="setting_menu">
        <li class="nav-item col-12">
          <router-link to="/setting" class="nav-link small text-primary">
            <span class="fa fa-cog"></span>
            <span>General</span>
          </router-link>
        </li>
        <li class="nav-item col-12">
          <router-link to="/setting/cycle" class="nav-link small text-primary">
            <span class="fa fa-hourglass-start"></span>
            <span>Cycles</span>
          </router-link>
        </li>
        <li class="nav-item col-12">
          <router-link to="/setting/lines" class="nav-link small text-primary">
            <span class="fa fa-users"></span>
            <span>Lines</span>
          </router-link>
        </li>
        <li class="nav-item col-12">
          <router-link
            to="/setting/requests"
            class="nav-link small text-primary"
          >
            <span class="fa fa-dollar-sign"></span>
            <span>Requests</span>
          </router-link>
        </li>
        <li class="nav-item col-12">
          <router-link
            to="/setting/products"
            class="nav-link small text-primary"
          >
            <span class="fa fa-gifts"></span>
            <span>Products</span>
          </router-link>
        </li>
      </ul>
    </li>
    <!-- users menu -->
    <li class="nav-item mx-md-0 mx-2">
      <a href="#user_menu" class="nav-link small" data-toggle="collapse">
        <span class="fa fa-tools"></span>
        <span>Users</span>
        <span class="fa fa-chevron-down float-right"></span>
      </a>
      <!-- user menu -->
      <ul class="collapse nav bg-white rounded" id="user_menu">
        <li class="nav-item col-12">
          <router-link to="/users" class="nav-link small text-primary">
            <span class="fa fa-book-open"></span>
            <span>All</span>
          </router-link>
        </li>
        <li class="nav-item col-12">
          <router-link to="/users/add" class="nav-link small text-primary">
            <span class="fa fa-plus"></span>
            <span>Add</span>
          </router-link>
        </li>
        <li class="nav-item col-12">
          <router-link to="/users/view" class="nav-link small text-primary">
            <span class="fa fa-user-check"></span>
            <span>Edit</span>
          </router-link>
        </li>
        <li class="nav-item col-12">
          <router-link to="/users/delete" class="nav-link small text-primary">
            <span class="fa fa-trash"></span>
            <span>Delete</span>
          </router-link>
        </li>
        <li class="nav-item col-12">
          <router-link to="/users/activate" class="nav-link small text-primary">
            <span class="fa fa-user-slash"></span>
            <span>Delete</span>
          </router-link>
        </li>
        <li class="nav-item col-12">
          <router-link
            to="/users/relations"
            class="nav-link small text-primary"
          >
            <span class="fa fa-user-friends"></span>
            <span>Relations</span>
          </router-link>
        </li>
      </ul>
    </li>
    <!-- Customers menu -->
    <li class="nav-item mx-md-0 mx-2">
      <a href="#customers_menu" class="nav-link small" data-toggle="collapse">
        <span class="fa fa-user-md"></span>
        <span>Customers</span>
        <span class="fa fa-chevron-down float-right"></span>
      </a>
      <!-- customer sub menu -->
      <ul class="collapse nav bg-white rounded" id="customers_menu">
        <li class="nav-item col-12">
          <router-link to="/customers" class="nav-link small text-primary">
            <span class="fa fa-book-open"></span>
            <span>All</span>
          </router-link>
        </li>
        <li class="nav-item col-12">
          <router-link
            to="/customers/duplicate-customers"
            class="nav-link small text-primary"
          >
            <span class="fa fa-clone"></span>
            <span>Duplicate</span>
          </router-link>
        </li>
      </ul>
    </li>
    <!-- planner menu -->
    <li class="nav-item mx-md-0 mx-2">
      <a href="#planner_menu" class="nav-link small" data-toggle="collapse">
        <span class="fa fa-calendar-alt"></span>
        <span>Planner</span>
        <span class="fa fa-chevron-down float-right"></span>
      </a>
      <!-- planner sub menu -->
      <ul class="collapse nav bg-white rounded" id="planner_menu">
        <li class="nav-item col-12">
          <router-link to="/planner" class="nav-link small text-primary">
            <span class="fa  fa-list"></span>
            <span>PM</span>
          </router-link>
        </li>
        <li class="nav-item col-12">
          <router-link to="/planner/am" class="nav-link small text-primary">
            <span class="fa  fa-list"></span>
            <span>AM</span>
          </router-link>
        </li>
        <li class="nav-item col-12">
          <router-link
            to="/planner/approval"
            class="nav-link small text-primary"
          >
            <span class="fa fa-check-circle"></span>
            <span>Approval</span>
          </router-link>
        </li>
      </ul>
    </li>

    <li class="nav-item mx-md-0 mx-2">
      <router-link to="/reports" class="nav-link small">
        <span class="fa fa-handshake"></span>
        <span> Reports</span>
      </router-link>
    </li>
    <li class="nav-item mx-md-0 mx-2">
      <router-link to="/validation" class="nav-link small">
        <span class="fa fa-check-circle"></span>
        <span> Validation</span>
      </router-link>
    </li>
    <li class="nav-item mx-md-0 mx-2">
      <router-link to="/broadcasting" class="nav-link small">
        <span class="fa fa-bullhorn"></span>
        <span> Broadcasting</span>
      </router-link>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    variant: {
      type: String,
      default: () => "mobile"
    }
  },
  computed: {
    navStyle() {
      if (this.variant === "mobile") {
        return "d-md-none d-block";
      } else {
        return "d-md-block d-none";
      }
    }
  }
};
</script>

<style></style>

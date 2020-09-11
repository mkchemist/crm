<template>
  <div class="col-lg-3">
    <div class="list-group list-group-flush sidebar-list-group">
      <router-link to="/workplaces/add-hospital" class="list-group-item list-group-item-action p-2" active-class="active-list-item" exact>
        <span><i class='fa fa-plus-circle'></i></span>
        <span>Add Hospital</span>
      </router-link>
      <router-link to="/workplaces/add-pharmacy" class="list-group-item list-group-item-action p-2" active-class="active-list-item" exact>
        <span><i class='fa fa-plus-circle'></i></span>
        <span>Add Pharmacy</span>
      </router-link>
      <router-link to="/workplaces" class="list-group-item list-group-item-action p-2" active-class="active-list-item" exact>
        <span><i class="fa fa-hospital-alt"></i></span>
        <span>Hospitals</span>
      </router-link>
      <router-link to="/workplaces/pharmacies" class="list-group-item list-group-item-action p-2" active-class="active-list-item" exact>
        <span><i class="fa fa-hospital-alt fa-store"></i></span>
        <span>Pharmacies</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>

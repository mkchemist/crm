<template>
  <div class="col-lg-3">
    <div class="list-group list-group-flush">
      <router-link to="/customers/new" class="list-group-item list-group-item-action p-2">
        <span><i class="fa fa-plus-circle"></i></span>
        <span>Add</span>
      </router-link>
      <router-link to="/customers" class="list-group-item list-group-item-action p-2">
        <span><i class="fa fa-unlock"></i></span>
        <span>Active</span>
      </router-link>
      <router-link to="/customers/inactive" class="list-group-item list-group-item-action p-2">
        <span><i class="fa fa-lock"></i></span>
        <span>InActive</span>
      </router-link>
      <router-link to="/customers/all" class="list-group-item list-group-item-action p-2">
        <span><i class="fa fa-user-md"></i></span>
        <span>All</span>
      </router-link>
      <router-link to="/customers/favorite" class="list-group-item list-group-item-action p-2">
        <span><i class="fa fa-star"></i></span>
        <span>Favorite list</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
  .list-group {
    .list-group-item {
      transition:.2s;

      &:hover {
        border-left:3px solid #38c172;
        background-color:#1111;
      }
    }
  }
</style>

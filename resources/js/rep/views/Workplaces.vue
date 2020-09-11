<template>
  <div>
      <div class="row mx-auto">
        <workplace-side-bar />
        <div class="col-lg-9">
          <router-view class="page-fade"></router-view>
        </div>
      </div>
  </div>
</template>

<script>
import WorkplaceSideBar from "../components/WorkplaceSideBar"
export default {
  components:{
    WorkplaceSideBar
  }
}
</script>

<style>

</style>

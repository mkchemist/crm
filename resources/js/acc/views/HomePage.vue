<template>
  <div>
    <div class="row mx-auto p-3" style="min-height:500px">
      <div class="col-lg d-flex align-content-center justify-content-center">
        <div>
          <img :src="`${baseUrl}images/Logo.png`" alt="" class="img-fluid">
        </div>
      </div>
      <div class="col-lg shadow rounded px-0">
        <page-title-component title="NPMT Requests Management System" :icon="`fa-tools`" />
        <div class="p-3">
          <div class="lead">
            <p>Name : <span class="text-primary font-weight-bold">{{ user.name }}</span></p>
            <p>Title : <span class="text-primary font-weight-bold">{{ user.role }}</span></p>
            <p>Username : <span class="text-primary font-weight-bold">{{ user.username }}</span></p>
          </div>
          <hr>
          <div class="btn-group">
            <a class="btn btn-sm btn-primary" :href="baseUrl+'change-password'">
              <span class="fa fa-lock"></span>
              <span>Change Password</span>
            </a>
            <a class="btn btn-sm btn-danger" :href="baseUrl+'logout'">
              <span class="fa fa-lock"></span>
              <span>Sign out</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageTitleComponent from '../../components/PageTitleComponent.vue';
import { UrlHelper } from '../../helpers/http-service'
export default {
  components: { PageTitleComponent },
  computed: {
    user() {
      return this.$store.getters.user;
    }
  },
  data: () => ({
    baseUrl: UrlHelper.generate()
  })
}
</script>

<style>

</style>

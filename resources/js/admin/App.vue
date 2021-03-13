<template>
  <div
    style="min-height:700px"
    class="wrapper skin-primary container-fluid shadow px-0"
  >
    <admin-navbar />
    <div class="row mx-auto bg-light admin-main">
      <div
        class="col-lg-2 col-md-3 d-flex flex-column justify-content-between bg-white px-0 py-3"
      >
        <div class="py-3 px-0 admin-sidebar">
          <app-menu variant="desktop" />
        </div>
        <div class="d-none d-md-block">
          <ul class="nav justify-content-center" id="skin-switcher"></ul>
        </div>
      </div>
      <div class="col-lg-10 col-md-9 px-2">
        <div class="bg-white">
          <router-view></router-view>
        </div>
      </div>
    </div>
    <modal-fade
      :show="$store.state.BroadcastModule.is_modal_active"
      @onClose="$store.commit('toggleBroadcastModal', false)"
      headerStyle="bg-primary text-light"
    >
      <template v-slot:header>
        Broadcast a new message
      </template>
      <template v-slot:body>
        <new-broadcast-message />
      </template>
    </modal-fade>
  </div>
</template>

<script>
import AdminSideMenu from "./components/AdminSideMenu.vue";
import AdminNavbar from "./components/AdminNavbar.vue";
import NewBroadcastMessage from "./components/NewBroadcastMessage";
import ModalFade from "../components/ModalFade";
import AppMenu from "./components/AppMenu.vue";
export default {
  components: {
    AdminSideMenu,
    AdminNavbar,
    ModalFade,
    NewBroadcastMessage,
    AppMenu
  },
  mounted() {
    /* Promise.all([
      this.$store.dispatch('getAllUsers'),
      this.$store.dispatch("fetchingApplicationSettings")
    ]) */
    (async () => {
      await this.$store.dispatch("getAllUsers");
      await this.$store.dispatch("fetchingApplicationSettings");
    })();
  }
};
</script>

<style scoped lang="scss">
body {
  background-color: #1111 !important;
}
</style>

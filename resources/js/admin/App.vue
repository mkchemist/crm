<template>
  <div style="min-height:700px" class="bg-white shadow">
    <admin-navbar />
    <div class="row mx-auto">
      <div class="col-lg-3 px-0">
        <admin-side-menu />
      </div>
      <div class="col-lg-9">
        <router-view></router-view>
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
export default {
  components: {
    AdminSideMenu,
    AdminNavbar,
    ModalFade,
    NewBroadcastMessage
  },
  mounted() {
    this.$store.dispatch('getAllUsers')
  }
};
</script>

<style scoped lang="scss">
body {
  background-color: #1111 !important;
}

</style>

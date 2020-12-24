<template>
  <div>
    <div class="row mx-auto col-12">
      <div class="col-lg-3"></div>
      <div class="col-lg-9 row mx-auto">
        <div class="col-lg-9">
          <broadcasting-messages />
        </div>
        <div class="col-lg-3">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BroadcastingMessages from "../../components/BroadcastingMessages.vue";
export default {
  components: {
    BroadcastingMessages
  }
};
</script>

<style></style>

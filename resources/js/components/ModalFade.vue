<template>
  <div class="modal fade" :id="id ? id :`modal_fade`">
    <div :class="`modal-dialog ${centered ? 'modal-dialog-centered' : null}`">
      <div class="modal-content">
        <div :class="`modal-header  ${headerStyle}`">
          <slot name="header" :data="data ? data: {}"></slot>
          <button class="close" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <slot name="body" :data="data ? data: {}"></slot>
        </div>
        <div class="modal-footer" v-if="footer">
          <slot name="footer" :data="data ? data: {}"></slot>
          <button class="btn btn-dark btn-sm" @click="closeModal">cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['show', 'data', 'centered', 'footer', 'id', 'headerStyle'],
  watch:{
    show: function() {
      let id = this.id ? `#${this.id}` : '#modal_fade'
      let modal = $(id);
      modal.on('hide.bs.modal', () => {
        this.$emit('onClose');
      });
      if(this.show === true) {
        modal.modal('show');
      } else {
        modal.modal('hide');
      }
    }
  },
  methods: {
    closeModal() {
      let id = this.id ? `#${this.id}` : '#modal_fade'
      let modal = $(id);
      modal.on('hide.bs.modal', () => {
        this.$emit('onClose');
      });
      modal.modal('hide');
    }
  }
}
</script>

<style>

</style>

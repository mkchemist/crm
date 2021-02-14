<template>
  <div class="modal fade" :id="id">
    <div :class="`modal-dialog ${centered ? 'modal-dialog-centered' : null} ${scroll ? 'modal-dialog-scrollable' : ''}`">
      <div class="modal-content">
        <div :class="`modal-header  ${headerStyle}`">
          <slot name="header" :data="data ? data: {}"></slot>
          <button class="close" @click="closeModal" type="button">&times;</button>
        </div>
        <div class="modal-body">
          <slot name="body" :data="data ? data: {}"></slot>
        </div>
        <div class="modal-footer" v-if="footer">
          <slot name="footer" :data="data ? data: {}"></slot>
          <button class="btn btn-dark btn-sm" @click="closeModal" type="button">cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true
    },
    data: {
      type: Object || Array,
    },
    centered: {
      type: Boolean
    },
    footer: {
      type: Boolean
    },
    id: {
      type: String,
      default : () => "modal_fade"
    },
    headerStyle: {
      type: String
    },
    scroll: {
      type: Boolean,
      default: () => false
    }
  },
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

<template>
  <div class="p-2">
    <!-- tool details -->
    <div class="row mx-auto border p-2 rounded">
      <div class="col-lg">
        <label for="">Conference</label>
        <ValidationProvider
          name="Conference Name"
          rules="required"
          v-slot="{ errors }"
        >
          <span class="text-danger small" v-if="errors[0]">* required</span>
          <input
            type="text"
            :class="
              `form-control form-control-sm ${
                errors[0] ? 'border border-danger' : ''
              }`
            "
            placeholder="Conference Name"
            v-model="request.comment.item"
          />
        </ValidationProvider>
      </div>
      <div class="col-lg">
        <label for="">Type</label>
        <input
          type="text"
          min="1"
          class="form-control form-control-sm"
          v-model="request.type"
          :disabled="true"
        />
      </div>
    </div>

    <div class="row mx-auto border p-2 rounded my-2">
      <div class="col-lg">
        <label for="">Location</label>
        <ValidationProvider
          name="Conference Location"
          rules="required"
          v-slot="{ errors }"
        >
          <span class="text-danger small" v-if="errors[0]">* required</span>
          <input
            type="text"
            :class="
              `form-control form-control-sm ${
                errors[0] ? 'border border-danger' : ''
              }`
            "
            placeholder="Write hotel name"
            v-model="location"
          />
        </ValidationProvider>
      </div>
      <div
        class="col-lg form-check-inline align-content-center justify-content-center"
         v-if="request.type !== 'Local Conference'"
      >
        <ValidationProvider
          name="With Ticket"
          rules="required"
          v-slot="{ errors }"
        >
          <input type="checkbox" v-model="withTickets" />
          <span class="text-danger small" v-if="errors[0]">* required</span>

          <label for="" class="form-check-label mx-1">with tickets</label>
        </ValidationProvider>
      </div>
    </div>
    <!-- end of tool details -->
  </div>
</template>

<script>
export default {
  props: {
    request: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    withTickets: false,
    location: null
  }),
  mounted() {
    this.request.comment.desc = `Conference in ${this.location} ${
      this.withTicket ? "With tickets" : "Without tickets"
    }`;
  },
  watch: {
    withTickets: function($new, $old) {
      this.request.comment.desc = `Conference in ${this.location} ${
        $new === true ? "With tickets" : "Without tickets"
      }`;
    },
    location: function($new, $old) {
      this.request.comment.desc = `Conference in ${$new} ${
        this.withTicket ? "With tickets" : "Without tickets"
      }`;
    }
  }
};
</script>

<style></style>

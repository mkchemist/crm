<template>
  <div>
    <div class="row mx-auto my-2 p-2 border rounded">
      <div class="col-lg">
        <label for="">Meeting Place</label>
        <ValidationProvider
          name="Group meeting place"
          rules="required"
          v-slot="{ errors }"
        >
          <span class="text-danger small" v-if="errors[0]">* required</span>
          <input
            type="text"
            class="form-control form-control-sm"
            placeholder="Group meeting place"
            v-model="place"
            :disabled="!editMode"
          />
        </ValidationProvider>
      </div>
      <div class="col-lg">
        <label for="">No. of Attendance</label>
        <ValidationProvider
          name="Meeting Attendees"
          rules="required"
          v-slot="{ errors }"
        >
          <span class="text-danger small" v-if="errors[0]">* required</span>

          <input
            type="number"
            class="form-control form-control-sm"
            placeholder="No. of attendance"
            v-model="desc"
            :disabled="!editMode"
          />
        </ValidationProvider>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    request: {
      type: Object,
      required: true
    },
    editMode: {
      type: Boolean,
      default: () => true
    }
  },
  mounted() {
    this.request.comment.item = `Group Meeting in ${this.place}`;
    this.request.comment.desc = `Number of expected attendance is ${this.desc}`;
    this.desc = this.request.customers.length;
  },
  data: () => ({
    desc: 1,
    place: ""
  }),
  watch: {
    desc: function($new) {
      this.request.comment.desc = `Number of expected attendance is ${$new}`;
    },
    place: function($new) {
      this.request.comment.item = `Group Meeting in ${$new}`;
    }
  }
};
</script>

<style></style>

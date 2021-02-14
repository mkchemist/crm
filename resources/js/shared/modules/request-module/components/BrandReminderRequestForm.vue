<template>
  <div class="p-2">
    <!-- tool details -->
    <div class="row mx-auto border p-2 rounded">
      <div class="col-lg">
        <label for="">Tool</label>
        <ValidationProvider name="Tool Name" rules="required" v-slot="{errors}">
          <span class="text-danger small" v-if="errors[0]">* required</span>
          <input
            type="text"
            :class="
              `form-control form-control-sm ${
                errors[0] ? 'border border-danger' : ''
              }`
            "
            placeholder="Write what tool you will present"
            v-model="request.comment.item"
          />
        </ValidationProvider>
      </div>
      <div class="col-lg">
        <label for="">Description</label>
        <ValidationProvider name="Description" rules="required" v-slot="{errors}">
          <span class="text-danger small" v-if="errors[0]">* required</span>
          <textarea
            cols="30"
            rows="4"
            :class="
              `form-control form-control-sm ${
                errors[0] ? 'border border-danger' : ''
              }`
            "
            placeholder="Write tool description"
            v-model="request.comment.desc"
          ></textarea>
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
  }
};
</script>

<style></style>

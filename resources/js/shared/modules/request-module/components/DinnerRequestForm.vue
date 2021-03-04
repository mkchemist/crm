<template>
  <div class="p-2">
    <!-- gift details -->
    <div class="row mx-auto border p-2 rounded">
      <div class="col-lg">
        <label for="">Restaurant</label>
        <ValidationProvider
          name="Restaurant Name"
          rules="required"
          v-slot="{ errors }"
        >
          <span class="text-danger small" v-if="errors[0]">* required</span>
          <input
            type="text"
            class="form-control form-control-sm"
            placeholder="write restaurant name"
            v-model="request.comment.item"
          />
        </ValidationProvider>
      </div>
      <div class="col-lg">
        <label for="">Persons</label>
        <ValidationProvider name="Persons" rules="required" v-slot="{ errors }">
          <span class="text-danger small" v-if="errors[0]">* required</span>
          <input
            type="number"
            :min="1"
            v-model="persons"
            class="form-control form-control-sm"
          />
        </ValidationProvider>
      </div>
    </div>
    <!-- end of gift details -->
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
    this.request.comment.desc = `Reservation in restaurant ${
      this.request.comment.item ? this.request.comment.item : ''
    } for ${this.persons} ${this.persons > 1 ? "persons" : "person"}`;
  },
  data: () => ({
    persons: 1
  }),
  watch: {
    persons: function($new, $old) {
      this.request.comment.desc = `Reservation in restaurant ${
        this.request.comment.item ? this.request.comment.item : ''
      } for ${$new} ${$new > 1 ? "persons" : "person"}`;
    },
    "request.comment.item": function($new, $old) {
      this.request.comment.desc = `Reservation in restaurant ${$new} for ${
        this.persons
      } ${this.persons > 1 ? "persons" : "person"}`;
    }
  }
};
</script>

<style></style>

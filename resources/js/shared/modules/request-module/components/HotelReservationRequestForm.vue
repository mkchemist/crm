<template>
  <div class="p-2">
    <!-- tool details -->
    <div class="row mx-auto border p-2 rounded">
      <div class="col-lg">
        <label for="">Hotel</label>
        <ValidationProvider
          name="Hotel Name"
          rules="required"
          v-slot="{ errors }"
        >
          <span class="text-danger small" v-if="errors[0]">* required</span>
          <input
            type="text"
            class="form-control form-control-sm"
            placeholder="Write hotel name"
            v-model="request.comment.item"
          />
        </ValidationProvider>
      </div>
      <div class="col-lg">
        <label for="">Duration</label>
        <ValidationProvider
          name="Duration"
          rules="required"
          v-slot="{ errors }"
        >
          <span class="text-danger small" v-if="errors[0]">* required</span>
          <input
            type="number"
            min="1"
            class="form-control form-control-sm"
            placeholder="Number of nights"
            v-model="nights"
          />
        </ValidationProvider>
      </div>
      <div class="col-lg">
        <label for="">Type</label>
        <ValidationProvider name="type" rules="required" v-slot="{ errors }">
          <span class="text-danger small" v-if="errors[0]">* required</span>
          <select class="form-control form-control-sm" v-model="type">
            <option value="BB">BB</option>
            <option value="Half Board">Half Board</option>
            <option value="Full Board">Full Board</option>
          </select>
        </ValidationProvider>
      </div>
    </div>
    <!-- end of tool details -->
    <!-- tool details -->
    <div class="row mx-auto border p-2 rounded my-2">
      <div class="col-lg">
        <label for="">Rooms</label>
        <ValidationProvider name="Rooms" rules="required" v-slot="{ errors }">
          <span class="text-danger small" v-if="errors[0]">* required</span>
          <input
            type="number"
            min="1"
            class="form-control form-control-sm"
            placeholder="Number of nights"
            v-model="rooms"
          />
        </ValidationProvider>
      </div>
      <div class="col-lg">
        <label for="">Room Type</label>
        <ValidationProvider
          name="Rome Type"
          rules="required"
          v-slot="{ errors }"
        >
          <span class="text-danger small" v-if="errors[0]">* required</span>
          <select class="form-control form-control-sm" v-model="room_type">
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Triple">Triple</option>
          </select>
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
    nights: 1,
    type: "Full Board",
    rooms: 1,
    room_type: "Double"
  }),
  mounted() {
    this.request.comment.desc = `${this.rooms} ${
      this.rooms > 1 ? "rooms" : "room"
    } ${this.room_type} for ${this.nights} ${
      this.nights > 1 ? "nights" : "night"
    } with ${this.type}`;
  },
  watch: {
    nights: function($new, $old) {
      this.request.comment.desc = `${this.rooms} ${
      this.rooms > 1 ? "rooms" : "room"
    } ${this.room_type} for ${$new} ${
      $new > 1 ? "nights" : "night"
    } with ${this.type}`;
    },
    type: function($new, $old) {
      this.request.comment.desc = `${this.rooms} ${
      this.rooms > 1 ? "rooms" : "room"
    } ${this.room_type} for ${this.nights} ${
      this.nights > 1 ? "nights" : "night"
    } with ${$new}`;
    },
    rooms: function($new, $old) {
      this.request.comment.desc = `${$new} ${
      $new > 1 ? "rooms" : "room"
    } ${this.room_type}  ${this.nights} ${
      this.nights > 1 ? "nights" : "night"
    } with ${this.type}`;
    },
    room_type: function($new, $old) {
      this.request.comment.desc = `${this.rooms} ${
      this.rooms > 1 ? "rooms" : "room"
    } ${$new}  ${this.nights} ${
      this.nights > 1 ? "nights" : "night"
    } with ${this.type}`;
    }
  }
};
</script>

<style></style>

<template>
  <div class="p-2">
    <div class="form-inline border p-2 rounded" v-if="request.type === 'Club'">
      <label for="">Event</label>
      <select class="form-control form-control-sm col ml-2" v-model="event_name" >
        <option :value="null">select event</option>
        <option v-for="ev in events" :key="`ev_${ev.id}`"  :value="ev">{{ ev.content.name }}</option>
      </select>
    </div>
    <!-- tool details -->
    <div class="row mx-auto border p-2 rounded" v-if="request.type!=='Club' || (request.type==='Club' && event_name)">
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
            :disabled="!editMode || request.type === 'Club'"
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
            :disabled="!editMode || request.type === 'Club'"
          />
        </ValidationProvider>
      </div>

    </div>
    <!-- end of tool details -->
    <!-- tool details -->
    <div class="row mx-auto border p-2 rounded" v-if="request.type!=='Club' || (request.type==='Club' && event_name)">
        <div class="col-lg">
        <label for="">Type</label>
        <ValidationProvider name="type" rules="required" v-slot="{ errors }">
          <span class="text-danger small" v-if="errors[0]">* required</span>
          <select class="form-control form-control-sm" v-model="type" :disabled="!editMode || request.type === 'Club'">
            <option value="BB">BB</option>
            <option value="Half Board">Half Board</option>
            <option value="Full Board">Full Board</option>
          </select>
        </ValidationProvider>
      </div>
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
            :disabled="!editMode || request.type === 'Club'"
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
          <select class="form-control form-control-sm" v-model="room_type" :disabled="!editMode || request.type === 'Club'">
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
import { httpCall } from '../../../../helpers/http-service';
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
  data: () => ({
    nights: 1,
    type: "Full Board",
    rooms: 1,
    room_type: "Double",
    event_name: null,
    events: [],
    fetched: false
  }),
  mounted() {
    if(this.request.type === "Club") {
      this.fetchAllEvents();
    }
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
    },
    event_name: function($new) {
      console.log('changed');
      this.nights = $new.content.duration;
      this.type = $new.content.type;
      this.rooms = $new.content.rooms;
      this.room_type = $new.content.room_type;
      this.request.comment.item = `Club in ${$new.content.hotel}`;
    }
  },
  methods: {
    fetchAllEvents() {
      this.events = [];
      this.fetched = false;
      if(!this.events.length) {
        return httpCall
          .get("v1/request-events")
          .then(({ data }) => {
            data.data.forEach(item => {
              item.content = JSON.parse(item.content);
            });
            this.events = data.data;
            this.fetched = true;
          })
          .catch(err => console.log(err));
      }
    }
  }
};
</script>

<style></style>

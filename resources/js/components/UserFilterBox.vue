<template>
  <div class="p-2 border rounded" v-if="users.length">
    <div class="form-group">
      <label for="">User</label>
      <select
        name="user"
        id="user"
        v-model="user"
        class="form-control form-control-sm"
      >
        <option :value="null">All</option>
        <option
          v-for="(user, i) in sortedUsers"
          :key="`filter_box_user_${i}`"
          :value="user.id"
          >{{ user.name }}</option
        >
      </select>
    </div>
    <div class="form-group text-right">
      <button type="button" class="btn btn-sm btn-secondary" @click="reset">
        <span class="fa fa-redo"></span>
        <span>reset</span>
      </button>
      <button type="button" class="btn btn-sm btn-primary" @click="filterUsers">
        <span class="fa fa-check-circle"></span>
        <span>ok</span>
      </button>
    </div>
  </div>
</template>

<script>
import { filterBy, sortBy } from '../helpers/helpers';
export default {
  props: {
    users: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    onFilter: {
      type: Function,
      required: true
    },
    onReset: {
      type: Function,
      required: true
    },
    userField: {
      type: String
    }
  },
  data: () => ({
    user: null
  }),
  computed: {
    sortedUsers() {
      return sortBy(this.users, 'name');
    }
  },
  methods: {
    filterUsers() {
      let key  = this.userField || 'user_id'
      if(user === null) {
        return this.data;
      }
      let data = filterBy(this.data, 'user_id', this.user);
      this.onFilter(data)
    },
    reset() {
      this.onReset();
      this.user = null;
    }
  }
};
</script>

<style></style>

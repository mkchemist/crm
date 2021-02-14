<template>
  <div :class="className" v-if="users.length">
    <div class="form-group">
      <label for="" class="text-muted">User</label>
      <select
        name="user"
        id="user"
        v-model="user"
        class="form-control form-control-sm"
      >
        <option :value="null">{{ placeholderText }}</option>
        <option
          v-for="(user, i) in sortedUsers"
          :key="`filter_box_user_${i}`"
          :value="user"
          >{{ user.name }}</option
        >
      </select>
    </div>
    <div class="form-group text-right">
      <button type="button" class="btn btn-sm btn-primary" @click="filterUsers" :disabled="singleSelect">
        <span class="fa fa-check-circle"></span>
        <span>ok</span>
      </button>
      <button type="button" class="btn btn-sm btn-secondary" @click="reset" :disabled="singleSelect" v-if="showResetButton != false">
        <span class="fa fa-redo"></span>
        <span>reset</span>
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
      default: () => []
    },
    onFilter: {
      type: Function,
      required: true
    },
    onReset: {
      type: Function,
      default: () => () => null
    },
    userField: {
      type: String
    },
    singleUser: {
      type: Boolean,
      default: () => false
    },
    showResetButton: {
      type: Boolean,
      default: () => true
    },
    placeholderText: {
      type: String,
      default: () => 'All'
    },
    className: {
      type: String,
      default: () => 'p-2 border rounded'
    }
  },
  data: () => ({
    user: null
  }),
  computed: {
    sortedUsers() {
      return sortBy(this.users, 'name');
    },
    singleSelect() {
      if(this.singleUser) {
        if(this.user === null) {
          return true;
        }
        return false
      }
      return false
    }
  },
  methods: {
    filterUsers() {
      let key  = this.userField || 'user_id'
      if(this.user === null) {
        return this.data;
      }
      let data = filterBy(this.data, key, this.user.id);
      this.onFilter(data, this.user.id, this.user)
    },
    reset() {
      this.onReset();
      this.user = null;
    }
  }
};
</script>

<style></style>

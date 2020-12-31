<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-success">
      <span class="fa fa-user-cog"></span>
      <span class="font-weight-bold">Planner Approval</span>
    </p>
    <div class="p-2">
      <div>
          <user-filter-box :users="reps" :data="[]" :onFilter="onFilter" :onReset="onReset" />
      </div>
    </div>
  </div>
</template>

<script>
import UserFilterBox from '../../../components/UserFilterBox.vue';
import { sortBy } from '../../../helpers/helpers';
export default {
  mounted() {
    this.$store.dispatch('getAllUsers')
  },
  components: {
UserFilterBox,
  },
  computed: {
    reps() {
      let users = this.$store.getters.users;
      let reps = users.filter(user => user.role === 'rep');
      return sortBy(reps,'name');
    },
    isRepsFetched() {
      return this.$store.getters.allUsersFetched;
    }
  },
  methods: {
    onFilter() {

    },
    onReset() {

    },
    getPlans() {

    }
  }
}
</script>

<style>

</style>

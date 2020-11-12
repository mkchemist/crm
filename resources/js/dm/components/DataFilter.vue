<template>
  <div>
    <div class="my-2 border p-2 rounded">
      <div class="form-group">
        <label for="rep">Rep</label>
        <select
          name="rep"
          id="rep"
          v-model="rep"
          v-if="reps.length"
          class="form-control form-control-sm"
        >
          <option :value="null">All</option>
          <option :value="rep.id" v-for="rep in reps" :key="rep.id">{{
            rep.name
          }}</option>
        </select>
        <loader-component v-else></loader-component>
      </div>
      <div class="form-group">
        <label for="start">From</label>
        <input
          type="date"
          class="form-control form-control-sm"
          v-model="start"
        />
      </div>
      <div class="form-group">
        <label for="end">End</label>
        <input type="date" class="form-control form-control-sm" v-model="end" :min="start" />
      </div>
      <div class="form-group text-right">
        <button class="btn btn-sm btn-secondary" @click="reset">
          <span><i class="fa fa-redo"></i></span>
          <span>reset</span>
        </button>
        <button
          class="btn btn-sm btn-primary"
          @click="filterByDate"
        >
          <span><i class="fa fa-filter"></i></span>
          <span>filter</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { filterBy, filterByDate, sortBy } from "../../helpers/helpers";
export default {
  computed: {
    reps() {
      return sortBy(this.$store.getters.allReps, "name");
    }
  },
  props: ["data", "keys","onUpdate", "onReset"],
  data: () => ({
    start: null,
    end: null,
    rep: null
  }),
  methods: {
    reset() {
      this.start = null;
      this.end = null;
      this.onReset();
    },
    filterByDate() {
      let repItems = filterBy(this.data, this.keys.rep, this.rep);
      if(!this.start && !this.end) {
        this.onUpdate(repItems);
      } else {
        repItems.then(repData => {
          let range = {start: this.start, end: this.end};
          let res = filterByDate(repData, this.keys.date, range);
          this.onUpdate(res);
        })
      }
    }
  }
};
</script>

<style></style>

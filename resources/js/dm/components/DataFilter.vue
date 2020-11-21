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
        <input
          type="date"
          class="form-control form-control-sm"
          v-model="end"
          :min="start"
        />
      </div>
      <div class="form-group text-right">
        <button class="btn btn-sm btn-secondary" @click="reset">
          <span><i class="fa fa-redo"></i></span>
          <span>reset</span>
        </button>
        <button class="btn btn-sm btn-primary" @click="filterByDate">
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
  props: {
    data: {
      type: Object | Array,
      required: true
    },
    keys: {
      type: Object,
      require: true
    },
    onUpdate: {
      required: true,
      type: Function
    },
    onReset: {
      require: true,
      type: Function
    }
  },
  data: () => ({
    start: null,
    end: null,
    rep: null
  }),
  methods: {
    reset() {
      this.start = null;
      this.end = null;
      this.rep = null;
      this.onReset();
    },
    filterByDate() {
      let data;
      if (this.data instanceof Array) {
        let repItems = filterBy(this.data, this.keys.rep, this.rep);
        if (this.start || this.end) {
          let range = { start: this.start, end: this.end };
          data = filterByDate(repItems, this.keys.date, range);
        } else {
          data = repItems;
        }
      } else {
        data = {};
        for (let i in this.data) {
          let key = this.data[i];
          let repItems = filterBy(key, this.keys.rep, this.rep);
          if (this.start || this.end) {
            let range = { start: this.start, end: this.end };
            data[i] = filterByDate(repItems, this.keys.date, range);
          } else {
            data[i] = repItems;
          }
        }
      }
      let res = new Promise(resolve => {
        resolve(data);
      });
      this.onUpdate(res);
    }
  }
};
</script>

<style></style>

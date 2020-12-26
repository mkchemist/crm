<template>
  <div class="border rounded p-2 my-2">
    <div class="form-group">
      <label for="">From</label>
      <input
        type="date"
        name="date_from"
        id="date_from"
        class="form-control form-control-sm"
        v-model="date.from"
      />
    </div>
    <div class="form-group">
      <label for="">To</label>
      <input
        type="date"
        name="date_from"
        id="date_from"
        class="form-control form-control-sm"
        v-model="date.to"
      />
    </div>
    <div class="form-group text-right">
      <button type="button" class="btn btn-sm btn-secondary" @click="reset">
        <span class="fa fa-redo"></span>
        <span>reset</span>
      </button>
      <button type="button" class="btn btn-sm btn-primary" @click="filterDates">
        <span class="fa fa-check-circle"></span>
        <span>ok</span>
      </button>
    </div>
  </div>
</template>

<script>
import { filterByDate } from '../helpers/helpers';
export default {
  props: {
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
    dateField: {
      type: String,
      required: true
    }
  },
  data: () => ({
    date: {
      from: null,
      to: null
    }
  }),
  methods: {
    filterDates() {
      let res  = filterByDate(this.data, this.dateField, {start: this.date.from, end: this.date.to});
      this.onFilter(res);
    },
    reset() {
      this.onReset();
      this.date.from = null;
      this.date.to = null;
    }
  }
};
</script>

<style></style>

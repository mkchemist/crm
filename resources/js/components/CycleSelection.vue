<template>
  <div class="p-2 border rounded my-1 shadow">
    <label for="active_cycle" class="small text-muted">Current Cycle</label>
    <select
      name="active_cycle"
      id="active_cycle"
      class="form-control form-control-sm"
      v-model="activeCycle"
      :disabled="!cycles.length || !activeCycle"
    >
      <option v-for="(cycle, i) in cycles" :key="`cycle_${i}`" :value="cycle">{{
        cycle.name
      }}</option>
    </select>
    <div class="p-2 text-right">
      <button class="btn btn-sm btn-primary" @click="selectCycle">
        <span class="fa fa-check-circle"></span>
        <span>select</span>
      </button>
      <button class="btn btn-sm btn-dark" @click="resetCycle">
        <span class="fa fa-redo"></span>
        <span>reset</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    onSelect: {
      required : true,
      type : Function
    },
    onReset: {
      type: Function,
      required: true
    }
  },
  methods: {
    selectCycle() {
      this.onSelect();
    },
    resetCycle() {
      this.onReset();
    }
  },
  computed: {
    activeCycle: {
      get() {
        return this.$store.getters.activeCycle;
      },
      set(cycle) {
        this.date = new Date(cycle.start)
        return this.$store.state.SettingModule.activeCycle = cycle
      }
    },
    cycles() {
      return this.$store.getters.cycles
    }
  }
};
</script>

<style></style>

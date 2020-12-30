<template>
  <div class="p-2">
    <button class="btn btn-sm btn-primary" @click="openModal">
      <span class="fa fa-filter"></span>
      <span>Filter</span>
    </button>
    <slot></slot>
    <modal-fade :show="show_modal" @onClose="closeModal" :headerStyle="`bg-primary text-light`">
      <template v-slot:header>
        <span>Filter Customers</span>
      </template>
      <template v-slot:body>
        <div class="form-group text-left">
          <label for="">Rep</label>
          <select name="rep" id="rep" class="form-control form-control-sm" v-model="rep">
            <option :value="null">All</option>
            <option v-for="rep in reps" :key="rep.id"  :value="rep">{{ rep.name }}</option>
          </select>
        </div>
        <div class="form-group">
          <button class="btn btn-sm btn-secondary" @click="reset">
            <span class="fa fa-redo"></span>
            <span>reset</span>
          </button>
           <button class="btn btn-sm btn-primary" @click="filter">
             <span class="fa fa-filter"></span>
            <span>filter</span>
          </button>
        </div>
      </template>
    </modal-fade>
  </div>
</template>

<script>
import ModalFade from '../../components/ModalFade.vue'
export default {
  props: {
    onFilter: {
      type: Function,
      required: true
    },
    onReset: {
      type: Function,
      required: true
    },
    data: {
      type: Array,
      required: true
    }
  },
  components: {
    ModalFade,
  },
  data: () => ({
    show_modal:false,
    rep: null
  }),
  computed: {
    reps() {
      return this.$store.getters.allReps;
    }
  },
  methods: {
    openModal() {
      this.show_modal = true;
    },
    closeModal() {
      this.show_modal = false
    },
    filter() {
      let area = JSON.parse(this.rep.area);
      let brick = JSON.parse(this.rep.assigned_brick);
      let district = JSON.parse(this.rep.district);
      let data = this.data;
      if(district.length && district[0] !== 'all') {
        data = data.filter(customer => district.includes(customer.district));
      }
      console.log(data)
      if(area.length && area[0] !== 'all') {
        data = data.filter(customer => area.includes(customer.area));
      }
      console.log(data)
      if(brick.length) {
        data = data.filter(customer => brick.includes(customer.brick));
      }
      console.log(data)
      this.onFilter(data);
      this.show_modal = false;

    },
    reset() {
      this.onReset();
      this.show_modal = false;
    }
  }
}
</script>

<style>

</style>

<template>
  <div>
    <modal-fade
      :show="show"
      @onClose="onClose"
      :headerStyle="`bg-primary text-light`"
    >
      <template v-slot:header>
        <span>Data Filter</span>
      </template>
      <template v-slot:body>
        <div class="row mx-auto justify-content-between">
          <div
            v-for="field in Object.keys(filterFields)"
            :key="`filter_${field}`"
            class="form-group flex-item px-2"
          >
            <label :for="field" class="text-muted small">{{
              field.toUpperCase()
            }}</label>
            <select
              :name="field"
              :id="`${field}_selection`"
              class="form-control form-control-sm"
              @change="updateQuery"
            >
              <option :value="null">Select {{ field }}</option>
              <option
                :value="index"
                v-for="(item, index) in filterFields[field]"
                :key="`filter_selection_${field}_${index}`"
                >{{ index }} ({{ item.length }})</option
              >
            </select>
          </div>
          <div
            v-for="field in extraKeys"
            :key="`extra_field_${field.title}`"
            class="form-group flex-item px-2"
          >
            <label :for="field.title + '_' + field.key">{{
              field.title
            }}</label>
            <select
              :name="field.title + '_' + field.key"
              :id="field.title + '_' + field.key"
              class="form-control form-control-sm"
              @change="updateQuery"
            >
              <option :value="null"> select {{ field.title }}</option>
              <option
                :value="item[field.key]"
                v-for="item in field.data"
                :key="item[field.key]"
                >{{ item[field.label] }}</option
              >
            </select>
          </div>
        </div>
        <hr />
        <div class="form-group text-right">
          <button type="button" class="btn btn-primary btn-sm" @click="filter">
            <span class="fa fa-check-circle"></span>
            <span>Apply</span>
          </button>
          <button type="button" class="btn btn-secondary btn-sm" @click="reset">
            <span class="fa fa-redo"></span>
            <span>Reset</span>
          </button>
          <button type="button" class="btn btn-dark btn-sm" @click="onClose">
            <span class="fa fa-times"></span>
            <span>Cancel</span>
          </button>
        </div>
      </template>
    </modal-fade>
  </div>
</template>

<script>
import { filterData } from "../helpers/helpers";
import ModalFade from "./ModalFade.vue";
export default {
  components: {
    ModalFade
  },
  props: {
    data: {
      type: Array,

      required: true
    },
    queryKeys: {
      type: Array,
      default: () => []
    },
    extraKeys: {
      type: Array
    },
    queryOnly: {
      type: Boolean,
      default: true
    },
    show: {
      type: Boolean,
      required: true
    },
    onClose: {
      type: Function
    },
    onFilter: {
      type: Function,
      required: true
    },
    onReset: {
      type: Function,
      required: true
    }
  },
  computed: {
    filterFields() {
      let fields = {};
      this.queryKeys.map(key => {
        fields[key] = filterData(this.data, key);
      });
      return fields;
    }
  },
  data: () => ({
    query: {}
  }),
  methods: {
    updateQuery(e) {
      this.query[e.target.name] = e.target.value;
    },
    generateQuery() {
      let query = {};
      for (let i in this.query) {
        if (this.query[i].trim() !== "" && this.query[i] !== null) {
          query[i] = this.query[i];
        }
      }
      return query;
    },
    filter() {
      let data = [];
      let query = this.generateQuery();
      if (!this.queryOnly) {
        data = this.data;
        for (let i in query) {
          data = data.filter(item => item[i] == query[i]);
        }
      }
      this.onFilter(query, data);
      this.onClose();
    },
    reset() {
      this.onReset();
      this.onClose();
    }
  }
};
</script>

<style lang="scss" scoped>
.flex-item {
  width: 50% !important;
}
</style>

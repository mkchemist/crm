<template>
  <div class="p-2 border rounded">
    <h4 class="text-primary mb-0">Field activity types</h4>
    <small class="text-muted"
      >this control how users plan and report non field activity</small
    >
    <div class="row mx-auto">
      <div class="p-2 col-lg-4">
        <div class="form-group p-2 border rounded">
          <label for="type" class="text-muted">Type : </label>
          <input type="text" name="field_activity_type" id="field_activity_type" v-model="type" class="form-control form-control-sm" placeholder="write new type name">
          <button class="btn btn-sm skin-btn btn-block my-2" @click="addType">
            <span class="fa fa-plus"></span>
            <span>add</span>
          </button>
        </div>
      </div>
      <div class="p-2 col-lg-8 border rounded" style="height:150px;overflow:auto">
        <div v-if="nonFieldActivityTypes.length">
          <ul class="nav">
            <li class="nav-item bg-light clearfix col-12 my-1" v-for="(type,i) in nonFieldActivityTypes" :key="`non_field_activity_type_${i}`">
              <span>{{ type }}</span>
              <button type="button" class="close text-danger" @click="removeType(i)">&times;</button>
            </li>
          </ul>
        </div>
        <div v-else-if="isNonFieldActivityTypesFetched" class="text-center">
          <p>
            <span class="fa fa-check-circle fa-4x text-success"></span>
          </p>
          <p>No data found</p>
        </div>
        <loader-component v-else></loader-component>
      </div>
    </div>
    <div class="p-2 text-right">
      <button class="btn btn-sm btn-secondary" @click="reset">
        <span class="fa fa-redo"></span>
        <span>reset</span>
      </button>
      <button class="btn btn-sm skin-btn" @click="saveTypes">
        <span class="fa fa-save"></span>
        <span>save</span>
      </button>
    </div>
  </div>
</template>

<script>
import { httpCall } from '../../helpers/http-service';
export default {
  mounted() {
    this.getNonFieldActivityTypes();
  },
  data: () => ({
    nonFieldActivityTypes: [],
    isNonFieldActivityTypesFetched: false,
    type: null
  }),
  methods: {
    /**
     * get all non field activity types
     */
    getNonFieldActivityTypes() {
      this.nonFieldActivityTypes = [];
      this.isNonFieldActivityTypesFetched = false;
      return httpCall.get('admin/v1/setting/field-activity')
      .then(({data}) => {
        this.nonFieldActivityTypes = data.data;
        this.isNonFieldActivityTypesFetched = true;
      }).catch(err => {
        console.log(err)
        this.$toasted.error('Something went wrong');
      })
    },
    /**
     * add type
     */
    addType() {
      this.nonFieldActivityTypes.push(this.type);
      this.type= null;
    },
    /**
     * remove non field activity type
     *
     * @param {int} i [type index]
     */
    removeType(i) {
      this.nonFieldActivityTypes.splice(i,1);
    },
    /**
     * reset non field activity type
     *
     */
    reset() {
      this.getNonFieldActivityTypes();
    },
    /**
     * save assigned types
     */
    saveTypes() {
      httpCall.post('admin/v1/setting/field-activity', {types: JSON.stringify(this.nonFieldActivityTypes)})
      .then(({data}) => {
        this.handleResponse(data, data => {
          this.getNonFieldActivityTypes();
        })
      }).catch(err => {
        console.log(err)
      })
    }
  }
};
</script>

<style></style>

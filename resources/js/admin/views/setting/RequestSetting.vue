<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-success">
      <span class="fa fa-dollar-sign"></span>
      <span class="font-weight-bold">Request types</span>
    </p>
    <div class="p-2">
      <div class="p-2 text-right">
        <button class="btn btn-sm skin-btn" type="button" @click="addGroup">
          <span class="fa fa-plus-circle"></span>
          <span>New group</span>
        </button>
      </div>
      <div class="p-2">
        <div class="p-2" v-if="groups.length">
          <!-- Group item -->
          <div class="p-2 row mx-auto border rounded" v-for="(group, i) in groups" :key="`group_${i}`">
            <!-- Group name and control -->
            <div class="col-lg-3 border rounded p-2">
              <input type="text" v-model="group.name" class="form-control form-control-sm" placeholder="Enter group name">
              <button class="btn btn-sm btn-danger btn-block my-2" @click="removeGroup(i)">
                <span class="fa fa-trash"></span>
              </button>
            </div>
            <!-- group requests -->
            <div class="col-lg mx-2 row border rounded p-2">
              <!-- add request type -->
              <div class="col-lg">
                <input type="text" class="form-control form-control-sm" v-model="types[i]" placeholder="Enter Request type" :disabled="!types[i].trim()===''">
                <button class="btn btn-sm btn-primary btn-block my-2" @click="addType(i)">
                <span class="fa fa-plus"></span>
              </button>
              </div>
              <!-- control requests -->
              <div class="col-lg">
                <ul class="nav" style="height:150px; overflow:auto">
                  <li class="nav-item col-12 bg-light my-1" v-for="(item, index) in group.requests" :key="`group_${i}_request_${index}`">
                    <span>{{ item }}</span>
                    <button class="close text-danger" type="button" @click="removeType(i, index)">&times;</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <no-data-to-show />
        </div>
      </div>
      <!-- groups controller -->
      <div class="p-2 text-right">
        <router-link to="/setting" class="btn btn-sm btn-dark">
          <span class="fa fa-chevron-circle-left"></span>
          <span>back</span>
        </router-link>
        <button class="btn btn-sm skin-btn" type="button" @click="saveGroups">
          <span class="fa fa-save"></span>
          <span>save</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import NoDataToShow from '../../../components/NoDataToShow.vue';
import { httpCall } from '../../../helpers/http-service';
export default {
  components:{
    NoDataToShow

  },
  mounted(){
    this.fetchGroups();
  },
  data:() => ({
    groups: [],
    types: []
  }),
  methods: {
    addGroup(){
      this.groups.push({
        name: '',
        requests: []
      })
      this.types.push('');
    },
    removeGroup(i) {
      this.groups.splice(i, 1);
    },
    addType(i) {
      let type = this.types[i];
      if(!this.groups[i].requests.includes(type)) {
        this.groups[i].requests.push(type);
        this.types[i] = '';
      } else {
        this.$toasted.show(`Type ${type} already exists`)
      }
    },
    removeType(i, index) {
      this.groups[i].requests.splice(index, 1);
    },
    fetchGroups(){
      httpCall.get('admin/v1/setting/request-types')
      .then(({data}) => {
        this.groups = data.data;
        for(let i =0 ; i < data.data.length ;i++) {
          this.types.push('');
        }
      }).catch(err => {
        console.log(err)
      })
    },
    saveGroups() {
      let request = Array.from(this.groups);
      httpCall.post('admin/v1/setting/request-types', {requests: JSON.stringify(request)})
      .then(({data}) => {
        this.handleResponse(data, data => {
          this.fetchGroups();
        });
      }).catch(err => console.log(err));
    }
  }
}
</script>

<style>

</style>

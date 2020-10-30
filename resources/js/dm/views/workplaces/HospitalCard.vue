<template>
  <div class="px-0 shadow">
    <p class="alert alert-success">
      <span><i class="fa fa-hospital-alt"></i></span>
      <span class="font-weight-bold">Hospital {{ hospital ? hospital.name : null }} Card</span>
    </p>
    <div class="p-2">
      <div class="px-0 border">
        <p class="alert alert-info">Workplace Info.</p>
        <div class="row mx-auto p-2 border rounded" v-if="hospital">
          <div class="col-lg">
            <p class="mb-0 small">
              <span>Name</span>
              <span class="font-weight-bold text-primary">{{ hospital.name }}</span>
            </p>
            <p class="mb-0 small">
              <span>Type</span>
              <span class="font-weight-bold text-primary">{{ hospital.type }}</span>
            </p>
          </div>
          <div class="col-lg">
            <p class="mb-0 small">
              <span>Area</span>
              <span class="font-weight-bold text-primary">{{ hospital.area }}</span>
            </p>
            <p class="mb-0 small">
              <span>Brick</span>
              <span class="font-weight-bold text-primary">{{ hospital.brick }}</span>
            </p>
            <p class="mb-0 small">
              <span>Address</span>
              <span class="font-weight-bold text-primary">{{ hospital.address }}</span>
            </p>
          </div>
        </div>
        <div v-else-if="fetched">
          <div v-if="error">
            <p class="text-center">{{ error }}</p>
          </div>
          <div v-else>
            <p class="text-center">No data to show</p>
          </div>
        </div>
        <div v-else>
          <loader-component></loader-component>
        </div>
      </div>
      <hr>
      <div class="px-0 border">
        <p class="alert alert-info">Departments</p>
        <div v-if="hospital && hospital.departs.length" class="p-2">
          <table class="table table-sm small">
            <thead>
              <tr>
                <th>Name</th>
                <th>Key Person</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(depart, i) in hospital.departs" :key="i">
                <td>{{ depart.name }}</td>
                <td>{{ depart.head }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <p class="text-muted text-center">No departments registered</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * //TODO adding hospital plans
 * // TODO adding hospital reports
 */
import { httpCall } from '../../../helpers/http-service'
export default {
  created() {
    this.getHospital();
  },
  data: () => ({
    hospital: null,
    fetched: false,
    error: null,
    heads: [
      {
        title: 'Name',
        name: 'name'
      },
      {
        title: 'Area',
        name: 'area'
      },
      {
        title: 'Brick',
        name: 'brick'
      },
      {
        title: 'Type',
        name: 'type'
      }
    ]
  }),
  methods: {
    getHospital() {
      this.fetched  = false;
      let id = this.$route.params.id;
      httpCall.get('dm/v1/workplaces/'+id)
      .then(({data}) => {
        this.fetched = true
        this.handleResponse(data, data => {
          this.hospital = data.data;
        }, data => {
          this.error =data.errors
        });
      })
    }
  }
}
</script>

<style>

</style>

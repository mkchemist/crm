<template>
  <div>
    <div class="px-0 shadow rouned pb-4">
      <p class="alert alert-success">
        <span><i class="fa fa-address-card"></i></span>
        <span>View Hospital {{ hospital ? hospital.name : null }}</span>
      </p>
      <div class="p-2 text-right">
        <router-link to="/workplaces" class="btn btn-sm btn-dark">
          <span><i class="fa fa-chevron-circle-left"></i></span>
          <span>back</span>
        </router-link>
        <router-link :to="`/workplaces/hospital/edit/${$route.params.id}`" class="btn btn-sm btn-warning">
          <span><i class="fa fa-edit"></i></span>
          <span>edit</span>
        </router-link>
      </div>
      <div class="p-2">
        <!-- hospital info -->
        <div class="border p-2 rounded">
          <p class="lead text-muted">Hospital Info.</p>
          <hr>
          <div class="row mx-auto" v-if="hospital">
            <div class="col-lg">
              <p class="mb-0 small">Name: <span class="font-weight-bold text-primary">{{ hospital.name }}</span></p>
              <p class="mb-0 small">Type: <span class="font-weight-bold text-primary">{{ hospital.type }}</span></p>
              <p class="mb-0 small">Phone: <span class="font-weight-bold text-primary">{{ hospital.phone }}</span></p>
            </div>
            <div class="col-lg">
              <p class="mb-0 small">Address: <span class="font-weight-bold text-primary">{{ hospital.address }}</span></p>
              <p class="mb-0 small">Brick: <span class="font-weight-bold text-primary">{{ hospital.brick }}</span></p>
            </div>
          </div>
          <div v-else-if="hospital_error" class="text-center">
            <p>
              <span><i class="fa fa-exclamation-triangle fa-4x"></i></span>
            </p>
            <p class="lead">{{ hospital_error }}</p>
          </div>
          <loader-component v-else />
        </div>
        <!-- hospital Department -->
        <div class="border p-2 rounded my-2">
          <p class="lead text-muted">Hospital Departments</p>
          <hr>
          <!-- add new department button -->
          <div class="p-2 text-right">
            <button class="btn btn-sm btn-primary" @click="openAddCard">
              <span><i class="fa fa-plus-circle"></i></span>
              <span>Add</span>
            </button>
          </div>

          <!-- add new department component -->
          <div class="border my-2 p-3 bg-light" v-if="open_add_card">
            <add-workplace-department @onCancel="closeAddCard" @onAdd="addDepartment"/>
          </div>
          <!-- workplace departments components -->
          <div v-if="departments.length">
            <workplace-department-component :data="departments" @onEdit="editDepartment" />
          </div>

          <div v-else-if="departments_error" class="text-center">
            <p><span><i class="fa fa-exclamation-triangle fa-4x"></i></span></p>
            <p class="lead">{{ departments_error }}</p>
          </div>
          <loader-component v-else />
        </div>

        <!-- hospital Reports -->
        <div class="border p-2 rounded my-2">
          <p class="lead text-muted">Hospital Reports</p>
          <div class="p-2" v-if="Object.keys(reports).length">
            <table class="table table-sm small table-responsive-sm">
              <thead>
                <tr>
                  <td>Customer</td>
                  <td>Comment</td>
                  <td>Products</td>
                  <td>Feedback</td>
                </tr>
              </thead>
              <tbody v-for="(date,i) in reports" :key="i">
                <tr class="bg-secondary">
                  <td colspan="4">
                    <a :href="`#details_${i}`" data-toggle="collapse" class="text-light text-decoration-none">{{ i }}</a>
                  </td>
                </tr>
                <tr v-for="report in date" :key="report.id" :id="'details_'+i" class="collapse">
                  <td>{{ report.customer.name }}</td>
                  <td>{{ report.comment }}</td>
                  <td>
                    <ul v-for="(product,i) in JSON.parse(report.products)" :key="i" class="nav">
                      <li v-for="(val, key) in product" :key="key" class="nav-item col-12">
                        <span>{{ key }} : <span class="font-weight-bold text-primary">{{ val }}</span></span>
                      </li>
                    </ul>
                  </td>
                  <td>{{ report.general_feedback }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="p-2" v-else-if="fetched">
            <p class="text-center text-muted">No reports found</p>
          </div>
          <loader-component v-else></loader-component>
        </div>
        <!-- end of hospital Reports -->
      </div>
    </div>
  </div>
</template>

<script>
import { httpCall } from "../../../helpers/http-service";
import WorkplaceDepartmentComponent from "../../components/WorkplaceDepartment";
import AddWorkplaceDepartment from "../../components/AddWorkplaceDepartment";

export default {
  created() {
    this.getHospital()
  },
  methods: {
    /**
     * get hospital id
     */
    getHospitalId() {
      return this.$route.params.id;
    },
    /**
     * get hospital
     *
     */
    getHospital() {
      this.fetched = false;
      let id = this.getHospitalId();
      httpCall.get("rep/v1/workplaces/" + id).then(({ data }) => {
        this.fetched = true
        data.message = "hospital loaded";
        this.handleResponse(data, data => {
          this.hospital = data.data;
          this.reports = data.reports;
        })
      }).then(() => {
        this.getDepartments();
      });
    },
    /**
     * get hospital departments
     */
    getDepartments() {
      let id = this.getHospitalId();
      httpCall.get('rep/v1/workplace-department/all/'+id)
      .then(({data}) => {
        data.message = "Departments loaded";
        this.handleResponse(data, data => {
          this.departments = data.data;
        })
      })
    },
    /**
     * open add card
     */
    openAddCard() {
      this.open_add_card = true;
    },
    /**
     * close add card
     *
     */
    closeAddCard() {
      this.open_add_card = false;
    },
    /**
     * add department
     *
     * @param {object} department
     */
    addDepartment(department) {
      let id = this.getHospitalId();
      httpCall.post('rep/v1/workplace-department',{...department, workplace_id: id })
      .then(({data}) => {
        data.message = "department added";
        this.handleResponse(data, data => {
          this.getDepartments();
        })
      })/* .finally(() => {
        this.$store.dispatch('workplaceGetAll', true);
      }); */
    },
    /**
     * edit department
     *
     * @param {object} department
     */
    editDepartment(department) {
      httpCall.post('rep/v1/workplace-department/'+department.id, {...department, _method: 'PUT'})
      .then(({data}) => {
        data.message = data.data;
        this.handleResponse(data, data => {
          this.getDepartments();
        })
      });
    }
  },
  data: () => ({
    hospital: null,
    fetched : false,
    hospital_error: null,
    departments: [],
    departments_error: null,
    open_add_card: false,
    reports: []
  }),
  components: {
    WorkplaceDepartmentComponent,
    AddWorkplaceDepartment
  }
};
</script>

<style lang="scss" scoped>
  tr, td, th {
    white-space: pre-wrap;
  }
</style>

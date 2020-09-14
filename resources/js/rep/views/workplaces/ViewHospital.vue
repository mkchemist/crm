<template>
  <div>
    <div class="px-0 shadow rouned pb-4">
      <p class="alert alert-success">
        <span><i class="fa fa-address-card"></i></span>
        <span>View Hospital {{ hospital ? hospital.name : null }}</span>
      </p>
      <div class="p-2">
        <!-- hospital info -->
        <div class="border p-2 rounded">
          <p class="lead text-muted">Hospital Info.</p>
          <hr>
          <div class="row mx-auto" v-if="hospital">
            <div class="col-lg">
              <p>Name: <span class="font-weight-bold text-primary">{{ hospital.name }}</span></p>
              <p>Type: <span class="font-weight-bold text-primary">{{ hospital.type }}</span></p>
            </div>
            <div class="col-lg">
              <p>Address: <span class="font-weight-bold text-primary">{{ hospital.address }}</span></p>
              <p>Brick: <span class="font-weight-bold text-primary">{{ hospital.brick }}</span></p>
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

      </div>
    </div>
  </div>
</template>

<script>
import { httpCall } from "../../helpers/http-service";
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
      let id = this.getHospitalId();
      httpCall.get("rep/v1/workplaces/" + id).then(({ data }) => {
        if (data.code === 400 || data.code === 301) {
          Object.keys(data.data).forEach(key => {
            data.data[key].forEach(err => {
              this.$toasted.show(err, {
                icon: "exclamation-triangle",
                duration: 10000
              });
            });
          });
          if(data.code === 400) {
            this.hospital_error = "Hospital ID must be a number";
          }else {
            this.hospital_error = "Hospital ID is not valid";
          }
        } else {
          this.$toasted.show("Hospital loaded successfully", {
            icon: "check",
            type: "success"
          });
          this.hospital = data.data;
        }
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
        if(data.code === 301) {
          this.$toasted.show(data.data, {
            icon: 'exclamation-triangle',
            duration:10000
          });
          this.departments_error = "No data to provided";
        } else {
          this.$toasted.show('Departments loaded successfully', {
            type: 'success',
            icon: 'check'
          });
          this.departments = data.data;
        }
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
        if(data.code === 400 || data.code === 203) {
          Object.keys(data.data).forEach((key) => {
            data.data[key].forEach((err) => {
              this.$toasted.show(err, {
                icon: 'exclamation',
                duration: 10000
              });
            });
          });
        } else {
          this.$toasted.show('Department added successfully', {
            type: 'success',
            icon: 'check'
          });
          this.getDepartments();
        }
      });
    },
    /**
     * edit department
     *
     * @param {object} department
     */
    editDepartment(department) {

    }
  },
  data: () => ({
    hospital: null,
    hospital_error: null,
    departments: [],
    departments_error: null,
    open_add_card: false
  }),
  components: {
    WorkplaceDepartmentComponent,
    AddWorkplaceDepartment
  }
};
</script>

<style></style>

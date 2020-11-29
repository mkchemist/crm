<template>
  <div class="px-0 shadow">
    <p class="alert alert-success">
      <span><i class="fa fa-edit"></i></span>
      <span class="font-weight-bold"
        >Edit User {{ user ? user.name : "" }}
      </span>
    </p>
    <div class="my-2 p-2" v-if="user">
      <ValidationObserver v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(editUser)">
          <!-- user personal info -->
          <div class="row mx-auto">
            <div class="form-group col-lg">
              <label for="name" class="text-muted small">Name</label>
              <ValidationProvider
                v-slot="{ errors }"
                name="name"
                rules="required"
              >
                <span class="small text-danger">{{ errors[0] }}</span>
                <input
                  type="text"
                  v-model="user.name"
                  name="name"
                  :class="
                    `form-control form-control-sm ${
                      errors[0] ? 'border-danger' : ''
                    }`
                  "
                  placeholder="Enter user fullname"
                />
              </ValidationProvider>
            </div>
            <div class="form-group col-lg">
              <label for="email" class="text-muted small">E-mail</label>
              <ValidationProvider
                v-slot="{ errors }"
                name="email"
                rules="required|email"
              >
                <span class="small text-danger">{{ errors[0] }}</span>
                <input
                  type="text"
                  v-model="user.email"
                  name="email"
                  :class="
                    `form-control form-control-sm ${
                      errors[0] ? 'border-danger' : ''
                    }`
                  "
                  placeholder="Enter user email"
                />
              </ValidationProvider>
            </div>
          </div>

          <!-- user account info -->
          <div class="row mx-auto">
            <div class="form-group col-lg">
              <label for="name" class="text-muted small">Username</label>
              <ValidationProvider
                v-slot="{ errors }"
                rules="required"
                name="username"
              >
                <span v-if="errors" class="small text-danger">{{
                  errors[0]
                }}</span>
                <input
                  type="text"
                  v-model="user.username"
                  name="username"
                  :class="
                    `form-control form-control-sm ${
                      errors[0] ? 'border-danger' : ''
                    }`
                  "
                  placeholder="Enter username"
                />
              </ValidationProvider>
            </div>
            <div class="form-group col-lg">
              <label for="password" class="text-muted small">Password</label>
              <input
                type="text"
                v-model="user.password"
                name="password"
                :class="
                    `form-control form-control-sm`
                  "
                placeholder="Enter user password"
              />
            </div>
          </div>

          <!--  role and line info -->
          <div class="row mx-auto">
            <div class="form-group col-lg">
              <label for="line" class="text-muted small">Line</label>
              <ValidationProvider
                v-slot="{ errors }"
                rules="required"
                name="line"
              >
                <span class="text-danger small">{{ errors[0] }}</span>
                <select
                  name="line"
                  v-model="user.line"
                  :class="
                    `form-control form-contorl-sm ${
                      errors[0] ? 'border-danger border' : ''
                    }`
                  "
                >
                  <option value="">Select Line</option>
                  <option value="line1">Line 1</option>
                  <option value="line2">Line 2</option>
                  <option value="line3">Line 3</option>
                </select>
              </ValidationProvider>
            </div>

            <div class="form-group col-lg">
              <label for="role" class="text-muted small">Role</label>
              <ValidationProvider
                v-slot="{ errors }"
                rules="required"
                name="role"
              >
                <span class="text-danger small">{{ errors[0] }}</span>
                <select
                  name="role"
                  v-model="user.role"
                  :class="
                    `form-control form-contorl-sm ${
                      errors[0] ? 'border-danger border' : ''
                    }`
                  "
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="dm">District Manager</option>
                  <option value="rep">Rep</option>
                  <option value="rm">Regional Manager</option>
                  <option value="am">Area Manager</option>
                </select>
              </ValidationProvider>
            </div>
          </div>

          <!-- area and location info -->
          <div class="row mx-auto">
            <div class="col-lg">
              <label for="area" class="text-muted small">Area</label>
              <ValidationProvider
                name="area"
                rules="required"
                v-slot="{ errors }"
              >
                <span class="text-danger small">{{ errors[0] }}</span>
                <input
                  type="text"
                  :class="
                    `form-control form-contorl-sm ${
                      errors[0] ? 'border-danger border' : ''
                    }`
                  "
                  name="area"
                  id="area"
                  v-model="user.area"
                  placeholder="Enter user area"
                />
              </ValidationProvider>
            </div>
            <div class="col-lg">
              <label for="district" class="text-muted small">District</label>
              <ValidationProvider
                name="district"
                rules="required"
                v-slot="{ errors }"
              >
                <span class="text-danger small">{{ errors[0] }}</span>
                <input
                  type="text"
                  :class="
                    `form-control form-contorl-sm ${
                      errors[0] ? 'border-danger border' : ''
                    }`
                  "
                  name="district"
                  id="district"
                  v-model="user.district"
                  placeholder="Enter user district"
                />
              </ValidationProvider>
            </div>
            <div class="col-lg">
              <label for="territory" class="text-muted small">Territory</label>
              <ValidationProvider
                name="territory"
                rules="required"
                v-slot="{ errors }"
              >
                <span class="text-danger small">{{ errors[0] }}</span>
                <input
                  type="text"
                  :class="
                    `form-control form-contorl-sm ${
                      errors[0] ? 'border-danger border' : ''
                    }`
                  "
                  name="territory"
                  id="territory"
                  v-model="user.territory"
                  placeholder="Enter user territory"
                />
              </ValidationProvider>
            </div>
            <div class="col-lg">
              <label for="region" class="text-muted small">Region</label>
              <ValidationProvider
                name="region"
                rules="required"
                v-slot="{ errors }"
              >
                <span class="text-danger small">{{ errors[0] }}</span>
                <input
                  type="text"
                  :class="
                    `form-control form-contorl-sm ${
                      errors[0] ? 'border-danger border' : ''
                    }`
                  "
                  name="region"
                  id="region"
                  v-model="user.region"
                  placeholder="Enter user region"
                />
              </ValidationProvider>
            </div>
          </div>
          <!-- end of area and location info -->
          <hr />
          <div class="form-group text-right">
            <router-link to="/users" class="btn btn-sm btn-dark">
              <span><i class="fa fa-chevron-circle-left"></i></span>
              <span>back</span>
            </router-link>
            <button class="btn btn-sm btn-success" type="submit">
              <span><i class="fa fa-save"></i></span>
              <span>save</span>
            </button>
          </div>
        </form>
      </ValidationObserver>
    </div>
    <loader-component v-else></loader-component>
  </div>
</template>

<script>
import { httpCall } from "../../../helpers/http-service";
export default {
  mounted() {
    this.getUser();
  },
  data: () => ({
    user: null
  }),
  methods: {
    getUser() {
      httpCall
        .get("admin/v1/users/" + this.$route.params.id)
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.user = data.data;
            this.user.password = "";
          });
        });
    },
    editUser() {
      console.log("start");
      let data = this.user;
      data._method = "PUT";
      httpCall
        .post("admin/v1/users/" + this.$route.params.id, data)
        .then(({ data }) => {
          this.handleResponse(data, data => {
           this.$store.dispatch("getAllUsers", true);
           this.$router.push("/users");
          })
        });
    }
  }
};
</script>

<style></style>

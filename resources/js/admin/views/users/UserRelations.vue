<template>
  <div class="px-0 shadow rounded">
    <p class="alert alert-success">
      <span class="fa fa-user-friends"></span>
      <span class="font-weight-bold">User Relation Assignment</span>
    </p>
    <div class="p-2">
      <!-- User selection  -->
      <div class="p-2">
        <div class="form-inline">
          <select
            name="users"
            id="users"
            class="form-control form-control-sm col-lg"
            v-model="selectedUser"
            :disabled="!users.length"
          >
            <option v-for="user in users" :key="user.id" :value="user.id"
              >{{ user.name }} - ({{ user.role }})</option
            >
          </select>
          <button class="btn btn-sm btn-primary mx-1" @click="fetchUser">
            <span class="fa fa-check-circle"></span>
            <span>select</span>
          </button>
        </div>
      </div>
      <!-- User info & ctrl -->
      <div class="p-2 border rounded" v-if="user">
        <h6 class="text-primary px-2">User Info.</h6>
        <!-- User Info -->
        <div class="p-2 border rounded">
          <p class="mb-0 small">
            <span>Name:</span>
            <span class="text-primary font-weight-bold">{{ user.name }}</span>
          </p>
          <p class="mb-0 small">
            <span>Role:</span>
            <span class="text-primary font-weight-bold">{{ user.role }}</span>
          </p>
          <p class="mb-0 small">
            <span>Username:</span>
            <span class="text-primary font-weight-bold">{{
              user.username
            }}</span>
          </p>
          <p class="mb-0 small">
            <span>E-mail:</span>
            <span class="text-primary font-weight-bold">{{ user.email }}</span>
          </p>
          <p class="mb-0 small">
            <span>Line:</span>
            <span
              v-for="(val, key) in user.line"
              :key="`brick_${key}`"
              class="mx-1"
            >
              <span class="text-primary font-weight-bold">{{ val }}</span></span
            >
          </p>
          <p class="mb-0 small" v-if="user.assigned_brick.length">
            <span>Bricks:</span>
            <span
              v-for="(val, key) in user.assigned_brick"
              :key="`brick_${key}`"
              class="mx-1"
            >
              <span class="text-primary font-weight-bold">{{ val }}</span></span
            >
          </p>
          <p class="mb-0 small">
            <span>Bricks:</span>
            <span class="text-primary font-weight-bold">All</span>
          </p>
          <p class="mb-0 small">
            <span>Area:</span>
            <span
              v-for="(val, key) in user.area"
              :key="`area_${key}`"
              class="mx-1"
            >
              <span class="text-primary font-weight-bold">{{ val }}</span></span
            >
          </p>
          <p class="mb-0 small">
            <span>District:</span>
            <span
              v-for="(val, key) in user.district"
              :key="`area_${key}`"
              class="mx-1"
            >
              <span class="text-primary font-weight-bold">{{ val }}</span></span
            >
          </p>
          <p class="mb-0 small">
            <span>Territory:</span>
            <span
              v-for="(val, key) in user.territory"
              :key="`area_${key}`"
              class="mx-1"
            >
              <span class="text-primary font-weight-bold">{{ val }}</span></span
            >
          </p>
          <p class="mb-0 small">
            <span>Region:</span>
            <span
              v-for="(val, key) in user.region"
              :key="`area_${key}`"
              class="mx-1"
            >
              <span class="text-primary font-weight-bold">{{ val }}</span></span
            >
          </p>
        </div>
        <!-- End of User info -->
        <!-- User Ctrl -->
        <div class="p-2">
          <!-- Reps -->
          <div
            class="row mx-auto my-1"
            v-if="!['rep', 'marketing', 'admin'].includes(user.role)"
          >
            <div class="col">
              <label for="">Reps</label>
            </div>
            <div class="col">
              <select
                name="reps"
                id="reps"
                v-model="relations.reps"
                multiple
                class="form-control"
              >
                <option v-for="user in reps" :key="user.id" :value="user.id"
                  >{{ user.name }}-({{ user.role }})</option
                >
              </select>
            </div>
          </div>
          <!-- End of Reps -->
          <!-- District Manager -->
          <div
            class="row mx-auto my-1"
            v-if="!['dm', 'marketing', 'admin'].includes(user.role)"
          >
            <div class="col">
              <label for="">District Manager</label>
            </div>
            <div class="col">
              <select
                name="reps"
                id="reps"
                v-model="relations.dm"
                class="form-control"
                multiple
              >
                <option v-for="user in dm" :key="user.id" :value="user.id"
                  >{{ user.name }}-({{ user.role }})</option
                >
              </select>
            </div>
          </div>
          <!-- End of District Manager -->
          <!-- Area Manager -->
          <div
            class="row mx-auto my-1"
            v-if="!['am', 'marketing', 'admin'].includes(user.role)"
          >
            <div class="col">
              <label for="">Area Manager</label>
            </div>
            <div class="col">
              <select
                name="reps"
                id="reps"
                v-model="relations.rm"
                class="form-control"
                multiple
              >
                <option v-for="user in am" :key="user.id" :value="user.id"
                  >{{ user.name }}-({{ user.role }})</option
                >
              </select>
            </div>
          </div>
          <!-- End of Area Manager -->
          <!-- Regional  Manager -->
          <div
            class="row mx-auto my-1"
            v-if="!['rm', 'marketing', 'admin'].includes(user.role)"
          >
            <div class="col">
              <label for="">Regional Manager</label>
            </div>
            <div class="col">
              <select
                name="reps"
                id="reps"
                v-model="relations.am"
                class="form-control"
                multiple
              >
                <option v-for="user in rm" :key="user.id" :value="user.id"
                  >{{ user.name }}-({{ user.role }})</option
                >
              </select>
            </div>
          </div>
          <!-- End of Regional Manager -->
          <!-- Marketing  Manager -->
          <div
            class="row mx-auto my-1"
            v-if="!['rm', 'am', 'marketing', 'admin'].includes(user.role)"
          >
            <div class="col">
              <label for="">Marketing</label>
            </div>
            <div class="col">
              <select
                name="reps"
                id="reps"
                v-model="relations.marketing"
                class="form-control"
                multiple
              >
                <option
                  v-for="user in marketing"
                  :key="user.id"
                  :value="user.id"
                  >{{ user.name }}-({{ user.role }})</option
                >
              </select>
            </div>
          </div>
          <!-- End of Marketing -->
        </div>
        <!-- Save -->
        <div class="p-2 text-right">
          <router-link to="/users" class="btn btn-sm btn-dark">
            <span class="fa fa-chevron-circle-left"></span>
            <span>back</span>
          </router-link>
          <button class="btn btn-sm btn-primary" @click="saveUserRelation">
            <span class="fa fa-save"></span>
            <span>save</span>
          </button>
        </div>
        <!-- End of user ctrl -->
      </div>
      <div v-else class="text-center border p-2 rounded">
        <p>
          <span class="fa fa-check-circle fa-4x text-primary"></span>
        </p>
        <p class="text-muted">Select user First</p>
      </div>
    </div>
  </div>
</template>

<script>
import { httpCall } from "../../../helpers/http-service";
export default {
  data: () => ({
    selectedUser: null,
    user: null,
    isUserFetched: false,
    relations: {
      reps: [],
      dm: [],
      am: [],
      rm: [],
      marketing: []
    }
  }),
  computed: {
    users() {
      return this.$store.getters.users;
    },
    reps() {
      let users = this.users;
      return users.filter(user => user.role === "rep");
    },
    dm() {
      return this.users.filter(user => user.role === "dm");
    },
    am() {
      return this.users.filter(user => user.role === "am");
    },
    rm() {
      return this.users.filter(user => user.role === "rm");
    },
    marketing() {
      return this.users.filter(user => user.role === "marketing");
    }
  },
  methods: {
    fetchUser() {
      httpCall
        .get("admin/v1/users/" + this.selectedUser)
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.user = data.data;
            this.relations = {
              reps: [],
              dm: [],
              am: [],
              rm: [],
              marketing: [],
              ...data.data.relations
            };
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    saveUserRelation() {
      let request = {
        ...this.user,
      }
      request.relations = JSON.stringify(this.relations);
      httpCall.post('admin/v1/users/relations/'+this.user.id, request)
      .then(({data}) => {
        this.handleResponse(data, data => {
          this.fetchUser();
        });
      }).catch(err => {
        console.log(err)
      })
    }
  }
};
</script>

<style></style>

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
          <button class="btn btn-sm skin-btn mx-1" @click="fetchUser">
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
            <div class="col-lg-4">
              <label for="">Reps</label>
            </div>
            <div class="col-lg-8 border p-2 rounded" style="max-height:200px;overflow:auto">
              <!-- <select
                name="reps"
                id="reps"
                v-model="relations.reps"
                multiple
                class="form-control small"
                style="min-height:250px"

              >
                <option v-for="user in reps" :key="user.id" :value="user.id"
                  >{{ user.name }}-({{ user.role }})</option
                >
              </select> -->
              <ul class="nav">
                <li class="nav-item col-12 small border-bottom" v-for="user in reps" :key="user.id">
                  <input type="checkbox" v-model="relations.reps" :value="user.id">
                  <span class="form-check-inline text-dark font-weight-bold">{{ user.name }} ({{ user.territory.join(' | ') }})</span>
                </li>
              </ul>
            </div>
          </div>
          <!-- End of Reps -->
          <!-- District Manager -->
          <div
            class="row mx-auto my-1"
            v-if="!['dm', 'marketing', 'admin'].includes(user.role)"
          >
            <div class="col-lg-4">
              <label for="">District Manager</label>
            </div>
            <div class="col-lg-8 border p-2 rounded" style="max-height:200px;overflow:auto">
              <!-- <select
                name="reps"
                id="reps"
                v-model="relations.dm"
                class="form-control small"
                multiple
                style="min-height:250px"

              >
                <option v-for="user in dm" :key="user.id" :value="user.id"
                  >{{ user.name }}-({{ user.role }})</option
                >
              </select> -->
              <ul class="nav">
                <li class="nav-item col-12 small border-bottom" v-for="user in dm" :key="user.id">
                  <input type="checkbox" v-model="relations.dm" :value="user.id">
                  <span class="form-check-inline text-dark font-weight-bold">{{ user.name }} ({{ user.territory.join(' | ') }})</span>
                </li>
              </ul>
            </div>
          </div>
          <!-- End of District Manager -->
          <!-- Area Manager -->
          <div
            class="row mx-auto my-1"
            v-if="!['am', 'marketing', 'admin'].includes(user.role)"
          >
            <div class="col-lg-4">
              <label for="">Area Manager</label>
            </div>
            <div class="col-lg-8 border p-2 rounded" style="max-height:200px;overflow:auto">
              <!-- <select
                name="reps"
                id="reps"
                v-model="relations.am"
                class="form-control small"
                multiple
                style="min-height:250px"

              >
                <option v-for="user in am" :key="user.id" :value="user.id"
                  >{{ user.name }}-({{ user.role }})</option
                >
              </select> -->
              <ul class="nav">
                <li class="nav-item col-12 small border-bottom" v-for="user in am" :key="user.id">
                  <input type="checkbox" v-model="relations.am" :value="user.id">
                  <span class="form-check-inline text-dark font-weight-bold">{{ user.name }} ({{ user.territory.join(' | ') }})</span>
                </li>
              </ul>
            </div>
          </div>
          <!-- End of Area Manager -->
          <!-- Regional  Manager -->
          <div
            class="row mx-auto my-1"
            v-if="!['rm', 'marketing', 'admin'].includes(user.role)"
          >
            <div class="col-lg-4">
              <label for="">Regional Manager</label>
            </div>
            <div class="col-lg-8 border p-2 rounded" style="max-height:200px;overflow:auto">
              <!-- <select
                name="reps"
                id="reps"
                v-model="relations.rm"
                class="form-control small"
                multiple
                style="min-height:250px"

              >
                <option v-for="user in rm" :key="user.id" :value="user.id"
                  >{{ user.name }}-({{ user.role }})</option
                >
              </select> -->
              <ul class="nav">
                <li class="nav-item col-12 small border-bottom" v-for="user in rm" :key="user.id">
                  <input type="checkbox" v-model="relations.rm" :value="user.id">
                  <span class="form-check-inline text-dark font-weight-bold">{{ user.name }} ({{ user.territory.join(' | ') }})</span>
                </li>
              </ul>
            </div>
          </div>
          <!-- End of Regional Manager -->
          <!-- Marketing  Manager -->
          <div
            class="row mx-auto my-1"
            v-if="!['rm', 'am', 'marketing', 'admin'].includes(user.role)"
          >
            <div class="col-lg-4">
              <label for="">Marketing</label>
            </div>
            <div class="col-lg-8 border p-2 rounded" style="max-height:200px;overflow:auto">
              <!-- <select
                name="reps"
                id="reps"
                v-model="relations.marketing"
                class="form-control small"
                multiple
                style="min-height:250px"

              >
                <option
                  v-for="user in marketing"
                  :key="user.id"
                  :value="user.id"
                  >{{ user.name }}-({{ user.role }})</option
                >
              </select> -->
              <ul class="nav">
                <li class="nav-item col-12 small border-bottom" v-for="user in marketing" :key="user.id">
                  <input type="checkbox" v-model="relations.marketing" :value="user.id">
                  <span class="form-check-inline text-dark font-weight-bold">{{ user.name }} ({{ user.territory.join('|') }})</span>
                </li>
              </ul>
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
import { sortBy } from '../../../helpers/helpers';
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
      return sortBy(this.$store.getters.users,'name');
    },
    reps() {
      let users = this.users;
      users = users.filter(user => user.role === "rep");
      users = sortBy(users, 'name')
      return users;
    },
    dm() {
      let dm = this.users;
      dm = dm.filter(user => user.role === "dm");
      dm = sortBy(dm, 'name')
      return dm;
    },
    am() {
      let am = this.users;
      am = am.filter(user => user.role === 'am');
      am = sortBy(am, 'name');
      return am;
    },
    rm() {
      let rm = this.users;
      rm = rm.filter(user => user.role === 'rm');
      rm = sortBy(rm, 'name');
      return rm;
    },
    marketing() {
      let marketing = this.users;
      marketing = marketing.filter(user => user.role === 'marketing');
      marketing = sortBy(marketing, 'name');
      return marketing;
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

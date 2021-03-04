<template>
  <div class="p-2">
    <div class="px-0 shadow pb-5">
      <p class="alert alert-success">
        <span><i class="fa fa-edit"></i></span>
        <span class="font-weight-bold"
          >Edit user {{ user ? user.name : "" }}</span
        >
      </p>
      <div class="p-2">
        <div class="p-2" v-if="user">
          <ValidationObserver v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(saveUser)">
              <!-- user personal info -->
              <div class="row mx-auto">
                <div class="form-group col-lg">
                  <label for="name" class="text-muted small">Name</label>
                  <input
                    type="text"
                    v-model="user.name"
                    name="name"
                    :class="`form-control form-control-sm`"
                    placeholder="Enter user full name"
                  />
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
                  <input
                    type="text"
                    v-model="user.username"
                    name="username"
                    :class="`form-control form-control-sm`"
                    placeholder="Enter username"
                    disabled
                  />
                </div>
                <div class="form-group col-lg">
                  <label for="email" class="text-muted small">Password</label>
                  <input
                    type="text"
                    v-model="user.password"
                    name="password"
                    :class="`form-control form-control-sm`"
                    placeholder="Enter user password"
                  />
                </div>
              </div>

              <!--  role and line info -->
              <div class="row mx-auto">
                <div class="form-group col-lg">
                  <label for="line" class="text-muted">Line</label>
                  <ValidationProvider
                    v-slot="{ errors }"
                    rules="required"
                    name="line"
                  >
                    <span class="text-danger small">{{ errors[0] }}</span>
                    <!-- <select
                      name="line"
                      v-model="user.line"
                      :class="
                        `form-control form-contorl-sm ${
                          errors[0] ? 'border-danger border' : ''
                        }`
                      "
                      multiple
                    >
                      <option value="all">All</option>
                      <option v-for="(val, key) in lines" :key="`line_${key}`" :value="val.name">{{ val.name }}</option>
                    </select> -->
                    <div style="height:200px;overflow:auto" class="border rounded p-2">
                      <ul class="nav">
                        <li class="nav-item col-12 p-2 border-bottom small">
                          <input type="checkbox" v-model="user.line" :value="'all'">
                          <span class="form-check-label mx-1">{{ 'All' }}</span>
                        </li>
                        <li class="nav-item col-12 p-2 border-bottom small" v-for="(val,key) in lines" :key="`line_${key}`">
                          <input type="checkbox" v-model="user.line" :value="val.name">
                          <span class="form-check-label mx-1">{{ val.name }}</span>
                        </li>
                      </ul>
                    </div>
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
                      <option value="rep">Rep</option>
                      <option value="otc-rep">OTC Rep</option>
                      <option value="dm">District Manager</option>
                      <option value="otc-manager">OTC Manager</option>
                      <option value="am">Area Manager</option>
                      <option value="rm">Regional Manager</option>
                      <option value="tm">Top manager</option>
                      <option value="marketing">Marketing</option>
                      <option value="accountant">Accountant</option>
                      <option value="hr">HR</option>
                      <option value="admin">Admin</option>
                    </select>
                  </ValidationProvider>
                </div>
              </div>

              <!-- area and location info -->
              <div class="row mx-auto">
                <!--  User Region  -->
                <div class="col-lg">
                  <label for="region" class="text-muted small">Region</label>
                  <ValidationProvider
                    name="region"
                    rules="required"
                    v-slot="{ errors }"
                  >
                    <span class="text-danger small">{{ errors[0] }}</span>
                    <!-- <select
                      name="region"
                      id="regoin"
                      v-model="user.region"
                      :class="
                        `form-control ${
                          errors[0] ? 'border border-danger' : ''
                        }`
                      "
                      :disabled="!user.role"
                      multiple
                      style="min-height:150px"

                    >
                      <option value="all">All</option>
                      <option
                        v-for="(name, i) in regions"
                        :key="`region_${i}`"
                        :value="name"
                        >{{ name }}</option
                      >
                    </select> -->
                    <div style="height:200px;overflow:auto" class="border rounded p-2">
                      <ul class="nav">
                        <li class="nav-item col-12 p-2 border-bottom small" v-for="(val,key) in regions" :key="`region_${key}`">
                          <input type="checkbox" v-model="user.region" :value="val">
                          <span class="form-check-label mx-1">{{ val }}</span>
                        </li>
                      </ul>
                    </div>
                  </ValidationProvider>
                </div>
                <!-- User Territory -->
                <div class="col-lg">
                  <label for="territory" class="text-muted small"
                    >Territory</label
                  >
                  <ValidationProvider
                    name="territory"
                    rules="required"
                    v-slot="{ errors }"
                  >
                    <span class="text-danger small">{{ errors[0] }}</span>
                    <!-- <select
                      name="territory"
                      id="territory"
                      v-model="user.territory"
                      :class="
                        `form-control ${errors[0] ? 'border border-danger' : ''}`
                      "
                      :disabled="!user.region.length"
                      multiple
                      style="min-height:150px"

                    >
                      <option value="all">All</option>
                      <option
                        v-for="(name, i) in territories"
                        :key="`region_${i}`"
                        :value="name"
                        >{{ name }}</option
                      >
                    </select> -->
                    <div style="height:200px;overflow:auto" class="border rounded p-2">
                      <ul class="nav" id="territory_select">
                        <li class="nav-item col-12 p-2 border-bottom small">
                          <input type="checkbox" v-model="user.territory" :value="`all`" @click="checkAllItems('#territory_select','territories','territory')">
                          <span class="form-check-label mx-1">{{ 'All' }}</span>
                        </li>
                        <li class="nav-item col-12 p-2 border-bottom small" v-for="(val,key) in territories" :key="`line_${key}`">
                          <input type="checkbox" v-model="user.territory" :value="val">
                          <span class="form-check-label mx-1">{{ val }}</span>
                        </li>
                      </ul>
                    </div>
                  </ValidationProvider>
                </div>
              </div>
              <div class="row mx-auto my-1">
                <!-- User District -->
                <div class="col-lg">
                  <label for="district" class="text-muted small"
                    >District</label
                  >
                  <ValidationProvider
                    name="district"
                    rules="required"
                    v-slot="{ errors }"
                  >
                    <span class="text-danger small">{{ errors[0] }}</span>
                    <!-- <select
                      name="district"
                      id="district"
                      v-model="user.district"
                      :class="
                        `form-control ${
                          errors[0] ? 'border border-danger' : ''
                        }`
                      "
                      :disabled="!user.territory.length"
                      multiple
                      style="min-height:150px"

                    >
                      <option value="all">All</option>
                      <option
                        v-for="(name, i) in districts"
                        :key="`region_${i}`"
                        :value="name"
                        >{{ name }}</option
                      >
                    </select> -->
                    <div style="height:200px;overflow:auto" class="border rounded p-2">
                      <ul class="nav">
                        <li class="nav-item col-12 p-2 border-bottom small">
                          <input type="checkbox" v-model="user.district" :value="'all'">
                          <span class="form-check-label mx-1">{{ 'All' }}</span>
                        </li>
                        <li class="nav-item col-12 p-2 border-bottom small" v-for="(val,key) in districts" :key="`line_${key}`">
                          <input type="checkbox" v-model="user.district" :value="val">
                          <span class="form-check-label mx-1">{{ val }}</span>
                        </li>
                      </ul>
                    </div>
                  </ValidationProvider>
                </div>
                <!-- User Area -->
                <div class="col-lg">
                  <label for="area" class="text-muted small">Area</label>
                  <ValidationProvider
                    name="area"
                    rules="required"
                    v-slot="{ errors }"
                  >
                    <span class="text-danger small">{{ errors[0] }}</span>
                   <!--  <select
                      name="area"
                      id="area"
                      v-model="user.area"
                      :class="
                        `form-control ${errors[0] ? 'border border-danger' : ''}`
                      "
                      :disabled="!user.district.length"
                      multiple
                      style="min-height:150px"

                    >
                      <option value="all">All</option>
                      <option
                        v-for="(name, i) in areas"
                        :key="`region_${i}`"
                        :value="name"
                        >{{ name }}</option
                      >
                    </select> -->
                    <div style="height:200px;overflow:auto" class="border rounded p-2">
                      <ul class="nav">
                        <li class="nav-item col-12 p-2 border-bottom small">
                          <input type="checkbox" v-model="user.area" :value="'all'">
                          <span class="form-check-label mx-1">{{ 'All' }}</span>
                        </li>
                        <li class="nav-item col-12 p-2 border-bottom small" v-for="(val,key) in areas" :key="`line_${key}`">
                          <input type="checkbox" v-model="user.area" :value="val">
                          <span class="form-check-label mx-1">{{ val }}</span>
                        </li>
                      </ul>
                    </div>
                  </ValidationProvider>
                </div>
              </div>
              <!-- end of area and location info -->
              <!-- Brick Assignation -->
              <div class="row mx-auto my-2 p-2">
                <div class="col">
                  <input
                    type="checkbox"
                    @click="toggleAssignedBricks"
                    :checked="user.assigned_brick.length"
                  />
                  <label class="text-muted">Assign bricks</label>
                </div>
                <div
                  class="col"
                  v-if="assignBricks || user.assigned_brick.length"
                >
                  <!-- <select
                    name="assigned_bricks"
                    id="assigned_bricks"
                    multiple
                    class="form-control"
                    v-model="user.assigned_brick"
                      style="min-height:200px"
                  >
                    <option
                      v-for="(item, i) in bricks"
                      :key="i"
                      :value="item"
                      >{{ item }}</option
                    >
                  </select> -->
                  <div style="height:200px;overflow:auto" class="border rounded p-2">
                      <ul class="nav">
                        <li class="nav-item col-12 p-2 border-bottom small" v-for="(val,key) in bricks" :key="`line_${key}`">
                          <input type="checkbox" v-model="user.assigned_brick" :value="val">
                          <span class="form-check-label mx-1">{{ val }}</span>
                        </li>
                      </ul>
                    </div>
                </div>
                <div v-else>
                  <span class="text-muted small"
                    >That helps if you want to assign only some brick to rep not
                    total area customer</span
                  >
                </div>
              </div>
              <!-- End of Brick Assignation -->
              <hr />
              <div class="form-group text-right">
                <router-link to="/users" class="btn btn-sm btn-dark">
                  <span><i class="fa fa-chevron-circle-left"></i></span>
                  <span>back</span>
                </router-link>
                <button class="btn btn-sm btn-success">
                  <span><i class="fa fa-save"></i></span>
                  <span>save</span>
                </button>
              </div>
            </form>
          </ValidationObserver>
        </div>
        <loader-component v-else></loader-component>
      </div>
    </div>
  </div>
</template>

<script>
import { sortBy } from '../../../helpers/helpers';
import { httpCall } from "../../../helpers/http-service";
export default {
  created() {
    this.$store.dispatch('getAllLines');
    this.getUser().then(() => {
      this.$store.dispatch("getAllLocations");
    });
  },
  data: () => ({
    user: null,
    assignBricks: false
  }),
  computed: {
    locations() {
      return this.$store.getters.allLocations;
    },
    isLocationsFetched() {
      return this.$store.getters.isAllLocationsFetched;
    },
    regions() {
      let regions = [];
      if (this.locations.length) {
        regions = this.filterItems(this.locations, "region");
      }
      regions.sort((a,b) => {
        if(a > b) {
          return 1
        } else {
          return -1
        }
        return 0
      })
      return regions;
    },
    territories() {
      let territory = [];
      if (!this.user.region) {
        return territory;
      }
      if (this.user.region[0] === "all") {
        territory = this.filterItems(this.locations, "territory");
        return territory;
      }
      territory = this.filterItems(this.locations, "territory", item =>
        this.user.region.includes(item.region)
      );
       territory.sort((a,b) => {
        if(a > b) {
          return 1
        } else {
          return -1
        }
        return 0
      })
      return territory;
    },
    districts() {
      let district = [];
      if (!this.user.territory) {
        return district;
      }
      if (this.user.territory[0] === "all") {
        if (this.user.region[0] === "all") {
          district = this.filterItems(this.locations, "district");
        } else {
          district = this.filterItems(this.locations, "district", item =>
            this.user.region.includes(item.region)
          );
        }

        return district;
      }
      district = this.filterItems(
        this.locations,
        "district",
        /* item => item.territory === this.user.territory */
        item => this.user.territory.includes(item.territory)
      );
       district.sort((a,b) => {
        if(a > b) {
          return 1
        } else {
          return -1
        }
        return 0
      })
      return district;
    },
    areas() {
      let areas = [];
      if (!this.user.district) {
        return areas;
      }
      if (this.user.district[0] === "all") {
        if (this.user.territory[0] !== "all") {
          areas = this.filterItems(this.locations, "area", item =>
            this.user.territory.includes(item.territory)
          );
        } else if (this.user.region[0] !== "all") {
          areas = this.filterItems(this.locations, "area", item =>
            this.user.region.includes(item.region)
          );
        } else {
          areas = this.filterItems(this.locations, "area");
        }
        return areas;
      }
      areas = this.filterItems(this.locations, "area", item =>
        this.user.district.includes(item.district)
      );
       areas.sort((a,b) => {
        if(a > b) {
          return 1
        } else {
          return -1
        }
        return 0
      })
      return areas;
    },
    bricks() {
      let bricks = [];
      if (this.user.area[0] === 'all') {
        if(this.user.district[0] !== 'all') {
          bricks = this.filterItems(this.locations, 'brick', item => this.user.district.includes(item.district))
        } else if (this.user.territory[0] !== "all") {
          bricks = this.filterItems(this.locations, "brick", item =>
            this.user.territory.includes(item.territory)
          );
        } else if (this.user.region[0] !== "all") {
          bricks = this.filterItems(this.locations, "brick", item =>
            this.user.region.includes(item.region)
          );
        } else {
          bricks = this.filterItems(this.locations, "brick");
        }
        return bricks;
      }
      bricks = this.filterItems(this.locations, "brick", item =>
       this.user.area.includes(item.area)
      );
       bricks.sort((a,b) => {
        if(a > b) {
          return 1
        } else {
          return -1
        }
        return 0
      })
      return bricks;
    },
    lines() {
      return this.$store.getters.allLines;
    }
  },
  methods: {
    getUser() {
      let id = this.$route.params.id;
      return httpCall
        .get("admin/v1/users/" + id)
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.user = data.data;
          });
        })
        .catch(err => {
          console.log(err);
          this.$toasted.error("Something went wrong");
        });
    },
    saveUser() {
      let request = {
        ...this.user,
        _method: "PUT"
      };
      let id = this.$route.params.id;
      this.lines.map(line => {
        if(request.line.includes(line.name)) {
          line.specialties.map(item => {
            if(!request.assigned_specialties.includes(item)) {
              request.assigned_specialties.push(item)
            }
          })
        }
      });
      request = this.serializeRequest(request);
      httpCall
        .post("admin/v1/users/" + id, request)
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.$router.push("/users");
            this.$store.dispatch("getAllUsers", true);
          });
        })
        .catch(err => {
          console.log(err);
          this.$toasted.error("Something wrong happened");
        });
    },
    /**
     * filTer data by the given item and condition
     *
     * @param {array} data
     * @param {string} item
     * @param {function} cond
     */
    filterItems(data, item, cond) {
      let res = [];
      if (undefined === cond) {
        cond = () => true;
      }
      data.map(row => {
        if (cond(row)) {
          if (!res.includes(row[item])) {
            res.push(row[item]);
          }
        }
      });
      return res;
    },
    toggleAssignedBricks() {
      if (event.target.checked) {
        this.assignBricks = true;
      } else {
        this.assignBricks = false;
        this.user.assigned_brick = [];
      }
    },
    /**
     * serialize request to json
     *
     * @param {object} request
     * @return {object}z
     */
    serializeRequest(request) {
      request.assigned_brick = JSON.stringify(request.assigned_brick);
      request.area = JSON.stringify(request.area);
      request.district = JSON.stringify(request.district);
      request.territory = JSON.stringify(request.territory);
      request.region = JSON.stringify(request.region);
      request.line = JSON.stringify(request.line);
      request.assigned_specialties = request.assigned_specialties
        ? JSON.stringify(request.assigned_specialties)
        : JSON.stringify([]);
      return request;
    },
    checkAllItems(dom,values,target) {
      dom = document.querySelectorAll(`${dom} input[type="checkbox"]`);
      console.log(event.target, event.target.checked)
      if(event.target.checked) {
        dom.forEach(item => {
          item.checked = true;
        })
        this.user[target] = this[values];
      } else {
        dom.forEach(item => {
          item.checked = false;
        })
        this.user[target] = [];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.custom-badge {
  border-radius: 5px;
  font-size: small;
  background-color: inherit;
  color: royalblue;
  text-decoration: none;
  transition: 0.5s;
  border: 1px solid royalblue;
  &:hover {
    opacity: 0.8;
    background-color: royalblue;
    color: white;
  }
}
</style>

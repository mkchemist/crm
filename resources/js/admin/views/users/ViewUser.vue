<template>
  <div class="px-0 shadow">
    <p class="alert alert-success">
      <span><i class="fa fa-book-reader"></i></span>
      <span>View User</span>
    </p>
    <div class="p-2">
      <div class="p-2">
        <!-- user selection-->
        <div class="form-group row mx-auto" v-if="users.length">
          <select
            name="users"
            id="users"
            class="form-control form-control-sm col-lg"
            v-model="userIndex"
          >
            <option value="">All</option>
            <option v-for="(user, i) in users" :value="i" :key="user.id">{{
              user.name
            }}</option>
          </select>
          <button
            class="btn btn-sm skin-btn col-lg-auto mx-1"
            @click="selectUser"
            :disabled="!users.length"
          >
            <span><i class="fa fa-check-circle"></i></span>
            <span>Select</span>
          </button>
        </div>
        <loader-component v-else></loader-component>
        <!-- end of user selection -->
        <!-- user info.-->
        <div class="p-2 border rounded" v-if="user">
          <p class="small font-weight-bold">
            Username:
            <span class="font-weight-bold text-primary">{{
              user.username
            }}</span>
          </p>
          <p class="small font-weight-bold">
            Name:
            <span class="font-weight-bold text-primary">{{ user.name }}</span>
          </p>
          <p class="small font-weight-bold">
            E-mail:
            <span class="font-weight-bold text-primary">{{ user.email }}</span>
          </p>
          <p class="small font-weight-bold">
            Line:
            <span class="font-weight-bold text-primary">{{ user.line }}</span>
          </p>
          <p class="small font-weight-bold">
            Role:
            <span class="font-weight-bold text-primary">{{ user.role }}</span>
          </p>
          <div class="small form-inline mb-1">
            <span class="font-weight-bold">Bricks</span>
            <input
              type="text"
              class="custom-input"
              v-model="brickSearchKeyword"
            />
            <span class="fa fa-search"></span>
          </div>
          <div class="row mx-auto">
            <p
              class="col-lg-2 col-md-3 col-4 mb-1"
              style="font-size:75%"
              v-for="(item, i) in bricks"
              :key="`brick_${i}`"
            >
              {{ item }}
            </p>
          </div>
          <div class="small form-inline mb-1">
            <span class="font-weight-bold">Area</span>
            <input
              type="text"
              class="custom-input"
              v-model="areaSearchKeyword"
            />
            <span class="fa fa-search"></span>
          </div>
          <div class="row mx-auto">
            <p
              class="col-lg-2 col-md-3 col-4 mb-1"
              style="font-size:75%"
              v-for="(item, i) in area"
              :key="`area_${i}`"
            >
              {{ item }}
            </p>
          </div>
          <div class="small form-inline mb-1">
            <span class="font-weight-bold">District</span>
            <input
              type="text"
              class="custom-input"
              v-model="districtSearchKeyword"
            />
            <span class="fa fa-search"></span>
          </div>
          <div class="row mx-auto">
            <p
              class="col-lg-2 col-md-3 col-4 mb-1"
              style="font-size:75%"
              v-for="(item, i) in area"
              :key="`district_${i}`"
            >
              {{ item }}
            </p>
          </div>
          <p class="small font-weight-bold">
            Territory:
            <span class="font-weight-bold text-primary">{{
              user.territory.join(" & ")
            }}</span>
          </p>
          <p class="small font-weight-bold">
            Region:
            <span class="font-weight-bold text-primary">{{
              user.region.join(" & ")
            }}</span>
          </p>
        </div>
        <div class="p-2 user-info-waiting" v-else>
          <p>
            <span><i class="fa fa-info-circle"></i></span>
            <span>No user selected, select user first to show info.</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { sortBy } from "../../../helpers/helpers";
export default {
  mounted() {},
  computed: {
    users() {
      return sortBy(this.$store.getters.users, "name");
    },
    isUsesFetched() {
      return this.$store.getters.allUsersFetched;
    },
    bricks() {
      if (!this.user) {
        return [];
      }
      try {
        let bricks = sortBy(this.user.assigned_brick);
        if (this.brickSearchKeyword) {
          bricks = bricks.filter(i => i.toLowerCase().includes(this.brickSearchKeyword.toLowerCase()));
        }
        return bricks;
      } catch (e) {
        console.log(e);
        return [];
      }
    },
    area() {
      if (!this.user) {
        return [];
      }
      try {
        let area = sortBy(this.user.area);
        if (this.areaSearchKeyword) {
          area = area.filter(i => i.toLowerCase().includes(this.areaSearchKeyword.toLowerCase()));
        }
        return area;
      } catch (e) {
        console.log(e);
        return [];
      }
    },
    district() {
      if (!this.user) {
        return [];
      }
      try {
        let district = sortBy(this.user.district);
        if (this.districtSearchKeyword) {
          district = district.filter(i =>
            i.toLowerCase().includes(this.districtSearchKeyword.toLowerCase())
          );
        }
        return district;
      } catch (e) {
        console.log(e);
        return [];
      }
    },
    territory() {}
  },
  data: () => ({
    userIndex: "",
    user: null,
    brickSearchKeyword: null,
    areaSearchKeyword: null,
    districtSearchKeyword: null
  }),
  methods: {
    selectUser() {
      if (this.userIndex === "") {
        return;
      }
      this.user = this.users[this.userIndex];
    }
  }
};
</script>

<style></style>

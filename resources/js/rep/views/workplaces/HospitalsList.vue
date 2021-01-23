<template>
  <div>
    <div class="px-0 shadow pb-5">
      <p class="alert alert-success">
        <span><i class="fa fa-list-alt"></i></span>
        <span class="font-weight-bold">Hospital list</span>
      </p>
      <div class="p-2 text-right">
        <router-link
          to="/workplaces/add-hospital"
          class="btn btn-sm btn-success"
        >
          <span><i class="fa fa-plus-circle"></i></span>
          <span>new</span>
        </router-link>
        <button class="btn btn-sm btn-primary" @click="openFilterModal">
          <span class="fa fa-filter"></span>
          <span>Filter</span>
        </button>
        <div class="text-left">
          <data-filter-box
          :show="showFilterModal"
          :onClose="closeFilterModal"
          :data="all"
          :onFilter="onFilter"
          :onReset="onReset"
          :queryKeys="['area','brick', 'plans', 'visits']"
          :queryOnly="false"
          />
        </div>
      </div>
      <div v-if="all.length" class="p-2">
        <!-- <hospital-table :data="all" /> -->
        <table-component
          :heads="heads"
          :data="all"
          head-class="bg-success text-light"
        >
        <template v-slot:head:before>
            <th>ID</th>
            <th>Action</th>
          </template>
           <template v-slot:body:before="{item}">
            <th>{{ item.id }}</th>
            <td>
              <router-link
                :to="`/workplaces/hospital/view/${item.id}`"
                class="btn btn-sm btn-info"
              >
                <span><i class="fa fa-eye"></i></span>
              </router-link>
              <router-link
                :to="`/workplaces/hospital/edit/${item.id}`"
                class="btn btn-sm btn-warning"
              >
                <span><i class="fa fa-edit"></i></span>
              </router-link>
            </td>
          </template>
          <template v-slot:head>
            <th>Achievement state</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Brick</th>
            <th>Area</th>
            <th>State</th>
          </template>
          <template v-slot:body="{ item }">
            <td><span v-html="calculateState(item)"></span></td>
            <td>{{ item.address }}</td>
            <td>{{ item.phone }}</td>
            <td>{{ item.brick }}</td>
            <td>{{ item.area }}</td>
            <td>{{ item.state }}</td>
          </template>
        </table-component>
      </div>
      <div class="text-center" v-else-if="fetched">
        <no-data-to-show title="No hospitals found">
          <router-link
            to="/workplaces/add-hospital"
            class="btn btn-success btn-sm"
          >
            <span><i class="fa fa-plus-circle"></i></span>
            <span>Add new Hospital</span>
          </router-link>
        </no-data-to-show>
      </div>
      <loader-component v-else />
    </div>
  </div>
</template>

<script>
import TableComponent from "../../../components/TableComponent";
import NoDataToShow from "../../../components/NoDataToShow";
import DataFilterBox from '../../../components/DataFilterBox.vue';
export default {
  mounted() {
    this.$store.dispatch("workplaceGetAll");
  },
  computed: {
    all() {
      if(this.shouldRenderFilter) {
        return this.filteredList
      }
      return this.$store.getters.allWorkplaces;
    },
    fetched() {
      return this.$store.getters.isWorkplacesFetched;
    }
  },
  components: {
    TableComponent,
    NoDataToShow,
    DataFilterBox
  },
  data: () => ({

       heads: [
      {
        title: "Name",
        name: "name"
      },
      {
        title: "Type",
        name: "type"
      },
      {
        title: 'Plans',
        name: 'plans'
      },
      {
        title: 'Reports',
        name: 'visits'
      },
      {
        title: 'Diff',
        name:'diff'
      }
    ],
    showFilterModal: false,
    shouldRenderFilter: false,
    filteredList: []
  }),
  methods: {
    calculateState(item) {
      let diff = item.diff,
          plans = item.plans,
          flag, style;
      if(diff > 0 && diff === plans ) {
        flag = "Uncovered";
        style = "bg-danger text-light"
      } else if(diff > 0 && diff !== plans) {
        flag = "Missed";
        style = "bg-warning text-dark"
      } else if(diff === 0 && plans === 0) {
        flag = "Not targeted";
        style = "bg-dark text-light"
      }else if(diff === 0 && plans !== 0) {
        flag = "Accomplished";
        style = "bg-success text-light"
      } else {
        flag = "Over";
        style = "bg-info text-light"
      }
      return `<span class="p-1 rounded ${style}">${flag}</span>`
    },
    openFilterModal() {
       this.showFilterModal = true;
    },
    closeFilterModal() {
      this.showFilterModal = false;
    },
    onFilter(query,data) {
      this.shouldRenderFilter = true;
      this.filteredList = [];
      let asyncDataFlow = () => Promise.resolve(data)
      asyncDataFlow().then(data => this.filteredList = data);
    },
    onReset() {
      this.filteredList = [];
      let asyncDataFlow = () => Promise.resolve(this.$store.getters.allWorkplaces)
      asyncDataFlow().then(data => this.filteredList = data);
    }
  }
};
</script>

<style></style>

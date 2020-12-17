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
      </div>
      <div v-if="all.length" class="p-2">
        <!-- <hospital-table :data="all" /> -->
        <table-component
          :heads="heads"
          :data="all"
          head-class="bg-success text-light"
        >
          <template v-slot:head>
            <th>Achievment state</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Brick</th>
            <th>Area</th>
            <th>State</th>
            <th>Actions</th>
          </template>
          <template v-slot:body="{ item }">
            <td :class="`${calculateState(item).class}`">{{ calculateState(item).title }}</td>
            <td>{{ item.address }}</td>
            <td>{{ item.phone }}</td>
            <td>{{ item.brick }}</td>
            <td>{{ item.area }}</td>
            <td>{{ item.state }}</td>
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
export default {
  mounted() {
    this.$store.dispatch("workplaceGetAll");
  },
  computed: {
    all() {
      return this.$store.getters.allWorkplaces;
    },
    fetched() {
      return this.$store.getters.isWorkplacesFetched;
    }
  },
  components: {
    TableComponent,
    NoDataToShow
  },
  data: () => ({
    heads: [
      {
        title: "ID",
        name: "id"
      },
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
    ]
  }),
  methods: {
    calculateState(item) {
      let diff = item.diff;
      let plans = item.plans;
      let visits = item.visits;
      if(diff === 0 && plans === 0) {
        return  {
          title: 'Not Planned',
          class: 'bg-dark text-light'
        };
      } else if(diff ===0 && plans !== 0) {
        return {
          title: 'Accomplished',
          class: 'bg-success text-light'
        }
      }else if (diff > 0 && visits !== 0){
        return {
          title: 'missed',
          class: "bg-warning text-dark"
        }
      }else if(diff > 0 && visits === 0) {
        return {
          title: 'uncoverd',
          class: "bg-danger text-light"
        }
      } else {
        return {
          title: 'over',
          class: 'bg-primary text-light'
        }
      }
    }
  }
};
</script>

<style></style>

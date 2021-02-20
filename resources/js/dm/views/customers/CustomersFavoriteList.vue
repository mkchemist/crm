<template>
  <div>
    <div class="px-0 shadow">
      <p class="alert alert-success">
        <span><i class="fa fa-star"></i></span>
        <span class="font-weight-bold">Customers Favorite List</span>
      </p>
      <div class="my-3 p-3">
        <div
          v-if="list.length"
        >
          <customer-list-component :refreshCallback="getList" :data="list" :withFavorite="false" :withUnlink="true" />
        </div>
        <div v-else-if="isFetched">
          <p class="text-center text-dark">No data to show</p>
        </div>
        <div v-else>
          <loader-component></loader-component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomerListComponent from '../../../components/CustomerListComponent.vue';
import { httpCall } from "../../../helpers/http-service";
export default {
  components: {
    CustomerListComponent
  },
  computed: {
    reps() {
      let reps = [...this.$store.getters.allReps];
      try {
        reps.forEach(r => {
          try {
            r.area = JSON.parse(r.area);
            r.district = JSON.parse(r.district);
            r.territory = JSON.parse(r.territory);
            r.assigned_brick = JSON.parse(r.assigned_brick);
          } catch (e) {
            return;
          }
          if (r.assigned_brick[0] === "all") {
            r.assigned_brick = [];
          }
        });
      } catch (e) {
        console.log(e);
      }
      return reps;
    }
  },
  data: () => ({
    list: [],
    isFetched: false
  }),
  created() {
    this.getList();
  },
  methods: {
    getList() {
      httpCall.get("customers-favorite-list").then(({ data }) => {
      data.message = "Favorite list loaded";
      this.handleResponse(data, data => {
        this.isFetched = true;
        this.list = this.prepareData(data.data)
      });
    });
    },
    prepareData(data) {
      data.forEach(item => {
        let { rep, line } = this.getRepName(item);
        item["rep"] = rep;
        item["line"] = line;
        item["status"] = this.customerState(item);
        item["current_freq"] = item.freq ? item.freq.current: 0;
        item["next_freq"] = item.freq ? item.freq.next: 0;
        item["diff"] = item.reports - item.plans;
      });
      return data;
    },
    customerState(item) {
      let diff = item.reports - item.plans;
      if (diff > 0) {
        return "over";
      } else if (diff === 0 && item.plans !== 0) {
        return "accomplished";
      } else if (diff === 0 && item.plans === 0) {
        return "not_targeted";
      } else if (diff === -1 * item.plans && item.plans !== 0) {
        return "uncovered";
      } else {
        return "under";
      }
    },
    getRepName(c) {
      let rep = "-------";
      let line = "------";
      this.reps.map(r => {
        if (
          r.assigned_brick.includes(c.brick) &&
          r.area.includes(c.area) &&
          r.territory.includes(c.territory) &&
          r.district.includes(c.district)
        ) {
            rep = r.name;
          line = r.line;
        }
      });
      return { rep, line };
    },
  }
};
</script>

<style></style>

<template>
  <div class="p-2 row mx-auto bg-light">
    <div class="col-lg-3 p-2 bg-white pb-5">
      <div class="px-0 shadow pb-2">
        <p class="alert alert-success">
          <span class="font-weigh-bold">Rep</span>
        </p>
        <div class="form-group p-2">
          <select
            name="rep"
            id="rep"
            class="form-control form-control-sm"
            v-model="rep"
          >
            <option :value="null">All</option>
            <option :value="rep" v-for="rep in reps" :key="rep.id">{{
              rep.name
            }}</option>
          </select>
        </div>
        <div class="form-group text-right p-2">
          <button class="btn btn-sm btn-primary" @click="filter" :disabled="!rep">
            <span class="fa fa-check-circle"></span>
            <span>Ok</span>
          </button>
          <button class="btn btn-sm btn-secondary" @click="reset">
            <span class="fa fa-times-circle"></span>
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>
    <div class="col-lg-9 p-2 bg-white">
      <div class="px-0 shadow rounded pb-5">
        <p class="alert alert-success">
          <span class="fa fa-book-reader"></span>
          <span class="font-weight-bold">Pharmacy List</span>
        </p>
        <div class="p-2">
          <div class="p-2" v-if="pharmacies.length">
            <data-table-component
              :data="pharmacies"
              :cols="cols"
              :tableHeadClass="`bg-success text-light`"
              :buttons="buttons"
            />
          </div>
          <div v-else-if="fetched">
            <no-data-to-show />
          </div>
          <loader-component v-else></loader-component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DataTableComponent from "../../../components/DataTableComponent.vue";
import { createDataTableButton } from "../../../helpers/data-table-helpers";
import { asyncDataFlow } from '../../../helpers/http-service';
export default {
  components: { DataTableComponent },

  mounted() {},
  computed: {
    pharmacies() {
      if(this.shouldRenderFilter) {
        return this.filteredList;
      }
      return this.$store.getters.allPharmacies;
    },
    fetched() {
      return this.$store.getters.isPharmaciesFetched;
    },
    buttons() {
      return [
        createDataTableButton(this, {
          title: "View",
          icon: "fa-book-reader",
          action: (e, dt) => {
            let row = dt.rows({ selected: true }).data()[0];
            if (!row) {
              this.$toasted.show("Choose pharmacy First", {
                icon: "fa-exclamation-circle"
              });
              return;
            }
            this.$router.push("/pharmacies/view/" + row.id);
          },
          className: "view-btn"
        })
      ];
    },
    reps() {
      return this.$store.getters.managerReps;
    }
  },
  data: () => ({
    cols: [
      {
        title: "ID",
        name: "id",
        visible: false
      },
      {
        title: "Pharmacy Name",
        name: "name"
      },
      {
        title: "Pharmacy Type",
        name: "type"
      },
      {
        title: "Key Person",
        name: "key_person"
      },
      {
        title: "Address",
        name: "address"
      },
      {
        title: "brick",
        name: "brick"
      },
      {
        title: "area",
        name: "area"
      },
      {
        title: "District",
        name: "district"
      },
      {
        title: "Territory",
        name: "territory"
      }
    ],
    rep: null,
    shouldRenderFilter: false,
    filteredList: []
  }),
  methods: {
    /**
     * filter pharmacies by rep
     *
     * check if the pharmacies have
     * the same region -> territory -> district->area
     *
     *
     */
    filter() {
      if(this.rep === null) {
        return;
      }
      let { area, district, territory, region } = this.rep;
      area = JSON.parse(area);
      district = JSON.parse(district);
      territory = JSON.parse(territory);
      region = JSON.parse(region);
      let filtered = this.$store.getters.allPharmacies;
      filtered = filtered.filter(item => region.includes(item.region))
                .filter(item => territory.includes(item.territory))
                .filter(item=> district.includes(item.district))
                .filter(item => area.includes(item.area))
      this.shouldRenderFilter = true;
      this.filteredList = [];
      asyncDataFlow(filtered, data => this.filteredList = data);

    },
    /**
     * reset rep filters
     *
     *
     */
    reset() {
      this.filteredList = [];
      this.rep = null;
      asyncDataFlow(this.$store.getters.allPharmacies, data => this.filteredList = data);
    }
  }
};
</script>

<style></style>

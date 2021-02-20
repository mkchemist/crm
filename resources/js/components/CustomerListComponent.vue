<template>
  <div>
    <div class="text-right">
      <data-filter-box
        :data="customers"
        :query-keys="filter"
        :queryOnly="false"
        :show="showFilterBox"
        :onClose="closeFilterBox"
        :onReset="onReset"
        :onFilter="onFilter"
      />
      <button class="btn btn-sm btn-primary" @click="openFilterBox">
        <span class="fa fa-filter"></span>
        <span>Filter</span>
      </button>

      <button
        class="btn btn-primary btn-sm"
        @click="forceRefresh"
      >
        <span><i class="fa fa-redo"></i></span>
        <span>refresh list</span>
      </button>
    </div>
    <div v-if="customers.length">
      <data-table-component
        :cols="heads"
        :data="customers"
        :buttons="buttons"
      >
      </data-table-component>
    </div>
  </div>
</template>

<script>
import { DM_CUSTOMERS_HEADS } from "../helpers/constants";
import { asyncDataFlow, httpCall } from '../helpers/http-service';
import DataFilterBox from './DataFilterBox.vue';
import DataTableComponent from "./DataTableComponent.vue";
export default {
  components: { DataTableComponent, DataFilterBox },
  props: {
    filter: {
      type: Object | Array,
      default: () => [
        {
          title: "Rep",
          name: "rep"
        },
        {
          title: "Specialty",
          name: "specialty"
        },
        {
          title: "Parameter",
          name: "parameter"
        },
        {
          title: "Frequency(current)",
          name: "current_freq"
        },
        {
          title: "Frequency(next)",
          name: "next_freq"
        },
        {
          title: "No. of plans",
          name: "plans"
        },
        {
          title: "No. of visits",
          name: "reports"
        },
        {
          title: "Status",
          name: "status"
        },
        {
          title: "Brick",
          name: "brick"
        },
        {
          title: "Area",
          name: "area"
        },
        {
          title: "District",
          name: "district"
        }
      ]
    },
    data: {
      type: Array,
      required: true
    },
    refreshCallback: {
      type: Function,
    },
    withFavorite: {
      type: Boolean,
      default: () => true
    },
    withUnlink: {
      type:Boolean,
      default: () => false
    }
  },
  computed: {
    customers() {
      if (this.shouldRenderFilter) {
        return this.filteredList;
      }
      return this.data;
    },
    buttons() {
      let buttons =  [
        {
          text: `<span class="fa fa-book-reader mx-1"></span> View`,
          action:(e,dt) => {
            let row = dt.rows({selected: true}).data()[0];
            if(!row) {
              this.$swal({
                title: "Warning",
                text: "You must select customer",
                icon: "warning",
                toast: true,
                timer: 3000
              })
            } else {
              this.$router.push("/customers/view/"+row.id);
            }
          }
        }
      ]
      if(this.withFavorite) {
        buttons.push({
          text: `<span class="fa fa-star mx-1"></span> Favorite`,
          action: (e,dt) => {
            let row = dt.rows({selected: true}).data()[0];
            if(!row) {
              this.$swal({
                title: "Warning",
                text: "You must select customer",
                icon: "warning",
                toast: true,
                timer: 3000
              })
            } else {
              let id = row.id
              httpCall
              .post("customers-favorite-list", { id})
              .then(({ data }) => {
                data.message = data.data;
                this.handleResponse(data);
              });
            }
          }
        })
      }

      if(this.withUnlink) {
        buttons.push({
          text: '<i class="fa fa-unlink"></i> Unlink',
          action: (e, dt) => {
            let row = dt.rows({selected: true}).data()[0];
            if(!row) {
              this.$swal({
                title: "Warning",
                text: "You must select customer",
                icon: "warning",
                toast: true,
                timer: 3000
              })
            } else {
              let id = row.id
              httpCall
              .post("customers-favorite-list/" + id, {
                _method: "DELETE"
              })
              .then(({ data }) => {
                data.message = data.data;
                this.handleResponse(data);
                this.forceRefresh()
              });
            }

          }
        })
      }
      return buttons;
    }
  },
  data: () => ({
    heads: DM_CUSTOMERS_HEADS,
    shouldRenderFilter: false,
    filteredList: [],
    showFilterBox: false
  }),
  methods: {
    forceRefresh() {
      if(this.refreshCallback) {
        this.refreshCallback();
      }
    },
    openFilterBox() {
      this.showFilterBox = true;
    },
    closeFilterBox(){
      this.showFilterBox = false;
    },
    onFilter(q,data) {
      this.shouldRenderFilter = true;
      this.filteredList = [];
      asyncDataFlow(data, d => this.filteredList = d);
    },
    onReset() {
      this.filteredList = [];
      asyncDataFlow([], d => {
        this.shouldRenderFilter = false;
        this.filteredList = d
      })
    },
  }
};
</script>

<style></style>

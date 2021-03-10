<template>
  <div>
    <div class="px-0 shadow rounded pb-5">
      <page-title-component title="Pharmacy Favorite List" icon="fa-start" />
      <div class="p-2">
        <div class="p-2" v-if="list.length && fetched">
          <data-table-component :buttons="buttons" :data="data" :cols="cols" />
        </div>
        <div class="p-2" v-else-if="fetched">
          <no-data-to-show :title="`No pharmacies found in favorite list`" />
        </div>
        <loader-component v-else text="Loading list"></loader-component>
      </div>
    </div>
    <data-filter-box
      :data="data"
      :onClose="closeFilterBox"
      :onFilter="onFilterList"
      :onReset="onResetListFilter"
      :queryKeys="queryKeys"
      :queryOnly="false"
      :show="showFilterBox"
    />
  </div>
</template>

<script>
import { asyncDataFlow, httpCall, UrlHelper } from "../helpers/http-service";
import DataFilterBox from "./DataFilterBox.vue";
import DataTableComponent from "./DataTableComponent.vue";
import NoDataToShow from "./NoDataToShow.vue";
import PageTitleComponent from "./PageTitleComponent.vue";
export default {
  components: {
    PageTitleComponent,
    NoDataToShow,
    DataFilterBox,
    DataTableComponent
  },
  mounted() {
    this.fetchFavoriteListFromApi();
  },
  computed: {
    data() {
      if (this.shouldRenderFilter) {
        return this.filteredList;
      }
      return this.list;
    },
    buttons() {
      /** unlink button
       *
       * to remove pharmacy from list
       */
      let unlinkFromListButton = {
        text: `<i class="fa fa-unlink"></i> unlink`,
        action: (e, dt) => {
          let row = dt.rows({ selected: true }).data()[0];
          if (!row) {
            this.$toasted.error("Select pharmacy first", {
              icon: "exclamation-triangle"
            });
            return;
          }
          this.unlinkPharmacyFromList(row.id);
        }
      };
      /** Filter Button */
      let filterListButton = {
        text: `<i class="fa fa-filter"></i> filter`,
        action: (e, dt) => this.openFilterBox()
      };

      return [unlinkFromListButton, filterListButton];
    }
  },
  data: () => ({
    list: [],
    fetched: false,
    showFilterBox: false,
    shouldRenderFilter: false,
    filteredList: [],
    cols: [
      {
        title: "Pharmacy",
        name: "name"
      },
      {
        title: "Id",
        name: "id",
        visible: false
      },
      {
        title: "Visits",
        name: "reports"
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
        title: "Phone",
        name: "phone"
      },
      {
        title: "Address",
        name: "address"
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
      },
      {
        title: "Territory",
        name: "territory"
      },

    ],
    queryKeys: [
      {
        title: "Pharmacy",
        name: "name"
      },
      {
        title: "Pharmacy Type",
        name: "type"
      },
      {
        title: "Address",
        name: "address"
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
      },
      {
        title: "Territory",
        name: "territory"
      },
      {
        title: "Visits",
        name: "reports"
      }
    ]
  }),
  methods: {
    fetchFavoriteListFromApi(payload = {}) {
      let url = payload.url || "v1/favorite-pharmacies";
      let base = payload.base || false;
      let add = payload.add || false;
      if(!add) {
        this.list = [];
        this.fetched = false;
      }
      return httpCall.get(url, {}, base).then(res => {
        let { data, status } = res;
        if (status === 200) {
          this.list = [...this.list, ...data.data];
          if (data.links.next) {
            this.fetchFavoriteListFromApi({
              url : UrlHelper.addToken(data.links.next_page_url),
              base: true,
              add: true
            });
          } else {
            this.fetched = true;
          }
        } else {
          this.$toasted.error(
            "Something wrong happen, please contact Admin \n, Error code : " +
              status,
            {
              icon: "exclamation",
              duration: 5000
            }
          );
        }
      });
    },
    unlinkPharmacyFromList(id) {
      return httpCall
        .post("v1/favorite-pharmacies/" + id, { _method: "DELETE" })
        .then(({ status, data }) => {
          if (status === 200) {
            this.$toasted.success("Pharmacy remove from favorite list", {
              icon: "check-circle"
            });
            this.fetchFavoriteListFromApi();
          } else {
            this.$toasted.error(
              "Something wrong happen, please contact Admin \n, Error code : " +
                status,
              {
                icon: "exclamation",
                duration: 5000
              }
            );
          }
        })
        .catch(err => console.log(err));
    },
    openFilterBox() {
      this.showFilterBox = true;
    },
    closeFilterBox() {
      this.showFilterBox = false;
    },
    onFilterList(queryString, data) {
      this.filteredList = [];
      asyncDataFlow(data, d => {
        this.filteredList = data;
        this.shouldRenderFilter = true;
      });
    },
    onResetListFilter() {
      this.filteredList = [];
      asyncDataFlow(data, d => {
        this.shouldRenderFilter = false;
      });
    }
  }
};
</script>

<style></style>

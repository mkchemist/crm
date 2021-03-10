<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-success">
      <span class="fa fa-list"></span>
      <span class="font-weight-bold">Pharmacies list</span>
    </p>
    <!-- pharmacy control -->
    <!-- <div class="p-2">
      <button type="button" class="btn btn-sm btn-primary" @click="openFilterModal">
        <span class="fa fa-filter"></span>
        <span>Filter</span>
      </button>
      <router-link to="/pharmacies/new" class="btn btn-sm btn-success" exact>
        <span class="fa fa-plus-circle"></span>
        <span>New Pharmacy</span>
      </router-link>
      <data-filter-box
        :data="pharmacies"
        :queryKeys="['area', 'brick']"
        :show="showFilterModal"
        :onClose="closeFilterModal"
        :onFilter="onFilter"
        :onReset="onReset"
        :queryOnly="false"
      />
    </div> -->
    <!-- data view -->
    <div class="p-2">
      <div v-if="pharmacies.length && isPharmaciesFetched">
        <!-- <table-component
          :data="pharmacies"
          :heads="heads"
          :unselectable="true"
          :headClass="`bg-success text-light`"
          orderBy="Pharmacy"
        >
          <template v-slot:head:before>
            <th>Actions</th>
          </template>
          <template v-slot:body:before="{item}">
            <td>
              <router-link :to="`/pharmacies/view/${item.id}`" class="btn btn-sm btn-primary" >
                <span class="fa fa-book-reader"></span>
              </router-link>
              <router-link :to="{path :`/pharmacies/edit/${item.id}`, query: {pid: '1'}}" class="btn btn-sm btn-warning" exact>
                <span class="fa fa-edit"></span>
              </router-link>
            </td>
          </template>
        </table-component> -->
        <data-table-component
          :data="pharmacies"
          :cols="heads"
          :buttons="tableButtons"
        />
      </div>
      <div v-else-if="isPharmaciesFetched">
        <no-data-to-show />
      </div>
      <loader-component v-else></loader-component>
      <data-filter-box
        :show="showFilterModal"
        :onClose="closeFilterModal"
        :onFilter="onFilter"
        :onReset="onReset"
        :data="pharmacies"
        :queryKeys="queryKeys"
        :queryOnly="false"
      />
    </div>
  </div>
</template>

<script>
import DataTableComponent from "../../../components/DataTableComponent.vue";
import { asyncDataFlow, httpCall } from "../../../helpers/http-service";
import {
  createDataTableButton,
  createEditButton,
  createViewButton
} from "../../../helpers/data-table-helpers";
import DataFilterBox from "../../../components/DataFilterBox.vue";

export default {
  components: {
    DataFilterBox,
    DataTableComponent,
    DataFilterBox
  },
  computed: {
    pharmacies() {
      if (this.shouldRenderFilter) {
        return this.filteredList;
      }
      return this.$store.getters.allPharmacies;
    },
    isPharmaciesFetched() {
      return this.$store.getters.isPharmaciesFetched;
    },
    tableButtons() {
      return [
        createDataTableButton(this, {
          icon: "fa-plus-circle",
          title: "",
          action: () => this.$router.push("/pharmacies/new")
        }),

        {
          text: `<i class="fas fa-filter" title="Filter list"></i>`,
          action: (e, dt) => {
            this.openFilterModal();
          }
        },
        {
          text: `<i class="fa fa-handshake" title="visit pharmacy"></i>`,
          action: (e, dt) => {
            let row = dt.rows({ selected: true }).data()[0];
            if (!row) {
              this.$toasted.error("Select pharmacy first");
              return;
            }
            this.$router.push(
              "/reports/add/pharmacy/" + row.id + `?name=${row.name}`
            );
          }
        },
        {
          text: `<i class="fa fa-star" title="Add to Favorite"></i>`,
          action: (e, dt) => {
            let row = dt.rows({ selected: true }).data()[0];
            if (!row) {
              this.$toasted.error("Select pharmacy first");
              return;
            }
            this.linkPharmacyToFavoriteList(row.id);
          }
        },
        createViewButton(this, {
          field: "id",
          url: "/pharmacies/view/",
          onError: () => this.$toasted.show("Must select an item")
        }),
        createEditButton(this, {
          field: "id",
          url: "/pharmacies/edit/",
          onError: () => this.$toasted.show("Must select an item")
        })
      ];
    }
  },
  data: () => ({
    heads: [
      {
        title: "Pharmacy",
        name: "name"
      },
      {
        title: "Type",
        name: "type"
      },
      {
        title: "Phone",
        name: "phone"
      },
      {
        title: "Key Person",
        name: "key_person"
      },
      {
        title: "Visits",
        name: "reports"
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
      }
    ],
    showFilterModal: false,
    shouldRenderFilter: false,
    filteredList: [],
    queryKeys: [
      {
        title: "Type",
        name: "type"
      },
      {
        title: "Visits",
        name: "reports"
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
      }
    ]
  }),
  methods: {
    openFilterModal() {
      this.showFilterModal = true;
    },
    closeFilterModal() {
      this.showFilterModal = false;
    },
    onFilter(query, data) {
      this.shouldRenderFilter = true;
      this.filteredList = [];
      asyncDataFlow(data, data => {
        this.filteredList = data;
      });
    },
    onReset() {
      this.filteredList = [];
      asyncDataFlow(new Array(), d => {
        this.shouldRenderFilter = false;
      });
    },
    linkPharmacyToFavoriteList(id) {
      try {
        return httpCall
          .post("v1/favorite-pharmacies", { id })
          .then(() => {
            this.$toasted.success("Added to List");
          })
          .catch(err => {
            let { status, data } = err.response;
            if (status === 409) {
              this.$toasted.info(data.message);
            }
          });
      } catch (e) {
        console.log("We found an issue");
      }
    }
  }
};
</script>

<style></style>

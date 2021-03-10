<template>
  <div>
    <div class="px-0 shadow rounded pb-5">
      <page-title-component title="PM Single visits" icon="fa-book-reader" />
      <div class="p-2">
        <div class="p-2" v-if="reports.length">
          <data-table-component
            :data="reports"
            :cols="cols"
            :buttons="buttons"
          />
          <data-filter-box
            :show="showFilterBox"
            :onClose="closeFilterBox"
            :data="reports"
            :onReset="onReset"
            :onFilter="onFilter"
            :queryOnly="false"
            :queryKeys="queryKeys"
          />
        </div>
        <div class="p-2" v-else-if="fetched">
          <no-data-to-show />
        </div>
        <loader-component v-else></loader-component>
      </div>
    </div>
    <modal-fade
      :show="showActionModal"
      :headerStyle="`bg-primary text-light`"
      @onClose="closeActionModal"
      :id="`action_modal`"
    >
      <template v-slot:header>
        <span>Action Modal</span>
      </template>
      <template v-slot:body>
        <div
          class="btn-group btn-block"
          v-if="currentSelectedRow && isOwner(currentSelectedRow.user_id)"
          type="button"

        >
          <button class="btn btn-sm btn-warning" @click="editRowAction(currentSelectedRow.id)">
            <span class="fa fa-edit"></span>
            <span>Edit</span>
          </button>
          <button class="btn btn-sm btn-danger" @click="deleteRowAction(currentSelectedRow.id)">
            <span class="fa fa-trash"></span>
            <span>Delete</span>
          </button>
        </div>
        <div class="text-center" v-else>
          <i class="fa fa-exclamation-triangle fa-4x text-primary"></i>
          <br />
          <p>No action permitted</p>
        </div>
      </template>
    </modal-fade>
  </div>
</template>

<script>
import DataFilterBox from "../../../../components/DataFilterBox.vue";
import DataTableComponent from "../../../../components/DataTableComponent.vue";
import ModalFade from "../../../../components/ModalFade.vue";
import NoDataToShow from "../../../../components/NoDataToShow.vue";
import PageTitleComponent from "../../../../components/PageTitleComponent.vue";
import {ProductWithRate } from "../../../../helpers/constants";
import { logger } from "../../../../helpers/helpers";
import { asyncDataFlow, httpCall } from "../../../../helpers/http-service";
export default {
  components: {
    PageTitleComponent,
    DataFilterBox,
    DataTableComponent,
    NoDataToShow,
    ModalFade
  },
  mounted() {
    this.callPharmacyCollectionService();
  },
  computed: {
    reports() {
      if (this.shouldRenderFilter) {
        return this.filteredList;
      }
      return this.list;
    },
    buttons() {
      return [
        {
          text: `<i class="fa fa-filter"></i> Filter`,
          action: () => this.openFilterBox()
        },
        {
          text: `<i class="fa fa-tools"></i> Action`,
          action: (e, dt) => {
            let row = dt.rows({ selected: true }).data()[0];
            if (!row) {
              this.$swal({
                title: "Warning",
                text: "Select visit first",
                icon: "warning",
                toast: true
              });
              return;
            }
            this.currentSelectedRow = row;
            this.openActionModal();
          }
        }
      ];
    },
    areaManger() {
      return this.$store.getters.allAreaManagers;
    },
    businessUnit() {
      return this.$store.getters.regionalManager;
    },
    user() {
      return this.$store.state.UserModule.user;
    }
  },
  data: () => ({
    list: [],
    fetched: false,
    showFilterBox: false,
    shouldRenderFilter: false,
    filteresList: [],
    showActionModal: false,
    currentSelectedRow: null,
    cols: [
      {
        title: "Date",
        name: "visit_date"
      },
      {
        title: "Pharmacy",
        name: "pharmacy.name"
      },
      {
        title: "Type",
        name: "pharmacy.type"
      },
      {
        title: "User",
        name: "user.name"
      },
      {
        title: "Business Unit",
        name: "bu"
      },
      {
        title: "Area Manager",
        name: "am"
      },
      {
        title: "Line",
        name: "line"
      },
      {
        title: "Role",
        name: "user.role"
      },

      ...ProductWithRate,
      {
        title: "Feedback",
        name: "feedback"
      },
      {
        title: "Address",
        name: "pharmacy.address"
      },
      {
        title: "Brick",
        name: "pharmacy.brick"
      },
      {
        title: "Area",
        name: "pharmacy.area"
      },
      {
        title: "District",
        name: "pharmacy.district"
      },
      {
        title: "Territory",
        name: "pharmacy.territory"
      }
    ],
    queryKeys: [
      {
        title: "Date",
        name: "visit_date"
      },
      {
        title: "Type",
        name: "pharmacy.specialty"
      },
      {
        title: "User",
        name: "user.name"
      },
      {
        title: "Line",
        name: "line"
      },
      {
        title: "Role",
        name: "user.role"
      },
      {
        title: "Brick",
        name: "pharmacy.brick"
      },
      {
        title: "Area",
        name: "pharmacy.area"
      },
      {
        title: "District",
        name: "pharmacy.district"
      },
      {
        title: "Territory",
        name: "pharmacy.territory"
      }
    ]
  }),
  methods: {
    callPharmacyCollectionService() {
      this.$store
        .dispatch("SingleVisitModule/PharmacyCollection")
        .then(({ data }) => {
          data.data = this.formatPharmacyCollectionResource(data.data);
          this.list = data.data;
          this.fetched = true;
        })
        .catch(err => logger(err, "danger", err.stack));
    },
    /**
     * format resource to fit table
     *
     * @param {Array} data
     * @return {Array}
     */
    formatPharmacyCollectionResource(data) {
      let user = JSON.parse(document.getElementById("user").value);
      data.forEach(item => {
        item["products"] = JSON.parse(item.products);
        item["bu"] = user.name;
        item["line"] = JSON.parse(user.line).join(" | ");
      });
      return data;
    },
    openFilterBox() {
      this.showFilterBox = true;
    },
    closeFilterBox() {
      this.showFilterBox = false;
      return Promise.resolve(true);
    },
    onFilter(q, data) {
      this.filteredList = [];
      asyncDataFlow(data, data => {
        this.filteredList = data;
        this.shouldRenderFilter = true;
      });
    },
    onReset() {
      this.filteredList = [];
      asyncDataFlow([], data => {
        this.filteredList = data;
        this.shouldRenderFilter = false;
      });
    },
    openActionModal() {
      this.showActionModal = true;
    },
    closeActionModal() {
      this.showActionModal = false;
      return Promise.resolve(true);
    },
    isOwner(id) {
      return id === this.user.id;
    },
    editRowAction(id) {
      this.closeActionModal().then(() => {
        this.$router.push("/single-visit/pharmacy/edit/" + id);
      });
    },
    deleteRowAction(id) {
      this.$swal({
        title: "Warning",
        text: "Are you sure, you want to delete this visit",
        icon: "warning",
        showCancelButton: true
      }).then(res => {
        if(res.isConfirmed) {
          return httpCall.post("v1/single/pharmacy/"+id, {_method: "DELETE"})
          .then(({data}) => {
            if(data.code) {
              this.$swal({
                title :"Deleted",
                icon: "success",
              });
              this.callPharmacyCollectionService();
              this.closeActionModal();
            } else {
              this.$swal({
                title: "Error",
                text: "Something went Error",
                icon: "error",
                toast: true
              })
            }
          }).catch(err => console.log(err))
        }
      })
    }
  }
};
</script>

<style></style>

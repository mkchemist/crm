<template>
  <div>
    <div class="form-group text-right">
      <router-link to="/planner" class="btn btn-sm btn-dark">
        <span class="fa fa-chevron-circle-left"></span>
        <span>Back</span>
      </router-link>
      <button
        class="btn btn-sm btn-success"
        :disabled="!store.length"
        @click="add"
      >
        <span class="fa fa-plus-circle"></span>
        <span>Add</span>
      </button>
      <button
        class="btn btn-sm btn-primary"
        :disabled="!update.length"
        @click="openDuplicateModal"
      >
        <span class="fa fa-redo"></span>
        <span>Duplicate</span>
      </button>
      <button
        class="btn btn-sm btn-warning"
        :disabled="!update.length"
        @click="openEditModal"
      >
        <span class="fa fa-edit"></span>
        <span>Edit</span>
      </button>
      <button
        class="btn btn-sm btn-danger"
        :disabled="!update.length"
        @click="deletePlans"
      >
        <span class="fa fa-times-circle"></span>
        <span>Delete</span>
      </button>
    </div>
    <modal-fade
      :show="showDuplicateModal"
      :id="`Duplicate_modal`"
      @onClose="closeDuplicateModal"
      :headerStyle="`bg-primary text-light`"
    >
      <template v-slot:header>
        <span>Duplicate Plans</span>
      </template>
      <template v-slot:body>
        <div class="form-group">
          <label for="" class="text-muted small">
            Copy plans to date
          </label>
          <input
            type="date"
            name="duplicate_date"
            id="duplicate_date"
            class="form-control form-control-sm"
            v-model="duplicate_date"
          />
        </div>
        <div class="form-group text-right">
          <button
            type="button"
            class="btn btn-sm btn-primary"
            @click="duplicate"
          >
            <span class="fa fa-redo"></span>
            <span>Duplicate</span>
          </button>
          <button
            type="button"
            data-dismiss="modal"
            class="btn btn-sm btn-dark"
          >
            <span class="fa fa-times"></span>
            <span>Cancel</span>
          </button>
        </div>
      </template>
    </modal-fade>
    <modal-fade
      :show="showEditModal"
      :id="`Edit_modal`"
      @onClose="closeEditModal"
      :headerStyle="`bg-primary text-light`"
    >
      <template v-slot:header>
        <span>Edit Plans</span>
      </template>
      <template v-slot:body>
        <div class="form-group">
          <label for="" class="text-muted small">
            Move plans to date
          </label>
          <input
            type="date"
            name="edit_date"
            id="edit_date"
            class="form-control form-control-sm"
            v-model="edit_date"
          />
        </div>
        <div class="form-group text-right">
          <button
            type="button"
            class="btn btn-sm btn-primary"
            @click="updatePlans"
          >
            <span class="fa fa-edit"></span>
            <span>Move</span>
          </button>
          <button
            type="button"
            data-dismiss="modal"
            class="btn btn-sm btn-dark"
          >
            <span class="fa fa-times"></span>
            <span>Cancel</span>
          </button>
        </div>
      </template>
    </modal-fade>
  </div>
</template>

<script>
import ModalFade from "../../components/ModalFade.vue";
import { httpCall } from "../../helpers/http-service";
export default {
  components: { ModalFade },
  props: {
    type: {
      type: String,
      required: true
    },
    store: {
      type: Array,
      required: true
    },
    update: {
      type: Array,
      required: true
    },
    date: {
      type: String,
      required: true
    }
  },
  data: () => ({
    showDuplicateModal: false,
    showEditModal: false,
    duplicate_date: null,
    edit_date: null
  }),
  methods: {
    /* open duplicate modal */
    openDuplicateModal() {
      this.showDuplicateModal = true;
    },
    /* close duplicate modal */
    closeDuplicateModal() {
      this.showDuplicateModal = false;
    },
    /* open edit modal */
    openEditModal() {
      this.showEditModal = true;
    },
    /* close edit modal */
    closeEditModal() {
      this.showEditModal = false;
    },
    /**
     * prepare add request
     *
     * @return {Object}
     */
    prepareRequest() {
      let request = {
        date: this.date,
        type: this.type,
        titles: JSON.stringify(this.store)
      };
      if (this.type === "health_day") {
        request.titles = JSON.stringify(["health day"]);
        request.pharmacy = this.store[0].id;
      }
      return request;
    },
    /* Adding plans */
    add() {
      if (!this.store.length) {
        this.$toasted.error("No item selected", {
          icon: "fa-exclamation"
        });
        return;
      }
      let request = this.prepareRequest();
      return httpCall
        .post("otc-rep/v1/planner", request)
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.$store.dispatch("fetchPlans", { force: true });
          });
        })
        .catch(err => console.log(err));
    },
    /* Delete Plans */
    deletePlans() {
      if (!this.update.length) {
        this.$toasted.error("No item selected", {
          icon: "fa-exclamation"
        });
        return;
      }
      httpCall
        .post("otc-rep/v1/planner/group-delete", {
          ids: JSON.stringify(this.update)
        })
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.$store.dispatch("fetchPlans", { force: true });
          });
        })
        .catch(err => console.log(err));
    },
    /* update plans */
    updatePlans() {
      if (!this.update.length) {
        this.$toasted.error("No item selected", {
          icon: "fa-exclamation"
        });
        return;
      }
      if (this.isWeekEndDay(this.edit_date)) {
        this.$toasted.error(`You choose Friday of date ${this.edit_date}`, {
          icon: "fa-exclamation"
        });
        return;
      }
      let request = {
        date: this.edit_date,
        ids: JSON.stringify(this.update),
        _method: "PUT"
      };
      httpCall
        .post("otc-rep/v1/planner/" + this.edit_date, request)
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.$store.dispatch("fetchPlans", { force: true });
            this.edit_date = null;
            this.closeEditModal();
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    /* Duplicate plans */
    duplicate() {
      if (!this.update.length) {
        this.$toasted.error("No item selected", {
          icon: "fa-exclamation"
        });
        return;
      }
      if (this.isWeekEndDay(this.duplicate_date)) {
        this.$toasted.error(
          `You choose Friday of date ${this.duplicate_date}`,
          {
            icon: "fa-exclamation"
          }
        );
        return;
      }
      let request = {
        date: this.duplicate_date,
        ids: JSON.stringify(this.update)
      };
      httpCall
        .post("otc-rep/v1/planner/duplicate", request)
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.$store.dispatch("fetchPlans", { force: true });
            this.duplicate_date = null;
            this.closeDuplicateModal();
          });
        })
        .catch(err => console.log(err));
    },
    /**
     * check if the given date is weekend day
     *
     * @param {String} date
     * @return {Boolean}
     */
    isWeekEndDay(date) {
      date = new Date(date);
      if (date.getDay() === 5) {
        return true;
      }
      return false;
    }
  }
};
</script>

<style></style>

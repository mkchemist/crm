<template>
  <div class="shadow px-0 pb-5 rounded">
    <page-title-component title="Event Management" icon="fa-calendar-alt" />

    <div class="p-2">
      <div class="">
        <button class="btn btn-sm btn-primary" @click="openEventCreateBox">
          <span class="fa fa-plus-circle"></span>
          <span>Event</span>
        </button>
      </div>
      <div v-if="events.length" class="my-2">
        <data-table-component
          :data="events"
          :cols="cols"
          :tableResponsive="true"
          :buttons="buttons"
        />
      </div>
      <div v-else-if="fetched">
        <no-data-to-show />
      </div>
      <loader-component v-else></loader-component>
    </div>
    <modal-fade
      :show="showEventCreateBox"
      :headerStyle="`bg-primary text-light`"
      @onClose="closeEventCreateBox"
    >
      <template v-slot:header>
        <span class="fa fa-plus-circle"></span>
        <span>Create new Event</span>
      </template>
      <template v-slot:body>
        <ValidationObserver v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(saveEvent)">
            <!-- Event & Hotel -->
            <div class="row mx-auto">
              <div class="col-lg">
                <label for="">Event name</label>
                <ValidationProvider
                  name="Event name"
                  v-slot="{ errors }"
                  rules="required"
                >
                  <label class="small text-danger">{{ errors[0] }}</label>
                  <input
                    type="text"
                    :class="
                      `form-control form-control-sm ${
                        errors[0] ? 'border border-danger' : ''
                      }`
                    "
                    v-model="newEvent.name"
                    placeholder="write event name"
                  />
                </ValidationProvider>
              </div>
              <div class="col-lg">
                <label for="">Hotel</label>
                <ValidationProvider
                  name="Hotel"
                  v-slot="{ errors }"
                  rules="required"
                >
                  <label class="small text-danger">{{ errors[0] }}</label>
                  <input
                    type="text"
                    :class="
                      `form-control form-control-sm ${
                        errors[0] ? 'border border-danger' : ''
                      }`
                    "
                    v-model="newEvent.hotel"
                    placeholder="write hotel name"
                  />
                </ValidationProvider>
              </div>
            </div>
            <!-- End of Event & Hotel -->
            <!-- Duration and Type -->
            <div class="row mx-auto">
              <div class="col-lg">
                <label for="">Duration</label>
                <ValidationProvider
                  name="Duration"
                  v-slot="{ errors }"
                  rules="required"
                >
                  <label class="small text-danger">{{ errors[0] }}</label>
                  <input
                    type="number"
                    :class="
                      `form-control form-control-sm ${
                        errors[0] ? 'border border-danger' : ''
                      }`
                    "
                    v-model="newEvent.duration"
                    :min="1"
                    placeholder="Duration of stay"
                  />
                </ValidationProvider>
              </div>
              <div class="col-lg">
                <label for="">Type</label>
                <ValidationProvider
                  name="Type"
                  v-slot="{ errors }"
                  rules="required"
                >
                  <label class="small text-danger">{{ errors[0] }}</label>
                  <select
                    :class="
                      `form-control form-control-sm ${
                        errors[0] ? 'border border-danger' : ''
                      }`
                    "
                    v-model="newEvent.type"
                  >
                    <option value="BB">BB</option>
                    <option value="Half Board">Half Board</option>
                    <option value="Full Board">Full Board</option>
                  </select>
                </ValidationProvider>
              </div>
            </div>
            <!-- End of Duration & type -->
            <!-- Room control -->
            <div class="row mx-auto">
              <div class="col-lg">
                <label for="">Rooms</label>
                <ValidationProvider
                  name="Duration"
                  v-slot="{ errors }"
                  rules="required"
                >
                  <label class="small text-danger">{{ errors[0] }}</label>
                  <input
                    type="number"
                    :class="
                      `form-control form-control-sm ${
                        errors[0] ? 'border border-danger' : ''
                      }`
                    "
                    v-model="newEvent.rooms"
                    :min="1"
                  />
                </ValidationProvider>
              </div>
              <div class="col-lg">
                <label for="">Room Type</label>
                <ValidationProvider
                  name="Room type"
                  v-slot="{ errors }"
                  rules="required"
                >
                  <label class="small text-danger">{{ errors[0] }}</label>
                  <select
                    :class="
                      `form-control form-control-sm ${
                        errors[0] ? 'border border-danger' : ''
                      }`
                    "
                    v-model="newEvent.room_type"
                  >
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Triple">Triple</option>
                  </select>
                </ValidationProvider>
              </div>
            </div>
            <!-- End of room control -->
            <!-- control -->
            <hr />
            <div class="form-group text-right">
              <button class="btn btn-sm btn-success">
                <span class="fa fa-save"></span>
                <span>Save</span>
              </button>
              <button
                class="btn btn-sm btn-dark"
                type="button"
                @click="closeEventCreateBox"
              >
                <span class="fa fa-times"></span>
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </ValidationObserver>
      </template>
    </modal-fade>
  </div>
</template>

<script>
import DataTableComponent from "../../../../components/DataTableComponent.vue";
import ModalFade from "../../../../components/ModalFade.vue";
import NoDataToShow from "../../../../components/NoDataToShow.vue";
import PageTitleComponent from "../../../../components/PageTitleComponent.vue";
import { httpCall } from "../../../../helpers/http-service";
export default {
  components: {
    PageTitleComponent,
    NoDataToShow,
    ModalFade,
    DataTableComponent
  },
  mounted() {
    this.fetchAllEvents();
  },
  beforeRouteEnter(to,from, next) {
    let user =JSON.parse(document.getElementById('user').value);
    if(!['admin', 'accountant'].includes(user.role)) {
      return next("/customers-requests")
    }
    return next();
  },
  computed: {
    cols() {
      return [
        {
          title: "Name",
          name: "content.name"
        },
        {
          title: "Hotel",
          name: "content.hotel"
        },
        {
          title: "Duration",
          name: "content.duration"
        },
        {
          title: "Type",
          name: "content.type"
        },
        {
          title: "Rooms",
          name: "content.rooms"
        },
        {
          title: "Rooms Type",
          name: "content.room_type"
        }
      ];
    },
    buttons() {
      return [
        {
          text: `<i class="fa fa-trash"></i> Delete`,
          action: (e, dt) => {
            let row = dt.rows({ selected: true }).data()[0];
            if (!row) {
              this.$swal({
                title: "Warning",
                toast: true,
                text: "You must select event",
                icon: "warning"
              }).then(res => {
                if (res.isConfirmed) {
                  console.log("must deleted");
                }
              });
            }
            this.$swal({
              title: "Warning",
              text: "You are going to delete this event",
              icon: "warning",
              showCancelButton: true,
              cancelButtonText: `<i class="fa fa-times"></i> Cancel`,
              confirmButtonText: `<i class="fa fa-trash"></i> Delete`,
              confirmButtonColor: 'red'
            }).then(res => {
              if (res.isConfirmed) {
                this.deleteEvent(row.id)
              }
            });
          }
        }
      ];
    }
  },
  data: () => ({
    events: [],
    fetched: false,
    newEvent: {
      name: null,
      hotel: null,
      duration: null,
      type: "Full Board",
      rooms: 1,
      room_type: "Double"
    },
    showEventCreateBox: false
  }),
  methods: {
    /**
     * fetch all events
     */
    fetchAllEvents() {
      this.events = [];
      this.fetched = false;
      return httpCall
        .get("v1/request-events")
        .then(({ data }) => {
          data.data.forEach(item => {
            item.content = JSON.parse(item.content);
          });
          this.events = data.data;
          this.fetched = true;
        })
        .catch(err => console.log(err));
    },
    /**
     * save event
     *
     */
    saveEvent() {
      console.log(this.newEvent);
      httpCall
        .post("v1/request-events", this.newEvent)
        .then(({ data }) => {
          if (data.code === 200) {
            this.$swal({
              title: "Success",
              text: data.message,
              icon: "success"
            });
            this.newEvent = {
              name: null,
              hotel: null,
              duration: null,
              type: "Full Board",
              rooms: 1,
              room_type: "Double"
            };
            this.closeEventCreateBox();
            this.fetchAllEvents();
          }
        })
        .catch(err => console.log(err));
    },
    openEventCreateBox() {
      this.showEventCreateBox = true;
    },
    closeEventCreateBox() {
      this.showEventCreateBox = false;
    },
    deleteEvent(id) {
      httpCall.post('v1/request-events/'+id, {_method: 'DELETE'})
      .then(({data}) => {
        if (data.code === 200) {
            this.$swal({
              title: "Success",
              text: data.message,
              icon: "success"
            });
            this.fetchAllEvents();
          }
      }).catch(err => console.log(err))
    }
  }
};
</script>

<style></style>

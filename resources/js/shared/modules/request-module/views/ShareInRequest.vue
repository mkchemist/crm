<template>
  <div class="bg-white">
    <div class="px-0 shadow rounded pb-5">
      <page-title-component :title="`Sharing In Request`" :icon="`fa-share`" />
      <div class="p-2">
        <p class="text-muted">
          You trying to share in request with serial
          <b>{{ getRequestSerial() }}</b>
        </p>
        <div class="p-2" v-if="data.length">
          <request-card :data="data" :onSave="onSaveRequest" mode="share" />
        </div>
        <div v-else-if="isRequestFetched"></div>
        <loader-component v-else></loader-component>
      </div>
    </div>
  </div>
</template>

<script>
import PageTitleComponent from "../../../../components/PageTitleComponent.vue";
import { httpCall } from "../../../../helpers/http-service";
import RequestCard from "../components/RequestCard.vue";
export default {
  components: {
    PageTitleComponent,
    RequestCard
  },
  mounted() {
    if (this.getRequestSerial()) {
      this.fetchRequest();
    }
  },
  computed: {},
  data: () => ({
    isRequestFetched: false,
    data: []
  }),
  methods: {
    getRequestSerial() {
      return this.$route.query.serial;
    },
    fetchRequest() {
      let serial = this.getRequestSerial();
      httpCall
        .get("v1/requests/" + serial)
        .then(({ data }) => {
          /* this.request = this.formattingRequest(data.data); */
          this.data = data.data;
        })
        .catch(err => console.log(err));
    },
    prepareRequest(data) {
      let request = {};
      request['serial'] = data.serial;
      request['owner_user_id'] = data.user_id;
      request['sharer_user_id'] = this.$store.state.CustomerRequestModule.UserModule.user.id;
      request['products'] = JSON.stringify(data.add_products);
      request['customers'] = JSON.stringify(data.add_customers);
      request['added_cost'] = data.added_cost;
      return request;
    },
    onSaveRequest(data) {
      if (!data.add_customers.length) {
        this.$swal({
          title: "Warning",
          text: "You didn't select any customer to share in ",
          icon: "warning",
          toast: true
        });

        return;
      }
      if (!data.add_products.length) {
        this.$swal({
          title: "Warning",
          text: "You didn't add any product to your request",
          icon: "warning",
          toast: true
        });
        return;
      }
      let request = this.prepareRequest(data);
      return httpCall.post('v1/requests/sharing/'+request.serial, request)
      .then(({data}) => {
        if(data.code === 200) {
          this.$swal({
            title: "Success",
            text: "Shared success",
            icon:"success",
            showCancelButton:true,
            confirmButtonText: `<i class="fa fa-chevron-left"></i> back to shared list`,
            cancelButtonText: `<i class="fa fa-book-reader"></i> go to requests list`
          }).then(res => {
            if(res.isConfirmed) {
              this.$router.push("/customers-requests/shared/list")
            }
            if(res.isDenied) {
              this.$router.push("/customers-requests/list");
            }
          })
        } else if(data.code === 409) {
          this.$swal({
            title:"Warning",
            text: data.message,
            icon: "warning",
            toast: true
          })
        } else {
          this.$swal({
            title: "Error",
            text: "Something wrong happen",
            icon: "error",
            toast: true
          })
          return;
        }
      }).catch(err => console.log(err))
    }
  }
};
</script>

<style></style>

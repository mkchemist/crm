<template>
  <div>
    <div class="px-0 shadow pb-3 rounded">
      <p class="alert alert-success">
        View Customer {{ customer ?customer.name : null }} card
      </p>
      <div class="p-2">
        <!-- ctrl buttons section  -->
        <div v-if="customer">
          <div class="text-right p-2 m-1">
            <router-link to="/customers" class="btn btn-sm btn-dark">
              <span><i class="fa fa-chevron-circle-left"></i></span>
              <span>back</span>
            </router-link>
            <router-link :to="`/customers/edit/${customer.id}`" class="btn btn-sm btn-warning">
              <span><i class="fa fa-edit"></i></span>
              <span>edit</span>
            </router-link>
          </div>
          <!--  Customer info section --->
          <div class="border m-1 p-2 rounded">
            <p class="lead">Customer info.</p>
            <hr>
            <div class="row mx-auto">
              <div class="col-lg">
                <p>Name: <b class="text-primary">{{ customer.name }}</b></p>
                <p>Specialty: <b class="text-primary">{{ customer.specialty }}</b></p>
                <p>Title: <b class="text-primary">{{ customer.title }}</b></p>
                <p>Parameter: <b class="text-primary">{{ customer.parameter}}</b></p>
                <p>Frequency: <b class="text-primary">{{ customer.current_freq}}</b></p>
              </div>
              <div class="col-lg">
                <p>Address: <b class="text-primary">{{ customer.address ? customer.address : "Null" }}</b></p>
                <p>Brick: <b class="text-primary">{{ customer.brick}}</b></p>
                <p>Area: <b class="text-primary">{{ customer.area}}</b></p>
                <p>Phone: <b class="text-primary">{{ customer.phone ? customer.phone :"Null"}}</b></p>
              </div>
            </div>
          </div>

        </div>

        <LoaderComponent v-else />
      </div>
    </div>
  </div>
</template>

<script>
import { httpCall } from '../../helpers/http-service'
export default {
  created() {
    this.getCustomer();
  },
  methods: {
    getCustomer() {
      let id = this.$route.params.id;
      httpCall.get('rep/v1/customers/'+id)
      .then(({data}) => {
        if(data.code === 400) {
          data.data.errors.forEach((err) => {
            this.$toasted.show(err, {
              icon: 'exclamation',
              duration: 10000
            })
          });
          return;
        }
        if(data.code === 301) {
          this.$toasted.show(data.data.errors, {
            icon: 'exclamation',
            durtation: 10000
          });
          return;
        }
          this.customer = data.data;
      });
    }
  },
  data: () => ({
    customer: null
  })
}
</script>

<style>

</style>

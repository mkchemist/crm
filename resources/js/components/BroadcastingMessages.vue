<template>
  <div class="px-0 border rounded">
    <p class="bg-success text-light p-2">
      <span class="fa fa-bullhorn"></span>
      <span class="font-weight-bold">Broadcasting messages</span>
    </p>
    <div class="p-2" style="height:150px;overflow:auto">
      <div class="" v-if="messages.length">
        <div v-for="message in messages" :key="message.id" :class="`alert ${message.type}`">
          <p class="alert-heading">
            <span class="lead">{{ message.title }}</span>
            <small class="text-muted float-right">{{ message.created_at }}</small>
          </p>
          <small><span v-html="message.body"></span></small>
        </div>
      </div>
      <div v-else-if="isFetched">
        <no-data-to-show title="No new messages" />
      </div>
      <loader-component v-else></loader-component>
    </div>
  </div>
</template>

<script>
import { httpCall } from '../helpers/http-service'
import NoDataToShow from './NoDataToShow.vue';
export default {
  components: { NoDataToShow },
  mounted() {
    this.getMessages();
  },
  data: () => ({
    messages: [],
    isFetched: false
  }),
  methods: {
    getMessages() {
      this.messages = [];
      this.isFetched = false;
      return httpCall.get('broadcasting')
      .then(({data}) => {
        this.messages = data.data;
        this.isFetched = true;
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style>

</style>

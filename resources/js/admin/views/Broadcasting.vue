<template>
  <div class="px-0 shadow rounded mt-2 mb-5 pb-5">
    <p class="alert alert-success">
      <span class="fa fa-bullhorn"></span>
      <span class="font-weight-bold">Message Broadcasting</span>
    </p>
    <div class="p-2">
      <new-broadcast-message />
    </div>
    <div class="p-2 my-2 pb-5">
      <div class="p-2" v-if="messages.length" >
        <table-component :data="messages" :heads="tableHeaders" headClass="bg-success text-light" :unselectable="true" orderBy="Date,asc">
          <template v-slot:head>
            <th>Actions</th>
          </template>
          <template v-slot:body="{item}">
            <td>
              <button class="btn btn-sm btn-danger"  type="button" @click="deleteMessage(item.id)">
                <span class="fa fa-times"></span>
              </button>
            </td>
          </template>
        </table-component>
      </div>
      <div class="p-2" v-else-if="isFetched">
        <no-data-to-show title="No messages to show" />
      </div>
      <loader-component v-else></loader-component>
    </div>
  </div>
</template>

<script>
import NewBroadcastMessage from '../components/NewBroadcastMessage.vue';
import TableComponent from '../../components/TableComponent';
import NoDataToShow from '../../components/NoDataToShow.vue';
import { httpCall } from '../../helpers/http-service';
export default {
  mounted(){
    this.$store.dispatch('getAllBroadcastingMessages')
  },
  computed: {
    messages() {
      return this.$store.getters.broadcastMessages;
    },
    isFetched() {
      return this.$store.getters.isBroadcastMessagesFetched;
    }
  },
  components: {
    NewBroadcastMessage,
    TableComponent,
    NoDataToShow
  },
  data: () => ({
    tableHeaders: [
      {
        title: 'Sender',
        name: 'user.name'
      },
      {
        title: 'Title',
        name: 'title'
      },
      {
        title: 'Message Content',
        name: 'body'
      },
      {
        title: 'Date',
        name:'created_at'
      }
    ]
  }),
  methods: {
    /**
     * delete broadcasting message
     *
     * @param {int} id [message id]
     */
    deleteMessage(id) {
      let quez = confirm('Do you want to remove this message');
      if(quez) {
        let request = {
          _method: 'DELETE'
        }
        httpCall.post('admin/v1/broadcasting/'+id, request)
        .then(({data}) => {
          this.handleResponse(data ,data => {
            this.$store.dispatch('getAllBroadcastingMessages', true);
          });
        }).catch(err => {
          console.log(err)
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>


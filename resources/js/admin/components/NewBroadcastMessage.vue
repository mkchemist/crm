<template>
  <div class="p-2 border rounded">
    <ValidationObserver v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(sendMessage)">
        <!-- Message info -->
        <div class="row mx-auto">
          <!-- Message title -->
          <div class="form-group col-lg-8">
            <label for="" class="text-muted">Title</label>
            <ValidationProvider
              name="title"
              rules="required"
              v-slot="{ errors }"
            >
              <span v-if="errors[0]" class="text-danger small">{{
                errors[0]
              }}</span>
              <input
                type="text"
                :class="
                  `form-control form-control-sm ${
                    errors[0] ? 'border border-danger' : ''
                  }`
                "
                placeholder="message title"
                name="title"
                id="title"
                v-model="message.title"
              />
            </ValidationProvider>
          </div>
          <!-- Message type -->
          <div class="form-group col-lg-4">
            <label for="" class="text-muted">Type</label>
            <ValidationProvider
              name="type"
              rules="required"
              v-slot="{ errors }"
            >
              <span v-if="errors[0]" class="text-danger small">{{
                errors[0]
              }}</span>
              <select
                name="type"
                id="type"
                :class="
                  `form-control form-control-sm ${
                    errors[0] ? 'border border-danger' : ''
                  }`
                "
                v-model="message.type"
              >
                <option value="alert-primary">Primary</option>
                <option value="alert-success">Success</option>
                <option value="alert-warning">Warning</option>
                <option value="alert-danger">Danger</option>
              </select>
            </ValidationProvider>
          </div>
        </div>
        <!-- Message body -->
        <div class="form-group px-3">
          <label for="" class="text-muted">Message :</label>
          <ValidationProvider name="body" rules="required" v-slot="{ errors }">
            <span v-if="errors[0]" class="text-danger small">{{
              errors[0]
            }}</span>
            <textarea
              name="body"
              id="body"
              cols="30"
              rows="6"
              :class="
                `form-control form-control-sm ${
                  errors[0] ? 'border border-danger' : ''
                }`
              "
              placeholder="write a message to broadcast"
              v-model="message.body"
            ></textarea>
          </ValidationProvider>
        </div>
        <!-- Control -->
        <div class="form-group text-right">
          <button type="reset" class="btn btn-secondary btn-sm">
            <span class="fa fa-redo"></span>
            <span>Reset</span>
          </button>
          <button class="btn btn-primary btn-sm" type="submit">
            <span class="fa fa-paper-plane"></span>
            <span>Broadcast</span>
          </button>
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import { httpCall } from '../../helpers/http-service';
export default {
  data: () => ({
    message: {
      title: "",
      type: "",
      body: ""
    }
  }),
  methods: {
    sendMessage() {
      httpCall.post('admin/v1/broadcasting', this.message)
      .then(({data}) => {
        this.handleResponse(data ,data => {
          this.handleResponse(data, data => {
            this.$store.dispatch('getAllBroadcastingMessages', true);
          })
        });
      }).catch(err => {
        console.log(err)
      })
    }
  }
};
</script>

<style></style>

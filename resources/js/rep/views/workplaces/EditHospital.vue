<template>
  <div>
    <div class="px-0 shadow pb-3">
      <p class="alert alert-warning">
        <span><i class="fa fa-edit"></i></span>
        <span class="font-weight-bold"
          >Edit Hospital {{ hospital ? hospital.name : null }} card</span
        >
      </p>
      <div class="my-2 p-2">
        <div v-if="hospital">
          <ValidationObserver v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(onSubmit)">
              <!-- Hospital info -->
              <div class="row mx-auto">
                <div class="col-lg">
                  <label for="name" class="text-muted">Name</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      class="form-control form-control-sm"
                      v-model="hospital.name"
                      readonly
                    />
                </div>

                <div class="col-lg">
                  <label for="name" class="text-muted">Type</label>
                  <ValidationProvider
                    name="type"
                    rules="required"
                    v-slot="{ errors }"
                  >
                    <span class="text-danger small">{{ errors[0] }}</span>
                    <select
                      name="type"
                      id="type"
                      class="form-control form-control-sm"
                      v-model="hospital.type"
                    >
                      <option
                        v-for="(item, i) in types"
                        :key="i"
                        :value="item"
                        >{{ item }}</option
                      >
                    </select>
                  </ValidationProvider>
                </div>
              </div>

              <!-- hospital location info --->
              <div class="row mx-auto my-2">
                <div class="col-lg">
                  <label for="name" class="text-muted">Address</label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    class="form-control form-control-sm"
                    v-model="hospital.address"
                  />
                </div>

                <div class="col-lg">
                  <label for="name" class="text-muted">Brick</label>
                    <input
                      type="text"
                      name="brick"
                      id="brick"
                      class="form-control form-control-sm"
                      v-model="hospital.brick"
                      disabled
                      readonly
                    />
                </div>
              </div>

              <hr />

              <div class="form-group text-right">
                <router-link to="/workplaces" class="btn btn-sm btn-dark">
                  <span><i class="fa fa-chevron-circle-left"></i></span>
                  <span>back</span>
                </router-link>
                <button class="btn btn-sm btn-success">
                  <span><i class="fa fa-save"></i></span>
                  <span>save</span>
                </button>
              </div>
            </form>
          </ValidationObserver>
        </div>
        <div v-else-if="hospital === null && fetched">
          <p class="text-center lead">Hospital ID is not valid ID</p>
        </div>
        <loader-component v-else />
      </div>
    </div>
  </div>
</template>

<script>
import { httpCall } from "../../../helpers/http-service";
export default {
  data: () => ({
    hospital: null,
    fetched: false
  }),
  created() {
    let id = this.$route.params.id;
    httpCall.get("rep/v1/workplaces/" + id).then(({ data }) => {
      this.fetched = true;
      data.message = "hospital ready";
      this.handleResponse(data, data => {
        this.hospital = data.data;
      })
    });
  },
  methods: {
    /**
     * updating hospital
     *
     */
    onSubmit() {
      let id = this.$route.params.id;
      httpCall.post('rep/v1/workplaces/'+id, {...this.hospital, _method:'PUT'})
      .then(({data}) => {
        data.message = data.data;
        this.handleResponse(data, data => {
          this.$store.dispatch('workplaceGetAll', true).then(() => {
            setTimeout(() => {
              this.$router.push('/workplaces');
            },2000);
          })
        });
      });
    }
  },
  computed: {
    types() {
      return this.$store.getters.hospitalTypes;
    }
  }
};
</script>

<style></style>

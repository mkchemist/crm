<template>
  <div class="page-fade">
    <ValidationObserver v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(onSubmit)">
        <div class="row mx-auto">
          <div class="col-lg">
            <label for="name" class="text-muted">Department</label>
            <ValidationProvider
              name="name"
              rules="required"
              v-slot="{ errors }"
            >
              <span class="text-danger small">{{ errors[0] }}</span>
              <select
                name="name"
                id="name"
                class="form-control form-control-sm"
                v-model="department.name"
              >
                <option value="">Select Department</option>
                <option v-for="(type, i) in types" :key="i" :value="type">{{
                  type
                }}</option>
              </select>
            </ValidationProvider>
          </div>
          <div class="col-lg">
            <label for="name" class="text-muted">Department Head</label>
            <ValidationProvider name="head" rules="alpha" v-slot="{ errors }">
              <span class="text-danger small">{{
                errors[0] ? "Must be alphabetic only" : null
              }}</span>
              <input
                type="text"
                id="head"
                name="head"
                class="form-control form-control-sm"
                v-model="department.head"
                placeholder="Enter name of department head"
              />
            </ValidationProvider>
          </div>
        </div>

        <div class="text-right p-2">
          <button
            class="btn btn-sm btn-warning"
            type="button"
            @click="cancelAdding"
          >
            <span><i class="fa fa-times"></i></span>
            <span>cancel</span>
          </button>
          <button class="btn btn-sm btn-success">
            <span><i class="fa fa-save"></i></span>
            <span>save</span>
          </button>
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
export default {
  methods: {
    onSubmit() {
      this.$emit("onAdd", this.department);
      this.$emit('onCancel');
    },
    cancelAdding() {
      this.$emit("onCancel");
    }
  },
  data: () => ({
    department: {
      name: "",
      head: ""
    }
  }),
  computed: {
    types() {
      return this.$store.getters.specialty;
    }
  },
  props: ["onAdd", "onCancel"]
};
</script>

<style></style>

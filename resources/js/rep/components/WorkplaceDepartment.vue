<template>
  <div class="col-12">
    <table class="table table-striped w-100">
      <thead>
        <tr>
          <th>Name</th>
          <th>Department head</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="depart in data" :key="depart.id">
          <td>{{ depart.name }}</td>
          <td>{{ depart.head }}</td>
          <td>
            <button class="btn btn-warning btn-sm" @click="markSelected(depart)">
              <span><i class="fa fa-edit"></i></span>
            </button>
            <button class="btn btn-danger btn-sm">
              <span><i class="fa fa-trash"></i></span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="modal fade" id="edit_department_modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-success text-light">
            <span class="mx-1"><i class="fa fa-edit"></i></span>
            <span>Edit Department {{ selected ? selected.name : null }}</span>
            <button class="close" data-dismiss="modal">&times;</button>
          </div>
          <div class="modal-body" v-if="selected">
            <div>
              <label for="head" class="text-muted">Department head</label>
              <input type="text" class="form-control form-control-sm" id="head" name="head" v-model="selected.head">
            </div>
            <hr>
            <div class="text-right">
              <button class="btn btn-dark btn-sm" data-dismiss="modal">
                <span><i class="fa fa-times"></i></span>
                <span>close</span>
              </button>
              <button class="btn btn-success btn-sm" @click="editDepartment">
                <span><i class="fa fa-save"></i></span>
                <span>save</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['data', 'onEdit'],
  methods: {
    markSelected(depart) {
      this.selected = depart;
      $('#edit_department_modal').modal('show')
    },
    editDepartment() {
      this.$emit('onEdit', this.selected);
    }
  },
  data: () => ({
    selected: null
  })
}
</script>

<style>

</style>

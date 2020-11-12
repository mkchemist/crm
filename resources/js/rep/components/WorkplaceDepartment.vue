<template>
  <div class="col-12">
    <table class="table table-striped w-100 table-responsive-sm table-sm small">
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
          <td>{{ depart.head ? depart.head : '--------' }}</td>
          <td>
            <button
              class="btn btn-warning btn-sm"
              @click="markSelected(depart)"
            >
              <span><i class="fa fa-edit"></i></span>
            </button>
            <button class="btn btn-danger btn-sm" @click="deleteDepartment(depart.id)">
              <span><i class="fa fa-trash"></i></span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <modal-fade
      :show="show_edit_modal"
      :data="selected"
      @onClose="() => (show_edit_modal = false)"
      :centered="true"
    >
      <template v-slot:header v-if="selected">
        Edit {{ selected.name }}
      </template>
      <template v-slot:body v-if="selected">
        <div>
          <label for="head" class="text-muted">Department head</label>
          <input
            type="text"
            class="form-control form-control-sm"
            id="head"
            name="head"
            v-model="selected.head"
          />
        </div>
        <hr />
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
      </template>
    </modal-fade>
  </div>
</template>

<script>
import ModalFade from "../../components/ModalFade";

export default {
  props: ["data", "onEdit"],
  methods: {
    markSelected(depart) {
      this.selected = depart;
      this.show_edit_modal = true;
    },
    editDepartment() {
      this.$emit("onEdit", this.selected);
      this.show_edit_modal = false;
    },
    deleteDepartment(id) {
      this.$emit('onDelete', id)
    }
  },
  data: () => ({
    selected: null,
    show_edit_modal: false
  }),
  components: {
    ModalFade
  }
};
</script>

<style></style>

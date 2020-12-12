<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-success">
      <span><i class="fa fa-hourglass-start"></i></span>
      <span class="font-weight-bold">Cycle Setting</span>
    </p>
    <div class="p-2">
      <!-- new cycle button -->
      <div class="p-2 text-right">
        <button class="btn btn-sm btn-primary" @click="showNewCycleModal">
          <span class="fa fa-plus-circle"></span>
          <span>New cycle</span>
        </button>
      </div>
      <!-- Cycles table -->
      <div class="p-2">
        <div v-if="cycles.length" class="p-2">
          <table class="table table-sm small table-bordered">
            <thead class="bg-success text-light">
              <tr>
                <th>Cycle Name</th>
                <th>Start</th>
                <th>End</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(cycle, i) in cycles" :key="i">
                <td>{{ cycle.name }}</td>
                <td>{{ cycle.start }}</td>
                <td>{{ cycle.end }}</td>
                <td class="text-center">
                  <button type="button" class="btn btn-sm btn-warning" @click="selectCycleForEdit(i)">
                    <span class="fa fa-edit"></span>
                  </button>
                  <button type="button" class="btn btn-sm btn-danger" @click="deleteCycle(i)">
                    <span class="fa fa-trash"></span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <no-data-to-show title="No registered cycles found" v-else-if="isCyclesFetched"/>
        <loader-component v-else></loader-component>
      </div>

      <!-- add new cycle modal -->
      <modal-fade :show="activeNewCycleModal" id="new_cycle_modal" @onClose="closeNewCycleModal" headerStyle="bg-primary text-light">
        <template v-slot:header>
          <span class="lead">Add new cycle</span>
        </template>
        <template v-slot:body>
          <div class="p-2">
            <div class="form-group">
              <label for="" class="text-muted small">Name</label>
              <input type="text" class="form-control form-control-sm" placeholder="Enter cycle name" v-model="newCycle.name">
            </div>
            <div class="form-group">
              <label for="" class="text-muted small">Start</label>
              <input type="date" class="form-control form-control-sm"  v-model="newCycle.start">
            </div>
            <div class="form-group">
              <label for="" class="text-muted small">End</label>
              <input type="date" class="form-control form-control-sm"  v-model="newCycle.end">
            </div>
            <div class="p-2 text-right">
              <button type="button" class="btn btn-sm btn-secondary" @click="closeNewCycleModal">
                <span class="fa fa-times"></span>
                <span>cancel</span>
              </button>
              <button type="button" class="btn btn-sm btn-primary" @click="saveNewCycle">
                <span class="fa fa-save"></span>
                <span>save</span>
              </button>
            </div>
          </div>
        </template>
      </modal-fade>

      <modal-fade :show="activeEditCycleModal" :headerStyle="`bg-dark text-light`" id="edit_cycle_modal" @onClose="closeEditCycleModal">
        <template v-slot:header>
          <span v-if="editCycle.name">Edit cycle {{ editCycle.name }}</span>
        </template>
        <template v-slot:body>
          <div class="p-2">
            <div class="form-group">
              <label for="" class="text-muted small">Name</label>
              <input type="text" class="form-control form-control-sm" placeholder="Enter cycle name" v-model="editCycle.name">
            </div>
            <div class="form-group">
              <label for="" class="text-muted small">Start</label>
              <input type="date" class="form-control form-control-sm"  v-model="editCycle.start">
            </div>
            <div class="form-group">
              <label for="" class="text-muted small">End</label>
              <input type="date" class="form-control form-control-sm"  v-model="editCycle.end">
            </div>
            <div class="p-2 text-right">
              <button type="button" class="btn btn-sm btn-secondary" @click="closeEditCycleModal">
                <span class="fa fa-times"></span>
                <span>cancel</span>
              </button>
              <button type="button" class="btn btn-sm btn-primary" @click="saveEditCycle">
                <span class="fa fa-save"></span>
                <span>save</span>
              </button>
            </div>
          </div>
        </template>
      </modal-fade>

    </div>
  </div>
</template>

<script>
import LoaderComponent from '../../../components/LoaderComponent.vue';
import ModalFade from "../../../components/ModalFade.vue";
import NoDataToShow from "../../../components/NoDataToShow.vue";
import { sortBy } from "../../../helpers/helpers";
import { httpCall } from "../../../helpers/http-service";
export default {
  mounted() {
    this.getAllCycles();
  },
  components: {
    ModalFade,
    LoaderComponent,
    NoDataToShow
  },
  data: () => ({
    cycles: [],
    isCyclesFetched: false,
    activeNewCycleModal: false,
    activeEditCycleModal: false,
    newCycle: {
      name: null,
      start: null,
      end: null
    },
    editCycle: {},
    editCycleIndex: null
  }),
  methods: {
    /**
     * get all cycles
     *
     */
    getAllCycles() {
      this.cycles = [];
      this.isCyclesFetched = false;
      return httpCall
        .get("admin/v1/setting/cycles")
        .then(({ data }) => {
          try {
            if (data.data instanceof Array === false) {
              throw new TypeError("Cycle must be a valid array");
            }
            this.cycles = sortBy(data.data, "name");
            this.isCyclesFetched = true;
          } catch (e) {
            console.log(e);
            this.$toasted.error("Something went wrong");
          }
        })
        .catch(err => {
          console.log(err);
          this.$toasted.error(err);
        });
    },
    /**
     * open new cycle modal
     */
    showNewCycleModal() {
      this.activeNewCycleModal = true;
    },
    /**
     * close new cycle modal
     */
    closeNewCycleModal() {
      this.activeNewCycleModal = false;
      this.newCycle = {
        name: null,
        start: null,
        end: null
      };
    },
    /**
     * open edit cycle modal
     */
    showEditCycleModal() {
      this.activeEditCycleModal = true;
    },
    /**
     * close edit cycle modal
     */
    closeEditCycleModal() {
      this.activeEditCycleModal = false;
      this.editCycle = {};
      this.editCycleIndex = null;
    },
    /**
     * select cycle for edit
     *
     * @param {int} i [cycle index]
     */
    selectCycleForEdit(i) {
      this.editCycle = this.cycles[i];
      this.editCycleIndex = i;
      this.activeEditCycleModal = true;
    },
    /**
     * save new cycle
     *
     */
    saveNewCycle() {
      let cycles = this.cycles;
      cycles.push(this.newCycle);
      this.sendRequest()
      .then(() => {
         this.newCycle = {
            name: null,
            start: null,
            end: null
          }
          this.activeNewCycleModal = false;
      })
    },
    deleteCycle(i) {
      this.cycles.splice(i, 1);
      this.sendRequest();
    },
    saveEditCycle() {
      this.cycles[this.editCycleIndex] = this.editCycle;
      this.sendRequest()
      .then(() => {
        this.editCycle = {};
        this.editCycleIndex = null;
        this.activeEditCycleModal = false;
      })
    },
    sendRequest() {
      let request = {
        cycles: JSON.stringify(this.cycles)
      }
      return httpCall.post('admin/v1/setting/cycles', request)
      .then(({data}) => {
        this.handleResponse(data, data => {
          this.getAllCycles();
        })
      }).catch(err => {
        console.log(err);
        this.$toasted.error(err, {
          icon: 'exclamation'
        })
      });
    }
  }
};
</script>

<style></style>

<template>
  <div>
    <!-- Visit Info -->
    <div class="p-2 bg-info text-light">
      <p class="mb-0 lead">Visit Info.</p>
    </div>
    <table class="table table-sm table-striped small">
      <tbody>
        <tr class="d-none" style="background-color:royalblue;color:white">
          <td colspan="2">Coach Report Info.</td>
        </tr>
        <tr>
          <td>
            <span
              >Date:
              <span
                class="font-weight-bold text-primary export-highlight"
                v-if="!editMode"
                >{{ report.visit_date }}</span
              >
              <input type="date" v-model="report.visit_date" v-if="editMode" />
            </span>
          </td>
          <td>
            <span
              >Customer:
              <span class="font-weight-bold text-primary export-highlight">{{
                report.customer.name
              }}</span>
            </span>
          </td>
        </tr>
        <tr>
          <td>
            <span
              >Rep:
              <span class="font-weight-bold text-primary export-highlight">{{
                report.rep.name
              }}</span>
            </span>
          </td>
          <td>
            <span
              >Specialty:
              <span class="font-weight-bold text-primary export-highlight">{{
                report.customer.specialty
              }}</span>
            </span>
          </td>
        </tr>
        <tr>
          <td>
            <span
              >Coach:
              <span class="font-weight-bold text-primary export-highlight">{{
                report.coach.name
              }}</span>
            </span>
          </td>
          <td>
            <span
              >Parameter:
              <span class="font-weight-bold text-primary export-highlight">{{
                report.customer.params && report.customer.params.length
                  ? report.customer.params[0].current
                  : "NN"
              }}</span>
            </span>
          </td>
        </tr>
        <tr>
          <td>
            <span
              >Brick:
              <span class="font-weight-bold text-primary export-highlight">{{
                report.customer.brick
              }}</span>
            </span>
          </td>
          <td>
            <span
              >Frequency:
              <span class="font-weight-bold text-primary export-highlight">{{
                report.customer.frequency && report.customer.frequency.length
                  ? report.customer.frequency[0].current
                  : 0
              }}</span>
            </span>
          </td>
        </tr>
        <tr>
          <td>
            <span
              >Area:
              <span class="font-weight-bold text-primary export-highlight">{{
                report.customer.area
              }}</span>
            </span>
          </td>
          <td>
            <span
              >Adress:
              <span class="font-weight-bold text-primary export-highlight">{{
                report.customer.address
              }}</span>
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Coach Report -->
    <div class="p-2 my-2 border rounded" v-if="report.data">
      <p class="mb-0 lead">Coach Evaluation</p>
      <table class="table table-bordered table-sm small col-12 export-table">
        <thead class="bg-success text-light">
          <tr>
            <th>Item</th>
            <th>Mark</th>
          </tr>
        </thead>
        <tbody v-for="(row, key) in report.data" :key="`report_${key}_data`">
          <tr class="export-table-headers">
            <td colspan="2" class="bg-dark text-light">{{ key }}</td>
          </tr>
          <tr
            v-for="(degree, name) in row"
            :key="`report_evaluation_${degree}_${name}`"
          >
            <td>{{ name }}</td>
            <td>
              <span v-if="!editMode">{{ degree }}</span>
              <select name="" id="" v-model="report.data[key][name]" v-else>
                <template v-if="key === 'Customer Parameter'">
                  <option value="HH">HH</option>
                  <option value="HM">HM</option>
                  <option value="HL">HL</option>
                  <option value="MH">MH</option>
                  <option value="MM">MM</option>
                  <option value="ML">ML</option>
                  <option value="LH">LH</option>
                  <option value="LM">LM</option>
                  <option value="LL">LL</option>
                  <option value="NN">NN</option>
                </template>
                <template v-else>
                  <option value="">N</option>
                  <option value="S">S</option>
                  <option value="U">U</option>
                </template>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      v-else
      class="d-flex align-items-center justify-content-center"
      style="height:200px"
    >
      <no-data-to-show :title="`Coach Report not finished yet`" />
    </div>
  </div>
</template>

<script>
import NoDataToShow from "./NoDataToShow.vue";
export default {
  components: { NoDataToShow },
  props: {
    report: {
      type: Object,
      required: true
    },
    editMode: {
      type: Boolean,
      default: () => false
    }
  }
};
</script>

<style></style>

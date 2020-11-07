<template>
  <div class="px-0 shadow">
    <p class="alert alert-success">
      <span><i class="fa fa-book-open"></i></span>
      <span class="font-weight-bold">View PM reports</span>
    </p>
    <div class="p-2 row mx-auto">
      <div class="col-lg-3 bg-light p-2 rounded">
        <div class="border p-2 rounded bg-white">
          <label for="">Rep :</label>
          <select name="" id="" class="form-control form-control-sm">
            <option value="">All</option>
            <option  v-for="rep in allReps" :key="rep.id" :value="rep.id">{{ rep.name }}</option>
          </select>
          <div class="text-right p-2">
            <button class="btn btn-sm btn-secondary">select</button>
          </div>
        </div>

        <div class="my-1 border p-2 rounded bg-white">
          <div class="form-group mb-0">
            <label for="">from</label>
            <input type="date" class="form-control form-control-sm">
          </div>
          <div class="form-group mb-0">
            <label for="">to</label>
            <input type="date" class="form-control form-control-sm">
          </div>
          <div class="form-group text-right my-2">
            <button class="btn btn-sm btn-primary">
              <span><i class="fa fa-filter"></i></span>
              <span>filter</span>
            </button>
          </div>
        </div>

        <div class="p-2 my-1 bg-white rounded border">
          <router-link to="" class="btn btn-block btn-sm btn-success">
            <span><i class="fa fa-plus-circle"></i></span>
            <span>Add</span>
          </router-link>
          <router-link to="/reports" class="btn btn-block btn-sm btn-dark">
            <span><i class="fa fa-chevron-circle-left"></i></span>
            <span>back</span>
          </router-link>
        </div>
      </div>
      <div class="col-lg-9">
        <div  v-if="reports.length">
          <table-component :heads="heads" :data="reports"  headClass="bg-success text-light" :unselectable="true">
            <template v-slot:head>
              <th>Products</th>
            </template>
            <template v-slot:body="{item}">
              <td>
                <ul v-for="(product, i) in JSON.parse(item.products)" :key="`product_${i}`" class="nav border-bottom">
                  <li v-for="(val, key) in product" :key="`product_${i}_${key}`" class="nav-item col-12">
                    <span>{{ key }}</span>:
                    <span class="font-weight-bold text-primary">{{ val }}</span>
                  </li>
                </ul>
              </td>
            </template>
          </table-component>
        </div>
        <div v-else-if="isFetched">
          <p class="text-center font-weight-bold">No data to show</p>
        </div>
        <loader-component v-else></loader-component>
      </div>
    </div>
  </div>
</template>

<script>
import TableComponent from '../../../components/TableComponent';
export default {
  created() {
    this.$store.dispatch('getAllReports');
  },
  components: {
    TableComponent
  },
  computed: {
    reports() {
      return this.$store.getters.repReports;
    },
    isFetched() {
      return this.$store.getters.isRepReportsFetched;
    },
    allReps() {
      return this.$store.getters.allReps;
    }
  },
  data: () => ({
    heads: [
      {
        title: 'Rep',
        name: 'user.name',
        style: 'font-weight-bold'
      },
      {
        title: 'Date',
        name: 'visit_date',
        style: 'font-weight-bold'
      },
      {
        title: 'Customer',
        name:'customer.name',
        style: 'font-weight-bold'
      },
      {
        title: 'Specialty',
        name:'customer.specialty',
        style: 'font-weight-bold'
      },
      {
        title: 'Parameter',
        name: 'customer.params.0.current',
        fallback: 'NN',
        style: 'font-weight-bold'
      },
      {
        title: 'Area',
        name: 'customer.area'
      },
      {
        title: 'Brick',
        name: 'customer.brick'
      },
      {
        title: 'Address',
        name: 'customer.address'
      },
      {
        title: 'Comment',
        name: 'comment'
      },
      {
        title: 'Coach',
        name: 'coach.name',
        fallback: '----'
      },
      {
        title: 'Feedback',
        name:'general_feedback'
      }
    ]
  })
}
</script>

<style>

</style>

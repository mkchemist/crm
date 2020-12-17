<template>
  <div class="p-2">
    <div class="p-2" v-if="lines.length">
      <table-component :data="lines" :heads="heads" :headClass="`text-light bg-success`" :notResponsive="true" :orderBy="`Line Name,asc`">
        <template v-slot:head>
          <th>Products</th>
          <th>Specialties</th>
          <th>Action</th>
        </template>
        <template v-slot:body="{item}">
          <td>
            <ul class="nav">
              <li v-for="(val,key) in item.products" :key="`product_${key}`"  class="nav-item col-12">{{ val }}</li>
            </ul>
          </td>
          <td>
            <ul class="nav">
              <li v-for="(val,key) in item.specialties" :key="`specialty_${key}`"  class="nav-item col-12">{{ val }}</li>
            </ul>
          </td>
          <td>
            <button class="btn btn-sm btn-warning" @click="editLine(item)">
              <span class="fa fa-edit"></span>
            </button>
            <button class="btn btn-sm btn-danger" @click="deleteLine(item)">
              <span class="fa fa-trash"></span>
            </button>
          </td>
        </template>
      </table-component>
    </div>
    <div class="p-2" v-else-if="isLinesFetched">
      <no-data-to-show title="No lines found" />
    </div>
    <loader-component v-else></loader-component>
  </div>
</template>

<script>
import NoDataToShow from '../../../../components/NoDataToShow.vue'
import TableComponent from '../../../../components/TableComponent.vue'
import { httpCall } from '../../../../helpers/http-service'
export default {
  components: { NoDataToShow, TableComponent },
  computed: {
    lines() {return this.$store.getters.allLines},
    isLinesFetched(){return this.$store.getters.isLinesFetched}
  },
  data: () => ({
    heads: [
      {
        title: 'Line name',
        name: 'name'
      },
      {
        title : 'Description',
        name: 'desc'
      }
    ]
  }),
  methods: {
    editLine(line) {
      let index = this.lines.indexOf(line);
      this.$router.push(`/setting/lines/${index}/edit`);

    },
    deleteLine(line) {
      let index =this.lines.indexOf(line);
      httpCall.post('admin/v1/setting/lines/'+index, {_method:'DELETE'})
      .then(({data}) => {
        this.handleResponse(data, data => {
          this.$store.dispatch('getAllLines', true);
        })
      }).catch(err => {
        console.log(err)
      })

    }
  }
}
</script>

<style>

</style>

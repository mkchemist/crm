<template>
  <div class="p-2">
    <div class="p-2" v-if="lines.length">
      <table-component :data="lines" :heads="heads" :headClass="`skin-table`" :orderBy="`Line Name,asc`" :unselectable="true" :responsive="true">
        <template v-slot:head>
          <th>Products</th>
          <th>Specialties</th>
          <th>Action</th>
        </template>
        <template v-slot:body="{item}">
          <td>
            <div v-for="(val,key) in item.products" :key="`product_${key}`" class="border rounded p-2 my-1">
              <p class="font-weight-bold border-bottom">{{ val.name }}</p>
              <p class="font-weight-bold text-danger border-bottom" v-if="val.competitors.length">Competitors</p>
              <div class="row mx-auto justify-content-between">
                <span  v-for="(competitor, index) in val.competitors" :key="`product_${val.name}_competitor_${index}`" class="col-lg">{{ competitor }}</span>
              </div>
            </div>
            <!-- <ul class="nav p-0 m-0">
              <li v-for="(val,key) in item.products" :key="`product_${key}`"  class="nav-item col-12  border rounded my-1">
                <span class="font-weight-bold">{{ val.name }}</span>
                <br>
                <span class="text-danger font-weight-bold">Competitors: </span>
                <ul v-if="val.competitors.length">
                  <li v-for="(competitor, index) in val.competitors" :key="`product_${val.name}_competitor_${index}`">
                    <span>{{ competitor }}</span>
                  </li>
                </ul>
                <span class="text-muted" v-else>Not registered</span>
              </li>
            </ul> -->
          </td>
          <td>
            <ul class="nav p-0 m-0" v-if="item.specialties.length">
              <li v-for="(val,key) in item.specialties" :key="`specialty_${key}`"  class="nav-item col-12 p-0 m-0">{{ val }}</li>
            </ul>
            <span v-else>No assignment</span>
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

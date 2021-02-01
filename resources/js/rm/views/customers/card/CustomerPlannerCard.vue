<template>
  <div>
    <div class="p-2">
      <h2 class="text-muted">Planner</h2>
      <div class="p-2">
        <data-table-component :cols="cols" :data="$attrs.data.planner"/>
      </div>
    </div>
  </div>
</template>

<script>
import DataTableComponent from '../../../../components/DataTableComponent.vue'
export default {
  components: {
    DataTableComponent,

  },
  computed:{
    dm() {
      return this.$store.getters.allDm
    },
    areaManager() {
      return this.$store.getters.allAreaManagers;
    },
    cols() {
      return [
      {
        title: 'Date',
        name: 'plan_date'
      },
      {
        title: 'Rep',
        name: 'user.name'
      },
      {
        title: 'Line',
        name: (row) => {
          return JSON.parse(row.user.line).join(" | ")
        }
      },
      {
        title: 'District Manager',
        name: (row) => {
          let user = row.user;
          let relations = JSON.parse(user.user_relations);
          let dm = relations.dm[0];
          let manager = "-----";
          this.dm.map(item => {
            if(item.id === dm) {
              manager = item.name
            }
          })
          return manager
        }
      },
      {
        title : 'Area Manager',
        name: (row) => {
          let user = row.user;
          let relations = JSON.parse(user.user_relations);
          let areaManager = relations.am[0];
          let manager = "-----";
          this.areaManager.map(item => {
            if(item.id === areaManager) {
              manager = item.name
            }
          })
          return manager
        }
      }
  ]
    }
  },
  data: () => ({

  }),
}
</script>

<style></style>

<template>
  <div>
    <div class="p-2">
      <h2 class="text-muted">Reports</h2>
      <div class="p-2">
        <data-table-component :cols="cols" :data="reports" />
      </div>
    </div>
  </div>
</template>

<script>
import DataTableComponent from "../../../../components/DataTableComponent.vue";
export default {
  components: {
    DataTableComponent
  },
  computed: {
    dm() {
      return this.$store.getters.allDm;
    },
    areaManager() {
      return this.$store.getters.allAreaManagers;
    },
    reports() {
      let reports = this.$attrs.data.report;
      reports.forEach(report => {
        report["products"] = JSON.parse(report["products"]);
      });
      return reports;
    },
    cols() {
      return [
        {
          title: "Date",
          name: "visit_date"
        },
        {
          title: "Rep",
          name: "user.name"
        },
        {
          title: "Line",
          name: row => {
            return JSON.parse(row.user.line).join(" | ");
          }
        },
        {
          title: "District Manager",
          name: row => {
            let user = row.user;
            let relations = JSON.parse(user.user_relations);
            let dm = relations.dm[0];
            let manager = "-----";
            this.dm.map(item => {
              if (item.id === dm) {
                manager = item.name;
              }
            });
            return manager;
          }
        },
        {
          title: "Area Manager",
          name: row => {
            let user = row.user;
            let relations = JSON.parse(user.user_relations);
            let areaManager = relations.am[0];
            let manager = "-----";
            this.areaManager.map(item => {
              if (item.id === areaManager) {
                manager = item.name;
              }
            });
            return manager;
          }
        },
        {
          title: "Coach 1",
          name: "coach.name"
        },
        {
          title: "Coach 2",
          name: "coach2.name"
        },
        {
          title: "Visit Type",
          name: "visit_type"
        },
        {
          title: "Product 1",
          name: "products.0.name"
        },
        {
          title: "Product 1 lader of adaption",
          name: "products.0.lader"
        },
        {
          title: "Product 1 action",
          name: "products.0.action"
        },
        {
          title: "Product 1 competitor",
          name: "products.0.competitor"
        },
        {
          title: "Product 2",
          name: "products.1.name"
        },
        {
          title: "Product 2 lader of adaption",
          name: "products.1.lader"
        },
        {
          title: "Product 2 action",
          name: "products.1.action"
        },
        {
          title: "Product 2 competitor",
          name: "products.1.competitor"
        },
        {
          title: "Product 3",
          name: "products.2.name"
        },
        {
          title: "Product 3 lader of adaption",
          name: "products.2.lader"
        },
        {
          title: "Product 3 action",
          name: "products.2.action"
        },
        {
          title: "Product 3 competitor",
          name: "products.2.competitor"
        },
        {
          title: 'Comment',
          name: 'comment'
        },
        {
          title: 'Feedback',
          name: 'general_feedback'
        }
      ];
    }
  },
  data: () => ({})
};
</script>

<style></style>

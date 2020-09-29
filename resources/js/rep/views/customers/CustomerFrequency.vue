<template>
  <div>
    <div class="px-0 shadow">
      <p class="alert alert-success">
        <span><i class="fa fa-wave-square"></i></span>
        <span class="font-weight-bold">Customer Frequency list</span>
      </p>
      <div class="p-2">
        <div class="p-2 text-right">
          <router-link to="/customers" class="btn btn-sm btn-dark">
            <span><i class="fa fa-chevron-circle-left"></i></span>
            <span>back</span>
          </router-link>
          <button
            class="btn btn-sm btn-success"
            v-if="updated.length"
            @click="saveFrequency"
          >
            <span class="bg-light rounded-circle text-success px-1">{{
              updated.length
            }}</span>
            <span>update</span>
          </button>
        </div>
        <div v-if="customers.length">
          <table-component
            :heads="heads"
            :data="customers"
            head-class="bg-success text-light"
            order-by="Name,asc|Specialty,asc"
          >
            <template v-slot:head>
              <th>Next</th>
              <th>Address</th>
            </template>
            <template v-slot:body="{ item }">
              <td>
                <input
                  type="number"
                  :value="item.next_freq"
                  class="form-control form-control-sm"
                  @change="updateCustomerFrequency(item.id)"
                />
              </td>
              <td>{{ item.address }}</td>
            </template>
          </table-component>
        </div>
        <div v-else>
          <loader-component />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TableComponent from "../../../components/TableComponent";
import { httpCall } from "../../helpers/http-service";
export default {
  components: {
    TableComponent
  },
  computed: {
    customers() {
      return this.$store.getters.active;
    }
  },
  data: () => ({
    heads: [
      {
        title: "Name",
        name: "name"
      },
      {
        title: "Specialty",
        name: "specialty"
      },
      {
        title: "Brick",
        name: "brick"
      },
      {
        title: "Parameter",
        name: "parameter"
      },
      {
        title: "Current",
        name: "current_freq"
      }
    ],
    updated: []
  }),
  methods: {
    /**
     * update customer frequency
     *
     * @param {int} id
     */
    updateCustomerFrequency(id) {
      let val = parseInt(event.target.value);
      let i = this.isExist(id);
      if (i !== false) {
        this.updated[i].val = val;
      } else {
        this.updated.push({
          id,
          val
        });
      }
    },
    /**
     * check if customer is exists in upadate container
     *
     * @param {int} id
     */
    isExist(id) {
      let exists = false;
      if (!this.updated.length) {
        return exists;
      }
      this.updated.forEach((item, i) => {
        if (item.id === id) {
          exists = i;
        }
      });
      return exists;
    },
    /**
     * save Updated Frequency
     *
     * @return {void}
     */
    saveFrequency() {
      httpCall
        .post("rep/v1/customer-frequency", {
          customers: JSON.stringify(this.updated)
        })
        .then(({ data }) => {
          if (data.code === 201) {
            this.$toasted.show("customers frequency updated", {
              type: "success",
              icon: "check"
            });
            this.$router.replace("/customers");
            this.$store.dispatch("customerGetAll", true);
          }
        });
    }
  }
};
</script>

<style></style>

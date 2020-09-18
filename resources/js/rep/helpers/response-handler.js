import Vue from "vue";
export const ResponseHandler = {
  methods: {

    /**
     * handle response error
     *
     * @param {object} data
     */
    handleResponseError: function(data) {
      Object.keys(data.data).forEach((key) => {
        let errors = data.data[key];
        errors.forEach((err) => {
          let toasted = this.$toasted;
          if(!toasted) {
            toasted = Vue.toasted;
          }
          toasted.show(err, {
            icon: 'exclamation',
            duration: 10000
          })
        })
      })
    }
  }
}

import Vue from "vue";
export const ResponseHandler = {
  methods: {
    /**
     * handle ajax calls response
     *
     *
     * @param {object} data
     * @param {CallableFunction} onSuccess
     * @param {CallableFunction} onErr
     */
    handleResponse: function (data, onSuccess = null, onErr = null) {
      if(data.code === 400 || data.code === 301 || data.code === 203) {
        Object.keys(data.data).forEach((key) => {
          let errors = data.data[key];
          errors.forEach((err) => {
            Vue.toasted.show(err, {
              icon: 'exclamation',
              duration: 5000,
              type: 'error'
            });
            if(onErr && typeof onErr === 'function') {
              onErr(data)
            }
          })
        })
      } else {
        Vue.toasted.show(data.message, {
          type: 'success',
          icon: 'check'
        });
        if(onSuccess && typeof onSuccess === 'function') {
          onSuccess(data)
        }
      }
    }
  }
}

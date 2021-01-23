import { httpCall } from "../../helpers/http-service";

export default {
  state: {
    pharmacies: [],
    fetched: false
  },
  getters: {
    allPharmacies: state => state.pharmacies,
    isPharmaciesFetched: state => state.fetched
  },
  mutations: {},
  actions: {
    fetchPharmacies(module, payload) {
      if (!module.state.pharmacies.length || payload) {
        module.state.pharmacies = [];
        module.state.fetched = false;
        return httpCall
          .get("otc-rep/v1/pharmacies")
          .then(({ data }) => {
            module.state.pharmacies = data.data;
            module.state.fetched = true;
          })
          .catch(err => console.log(err));
      }
    }
  }
};

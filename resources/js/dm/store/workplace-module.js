import {httpCall} from "../../helpers/http-service"

export default {
  state: {
    hospitals: [],
    pharmacies: [],
    is_hospital_fetched: false,
    is_pharmacy_fetched: false
  },
  getters: {
    hospitals: state => state.hospitals,
    pharmacies: state => state.pharmacies,
    isHospitalFetched: state => state.is_hospital_fetched,
    isPharmacyFetched: state => state.is_pharmacy_fetched
  },
  mutations: {

  },
  actions: {
    /**
     * get all hospitals
     *
     * @param {workplace module} state
     * @param {boolean} force
     */
    hospitalsGetAll({state}, force) {
      if(!state.hospitals.length || force) {
        httpCall.get('dm/v1/workplaces')
        .then(res => {
          state.is_hospital_fetched = true;
          state.hospitals = res.data.data;
        })
      }
    },
    /**
     * get all pharmacies
     *
     * @param {workplace module} state
     * @param {boolean} force
     */
    pharmaciesGetAll({state}, force) {
      if(!state.pharmacies.length || force) {
        httpCall.get('dm/v1/pharmacies')
        .then(res => {
          state.is_pharmacy_fetched = true;
          state.pharmacies = res.data.data;
        })
      }
    }
  }
}

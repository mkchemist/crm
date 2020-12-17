/**
 * App Module
 *
 * this module container all general settings and states of
 * the whole application
 *
 */

import { httpCall } from "../../helpers/http-service";

let user = document.getElementById("user");
if (user) {
  user = JSON.parse(user.value);
} else {
  user: null;
}

export default {
  state: {
    // customers specialty
    specialties: [
      "Gynaecology",
      "Asthma",
      "Cardiology",
      "Cardiothoracic/Thoracic Surger",
      "Dermatology",
      "Diabetology",
      "Endocrinology",
      "ENT",
      "Family Medicine",
      "Gastroenterological Surgery",
      "Gastroenterology",
      "General Practice",
      "General Surgery",
      "Gyna",
      "Gynaecology",
      "Haematology",
      "Hepatology",
      "Infectious Diseases",
      "Internal Medicine",
      "Neonatology",
      "Nephrology",
      "Neurology",
      "Neuropsychiatry",
      "Neurosurgery",
      "Nutrition Medicine",
      "Oncology",
      "Ophthalmology",
      "Orthopaedics",
      "Otorhinolaryngology",
      "Paediatrics",
      "Physiotherapy",
      "Pneumology",
      "Rheumatology",
      "Surgical Oncology",
      "Tropical Medicine",
    ],
    // customer titles
    titles: ["Assistant", "Resident", "Specialist", "Physician", "Prof"],
    // customer parameters
    params: ["HH", "HM", "HL", "MH", "MM", "ML", "LH", "LM", "LL", "NN", "XX"],
    user,
    /**
     * workplace hospitals type
     *
     * i.e MOH hospital, polyclinic, Family healthcare unit
     */
    hospitalTypes: [
      "MOH hospital",
      "PolyClinic",
      "Health unit",
      "Company",
      "Private hospital",
      "Tender",
      "Military hospital"
    ],
    /**
     * pharmacy types
     *
     *
     */
    pharmacyTypes: ["Private", "Company", "Tender", "Chain"],
    /**
     * Visit types
     *
     *
     */
    visitTypes: [
      "pm face to face",
      "am face to face",
      "sample visit",
      "double visit"
    ],
    /**
     * products
     */
    products: [
      "Ferrotron",
      "Calcitron",
      "Ferrotron Sachets",
      "Calcitron Sachets",
      "Octatron",
      "Chromitron",
      "Zinctron",
      "Trib Gold",
      "After Meals",
      "Hi-potency",
      "Syno",
      "Rocha",
      "Ivoreen",
      "herbolin",
      "Peopospan",
      "Peopobruf tablets",
      "Peopobruf drops",
      "Chemicetrizine",
      "Quinofloxachem",
      "Aceliofenaz"
    ],
    /**
     * lader of adaption
     *
     */
    lader_of_adaption: [
      "Never heared",
      "Aware and not use",
      "Tried in a few Rx",
      "Sharing with competitor",
      "2nd line Rx",
      "1st line Rx",
      "1st in all Rx",
      "Advocator"
    ],
    /**
     * visit actions
     *
     */
    visit_actions: [
      "Remind message",
      "Finding new indication",
      "Competitor attack",
      "Thanking visit",
      "Sharpen Commitment",
      "Demonstrate a new message",
      "Handle Objections",
      "Make a deal",
      "Finding new needs"
    ],
    userLocations: [],
    isUserLocationsFetched: false
  },
  actions: {
    getUserLocations({state}, force) {
      if(!state.userLocations.length || force) {
        state.userLocations = [];
        state.isUserLocationsFetched = false;
        return httpCall.get('rep/v1/locations')
        .then(({data}) => {
          state.userLocations = data.data;
          state.isUserLocationsFetched = true;
        }).catch(err => {
          console.log(err)
        });
      }
    }
  },
  mutations: {},
  getters: {
    specialty: state => {
      return state.specialties;
    },
    title: state => {
      return state.titles;
    },
    param: state => {
      return state.params;
    },
    hospitalTypes: state => {
      return state.hospitalTypes;
    },
    pharmacyTypes: state => {
      return state.pharmacyTypes;
    },
    visitTypes: state => {
      return state.visitTypes;
    },
    products: state => {
      return state.products;
    },
    lader: state => {
      return state.lader_of_adaption;
    },
    visitActions: state => {
      return state.visit_actions;
    },
    userLocations: state => {
      return state.userLocations
    },
    isUserLocationsFetched: state => {
      return state.isUserLocationsFetched;
    }
  }
};

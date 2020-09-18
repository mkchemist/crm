/**
 * App Module
 *
 * this module container all general settings and states of
 * the whole application
 *
 */

let user = document.getElementById('user');
if(user) {
  user = JSON.parse(user.value);
} else {
  user : null
}

export default  {
  state: {
    // customers specialty
    specialties: [
      'Gyna',
      'Ortho',
      'Ped',
      'Physo',
      'IM',
      'GP',
      'Derma',
      'Uro',
      'Optha',
      'Ent',
      'Chest',
      'Dent'
    ],
    // customer titles
    titles: [
      'Resident',
      'Specialist',
      'Physician',
      'Prof'
    ],
    // customer parameters
    params: [
      'HH',
      'HM',
      'HL',
      'MH',
      'MM',
      'ML',
      'LH',
      'LM',
      'LL',
      'NN',
      'XX'
    ],
    user,
    /**
     * workplace hospitals type
     *
     * i.e MOH hospital, polyclinic, Family healthcare unit
     */
    hospitalTypes: [
      'MOH hospital',
      'PolyClinic',
      'Health unit',
      'Company',
      'Private hospital',
      'Tender',
      'Military hospital'
    ],
    /**
     * pharmacy types
     *
     *
     */
    pharmacyTypes: [
      'Private',
      'Company',
      'Tender',
      'Chain'
    ],
    /**
     * Visit types
     *
     *
     */
    visitTypes:[
      'Single',
      'Coach'
    ]
  },
  actions: {

  },
  mutations: {

  },
  getters:{
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
      return state.hospitalTypes
    },
    pharmacyTypes: state => {
      return state.pharmacyTypes;
    },
    visitTypes: state => {
      return state.visitTypes;
    }
  }
}

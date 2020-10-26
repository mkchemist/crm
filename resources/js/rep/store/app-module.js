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
      'Assistant',
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
    ],
    /**
     * products
     */
    products: [
      'Ferrotron',
      'Calcitron',
      'Octatron',
      'Chromitron',
      'Trib Gold',
      'Ferrotron Sachets',
      'Calcitron Sachers',
      'Peopospan',
      'Peopobruf tablets',
      'Peopobruf drops',
      'Chemicetrizine',
      'Quinofloxachem',
      'Aceliofenaz',
      'Syno',
      'Rocha',
      'Ivoreen',
      'herbolin'
    ],
    /**
     * lader of adaption
     *
     */
    lader_of_adaption: [
      'Never heared',
      'Aware and not use',
      'Tried in a few Rx',
      'Sharing with competitor',
      '2nd line Rx',
      '1st line Rx',
      '1st in all Rx',
      'Advocator'
    ],
    /**
     * visit actions
     *
     */
    visit_actions: [
      'Thanking visit',
      'Sharpen Commitment',
      'Demonstrate a new message',
      'Handle Objections',
      'Make a deal',
      'Finding new needs'
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
    },
    products: state => {
      return state.products;
    },
    lader: state => {
      return state.lader_of_adaption;
    },
    visitActions: state => {
      return state.visit_actions;
    }
  }
}

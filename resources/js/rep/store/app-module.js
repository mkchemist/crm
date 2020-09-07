/**
 * App Module
 *
 * this module container all general settings and states of
 * the whole application
 *
 */

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
      'Specialist',
      'MD',
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
    }
  }
}

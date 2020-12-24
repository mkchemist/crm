import { httpCall } from "../../helpers/http-service"

/**
 * Broadcasting messages controller
 *
 *
 */
export default {
  state: {
    /** messages container */
    messages: [],
    /** is messages fetched */
    is_fetched: false,
    /** is new message modal active */
    is_modal_active: false,
  },
  getters: {
    /** broadcasting message getter */
    broadcastMessages: state => state.messages,
    /** isBroadcastingMessage fetched getter */
    isBroadcastMessagesFetched: state=>state.is_fetched,
    /** is broadcasting modal active */
    isBroadcastModalActive: state => state.is_modal_active
  },
  mutations: {
    /**
     * toggle broadcast modal state
     * [show|hide] new broadcast message
     *
     * @param {object} state
     * @param {boolean} payload
     */
    toggleBroadcastModal(state, payload) {
      state.is_modal_active = payload
    }
  },
  actions: {
    /**
     * get all broadcasting messages
     *
     * @param {object} module
     * @param {boolean} payload
     */
    getAllBroadcastingMessages(module, payload) {
      if(!module.state.messages.length || payload) {
        module.state.messages = [];
        module.state.is_fetched = false;
        return httpCall.get('admin/v1/broadcasting')
        .then(({data}) => {
          module.state.messages = data.data;
          module.state.is_fetched = true;
        }).catch(err => {
          console.log(err)
        });
      }
    }
  }
}

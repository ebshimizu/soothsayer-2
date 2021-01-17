import Vue from 'vue';
import Vuex from 'vuex';
import { ipcRenderer } from 'electron';
import { MUTATION, ACTION } from './actions';

Vue.use(Vuex);

const defaultShowData = {
  theme: '',
  casters: [
    {
      name: '',
      social: '',
      textSize: 'medium',
    },
  ],
  frameVariant: 1,
  eventLogo: '',
};

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    app: {},
    overlays: {},
    show: defaultShowData,
    log: [],
    version: 'uh oh',
  },
  getters: {
    version(state) {
      return state.version;
    },
  },
  mutations: {
    [MUTATION.REGISTER_OVERLAY](state, { id, name }) {
      Vue.set(state.overlays, id, name);
    },
    [MUTATION.UNREGISTER_OVERLAY](state, id) {
      Vue.delete(state.overlays, id);
    },
    [MUTATION.SET_VERSION](state, version) {
      state.version = version;
    },
    [MUTATION.CHANGE_CASTER_LENGTH](state, count) {
      if (count > state.show.casters.length) {
        // expand by adding until length
        while (state.show.casters.length < count) {
          state.show.casters.push({
            name: '',
            social: '',
            textSize: 'medium',
          });
        }
      } else if (count < state.show.casters.length) {
        // truncate
        state.show.casters.splice(count);
      }
    },
    [MUTATION.SET_CASTER_DATA](state, casterData) {
      // this replaces the entire object
      Vue.set(state.show, 'casters', casterData);
    },
    [MUTATION.SET_SHOW_PROP](state, { key, value }) {
      Vue.set(state.show, key, value);
    },
  },
  actions: {
    [ACTION.INIT_OVERLAY]({ commit, state }, socketData) {
      commit(MUTATION.REGISTER_OVERLAY, socketData);
      ipcRenderer.send('change-one-theme', {
        id: socketData.id,
        theme: state.show.theme,
      });
      ipcRenderer.send('update-one-state', {
        id: socketData.id,
        data: state.show,
      });
    },
    [ACTION.DISCONNECT_OVERLAY]({ commit }, socketId) {
      commit(MUTATION.UNREGISTER_OVERLAY, socketId);
    },
    [ACTION.UPDATE]({ state }) {
      // this action triggers a show state snapshot in the persistence plugin
      ipcRenderer.send('update-all-state', state.show);
    },
  },
});

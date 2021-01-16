import Vue from 'vue'
import Vuex from 'vuex'
import { ipcRenderer } from 'electron'
import { MUTATION, ACTION } from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    app: {},
    overlays: {},
    show: {
      theme: '',
      casters: [{
        name: '',
        social: '',
        textSize: 'medium'
      }]
    },
    log: [],
    version: 'uh oh'
  },
  getters: {
    casterCount (state) {
      return state.casters.length
    },
    version (state) {
      return state.version
    }
  },
  mutations: {
    [MUTATION.REGISTER_OVERLAY] (state, { id, name }) {
      Vue.set(state.overlays, id, name)
    },
    [MUTATION.UNREGISTER_OVERLAY] (state, id) {
      Vue.delete(state.overlays, id)
    },
    [MUTATION.SET_VERSION] (state, version) {
      state.version = version
    }
  },
  actions: {
    [ACTION.INIT_OVERLAY] ({ commit, state }, socketData) {
      commit(MUTATION.REGISTER_OVERLAY, socketData)
      ipcRenderer.send('change-one-theme', { id: socketData.id, theme: state.show.theme })
      ipcRenderer.send('update-one-state', { id: socketData.id, data: state.show })
    },
    [ACTION.DISCONNECT_OVERLAY] ({ commit }, socketId) {
      commit(MUTATION.UNREGISTER_OVERLAY, socketId)
    },
    [ACTION.UPDATE] ({ state }) {
      ipcRenderer.send('update-all-state', state.show)
    }
  }
})

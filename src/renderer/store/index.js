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
      theme: ''
    },
    log: []
  },
  mutations: {
    [MUTATION.REGISTER_OVERLAY] (state, { id, name }) {
      Vue.set(state.overlays, id, name)
    },
    [MUTATION.UNREGISTER_OVERLAY] (state, id) {
      Vue.delete(state.overlays, id)
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

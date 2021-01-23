import Vue from 'vue'
import Vuex from 'vuex'
import { ipcRenderer } from 'electron'
import { MUTATION, ACTION } from './actions'
import fs from 'fs-extra'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { LOG_LEVEL } from '../data/appDefaults'
import { Persistence } from './persistence'
import _ from 'lodash'
import { OVERLAY_MANIFEST } from '../data/overlayManifest'
import { GAME, GAME_SETTINGS, GAME_STRING } from '../data/supportedGames'

// log helper for mutations
function stateLog(log, message, severity) {
  log.push({ message, severity, date: new Date() })
}

Vue.use(Vuex)

const defaultShowData = () => {
  return {
    theme: '',
    themeOverrides: {},
    casters: [
      {
        name: '',
        social: '',
        textSize: 'medium',
      },
    ],
    casterCount: 1,
    frameVariant: 1,
    eventLogo: '',
    tournamentName: '',
    eventName: '',
    sponsorLogo: '',
    notepad: '',
    date: (new Date()).toISOString().substr(0, 10),
    time: '12:00',
    schedule: {},
    mapImage: '',
    lowerThirdVisible: false,
    playerPool: [],
  }
}

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  plugins: [Persistence],
  state: {
    app: {
      themeFolder: '',
      availableThemes: {},
      game: GAME.ERBS,
    },
    keybinds: {}, // default keybinds are defined in the main process and forwarded
    availableOverlays: [],
    overlays: {},
    show: defaultShowData(),
    imageCache: {},
    log: [],
    version: 'uh oh',
    localFiles: '',
  },
  getters: {
    version(state) {
      return state.version
    },
    availableThemes(state) {
      // format for vuetify
      return Object.keys(state.app.availableThemes).map((k) => {
        const theme = state.app.availableThemes[k]
        return { value: k, text: `${theme.name} v${theme.version}` }
      })
    },
    connectedOverlays(state) {
      return Object.keys(state.overlays).map((socketId) => {
        const overlay = state.overlays[socketId]
        return { socketId, name: overlay.name, page: overlay.page }
      })
    },
    availableOverlays(state) {
      // only return overlays that are in the manifest
      // todo: and have support for the current game
      const overlays = state.availableOverlays.filter(
        (o) => o in OVERLAY_MANIFEST,
      )
      return overlays.map((o) => {
        return {
          ...OVERLAY_MANIFEST[o],
          page: o,
        }
      })
    },
    componentVisible: (state) => (name) => {
      return GAME_SETTINGS[state.app.game].COMPONENT_VISIBLE[name]
    },
    menuVisible: (state) => (name) => {
      return GAME_SETTINGS[state.app.game].MENU_VISIBLE[name]
    },
    overlaySupported: (state) => (name) => {
      return GAME_SETTINGS[state.app.game].OVERLAY_SUPPORT[name]
    },
    supportedGames: () => {
      return Object.keys(GAME).map((k) => {
        return { value: k, text: GAME_STRING[k] }
      })
    },
  },
  mutations: {
    [MUTATION.REGISTER_OVERLAY](state, { id, name, page }) {
      Vue.set(state.overlays, id, { name, page })
    },
    [MUTATION.UNREGISTER_OVERLAY](state, id) {
      Vue.delete(state.overlays, id)
    },
    [MUTATION.SET_VERSION](state, version) {
      state.version = version
    },
    [MUTATION.SET_LOCAL_FILES](state, files) {
      state.localFiles = files
    },
    [MUTATION.CHANGE_CASTER_LENGTH](state, count) {
      if (count > state.show.casters.length) {
        // expand by adding until length
        while (state.show.casters.length < count) {
          state.show.casters.push({
            name: '',
            social: '',
            textSize: 'medium',
          })
        }
      } else if (count < state.show.casters.length) {
        // truncate
        state.show.casters.splice(count)
      }

      state.show.casterCount = count
    },
    [MUTATION.SET_CASTER_DATA](state, { index, key, value }) {
      Vue.set(state.show.casters[index], key, value)
    },
    [MUTATION.SET_SHOW_PROP](state, { key, value }) {
      Vue.set(state.show, key, value)
    },
    [MUTATION.SET_APP_PROP](state, { key, value }) {
      Vue.set(state.app, key, value)
    },
    // images need a src prop (the original image) and a resolved prop (the local file, if applicable)
    // Image fields should react to @input by just writing the resolved mutation, while local files should
    // use this one so we can properly cache the image.
    [MUTATION.SET_LOCAL_IMG](state, { key, src }) {
      // first, load the src
      try {
        const fileName = path.basename(src)

        // to avoid conflicts, a guid will be pre-pended to the filename
        const uniqueFileName = `${uuidv4()}-${fileName}`

        const dest = path.join(state.localFiles, 'img', uniqueFileName)
        fs.copyFileSync(src, dest)

        Vue.set(state.show, key, `/${uniqueFileName}`)

        // update the cache for this element
        Vue.set(state.imageCache, key, { src, dest })
      } catch (e) {
        stateLog(
          state.log,
          `Unable to load local image ${src}.`,
          LOG_LEVEL.WARN,
        )
        console.log(e)
      }
    },
    [MUTATION.LOG](state, { message, severity }) {
      state.log.push({ message, severity, date: new Date() })
    },
    [MUTATION.LOAD_STATE](state, data) {
      // does a merge into the current state
      // object is cleaned up by the action before giving it to the state here
      const newState = _.merge(state, data)
      Object.assign(state, newState)

      // ensure defaults
      if (!state.app.themeFolder || state.app.themeFolder === '') {
        state.app.themeFolder = path.join(state.localFiles, 'themes')
      }
    },
    [MUTATION.UPDATE_THEME_DATA](state, { availableThemes, folder }) {
      state.app.themeFolder = folder
      Vue.set(state.app, 'availableThemes', availableThemes)
    },
    [MUTATION.UPDATE_KEYBINDS](state, { keybinds, status }) {
      if (!status) {
        Vue.set(state, 'keybinds', keybinds)
      } else {
        for (const key in keybinds) {
          if (status[key]) {
            Vue.set(state.keybinds, key, keybinds[key])
          }
        }
      }
    },
  },
  actions: {
    [ACTION.INIT_OVERLAY]({ commit, state }, socketData) {
      commit(MUTATION.REGISTER_OVERLAY, socketData)
      ipcRenderer.send('change-one-theme', {
        id: socketData.id,
        theme: state.show.theme,
      })
      ipcRenderer.send('update-one-state', {
        id: socketData.id,
        data: state.show,
      })
    },
    [ACTION.DISCONNECT_OVERLAY]({ commit }, socketId) {
      commit(MUTATION.UNREGISTER_OVERLAY, socketId)
    },
    [ACTION.UPDATE]({ state }) {
      // this action triggers a show state snapshot in the persistence plugin
      ipcRenderer.send('update-all-state', state.show)
    },
    [ACTION.LOAD_STATE]({ commit }, data) {
      // data should be pre-processed in main.
      commit(MUTATION.LOAD_STATE, data)
    },
    [ACTION.SET_THEME]({ commit, state }, data) {
      commit(MUTATION.SET_SHOW_PROP, data)
      ipcRenderer.send('update-all-state', state.show)
    },
  },
})

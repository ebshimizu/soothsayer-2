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
import {
  defaultLowerThirdData,
  defaultShowData,
  defaultGraphicsData,
  scheduleItem,
} from './defaults'
import moment from 'moment'

// log helper for mutations
function stateLog(log, message, severity) {
  log.push({ message, severity, date: new Date() })
}

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  plugins: [Persistence],
  state: {
    app: {
      themeFolder: '',
      availableThemes: {},
      game: GAME.ERBS,
      erbsApiKey: '',
    },
    keybinds: {}, // default keybinds are defined in the main process and forwarded
    availableOverlays: [],
    overlays: {},
    show: defaultShowData(),
    graphics: defaultGraphicsData(),
    imageCache: {},
    log: [],
    version: 'uh oh',
    localFiles: '',
    whiteboardData: null,
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
          resolution: `${OVERLAY_MANIFEST[o].width} x ${OVERLAY_MANIFEST[o].height}`,
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
    tournamentSchedule(state) {
      return Object.values(state.show.schedule)
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
            socialTwitch: '',
            socialTwitter: '',
            socialYoutube: '',
            socialInsta: '',
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
    [MUTATION.SET_TIMER_PROP](state, { key, value }) {
      Vue.set(state.show.timer, key, value)
    },
    [MUTATION.ADD_TOURNAMENT_SCHEDULE_ITEM](state, id) {
      const newItem = scheduleItem()
      newItem.id = id
      Vue.set(state.show.schedule, id, newItem)
    },
    [MUTATION.DELETE_TOURNAMENT_SCHEDULE_ITEM](state, id) {
      Vue.delete(state.show.schedule, id)
    },
    [MUTATION.DELETE_TOURNAMENT_SCHEDULE](state) {
      state.show.schedule = {}
    },
    [MUTATION.SET_TOURNAMENT_SCHEDULE_PROP](state, { id, key, value }) {
      Vue.set(state.show.schedule[id], key, value)
    },
    [MUTATION.SAVE_CANVAS](state, data) {
      state.whiteboardData = data
    },
    [MUTATION.SET_LT_PROP](state, { key, value }) {
      Vue.set(state.graphics.lowerThird, key, value)
      state.graphics.lowerThird.lastChangeAt = Date.now()
    },
    [MUTATION.SET_LT_MODE_DATA](state, { mode, key, value }) {
      Vue.set(state.graphics.lowerThird.modeData[mode], key, value)
      state.graphics.lowerThird.lastChangeAt = Date.now()
    },
    [MUTATION.SET_ALL_LT_MODE_DATA](state, { mode, data }) {
      Vue.set(state.graphics.lowerThird.modeData, mode, data)
      state.graphics.lowerThird.lastChangeAt = Date.now()
    },
    [MUTATION.RESET_LT](state) {
      Vue.set(state.graphics, 'lowerThird', defaultLowerThirdData())
      state.graphics.lowerThird.lastChangeAt = Date.now()
    },
    [MUTATION.ADD_SPONSOR_IMAGE](state, url) {
      Vue.set(state.show.sponsorLogos, url, url)
    },
    [MUTATION.REMOVE_SPONSOR_IMAGE](state, url) {
      Vue.delete(state.show.sponsorLogos, url, url)

      // check cache
      const key = `sponsorLogos[${url}]`
      if (key in state.imageCache) {
        Vue.delete(state.imageCache, key)
      }
    },
    [MUTATION.ADD_LOCAL_SPONSOR_IMAGE](state, url) {
      // similar to load local imge but the key is a bit different
      // first, load the src
      try {
        const fileName = path.basename(url)

        // to avoid conflicts, a guid will be pre-pended to the filename
        const uniqueFileName = `${uuidv4()}-${fileName}`
        const key = `sponsorLogos[${uniqueFileName}]`

        const dest = path.join(state.localFiles, 'img', uniqueFileName)
        fs.copyFileSync(url, dest)

        // update the cache for this element
        Vue.set(state.show.sponsorLogos, uniqueFileName, uniqueFileName)
        Vue.set(state.imageCache, key, { src: url, dest })
      } catch (e) {
        stateLog(
          state.log,
          `Unable to load local image ${url}.`,
          LOG_LEVEL.WARN,
        )
        console.log(e)
      }
    },
  },
  actions: {
    [ACTION.INIT_OVERLAY]({ commit, state }, socketData) {
      commit(MUTATION.REGISTER_OVERLAY, socketData)
      ipcRenderer.send('update-one-state', {
        id: socketData.id,
        data: state.show,
      })
      ipcRenderer.send('update-one-graphics', {
        id: socketData.id,
        data: state.graphics,
      })
    },
    [ACTION.UPDATE_GRAPHICS]({ state }, socketData) {
      ipcRenderer.send('update-all-graphics', state.graphics)
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
      ipcRenderer.send('update-all-theme', state.show.theme)
    },
    [ACTION.START_TIMER]({ commit, dispatch, state }) {
      // state is updated with current duration (or mode, in the future)
      // init the end time
      const end = moment()
        .add(state.show.timer.minutes, 'm')
        .add(state.show.timer.seconds, 's')

      commit(MUTATION.SET_TIMER_PROP, { key: 'endsAt', value: end.toDate() })
      commit(MUTATION.SET_TIMER_PROP, { key: 'pauseDuration', value: 0 })
      commit(MUTATION.SET_TIMER_PROP, { key: 'isPaused', value: false })
      commit(MUTATION.SET_TIMER_PROP, { key: 'isPlaying', value: true })

      commit(MUTATION.LOG, {
        message: `Countdown timer set to end at ${end}`,
        severity: LOG_LEVEL.INFO,
      })

      // inform overlays
      dispatch(ACTION.UPDATE)
    },
    [ACTION.STOP_TIMER]({ commit, dispatch }) {
      commit(MUTATION.SET_TIMER_PROP, { key: 'isPaused', value: false })
      commit(MUTATION.SET_TIMER_PROP, { key: 'isPlaying', value: false })

      commit(MUTATION.LOG, {
        message: 'Countdown timer stopped',
        severity: LOG_LEVEL.INFO,
      })

      // inform overlays
      dispatch(ACTION.UPDATE)
    },
    [ACTION.PAUSE_TIMER]({ commit, dispatch }) {
      // set the pause time
      commit(MUTATION.SET_TIMER_PROP, { key: 'pausedAt', value: new Date() })

      // set the pause key
      commit(MUTATION.SET_TIMER_PROP, { key: 'isPaused', value: true })

      commit(MUTATION.LOG, {
        message: 'Countdown timer paused',
        severity: LOG_LEVEL.INFO,
      })

      // inform overlays
      dispatch(ACTION.UPDATE)
    },
    [ACTION.RESUME_TIMER]({ commit, dispatch, state }) {
      // get the pause time and check the duration of the pause
      const diff =
        state.show.timer.pauseDuration +
        moment().diff(moment(state.show.timer.pausedAt), 'ms')

      // set the pause duration
      commit(MUTATION.SET_TIMER_PROP, { key: 'pauseDuration', value: diff })

      // update keys
      commit(MUTATION.SET_TIMER_PROP, { key: 'isPaused', value: false })

      commit(MUTATION.LOG, {
        message: 'Countdown timer resumed',
        severity: LOG_LEVEL.INFO,
      })

      // inform overlays
      dispatch(ACTION.UPDATE)
    },
  },
})

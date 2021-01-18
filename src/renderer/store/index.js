import Vue from 'vue';
import Vuex from 'vuex';
import { ipcRenderer } from 'electron';
import { MUTATION, ACTION } from './actions';
import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { LOG_LEVEL } from '../data/appDefaults';
import { Persistence } from './persistence';
import _, { uniq } from 'lodash';

// log helper for mutations
function stateLog(log, message, severity) {
  log.push({ message, severity, date: new Date() });
}

Vue.use(Vuex);

const defaultShowData = {
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
};

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  plugins: [Persistence],
  state: {
    app: {
      themeFolder: '',
      availableThemes: {},
    },
    overlays: {},
    show: defaultShowData,
    imageCache: {},
    log: [],
    version: 'uh oh',
    localFiles: '',
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
    [MUTATION.SET_LOCAL_FILES](state, files) {
      state.localFiles = files;
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

      state.show.casterCount = count;
    },
    [MUTATION.SET_CASTER_DATA](state, { index, key, value }) {
      Vue.set(state.show.casters[index], key, value);
    },
    [MUTATION.SET_SHOW_PROP](state, { key, value }) {
      Vue.set(state.show, key, value);
    },
    [MUTATION.SET_APP_PROP](state, { key, value }) {
      Vue.set(state.app, key, value);
    },
    // images need a src prop (the original image) and a resolved prop (the local file, if applicable)
    // Image fields should react to @input by just writing the resolved mutation, while local files should
    // use this one so we can properly cache the image.
    [MUTATION.SET_LOCAL_IMG](state, { key, src }) {
      // first, load the src
      try {
        const fileName = path.basename(src);

        // to avoid conflicts, a guid will be pre-pended to the filename
        const uniqueFileName = `${uuidv4()}-${fileName}`;

        const dest = path.join(state.localFiles, 'img', uniqueFileName);
        fs.copyFileSync(src, dest);

        Vue.set(state.show, key, `/${uniqueFileName}`);

        // update the cache for this element
        Vue.set(state.imageCache, key, { src, dest });
      } catch (e) {
        stateLog(
          state.log,
          `Unable to load local image ${src}.`,
          LOG_LEVEL.ERROR
        );
        console.error(e);
      }
    },
    [MUTATION.LOG](state, { message, severity }) {
      state.log.push({ message, severity, date: new Date() });
    },
    [MUTATION.LOAD_STATE](state, data) {
      // does a merge into the current state
      // object is cleaned up by the action before giving it to the state here
      state = _.merge(state, data);

      // ensure defaults
      if (!state.app.themeFolder || state.app.themeFolder === '') {
        state.app.themeFolder = path.join(state.localFiles, 'themes');
      }
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
    [ACTION.LOAD_STATE]({ commit }, data) {
      // data should be pre-processed in main.
      commit(MUTATION.LOAD_STATE, data);
    },
  },
});

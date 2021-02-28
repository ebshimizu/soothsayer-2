<template>
  <v-row dense>
    <v-col cols="12">
      <v-card>
        <v-card-title>Application Settings</v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col cols="8">
              <v-select
                v-model="game"
                :items="games"
                label="Selected Game Configuration"
                hint="Each game supports a different set of overlays and functions."
                persistent-hint
              ></v-select>
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="locale"
                label="Locale"
                hint="Set Application and Overlay Language"
                persistent-hint
                :items="locales"
              ></v-select>
            </v-col>
            <v-col cols="12" v-if="erbs">
              <v-text-field
                label="Eternal Return: Black Survival API Key"
                hint="Visit https://developer.eternalreturn.io/ to get a key"
                :value="$store.state.app.erbsApiKey"
                persistent-hint
                @input="(v) => update('erbsApiKey', v)"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <theme-settings></theme-settings>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-card-title>Keyboard Shortcuts</v-card-title>
        <v-card-subtitle
          >Soothsayer's shortcuts are global, meaning that they'll work whether
          or not the app is focused (clicked on). Keyboard shortcuts use the
          <a
            @click="
              openExternal('https://www.electronjs.org/docs/api/accelerator')
            "
            >Electron Accelerator</a
          >
          format</v-card-subtitle
        >
        <v-card-text>
          <v-row no-gutters v-for="(accel, key) in readOnlyKeybinds" :key="key">
            <v-col cols="6">{{ shortcutName(key) }}</v-col>
            <v-col cols="6"
              ><v-text-field
                label="Shortcut"
                v-model="readOnlyKeybinds[key]"
                :error="!keyDidBind(key)"
                :error-messages="
                  !keyDidBind(key) ? 'Invalid Keyboard Shortcut' : null
                "
              ></v-text-field
            ></v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn class="green" @click="updateShortcuts">Update Shortcuts</v-btn>
          <v-btn class="secondary" @click="resetShortcuts"
            >Reset Shortcuts</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-card-title>Resets</v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col cols="4"
              ><v-btn block @click="firstTime">Run First Time Setup</v-btn>
            </v-col>
            <v-col cols="4"
              ><v-btn color="red" block @click="resetShow"
                >Reset Show Data</v-btn
              ></v-col
            >
            <v-col col="4"
              ><v-btn color="red" block @click="resetAll"
                >Delete Settings Cache</v-btn
              ></v-col
            >
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { ACTION, MUTATION } from '../store/actions'
import { ipcRenderer, shell } from 'electron'
import { SHORTCUT_NAMES } from '../data/keyboardShortcuts'
import { DEFAULT_SHORTCUTS } from '../../main/defaultKeyboardShortcuts'
import { GAME } from '../data/supportedGames'
import { LOCALES } from '../data/appDefaults'
import ThemeSettings from './ThemeSettings'

export default {
  name: 'app-settings',
  components: { ThemeSettings },
  data() {
    return {
      // keybinds aren't dynamic. The state on load should be consistent.
      keybindStatus: {},
      // add new locales here after adding proper files
      locales: LOCALES,
    }
  },
  computed: {
    locale: {
      get() {
        return this.$store.state.app.locale
      },
      set(value) {
        this.$store.dispatch(ACTION.UPDATE_LOCALE, value)

        // also update the actual i18n prop
        this.$i18n.locale = value
      },
    },
    games() {
      return this.$store.getters.supportedGames
    },
    game: {
      get() {
        return this.$store.state.app.game
      },
      set(value) {
        this.update('game', value)
      },
    },
    erbs() {
      return this.game === GAME.ERBS
    },
    // just copy the keybinds.
    // we want to save local edits, send to main, validate, update main state.
    readOnlyKeybinds() {
      const keys = {}
      for (const id in this.$store.state.keybinds) {
        keys[id] = this.$store.state.keybinds[id]
      }

      return keys
    },
  },
  methods: {
    openExternal(url) {
      shell.openExternal(url)
    },
    shortcutName(key) {
      return SHORTCUT_NAMES[key]
    },
    keyDidBind(key) {
      return key in this.keybindStatus ? this.keybindStatus[key] : true
    },
    updateShortcuts() {
      ipcRenderer.invoke('rebind', this.readOnlyKeybinds).then((status) => {
        this.keybindStatus = status

        // update state based on status
        this.$store.commit(MUTATION.UPDATE_KEYBINDS, {
          keybinds: this.readOnlyKeybinds,
          status,
        })
      })
    },
    resetShortcuts() {
      ipcRenderer.invoke('rebind', DEFAULT_SHORTCUTS).then((status) => {
        this.keybindStatus = status

        this.$store.commit(MUTATION.UPDATE_KEYBINDS, {
          keybinds: DEFAULT_SHORTCUTS,
        })
      })
    },
    update(key, value) {
      this.$store.commit(MUTATION.SET_APP_PROP, { key, value })
    },
    firstTime() {
      this.$store.commit(MUTATION.SET_APP_PROP, {
        key: 'firstLaunch',
        value: true,
      })
    },
    resetShow() {
      this.$store.commit(MUTATION.RESET_SHOW_DATA)
    },
    resetAll() {
      this.$store.dispatch(ACTION.DELETE_SETTINGS_CACHE)
    },
  },
}
</script>

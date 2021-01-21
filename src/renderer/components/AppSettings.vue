<template>
  <v-row dense>
    <v-col cols="12" class="mb-2">
      <v-select
        v-model="game"
        :items="games"
        label="Selected Game Configuration"
        hint="Each game supports a different set of overlays and functions."
        persistent-hint
      ></v-select>
    </v-col>
    <v-col cols="12">
      <v-card outlined>
        <v-card-title>Keyboard Shortcuts</v-card-title>
        <v-card-subtitle
          >Keyboard shortcuts use the
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
  </v-row>
</template>

<script>
import { MUTATION } from '../store/actions'
import { ipcRenderer, shell } from 'electron'
import { SHORTCUT_NAMES } from '../data/keyboardShortcuts'
import { DEFAULT_SHORTCUTS } from '../../main/defaultKeyboardShortcuts'

export default {
  name: 'app-settings',
  data() {
    return {
      // keybinds aren't dynamic. The state on load should be consistent.
      keybindStatus: {},
    }
  },
  computed: {
    games() {
      return this.$store.getters.supportedGames
    },
    game: {
      get() {
        return this.$store.state.app.game
      },
      set(value) {
        this.$store.commit(MUTATION.SET_APP_PROP, { key: 'game', value })
      },
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
  },
}
</script>

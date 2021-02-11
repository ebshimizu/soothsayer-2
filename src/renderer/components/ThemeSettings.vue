<template>
  <v-row dense>
    <v-col cols="12">
      <v-card outlined>
        <v-card-title>Set Theme</v-card-title>
        <v-card-subtitle>Set the theme used by all overlays</v-card-subtitle>
        <v-card-text>
          <v-row dense>
            <theme-selector></theme-selector>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card outlined>
        <v-card-title>Manage Themes</v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                label="Theme Folder Location"
                v-model="themeFolder"
                readonly
              >
                <template v-slot:append-outer>
                  <v-btn color="primary" @click="setThemeFolder">
                    <v-icon left>mdi-folder-open</v-icon>
                    Set Theme Folder
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { ipcRenderer } from 'electron'
import { MUTATION } from '../store/actions'
import ThemeSelector from './ThemeSelector'

export default {
  name: 'theme-settings',
  components: { ThemeSelector },
  computed: {
    themeFolder: {
      get() {
        return this.$store.state.app.themeFolder
      },
      set(value) {
        this.$store.commit(MUTATION.SET_APP_PROP, {
          key: 'themeFolder',
          value,
        })
      },
    },

  },
  methods: {
    setThemeFolder() {
      ipcRenderer.invoke('set-theme-folder').then((themes) => {
        if (themes) {
          this.$store.commit(MUTATION.UPDATE_THEME_DATA, themes)
        }
      })
    },
  },
}
</script>

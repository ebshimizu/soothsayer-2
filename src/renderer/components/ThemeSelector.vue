<template>
  <v-col cols="12">
    <v-select label="Available Themes" :items="availableThemes" v-model="theme">
      <template v-slot:append-outer>
        <v-btn class="mx-1" color="secondary" @click="scanThemeFolder"
          >Scan</v-btn
        >
        <v-btn class="mx-1" color="secondary" @click="openDownload">Add</v-btn>
      </template>
    </v-select>

    <v-dialog v-model="downloadTheme" max-width="800">
      <v-card>
        <v-card-title>Add or Update Offical Theme</v-card-title>
        <v-card-subtitle
          >Official Soothsayer themes are hosted in the Soothsayer 2 GitHub
          Repository</v-card-subtitle
        >
        <v-card-text>
          <v-select
            label="Theme"
            v-model="selectedTheme"
            :items="remoteThemes"
            :loading="loadingManifest"
            :disabled="loadingManifest"
            :messages="status"
            no-data-text="Loading Themes..."
            :error="error"
          ></v-select>
          <p>
            Downloading a theme will overwrite existing themes of the same name.
          </p>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green" @click="download">Download</v-btn>
            <v-btn color="red" @click="downloadTheme = false">Cancel</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script>
import { MUTATION, ACTION } from '../store/actions'
import { ipcRenderer } from 'electron'

const REMOTE_THEME_MANIFEST =
  'https://ebshimizu.github.io/soothsayer-2/themes.json'

export default {
  name: 'theme-selector',
  data() {
    return {
      downloadTheme: false,
      loadingManifest: false,
      status: [],
      selectedTheme: null,
      remoteThemes: [],
      error: false,
    }
  },
  beforeMount() {
    // not entirely sure why this component needs a scan on the theme folder to make them show up.
    this.scanThemeFolder()
  },
  computed: {
    availableThemes() {
      return this.$store.getters.availableThemes
    },
    theme: {
      get() {
        return this.$store.state.show.theme
      },
      set(value) {
        this.$store.dispatch(ACTION.SET_THEME, { key: 'theme', value })
      },
    },
  },
  methods: {
    openDownload() {
      this.error = false
      this.downloadTheme = true

      // probably initiate a fetch too
      this.loadingManifest = true
      this.status = ['Retrieving Manifest...']

      fetch(REMOTE_THEME_MANIFEST, {
        method: 'GET',
      })
        .then(async (req) => {
          const manifest = await req.json()

          this.remoteThemes = Object.entries(manifest).map(([key, theme]) => {
            return {
              text: `${theme.name} v${theme.version}`,
              value: key,
              url: theme.url,
            }
          })

          this.loadingManifest = false
          this.status = []
        })
        .catch((e) => {
          this.status = [`Failed to Retrieve Manifest: ${e}`]
          this.loadingManifest = false
          this.error = true
        })

      console.log(REMOTE_THEME_MANIFEST)
    },
    download() {
      const url = this.remoteThemes.find((t) => t.value === this.selectedTheme)
        .url
      this.loadingManifest = true
      this.status = [`Downloading ${this.selectedTheme} from ${url}`]

      ipcRenderer
        .invoke('download-theme', url)
        .then(() => {
          // move to extract
          this.status = [
            `Extracting ${this.selectedTheme} to ${this.$store.state.app.themeFolder}`,
          ]
          ipcRenderer
            .invoke('extract-theme', this.$store.state.app.themeFolder)
            .then((e) => {
              // updoot
              if (e) {
                this.status = [`Error extracting theme: ${e}`]
                this.error = true
                this.loadingManifest = false
              } else {
                ipcRenderer
                  .invoke(
                    'scan-theme-folder',
                    this.$store.state.app.themeFolder,
                  )
                  .then((themes) => {
                    if (themes) {
                      this.$store.commit(MUTATION.SET_APP_PROP, {
                        key: 'availableThemes',
                        value: themes,
                      })

                      this.status = ['Downloaded Theme']
                      this.loadingManifest = false
                      this.downloadTheme = false
                    }
                  })
              }
            })
            .catch(() => {})
        })
        .catch((e) => {
          this.status = [`Error downloading theme: ${e}`]
          this.error = true
          this.loadingManifest = false
        })
    },
    scanThemeFolder() {
      if (this.$store.state.app.themeFolder) {
        ipcRenderer
          .invoke('scan-theme-folder', this.$store.state.app.themeFolder)
          .then((themes) => {
            if (themes) {
              this.$store.commit(MUTATION.SET_APP_PROP, {
                key: 'availableThemes',
                value: themes,
              })
            }
          })
      }
    },
  },
}
</script>

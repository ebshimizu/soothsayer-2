<template>
  <v-col cols="12">
    <v-select label="Available Themes" :items="availableThemes" v-model="theme">
      <template v-slot:append-outer>
        <v-btn class="mx-1" color="primary" @click="openDownload">Add</v-btn>
        <v-btn class="mx-1" color="secondary" @click="scanThemeFolder"
          >Scan</v-btn
        >
      </template>
    </v-select>

    <v-card dense v-if="themeData !== null">
      <v-card-title>{{ themeData.name }}</v-card-title>
      <v-card-subtitle
        >v{{ themeData.version }}
        <span v-if="themeLicense"
          ><br />Licenesed under
          <a @click="openExternal(themeLicense.link)">{{ themeLicense.name }}</a
          >. <span v-if="themeLicense.long">{{ themeLicense.long }}</span></span
        ></v-card-subtitle
      >
      <v-card-text>
        {{ themeData.description }}
      </v-card-text>
      <v-card-actions>
        <v-chip
          v-for="link in themeLinks"
          :key="link.key"
          class="mr-2"
          :color="link.color"
          @click="openExternal(link.link)"
        >
          <v-avatar v-if="link.key === 'kofi'" left :class="link.color">
            <img src="~@/assets/ko-fi-icon.png" />
          </v-avatar>
          <v-icon v-else left>
            {{ link.icon }}
          </v-icon>
          {{ link.value }}
        </v-chip>
      </v-card-actions>
    </v-card>

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
import { ipcRenderer, shell } from 'electron'

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
    themeData() {
      if (this.theme in this.$store.state.app.availableThemes) {
        return this.$store.state.app.availableThemes[this.theme]
      }

      return null
    },
    themeLinks() {
      if (this.themeData !== null) {
        if (this.themeData.links) {
          return Object.entries(this.themeData.links).map(([key, value]) => {
            const icon = key === 'kofi' ? 'Ko-Fi' : `mdi-${key}`

            let link = ''
            let color = ''
            if (key === 'twitter') {
              link = `http://twitter.com/${value}`
              color = 'light-blue darken-1'
            } else if (key === 'kofi') {
              link = `http://ko-fi.com/${value}`
              color = 'blue darken-1'
            }

            return {
              key,
              value,
              icon,
              link,
              color,
            }
          })
        }
      }

      return []
    },
    themeLicense() {
      if (this.themeData !== null && this.themeData.license) {
        return this.themeData.license
      }

      return null
    },
  },
  methods: {
    openExternal(url) {
      shell.openExternal(url)
    },
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

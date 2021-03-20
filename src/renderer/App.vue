<template>
  <v-app>
    <v-overlay
      :value="!appReady"
      absolute
      :opacity="1"
      z-index="10000"
      color="#031a1c"
    >
      <v-row>
        <v-col cols="12" class="d-flex align-center justify-center">
          <img src="~@/assets/soothsayer.png" />
        </v-col>
        <v-col cols="12" class="d-flex align-center justify-center">{{
          loadStatus
        }}</v-col>
        <v-col cols="12" class="d-flex align-center justify-center">
          <v-progress-circular indeterminate size="64"></v-progress-circular
        ></v-col>
      </v-row>
    </v-overlay>

    <div class="top-border"></div>

    <v-system-bar class="dark-bg system-bar" app window height="51">
      <span class="bar-title">{{ $route.name }}</span>
      <v-spacer></v-spacer>
      <div class="app button" @click="minimize">
        <v-icon>mdi-minus</v-icon>
      </div>
      <div class="app button" @click="maximize">
        <v-icon>mdi-checkbox-blank-outline</v-icon>
      </div>
      <div class="app button close" @click="close">
        <v-icon>mdi-close</v-icon>
      </div>
    </v-system-bar>

    <v-navigation-drawer app permanent class="dark-bg" :width="460">
      <v-list>
        <v-list-item class="px-2" two-line>
          <v-list-item-content>
            <div class="soothsayer-bar-logo"></div>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-row>
              <v-col
                cols="4"
                class="d-flex flex-column align-content-center justify-center align-center"
              >
                <v-btn fab color="primary" class="nav-btn" @click="update"
                  ><v-icon large>mdi-update</v-icon></v-btn
                >
                <span class="mt-3 nav-dark">{{ $t('leftNav.update') }}</span>
              </v-col>
              <v-col
                cols="4"
                class="d-flex flex-column align-content-center justify-center align-center"
              >
                <v-btn fab color="primary" class="nav-btn" to="/status"
                  ><v-icon large>mdi-file-find</v-icon></v-btn
                >
                <span class="mt-3 nav-dark">{{ $t('leftNav.overlays') }}</span>
              </v-col>
              <v-col
                cols="4"
                class="d-flex flex-column align-content-center justify-center align-center"
              >
                <v-btn fab color="primary" class="nav-btn" to="/"
                  ><v-icon large>mdi-view-dashboard</v-icon></v-btn
                >
                <span class="mt-3 nav-dark">{{ $t('leftNav.dashboard') }}</span>
              </v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list nav dense>
        <v-list-item
          to="/general"
          v-show="$store.getters.menuVisible('general')"
        >
          <v-list-item-icon><v-icon>mdi-key</v-icon></v-list-item-icon>
          <v-list-item-title>User Information</v-list-item-title>
        </v-list-item>
        <v-list-item
          to="/schedule"
          v-show="$store.getters.menuVisible('schedule')"
        >
          <v-list-item-icon><v-icon>mdi-calendar</v-icon></v-list-item-icon>
          <v-list-item-title>Schedule</v-list-item-title>
        </v-list-item>
        <v-list-item to="/settings">
          <v-list-item-icon><v-icon>mdi-cog</v-icon></v-list-item-icon>
          <v-list-item-title>Application Settings</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-list nav dense>
        <v-subheader
          >Cast Setup
          <span class="save profile" @click="saveProfile"
            >Save <v-icon>mdi-download</v-icon></span
          >
          <span class="load profile" @click.stop="castProfileDialog = true"
            >Load <v-icon>mdi-upload</v-icon></span
          >
        </v-subheader>
        <v-list-item
          to="/co-caster"
          v-show="$store.getters.menuVisible('coCaster')"
        >
          <v-list-item-icon><v-icon>mdi-microphone</v-icon></v-list-item-icon>
          <v-list-item-title>Co-Caster Information</v-list-item-title>
        </v-list-item>
        <v-list-item
          to="/tournament"
          v-show="$store.getters.menuVisible('tournament')"
        >
          <v-list-item-icon><v-icon>mdi-tournament</v-icon></v-list-item-icon>
          <v-list-item-title>Tournament Info</v-list-item-title>
        </v-list-item>
        <v-list-item
          to="/players-teams"
          v-show="$store.getters.menuVisible('playersTeams')"
        >
          <v-list-item-icon
            ><v-icon>mdi-account-group</v-icon></v-list-item-icon
          >
          <v-list-item-title>Players &amp; Teams</v-list-item-title>
        </v-list-item>
        <v-list-item
          to="/scoreboard"
          v-show="$store.getters.menuVisible('scoreboard')"
        >
          <v-list-item-icon><v-icon>mdi-scoreboard</v-icon></v-list-item-icon
          ><v-list-item-title>Scoreboard</v-list-item-title>
        </v-list-item>
        <v-list-item
          to="/notepad"
          v-show="$store.getters.menuVisible('notepad')"
        >
          <v-list-item-icon><v-icon>mdi-note-text</v-icon></v-list-item-icon>
          <v-list-item-title>Notepad</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-list nav dense>
        <v-subheader>Dynamic Elements</v-subheader>
        <v-list-item
          to="/lower-third"
          v-show="$store.getters.menuVisible('lowerThird')"
        >
          <v-list-item-icon
            ><v-icon>mdi-folder-information</v-icon></v-list-item-icon
          >
          <v-list-item-title>Lower Third</v-list-item-title>
        </v-list-item>
        <v-list-item
          to="/whiteboard"
          v-show="$store.getters.menuVisible('whiteboard')"
        >
          <v-list-item-icon><v-icon>mdi-earth</v-icon></v-list-item-icon>
          <v-list-item-title>Map</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-footer class="status" padless absolute>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <a v-bind="attrs" v-on="on" @click="about" class="mr-2">
              {{
                showUpdateStatus
                  ? 'Downloading Update'
                  : `v${$store.state.version}`
              }}</a
            ></template
          >
          <span>About the App</span>
        </v-tooltip>
        |
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              v-on="on"
              class="ml-2"
              color="#487e84"
              @click="discord"
              >mdi-discord</v-icon
            >
          </template>
          <span>Join the Discord</span>
        </v-tooltip>
      </v-footer>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <v-banner
          single-line
          sticky
          class="mb-4"
          v-show="updateAvailable"
          color="green darken-3"
        >
          Update Available. Click the button to install and relaunch Soothsayer.
          <template v-slot:actions>
            <v-btn text color="yellow darken-2" @click="updateApp">
              Update and Restart
            </v-btn>
          </template>
        </v-banner>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-dialog v-model="castProfileDialog" max-width="400">
      <v-card>
        <v-card-title class="headline mb-2">Load Cast Profile</v-card-title>
        <v-card-subtitle
          >Only upload files generated by Soothsayer</v-card-subtitle
        >
        <v-card-text>
          <v-file-input
            v-model="selectedProfile"
            :loading="loading"
            :error="profileErrorMessages.length > 0"
            :error-messages="profileErrorMessages"
          ></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green" text @click="loadProfile">Load</v-btn>
          <v-btn color="red" text @click="castProfileDialog = false"
            >Cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <first-launch></first-launch>

    <v-tooltip left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
          class="problem"
          color="yellow darken-3"
          fab
          elevation="2"
          @click="openIssue"
        >
          <v-icon>mdi-message-alert-outline</v-icon>
        </v-btn>
      </template>
      <span>Report a Problem</span>
    </v-tooltip>
  </v-app>
</template>

<script>
import { ipcRenderer, shell } from 'electron'
import { MUTATION, ACTION } from './store/actions'
import { KEYBOARD_SHORTCUTS } from './data/keyboardShortcuts'
import FirstLaunch from './components/FirstLaunch'

export default {
  name: 'soothsayer-2',
  components: { FirstLaunch },
  beforeCreate() {
    this.loadStatus = 'Registering Hooks'

    // add ipc hooks from main
    ipcRenderer.on('register-overlay', (event, data) => {
      this.$store.dispatch(ACTION.INIT_OVERLAY, data)
    })

    ipcRenderer.on('unregister-overlay', (event, id) => {
      this.$store.dispatch(ACTION.DISCONNECT_OVERLAY, id)
    })

    ipcRenderer.on('set-version', (event, { version, localFiles }) => {
      this.$store.commit(MUTATION.SET_VERSION, version)
      this.$store.commit(MUTATION.SET_LOCAL_FILES, localFiles)
    })

    ipcRenderer.on('update-version', (event, version) => {
      this.updateVersion = version
      this.showUpdateStatus = true
    })

    ipcRenderer.on('update-ready', () => {
      this.updateAvailable = true
      this.showUpdateStatus = false
    })

    // keyboard shortcuts
    // main process sends an action key (keyboard shortcuts cannot currently have arguments)
    ipcRenderer.on('keyboard', (event, { key }) => {
      this.$store.dispatch(KEYBOARD_SHORTCUTS[key])
    })

    // ipcRenderer.send('get-version');
  },
  beforeMount() {
    this.loadStatus = 'Loading State'

    ipcRenderer.invoke('load-state').then((state) => {
      // action just in case some async stuff needs to happen later
      // images might need to be formatted, etc.
      this.$store.dispatch(ACTION.LOAD_STATE, state)

      // if the loaded state has a locale key, set it (otherwise use default)
      if (state.app.locale) {
        this.$i18n.locale = state.app.locale
      }

      setTimeout(() => {
        this.loadStatus = 'Load Complete'
        this.appReady = true
      }, 1000)
    })
  },
  data() {
    return {
      castProfileDialog: false,
      selectedProfile: null,
      loading: false,
      profileErrorMessages: [],
      appReady: false,
      loadStatus: 'Loading Soothsayer',
      updateAvailable: false,
      showUpdateStatus: false,
      updateVersion: undefined,
    }
  },
  methods: {
    about() {
      // this error doesn't matter
      this.$router.push('/about').catch(() => {})
    },
    update() {
      this.$store.dispatch(ACTION.UPDATE)
    },
    minimize() {
      ipcRenderer.send('minimize')
    },
    maximize() {
      ipcRenderer.send('maximize')
    },
    close() {
      ipcRenderer.send('quit')
    },
    openIssue() {
      shell.openExternal('https://github.com/ebshimizu/soothsayer-2/issues/new')
    },
    discord() {
      shell.openExternal('https://discord.gg/wzU3YtaT4t')
    },
    saveProfile() {
      const a = document.createElement('a')
      const file = new Blob(
        [JSON.stringify(this.$store.getters.castProfile, null, 2)],
        {
          type: 'application/json',
        },
      )
      a.href = URL.createObjectURL(file)
      a.download = `soothsayer-2-cast-profile-${Date.now()}.json`
      a.click()
    },
    loadProfile() {
      this.loading = true

      const reader = new FileReader()
      reader.addEventListener('load', (e) => {
        try {
          const profile = JSON.parse(e.target.result)

          // uh, validate i guess
          // just make sure show exists
          if ('show' in profile) {
            this.$store.commit(MUTATION.LOAD_STATE, profile)
            this.castProfileDialog = false
            this.loading = false
            this.profileErrorMessages = []
          } else {
            this.loading = false
            this.profileErrorMessages = [
              'Failed to load profile. Show data not found.',
            ]
          }
        } catch (e) {
          console.log(e)
          this.profileErrorMessages = [`Failed to load profile: ${e}.`]
          this.loading = false
        }
      })

      reader.addEventListener('error', () => {
        console.log('Upload error')
        this.loading = false
        this.profileErrorMessages = ['Failed to load profile']
      })

      reader.readAsText(this.selectedProfile)
    },
    updateApp() {
      ipcRenderer.send('install-and-relaunch')
    },
  },
}
</script>

<style lang="scss">
$body-font-family: 'Muli', sans-serif;
$title-font: 'Muli', sans-serif;
$bg: #0d2629;
$dark-bg: #031a1c;
$primary: #5ee2ea;
$nav-link-dark: #487e84;

.v-application {
  font-family: $body-font-family, sans-serif !important;
  background: $bg !important;

  .title {
    // To pin point specific classes of some components
    font-family: $title-font, sans-serif !important;
  }
}

.dark-bg {
  background: $dark-bg !important;
}

.v-messages__message {
  line-height: 20px !important;
}

.v-stepper,
.v-dialog {
  background-color: $dark-bg !important;
}

.v-dialog .v-stepper {
  box-shadow: unset;
}

.v-stepper__label {
  text-transform: uppercase;
  font-weight: 900;
  font-size: 28px;
}

.v-stepper__step--inactive {
  .v-stepper__label {
    color: #487e84 !important;
  }
}

.v-stepper__step__step.primary {
  color: $dark-bg !important;
}

.system-bar {
  position: fixed;
  left: 0;
  top: 1px !important;
  z-index: 5;
  width: 100%;
  -webkit-user-select: none;
  -webkit-app-region: drag;

  .bar-title {
    margin-left: 470px;
  }

  .v-icon {
    -webkit-app-region: no-drag;
    margin-right: 0 !important;
  }

  .app.button {
    display: flex;
    align-items: center;
    justify-content: center;
    justify-items: center;
    height: 100% !important;
    width: 51px !important;
  }

  .button:hover {
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.1);
  }

  .close {
    margin-right: -8px;
  }
  .close:hover {
    background-color: #e53935 !important;
  }
}

.top-border {
  height: 1px;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  -webkit-app-region: no-drag;
  -webkit-user-select: auto;
  z-index: 1000000;
  background-color: $dark-bg !important;
}

.v-navigation-drawer {
  padding: 0 32px 32px 32px;
}

.soothsayer-bar-logo {
  background-image: url('~@/assets/soothsayer.png');
  width: 100%;
  height: 62px;
  background-repeat: no-repeat;
  background-position: center;
}

.nav-btn {
  color: $dark-bg !important;
}

.nav-dark {
  color: $nav-link-dark !important;
  font-size: 16px;
}

html {
  overflow-y: hidden !important;
}

.v-main__wrap {
  overflow-y: auto !important;
  height: calc(100vh - 52px) !important;
}

.v-btn.primary span {
  color: $dark-bg !important;
}

.v-navigation-drawer {
  .v-subheader {
    color: $primary !important;
    font-size: 22px !important;
    font-weight: 600;

    .v-icon {
      color: $primary !important;
    }

    .profile {
      font-size: 16px !important;
      color: $nav-link-dark !important;
      font-weight: 400;
      position: absolute;
      right: 64px;
      cursor: pointer;
    }

    .profile.save {
      right: 150px;
    }
  }

  .status {
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    height: 50px;
    background-color: rgba(0, 0, 0, 0) !important;
    color: $nav-link-dark !important;

    a {
      color: $nav-link-dark !important;
    }

    a:hover {
      color: $primary !important;
    }

    .v-icon:hover {
      color: $primary !important;
    }
  }
}

.problem {
  position: absolute !important;
  right: 24px;
  bottom: 24px;
  z-index: 10;
}

.theme--dark.v-tabs > .v-tabs-bar,
.theme--dark.v-tabs-items {
  background-color: $bg !important;
}

.v-card.theme--dark {
  background-color: $dark-bg !important;
}

.v-data-table.theme--dark thead,
.v-data-table.theme--dark tr {
  background-color: $dark-bg;
}

.v-data-table.theme--dark tr.even {
  background-color: $bg;
}
</style>

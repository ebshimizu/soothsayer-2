<template>
  <v-app>
    <v-system-bar class="dark-bg system-bar" app window height="52">
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
                <span class="mt-3 nav-dark">Update</span>
              </v-col>
              <v-col
                cols="4"
                class="d-flex flex-column align-content-center justify-center align-center"
              >
                <v-btn fab color="primary" class="nav-btn" to="/status"
                  ><v-icon large>mdi-file-find</v-icon></v-btn
                >
                <span class="mt-3 nav-dark">Preview</span>
              </v-col>
              <v-col
                cols="4"
                class="d-flex flex-column align-content-center justify-center align-center"
              >
                <v-btn fab color="primary" class="nav-btn" to="/"
                  ><v-icon large>mdi-view-dashboard</v-icon></v-btn
                >
                <span class="mt-3 nav-dark">Dashboard</span>
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
          to="/co-caster"
          v-show="$store.getters.menuVisible('coCaster')"
        >
          <v-list-item-icon><v-icon>mdi-microphone</v-icon></v-list-item-icon>
          <v-list-item-title>Co-Caster Information</v-list-item-title>
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
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
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
  </v-app>
</template>

<script>
import { ipcRenderer } from 'electron'
import { MUTATION, ACTION } from './store/actions'
import { KEYBOARD_SHORTCUTS } from './data/keyboardShortcuts'
import FirstLaunch from './components/FirstLaunch'

export default {
  name: 'soothsayer-2',
  components: { FirstLaunch },
  beforeCreate() {
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

    ipcRenderer.invoke('load-state').then((state) => {
      // action just in case some async stuff needs to happen later
      // images might need to be formatted, etc.
      this.$store.dispatch(ACTION.LOAD_STATE, state)
    })

    // keyboard shortcuts
    // main process sends an action key (keyboard shortcuts cannot currently have arguments)
    ipcRenderer.on('keyboard', (event, { key }) => {
      this.$store.dispatch(KEYBOARD_SHORTCUTS[key])
    })

    // ipcRenderer.send('get-version');
  },
  data() {
    return {
      castProfileDialog: false,
      selectedProfile: null,
      loading: false,
      profileErrorMessages: [],
    }
  },
  methods: {
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
  },
}
</script>

<style lang="scss">
$body-font-family: 'Muli', sans-serif;
$title-font: 'Muli', sans-serif;
$dark-bg: #031a1c;
$primary: #5ee2ea;
$nav-link-dark: #487e84;

.v-application {
  font-family: $body-font-family, sans-serif !important;
  background: #0d2629 !important;

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
  top: 0;
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
    width: 52px !important;
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
  height: calc(100vh - 32px) !important;
}

.v-btn.primary span {
  color: $dark-bg !important;
}

.v-navigation-drawer .v-subheader {
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
</style>

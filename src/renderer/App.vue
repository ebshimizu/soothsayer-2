<template>
  <v-app>
    <v-system-bar class="dark-bg system-bar" app window height="52">
      <span class="bar-title">{{ $route.name }}</span>
      <v-spacer></v-spacer>
      <v-icon>mdi-minus</v-icon>
      <v-icon>mdi-checkbox-blank-outline</v-icon>
      <v-btn tile color="red" icon @click="close">
        <v-icon @click="close">mdi-close</v-icon></v-btn
      >
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
        <v-list-item to="/schedule">
          <v-list-item-icon><v-icon>mdi-calendar</v-icon></v-list-item-icon>
          <v-list-item-title>Schedule</v-list-item-title>
        </v-list-item>
        <v-list-item to="/settings">
          <v-list-item-icon><v-icon>mdi-cog</v-icon></v-list-item-icon>
          <v-list-item-title>Application Settings</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-list nav dense>
        <v-subheader>Cast Setup</v-subheader>
        <v-list-item
          to="/tournament"
          v-show="$store.getters.menuVisible('tournament')"
        >
          <v-list-item-icon><v-icon>mdi-tournament</v-icon></v-list-item-icon>
          <v-list-item-title>Tournament Info</v-list-item-title>
        </v-list-item>
        <v-list-item to="/players-teams">
          <v-list-item-icon
            ><v-icon>mdi-account-group</v-icon></v-list-item-icon
          >
          <v-list-item-title>Players &amp; Teams</v-list-item-title>
        </v-list-item>
        <v-list-item to="/co-caster">
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
  </v-app>
</template>

<script>
import { ipcRenderer } from 'electron'
import { MUTATION, ACTION } from './store/actions'
import { KEYBOARD_SHORTCUTS } from './data/keyboardShortcuts'

export default {
  name: 'soothsayer-2',
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
    return {}
  },
  methods: {
    update() {
      this.$store.dispatch(ACTION.UPDATE)
    },
    close() {
      ipcRenderer.send('quit')
    },
  },
}
</script>

<style lang="scss">
$body-font-family: 'Muli', sans-serif;
$title-font: 'Muli', sans-serif;
$dark-bg: #031a1c;
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
</style>

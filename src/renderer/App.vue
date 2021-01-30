<template>
  <v-app>
    <v-navigation-drawer app permanent expand-on-hover>
      <v-list>
        <v-list-item class="px-2" two-line>
          <v-list-item-avatar rounded="0">
            <img src="~@/assets/soothsayer-logo.png" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title
              >Soothsayer v{{ $store.getters.version }}</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item to="/">
          <v-list-item-icon
            ><v-icon>mdi-rocket-launch</v-icon></v-list-item-icon
          >
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>
        <v-list-item
          to="/general"
          v-show="$store.getters.menuVisible('general')"
        >
          <v-list-item-icon><v-icon>mdi-information</v-icon></v-list-item-icon>
          <v-list-item-title>Cast Info</v-list-item-title>
        </v-list-item>
        <v-list-item
          to="/tournament"
          v-show="$store.getters.menuVisible('tournament')"
        >
          <v-list-item-icon><v-icon>mdi-tournament</v-icon></v-list-item-icon>
          <v-list-item-title>Tournament Info</v-list-item-title>
        </v-list-item>
        <v-list-item
          to="/whiteboard"
          v-show="$store.getters.menuVisible('whiteboard')"
        >
          <v-list-item-icon><v-icon>mdi-draw</v-icon></v-list-item-icon>
          <v-list-item-title>Whiteboard</v-list-item-title>
        </v-list-item>
        <v-list-item
          to="/graphics"
          v-show="$store.getters.menuVisible('graphics')"
        >
          <v-list-item-icon
            ><v-icon>mdi-movie-filter</v-icon></v-list-item-icon
          >
          <v-list-item-title>Motion Graphics</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item to="/settings">
          <v-list-item-icon><v-icon>mdi-cog</v-icon></v-list-item-icon>
          <v-list-item-title>General Settings</v-list-item-title>
        </v-list-item>
        <v-list-item to="/theme">
          <v-list-item-icon><v-icon>mdi-palette</v-icon></v-list-item-icon>
          <v-list-item-title>Theme</v-list-item-title>
        </v-list-item>
        <v-list-item to="/status">
          <v-list-item-icon><v-icon>mdi-information</v-icon></v-list-item-icon>
          <v-list-item-title>Status</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="primary" app dark>
      <v-toolbar-title>{{ $route.name }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="green" large @click="update">Update</v-btn>
    </v-app-bar>

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
  },
}
</script>

<style>
/* CSS */
</style>

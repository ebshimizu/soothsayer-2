<template>
  <v-app>
    <v-navigation-drawer app permanent expand-on-hover>
      <v-list>
        <v-list-item class="px-2" two-line>
          <v-list-item-avatar rounded="0">
            <img src="~@/assets/soothsayer-logo.png" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>Soothsayer v{{ $store.getters.version }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item to="/">
          <v-list-item-icon><v-icon>mdi-information</v-icon></v-list-item-icon>
          <v-list-item-title>General Info</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item to="/settings">
          <v-list-item-icon><v-icon>mdi-cog</v-icon></v-list-item-icon>
          <v-list-item-title>Settings</v-list-item-title>
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

export default {
  name: 'soothsayer-2',
  beforeCreate () {
    // add ipc hooks from main
    ipcRenderer.on('register-overlay', (event, data) => {
      this.$store.dispatch(ACTION.INIT_OVERLAY, data)
    })

    ipcRenderer.on('unregister-overlay', (event, id) => {
      this.$store.dispatch(ACTION.DISCONNECT_OVERLAY, id)
    })

    ipcRenderer.on('set-version', (event, version) => {
      this.$store.commit(MUTATION.SET_VERSION, version)
    })

    ipcRenderer.send('get-version')
  },
  data () {
    return {}
  },
  methods: {
    update () {
      this.$store.dispatch(ACTION.UPDATE)
    }
  }
}
</script>

<style>
/* CSS */
</style>

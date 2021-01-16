<template>
  <v-app>
    <v-content>
      <div id="app">
        <router-view></router-view>
      </div>
    </v-content>
  </v-app>
</template>

<script>
import { ipcRenderer } from 'electron'
import { ACTION } from './store/actions'

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
  }
}
</script>

<style>
/* CSS */
</style>

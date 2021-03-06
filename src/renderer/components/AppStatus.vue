<template>
  <v-container>
    <h2 class="mb-2">{{ gameName }} Overlays</h2>
    <p>
      Add each element as a Browser Source to OBS by copying its link from
      Soothsayer and pasting it into OBS. Make sure the width and height in OBS
      match the dimensions given for the element in Soothsayer, and that OBS's
      CSS field is clear.
    </p>
    <v-data-table
      :headers="availableHeaders"
      :items="availableOverlays"
      :items-per-page="-1"
      :hide-default-footer="true"
      class="mb-2"
    >
      <template v-slot:item.actions="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" icon>
              <v-icon color="primary" @click="copyUrl(item)"
                >mdi-content-copy</v-icon
              >
            </v-btn>
          </template>
          <span>Copy URL</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" icon
              ><v-icon
                @click="toggleBackground(item)"
                :color="
                  item.settings.backgroundOff ? 'grey lighten-1' : 'primary'
                "
                >mdi-image</v-icon
              ></v-btn
            >
          </template>
          <span>Toggle Background</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" icon>
              <v-icon color="primary" @click="preview(item)"
                >mdi-file-find</v-icon
              >
            </v-btn>
          </template>
          <span>Preview in Soothsayer</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <h2 class="mb-2">Connected Overlays</h2>
    <v-data-table
      :headers="headers"
      :items="overlays"
      :items-per-page="-1"
      no-data-text="No Overlays Connected"
      :hide-default-footer="true"
    >
      <template v-slot:item.actions="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" icon>
              <v-icon color="warning" @click="identify(item)"
                >mdi-magnify</v-icon
              >
            </v-btn>
          </template>
          <span>Identify</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { ipcRenderer, clipboard } from 'electron'
import { GAME_STRING } from '../data/supportedGames'
import { ACTION } from '../store/actions'

export default {
  name: 'app-status',
  data() {
    return {
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Page', value: 'page' },
        { text: 'Socket ID', value: 'socketId' },
        { text: 'Actions', value: 'actions', sortable: 'false' },
      ],
      availableHeaders: [
        { text: 'Name', value: 'name' },
        { text: 'Page', value: 'page' },
        { text: 'Recommended Resolution', value: 'resolution' },
        { text: 'Actions', value: 'actions', sortable: 'false' },
      ],
    }
  },
  computed: {
    overlays() {
      return this.$store.getters.connectedOverlays
    },
    availableOverlays() {
      return this.$store.getters.availableOverlays
    },
    gameName() {
      return GAME_STRING[this.$store.state.app.game]
    },
  },
  methods: {
    copyUrl(item) {
      clipboard.writeText(`http://localhost:3005/${item.page}`)
    },
    preview(item) {
      ipcRenderer.invoke('preview', item)
    },
    identify(item) {
      // send an identify command to the overlay, which displays a full-screen overlay for a few seconds
      ipcRenderer.send('identify', item.socketId)
    },
    toggleBackground(item) {
      this.$store.dispatch(ACTION.SET_OVERLAY_SETTING, {
        overlay: item.page,
        prop: 'backgroundOff',
        value: !item.settings.backgroundOff,
      })
    },
  },
}
</script>

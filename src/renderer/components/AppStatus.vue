<template>
  <v-container>
    <h2 class="mb-2">Available Overlays</h2>

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
import { ipcRenderer } from 'electron';

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
    };
  },
  computed: {
    overlays() {
      return this.$store.getters.connectedOverlays;
    },
  },
  methods: {
    copyUrl(item) {
      // do the thing
    },
    identify(item) {
      // send an identify command to the overlay, which displays a full-screen overlay for a few seconds
      ipcRenderer.send('identify', item.socketId);
    }
  },
};
</script>

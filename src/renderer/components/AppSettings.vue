<template>
  <v-row dense>
    <v-col cols="12">
      <v-select
        v-model="game"
        :items="games"
        label="Selected Game Configuration"
        hint="Each game supports a different set of overlays and functions."
        persistent-hint
      ></v-select>
    </v-col>
  </v-row>
</template>

<script>
import { MUTATION } from '../store/actions'

export default {
  name: 'app-settings',
  computed: {
    games() {
      return this.$store.getters.supportedGames
    },
    game: {
      get() {
        return this.$store.state.app.game
      },
      set(value) {
        this.$store.commit(MUTATION.SET_APP_PROP, { key: 'game', value })
      },
    },
  },
}
</script>

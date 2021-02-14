<template>
  <v-row dense>
    <v-col cols="12">
      <v-card>
        <v-card-title>Participants</v-card-title>
        <v-card-subtitle
          >A list of player names, listed one per line. Names entered here will
          be used as shortcuts in other parts of the app, such as the lower
          third</v-card-subtitle
        >
        <v-card-text>
          <v-textarea
            label="Participants"
            :value="this.$store.state.show.playerPool"
            @input="(v) => updateShowParam('playerPool', v)"
          ></v-textarea>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { MUTATION } from '../store/actions'

export default {
  name: 'players-teams',
  methods: {
    updateShowParam(key, value) {
      this.$store.commit(MUTATION.SET_SHOW_PROP, {
        key,
        value,
      })
    },
  },
}
</script>

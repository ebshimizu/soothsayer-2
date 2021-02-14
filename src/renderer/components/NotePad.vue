<template>
  <v-card>
    <v-card-title>Notepad</v-card-title>
    <v-card-subtitle
      >Some themes provide space for extra notes and commentary about the
      match/game/tournament</v-card-subtitle
    >
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field label="Title" v-model="notepadTitle"></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-textarea label="Notepad" v-model="notepad"></v-textarea>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { MUTATION } from '../store/actions'

export default {
  name: 'note-pad',
  computed: {
    notepadTitle: {
      get() {
        return this.$store.state.show.notepadTitle
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SHOW_PROP, {
          key: 'notepadTitle',
          value,
        })
      },
    },
    notepad: {
      get() {
        return this.$store.state.show.notepad
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SHOW_PROP, { key: 'notepad', value })
      },
    },
  },
}
</script>

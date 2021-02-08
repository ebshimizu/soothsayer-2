<template>
  <v-row dense v-show="$store.getters.componentVisible('tournament-info')">
    <v-col cols="12">
      <v-card outlined>
        <v-card-title>Tournament Information</v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col>
              <v-text-field
                label="Tournament Name"
                :value="$store.state.show.tournamentName"
                @input="(v) => updateShowParam('tournamentName', v)"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <sponsor-logos></sponsor-logos>
    </v-col>
  </v-row>
</template>

<script>
import { MUTATION } from '../store/actions'
import SponsorLogos from './SponsorLogos.vue'

export default {
  components: { SponsorLogos },
  name: 'tournament-info',
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

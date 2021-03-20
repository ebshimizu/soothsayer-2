<template>
  <v-col cols="12">
    <div
      class="d-flex justify-center align-center align-content-center flex-column"
    >
      <span class="mb-2">{{ $t('scoreboard.erbs.mode') }}</span>
      <v-btn-toggle rounded mandatory v-model="mode">
        <v-btn value="solo" class="pl-4">
          <v-icon left>mdi-account</v-icon>
          <span class="hidden-sm-and-down">{{ $t('label.solo') }}</span>
        </v-btn>
        <v-btn value="team" class="pr-4">
          <span class="hidden-sm-and-down">{{ $t('label.erbs-teams') }}</span>
          <v-icon right>mdi-account-group</v-icon>
        </v-btn>
      </v-btn-toggle>
    </div>
    <v-row dense class="mt-2">
      <v-col cols="6">
        <v-card outlined>
          <v-card-title>{{
            $t('scoreboard.erbs.computed-title')
          }}</v-card-title>
          <v-card-subtitle>{{
            $t('scoreboard.erbs.computed')
          }}</v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card outlined>
          <v-card-title>{{ $t('scoreboard.erbs.entry-title') }}</v-card-title>
          <v-card-subtitle>{{ $t('scoreboard.erbs.entry') }}</v-card-subtitle>
          <v-card-text>
            <v-expansion-panels focusable>
              <erbs-scoreboard-round
                v-for="(round, idx) in rounds"
                :key="round"
                v-bind:roundId="round"
                v-bind:displayName="$t('scoreboard.erbs.round', [idx + 1])"
                v-bind:players="players"
                v-bind:teams="teams"
              />
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import { MUTATION } from '../store/actions'
import ErbsScoreboardRound from './ErbsScoreboardRound.vue'

export default {
  components: { ErbsScoreboardRound },
  name: 'erbs-scoreboard',
  props: ['players', 'teams'],
  computed: {
    rounds() {
      return Object.keys(this.$store.state.show.erbsStandings.rounds)
    },
    mode: {
      get() {
        return this.$store.state.show.erbsStandings.mode
      },
      set(value) {
        this.$store.commit(MUTATION.ERBS_SET_SCOREBOARD_PROP, {
          key: 'mode',
          value,
        })
      },
    },
  },
}
</script>

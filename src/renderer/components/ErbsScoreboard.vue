<template>
  <v-col cols="12">
    <v-row dense>
      <v-col cols="6">
        <div
          class="d-flex justify-center align-center align-content-center flex-row"
          style="height: 100%"
        >
          <span class="mr-4">{{ $t('scoreboard.erbs.mode') }}</span>
          <v-btn-toggle rounded mandatory v-model="mode">
            <v-btn value="solo" class="pl-4">
              <v-icon left>mdi-account</v-icon>
              <span class="hidden-sm-and-down">{{ $t('label.solo') }}</span>
            </v-btn>
            <v-btn value="team" class="pr-4">
              <span class="hidden-sm-and-down">{{
                $t('label.erbs-teams')
              }}</span>
              <v-icon right>mdi-account-group</v-icon>
            </v-btn>
          </v-btn-toggle>
        </div>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="2">
        <v-text-field
          :label="$t('label.scoreboard-time')"
          type="number"
          min="0"
          :value="scoreboardDisplayTime"
          @input="(v) => updateProp('scoreboardDisplayTime', parseInt(v))"
        />
      </v-col>
      <v-col cols="2">
        <v-text-field
          :label="$t('label.scoreboard-count')"
          type="number"
          min="0"
          :value="scoreboardDisplayCount"
          @input="(v) => updateProp('scoreboardDisplayCount', parseInt(v))"
        />
      </v-col>
      <v-col class="d-flex align-center justify-center align-content-center">
        <v-btn color="primary" @click="resetDisplay">{{
          $t('label.reset')
        }}</v-btn>
      </v-col>
    </v-row>
    <v-row dense class="mt-2">
      <v-col cols="6">
        <v-card outlined>
          <v-card-title>{{
            $t('scoreboard.erbs.computed-title')
          }}</v-card-title>
          <v-card-subtitle>{{
            $t('scoreboard.erbs.computed')
          }}</v-card-subtitle>
          <v-card-text>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th>{{ $t('label.place') }}</th>
                    <th>{{ title }}</th>
                    <th>{{ $t('label.points') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, index) in computedScoreboard" :key="row.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ row.name }}</td>
                    <td>{{ row.total }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
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
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" @click="resetAll">{{
              $t('label.clear-all')
            }}</v-btn>
          </v-card-actions>
        </v-card>
        <v-card outlined>
          <v-card-title>{{ $t('scoreboard.erbs.point-title') }}</v-card-title>
          <v-card-subtitle>{{
            $t('scoreboard.erbs.point-description')
          }}</v-card-subtitle>
          <v-card-text>
            <v-row dense>
              <v-col cols="2">
                <v-text-field
                  type="number"
                  min="0"
                  :label="$t('label.erbs-kill')"
                  v-model="kill"
                />
              </v-col>
              <v-col cols="2" v-for="rank in ranks" :key="rank.rank">
                <v-text-field
                  type="number"
                  min="0"
                  :label="$t('label.erbs-rank-ordinal', [rank.rank])"
                  :value="rank.points"
                  @input="(v) => updateRankPoints(rank.rank, parseInt(v))"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" @click="resetScoring">{{
              $t('label.reset-scoring')
            }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import { MUTATION } from '../store/actions'
import { defaultShowData } from '../store/defaults'
import ErbsScoreboardRound from './ErbsScoreboardRound.vue'

export default {
  components: { ErbsScoreboardRound },
  name: 'erbs-scoreboard',
  props: ['players', 'teams'],
  computed: {
    computedScoreboard() {
      return this.$store.getters.erbsComputedScoreboard
    },
    rounds() {
      return Object.keys(this.$store.state.show.erbsStandings.rounds)
    },
    ranks() {
      return this.mode === 'solo'
        ? this.$store.state.show.erbsStandings.points.soloRank
        : this.$store.state.show.erbsStandings.points.groupRank
    },
    title() {
      if (this.mode === 'solo') {
        return this.$t('label.player-name')
      } else if (this.mode === 'team') {
        return this.$t('label.team-name')
      }
    },
    scoreboardDisplayTime() {
      return this.$store.state.show.scoreboardDisplayTime
    },
    scoreboardDisplayCount() {
      return this.$store.state.show.scoreboardDisplayCount
    },
    kill: {
      get() {
        return this.$store.state.show.erbsStandings.points.kill
      },
      set(val) {
        this.$store.commit(MUTATION.ERBS_SET_SCOREBOARD_POINTS, {
          key: 'kill',
          value: val,
        })
      },
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
  methods: {
    updateRankPoints(rank, points) {
      this.$store.commit(MUTATION.ERBS_SET_SCOREBOARD_POINTS, {
        key: rank,
        value: points,
      })
    },

    updateProp(key, value) {
      this.$store.commit(MUTATION.SET_SHOW_PROP, { key, value })
    },
    resetAll() {
      this.$store.commit(MUTATION.ERBS_RESET_ALL_ROUNDS)
    },
    resetScoring() {
      this.$store.commit(MUTATION.ERBS_RESET_SCOREBOARD_POINTS)
    },
    resetDisplay() {
      const defaults = defaultShowData()
      this.$store.commit(MUTATION.SET_SHOW_PROP, {
        key: 'scoreboardDisplayTime',
        value: defaults.scoreboardDisplayTime,
      })
      this.$store.commit(MUTATION.SET_SHOW_PROP, {
        key: 'scoreboardDisplayCount',
        value: defaults.scoreboardDisplayCount,
      })
    },
  },
}
</script>

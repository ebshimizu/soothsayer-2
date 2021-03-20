<template>
  <v-expansion-panel>
    <v-expansion-panel-header>{{ displayName }}</v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-simple-table dark class="mt-4">
        <template v-slot:default>
          <thead>
            <tr>
              <th>{{ title }}</th>
              <th>{{ $t('label.erbs-kill') }}</th>
              <th>{{ $t('label.erbs-rank') }}</th>
              <th>{{ $t('label.points') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in roundData" :key="row.id">
              <td>{{ row.name }}</td>
              <td>
                <v-text-field
                  type="number"
                  min="0"
                  :label="$t('label.erbs-kill')"
                  single-line
                  :value="row.kill"
                  @input="
                    (v) => updateRoundEntry(row.id, row, 'kill', parseFloat(v))
                  "
                />
              </td>
              <td>
                <v-text-field
                  type="number"
                  min="1"
                  :label="$t('label.erbs-rank')"
                  single-line
                  :value="row.rank"
                  @input="
                    (v) => updateRoundEntry(row.id, row, 'rank', parseFloat(v))
                  "
                />
              </td>
              <td>{{ rowPoints(row.id) }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { MUTATION } from '../store/actions'
export default {
  name: 'erbs-scoreboard-round',
  props: ['roundId', 'displayName', 'players', 'teams'],
  computed: {
    pointsByPlayer() {
      const data = {}
      const scoreboard = this.$store.getters.erbsComputedScoreboard
      scoreboard.forEach((p) => (data[p.id] = p.roundsData[this.roundId].points))
      return data
    },
    mode() {
      return this.$store.state.show.erbsStandings.mode
    },
    roundData() {
      // round data displays all players/teams (depending on mode)
      const rows = this.mode === 'solo' ? this.players : this.teams
      const modeData = this.$store.state.show.erbsStandings.rounds[
        this.roundId
      ][this.mode]

      return rows.map((r) => {
        const roundEntry = modeData[r.value]

        return {
          id: r.value,
          name: r.text,
          kill: roundEntry ? roundEntry.kill : 0,
          rank: roundEntry ? roundEntry.rank : 18,
        }
      })
    },
    title() {
      if (this.mode === 'solo') {
        return this.$t('label.player-name')
      } else if (this.mode === 'team') {
        return this.$t('label.team-name')
      }
    },
  },
  methods: {
    playerName(id) {
      return this.$store.state.show.playerPool[id]
    },
    rowPoints(id) {
      const entry = this.pointsByPlayer[id]

      if (entry) return entry

      return 0
    },
    updateRoundEntry(id, data, key, value) {
      const updatedData = {
        ...data,
      }
      updatedData[key] = value

      this.$store.commit(MUTATION.ERBS_SET_ROUND_DATA, {
        round: this.roundId,
        mode: this.mode,
        id,
        data: updatedData,
      })
    },
  },
}
</script>

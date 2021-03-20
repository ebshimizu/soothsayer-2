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
                  min="0"
                  :label="$t('label.erbs-rank')"
                  single-line
                  :value="row.rank"
                  @input="
                    (v) => updateRoundEntry(row.id, row, 'rank', parseFloat(v))
                  "
                />
              </td>
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
          rank: roundEntry ? roundEntry.rank : 0,
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

<template>
  <v-expansion-panel>
    <v-expansion-panel-header>{{ displayName }}</v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row dense class="mt-4">
        <v-col cols="6">
          <v-dialog v-model="importDialog" max-width="800">
            <template v-slot:activator="{ on, attrs }">
              <v-btn block color="primary" @click="openImportDialog">
                <v-icon class="mr-2">mdi-application-import</v-icon> Import
              </v-btn>
            </template>
            <v-card>
              <v-card-title>{{
                $t('scoreboard.erbs.import-title', [displayName])
              }}</v-card-title>
              <v-card-subtitle>{{
                $t('scoreboard.erbs.import-help')
              }}</v-card-subtitle>
              <v-card-text>
                <v-textarea
                  :label="$t('label.import-data-field')"
                  v-model="importData"
                  :error-messages="importErrorMessage"
                  outlined
                />
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text color="red" @click="closeImportDialog"
                  >Cancel</v-btn
                >
                <v-btn text color="primary" @click="parseImportData"
                  >Import</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
        <v-col cols="6">
          <v-btn block color="red" @click="resetRound"
            ><v-icon class="mr-2">mdi-eraser-variant</v-icon> Reset</v-btn
          >
        </v-col>
      </v-row>
      <v-simple-table dark class="mt-4">
        <template v-slot:default>
          <thead>
            <tr>
              <th>{{ title }}</th>
              <th>{{ $t('label.erbs-rank') }}</th>
              <th>{{ $t('label.erbs-kill') }}</th>
              <th>{{ $t('label.points') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in roundData" :key="row.id">
              <td>{{ row.name }}</td>
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
  data() {
    return {
      importData: '',
      importDialog: false,
      importErrorMessage: null,
    }
  },
  computed: {
    pointsByPlayer() {
      const data = {}
      const scoreboard = this.$store.getters.erbsComputedScoreboard
      scoreboard.forEach(
        (p) => (data[p.id] = p.roundsData[this.roundId].points),
      )
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
    resetRound() {
      this.$store.commit(MUTATION.ERBS_RESET_SCOREBOARD_ROUND, this.roundId)
    },
    openImportDialog() {
      this.importData = ''
      this.importErrorMessage = null
      this.importDialog = true
    },
    parseImportData() {
      // some string parsing wheeeee
      try {
        // split into rows
        const rows = this.importData.split('\n')

        // no data? no run
        if (rows.length === 0) {
          return
        }

        const splitRows = rows.map((r) => r.split('\t'))

        // determine import mode
        const matchName = splitRows[0].length > 2

        // players and teams are in vuetify dropdown mode, so
        // entityList.value is the uuid
        const entityList = this.mode === 'solo' ? this.players : this.teams

        // clear
        this.resetRound()

        const roundData = {}
        // iterate
        for (let i = 0; i < splitRows.length; i++) {
          const row = splitRows[i]

          // collect data
          let name, rank, kill
          let id = null

          if (matchName) {
            name = row[0]
            rank = row[1]
            kill = row[2]

            id = entityList.find((e) => e.text === name).value
          } else {
            rank = row[0]
            kill = row[1]

            id = i < entityList.length ? entityList[i].value : null
          }

          if (id) {
            roundData[id] = { rank: parseInt(rank), kill: parseInt(kill) }
          }
        }

        // execute
        this.$store.commit(MUTATION.ERBS_SET_ALL_ROUND_DATA, {
          round: this.roundId,
          mode: this.mode,
          data: roundData,
        })

        this.closeImportDialog()
      } catch (e) {
        console.log(e)
        this.importErrorMessage = `${e}`
      }
    },
    closeImportDialog() {
      this.importDialog = false
    },
  },
}
</script>

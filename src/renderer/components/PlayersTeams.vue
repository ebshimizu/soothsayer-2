<template>
  <v-row dense>
    <v-col cols="12">
      <v-tabs v-model="tab" @change="updateTeamPlayers">
        <v-tab key="player">{{ $t('players.title') }}</v-tab>
        <v-tab key="team">{{ $t('teams.title') }}</v-tab>
      </v-tabs>
    </v-col>
    <v-col cols="12">
      <v-tabs-items v-model="tab">
        <v-tab-item key="player">
          <v-card>
            <v-card-title>{{ $t('players.title') }}</v-card-title>
            <v-card-subtitle>{{ $t('players.description') }}</v-card-subtitle>
            <v-card-text>
              <v-simple-table dark>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th>{{ $t('label.player-name') }}</th>
                      <th>{{ $t('label.twitter') }}</th>
                      <th>{{ $t('label.twitch') }}Teams</th>
                      <th>{{ $t('label.actions') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(player, idx) in players"
                      :key="player.id"
                      :class="{ even: idx % 2 === 0 }"
                    >
                      <td>
                        <v-text-field
                          single-line
                          :label="$t('label.name')"
                          :value="player.name"
                          @input="(v) => updatePlayer('name', v, player.id)"
                        />
                      </td>
                      <td>
                        <v-text-field
                          single-line
                          :label="$t('label.twitter')"
                          :value="player.twitter"
                          @input="(v) => updatePlayer('twitter', v, player.id)"
                          prepend-icon="mdi-twitter"
                        />
                      </td>
                      <td>
                        <v-text-field
                          single-line
                          :label="$t('label.twitch')"
                          :value="player.twitch"
                          @input="(v) => updatePlayer('twitch', v, player.id)"
                          prepend-icon="mdi-twitch"
                        />
                      </td>
                      <td>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              color="red"
                              v-bind="attrs"
                              v-on="on"
                              class="mx-auto"
                              @click="deletePlayer(player.id)"
                              >mdi-delete</v-icon
                            >
                          </template>
                          <span>{{ $t('label.delete') }}</span>
                        </v-tooltip>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-dialog v-model="importDialog" max-width="800px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    text
                    @click="
                      () => {
                        importData = ''
                        importDialog = true
                      }
                    "
                    >{{ $t('players.mass-import') }}</v-btn
                  >
                </template>
                <v-card>
                  <v-card-title>{{ $t('players.mass-import') }}</v-card-title>
                  <v-card-text
                    ><p>
                      {{ $t('players.mass-import-instructions') }}
                    </p>
                    <v-textarea
                      outlined
                      :label="$t('players.mass-import-field')"
                      v-model="importData"
                    >
                    </v-textarea>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green" @click="importPlayerData">{{
                      $t('label.import')
                    }}</v-btn>
                    <v-btn outlined color="red" @click="importDialog = false">{{
                      $t('label.cancel')
                    }}</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-btn text color="primary" @click="addPlayer">{{
                $t('players.add-player')
              }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-tab-item>
        <v-tab-item key="team">
          <v-card>
            <v-card-title>{{ $t('teams.title') }}</v-card-title>
            <v-card-subtitle>{{ $t('teams.description') }}</v-card-subtitle>
            <v-card-text>
              <v-simple-table dark>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th>{{ $t('label.team-name') }}</th>
                      <th>{{ $t('label.players') }}</th>
                      <th>{{ $t('label.actions') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(team, idx) in teams"
                      :key="team.id"
                      :class="{ even: idx % 2 === 0 }"
                    >
                      <td>
                        <v-text-field
                          single-line
                          :label="$t('label.name')"
                          :value="team.name"
                          @input="(v) => updateTeam('name', v, team.id)"
                        />
                      </td>
                      <td>
                        <v-autocomplete
                          :value="team.players"
                          :items="filteredTeamPlayers(team.id)"
                          @input="(v) => updateTeam('players', v, team.id)"
                          chips
                          multiple
                          deletable-chips
                          clearable
                        >
                          <template v-slot:item="data">
                            <v-list-item-content>
                              <v-list-item-title>{{
                                data.item.text
                              }}</v-list-item-title>
                            </v-list-item-content>
                          </template>
                        </v-autocomplete>
                      </td>
                      <td>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              color="red"
                              v-bind="attrs"
                              v-on="on"
                              class="mx-auto"
                              @click="deleteTeam(team.id)"
                              >mdi-delete</v-icon
                            >
                          </template>
                          <span>{{ $t('label.delete') }}</span>
                        </v-tooltip>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="addTeam">{{
                $t('teams.add')
              }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-col>
  </v-row>
</template>

<script>
import { MUTATION } from '../store/actions'
import { defaultPlayerItem } from '../store/defaults'

export default {
  name: 'players-teams',
  data() {
    return {
      importData: '',
      importDialog: false,
      tab: 'players',
      teamPlayers: [],
      localPlayers: {},
      localTeams: {},
      assigned: {},
    }
  },
  watch: {
    players(val) {
      this.localPlayers = val
      this.updateTeamPlayers()
    },
    teams(val) {
      this.localTeams = val
      this.updateTeamPlayers()
    },
  },
  beforeMount() {
    this.localTeams = this.$store.state.show.teams
    this.localPlayers = this.$store.state.show.playerPool
  },
  computed: {
    players() {
      return Object.values(this.$store.state.show.playerPool)
    },
    teams() {
      return Object.values(this.$store.state.show.teams)
    },
  },
  methods: {
    updateShowParam(key, value) {
      this.$store.commit(MUTATION.SET_SHOW_PROP, {
        key,
        value,
      })
    },
    updateTeamPlayers() {
      console.log('updating')
      this.assigned = {}
      Object.values(this.localTeams).forEach((t) => {
        t.players.forEach((p) => (this.assigned[p] = t.id))
      })

      // vue im pleading with you to not cache this
      this.teamPlayers = Object.values(this.localPlayers).map((p) => {
        return {
          text: p.name,
          value: p.id,
          assignedTo: p.id in this.assigned ? this.assigned[p.id] : null,
        }
      })
    },
    filteredTeamPlayers(id) {
      const filtered = this.teamPlayers.filter(
        (item) => item.assignedTo === id || item.assignedTo === null,
      )
      return filtered
    },
    updatePlayer(key, value, id) {
      this.$store.commit(MUTATION.UPDATE_PLAYER, { key, value, id })
      this.updateTeamPlayers()
    },
    addPlayer() {
      this.$store.commit(MUTATION.NEW_PLAYER)
    },
    deletePlayer(id) {
      this.$store.commit(MUTATION.DELETE_PLAYER, id)
    },
    updateTeam(key, value, id) {
      this.$store.commit(MUTATION.UPDATE_TEAM, { key, value, id })
      this.updateTeamPlayers()
    },
    addTeam() {
      this.$store.commit(MUTATION.NEW_TEAM)
    },
    deleteTeam(id) {
      this.$store.commit(MUTATION.DELETE_TEAM, id)
    },
    importPlayerData() {
      // do the import
      const data = this.importData.split('\n')

      if (data.length > 0) {
        this.$store.commit(MUTATION.SET_SHOW_PROP, {
          key: 'playerPool',
          value: {},
        })
      }

      for (const line of data) {
        const fields = line.split('\t')
        const player = defaultPlayerItem()

        // must have at least one field with a non-empty player name
        if (fields.length >= 1 && fields[0] !== '') {
          player.name = fields[0]

          if (fields.length >= 2) {
            player.twitter = fields[1]
          }

          if (fields.length >= 3) {
            player.twitch = fields[2]
          }

          this.$store.commit(MUTATION.SET_PLAYER, player)
        }
      }

      this.importDialog = false
    },
  },
}
</script>

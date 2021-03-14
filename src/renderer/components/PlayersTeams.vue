<template>
  <v-row dense>
    <v-col cols="12">
      <v-tabs v-model="tab">
        <v-tab key="player">Players</v-tab>
        <v-tab key="team">Teams</v-tab>
      </v-tabs>
    </v-col>
    <v-col cols="12">
      <v-tabs-items v-model="tab">
        <v-tab-item key="player">
          <v-card>
            <v-card-title>Players</v-card-title>
            <v-card-subtitle
              >Enter player names and social handles here. Player names are
              required for the scoreboard to function. If your game requires
              team data, enter that on the Teams tab.</v-card-subtitle
            >
            <v-card-text>
              <v-simple-table dark>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th>Player Name</th>
                      <th>Twitter</th>
                      <th>Twitch</th>
                      <th>Actions</th>
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
                          label="Name"
                          :value="player.name"
                          @input="(v) => updatePlayer('name', v, player.id)"
                        />
                      </td>
                      <td>
                        <v-text-field
                          single-line
                          label="Twitter"
                          :value="player.twitter"
                          @input="(v) => updatePlayer('twitter', v, player.id)"
                          prepend-icon="mdi-twitter"
                        />
                      </td>
                      <td>
                        <v-text-field
                          single-line
                          label="Twitch"
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
                          <span>Delete</span>
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
                    >Mass Import</v-btn
                  >
                </template>
                <v-card>
                  <v-card-title>Mass Import</v-card-title>
                  <v-card-text
                    ><p>
                      Paste player data, one per row with tabs separating
                      columns.
                    </p>
                    <v-textarea
                      outlined
                      label="Player Import"
                      v-model="importData"
                    >
                    </v-textarea>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green" @click="importPlayerData"
                      >Import</v-btn
                    >
                    <v-btn outlined color="red" @click="importDialog = false"
                      >Cancel</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-btn text color="primary" @click="addPlayer">Add Player</v-btn>
            </v-card-actions>
          </v-card>
        </v-tab-item>
        <v-tab-item key="team">
          <v-card>
            <v-card-title>Teams</v-card-title>
            <v-card-subtitle
              >Teams consist of players. You can add players to multiple teams,
              however this might interfere with scoring calculations. Teams can
              consist of zero players, if your game uses teams alone instead of
              players. If your game uses team-based scoring, you must make teams
              here before they will appear in the scoreboard.</v-card-subtitle
            >
            <v-card-text>
              <v-simple-table dark>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th>Team Name</th>
                      <th>Players</th>
                      <th>Actions</th>
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
                          label="Name"
                          :value="team.name"
                          @input="(v) => updateTeam('name', v, team.id)"
                        />
                      </td>
                      <td>
                        <v-autocomplete
                          :value="team.players"
                          :items="teamPlayers()"
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
                          <span>Delete</span>
                        </v-tooltip>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="addTeam">Add Team</v-btn>
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
    }
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
    teamPlayers() {
      // vue im pleading with you to not cache this
      return Object.values(this.$store.state.show.playerPool)
        .map((p) => {
          return {
            text: p.name,
            value: p.id,
          }
        })
    },
    updatePlayer(key, value, id) {
      this.$store.commit(MUTATION.UPDATE_PLAYER, { key, value, id })
    },
    addPlayer() {
      this.$store.commit(MUTATION.NEW_PLAYER)
    },
    deletePlayer(id) {
      this.$store.commit(MUTATION.DELETE_PLAYER, id)
    },
    updateTeam(key, value, id) {
      this.$store.commit(MUTATION.UPDATE_TEAM, { key, value, id })
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

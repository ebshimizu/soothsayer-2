<template>
  <v-row dense>
    <erbs-scoreboard
      v-if="$store.getters.componentVisible('erbs-scoreboard')"
      v-bind:players="playerSelect"
      v-bind:teams="teamSelect"
    />
  </v-row>
</template>

<script>
import ErbsScoreboard from './ErbsScoreboard'

export default {
  name: 'score-board',
  components: { ErbsScoreboard },
  data() {
    return {
      localPlayers: [],
      playerSelect: [],
      localTeams: [],
      teamSelect: [],
    }
  },
  watch: {
    players(val) {
      this.localPlayers = val
      this.updatePlayerMenus()
    },
    teams(val) {
      this.localTeams = val
      this.updateTeamMenus()
    },
  },
  beforeMount() {
    this.localTeams = this.$store.state.show.teams
    this.localPlayers = this.$store.state.show.playerPool

    this.updatePlayerMenus()
    this.updateTeamMenus()
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
    updatePlayerMenus() {
      this.playerSelect = Object.values(this.localPlayers).map((p) => {
        return {
          text: p.name,
          value: p.id,
        }
      })
    },
    updateTeamMenus() {
      this.teamSelect = Object.values(this.localTeams).map((p) => {
        let text = p.name

        if (text === '') {
          text = p.players.map(id => this.localPlayers[id].name).join(', ')
        }

        return {
          text,
          value: p.id,
        }
      })
    },
  },
}
</script>

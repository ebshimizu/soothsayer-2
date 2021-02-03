<template>
  <v-row dense v-show="$store.getters.componentVisible('motion-graphics')">
    <v-col cols="12">
      <v-card outlined>
        <v-card-title>Lower Third</v-card-title>
        <v-card-subtitle>{{ status }}</v-card-subtitle>
        <v-card-text>
          <v-row>
            <v-col cols="3">
              <v-select
                :value="$store.state.graphics.lowerThird.activeMode"
                @input="(v) => update('activeMode', v)"
                :items="modes"
                label="Lower Third Mode"
              ></v-select>
            </v-col>
            <v-col cols="5"></v-col>
            <v-col cols="4" class="my-auto d-flex justify-end">
              <v-btn color="green" class="mx-2" @click="showOrUpdate"
                ><v-icon left>mdi-play</v-icon>
                {{ visible ? 'Update Graphics' : 'Show Graphics' }}</v-btn
              >
              <v-btn color="red" @click="hide" :disabled="!visible"
                ><v-icon left>mdi-eye-off</v-icon> Hide</v-btn
              >
            </v-col>
            <v-col cols="4" v-show="erbsPlayerStat">
              <v-text-field
                label="Player Name"
                :value="erbsPlayer.playerName"
                @input="(v) => updateErbsPlayer('playerName', v)"
              ></v-text-field
            ></v-col>
            <v-col cols="2" v-show="erbsPlayerStat" class="my-auto">
              <v-btn color="primary">Load From API</v-btn>
            </v-col>
            <v-col cols="3" v-show="erbsPlayerStat">
              <v-text-field
                label="Player Twitter"
                prepend-icon="mdi-twitter"
                :value="erbsPlayer.playerTwitter"
                @input="(v) => updateErbsPlayer('playerTwitter', v)"
              ></v-text-field>
            </v-col>
            <v-col cols="3" v-show="erbsPlayerStat">
              <v-text-field
                label="Player Twitch"
                prepend-icon="mdi-twitch"
                :value="erbsPlayer.playerTwitch"
                @input="(v) => updateErbsPlayer('playerTwitch', v)"
              ></v-text-field>
            </v-col>
            <v-col cols="2" v-show="erbsPlayerStat">
              <v-text-field
                label="KDA"
                type="number"
                @input="(v) => updateErbsPlayer('kda', v)"
              ></v-text-field>
            </v-col>
            <v-col cols="2" v-show="erbsPlayerStat">
              <v-text-field
                label="Win Rate"
                :value="erbsPlayer.winRate"
                type="number"
                @input="(v) => updateErbsPlayer('winRate', v)"
              ></v-text-field>
            </v-col>
            <v-col cols="2" v-show="erbsPlayerStat">
              <v-text-field
                label="Top 3 Rate"
                :value="erbsPlayer.top3"
                type="number"
                @input="(v) => updateErbsPlayer('top3', v)"
              ></v-text-field>
            </v-col>
            <v-col cols="2" v-show="erbsPlayerStat">
              <v-text-field
                label="Average Kills"
                :value="erbsPlayer.avgKills"
                type="number"
                @input="(v) => updateErbsPlayer('avgKills', v)"
              ></v-text-field>
            </v-col>
            <v-col cols="4" v-show="erbsPlayerStat">
              <v-select multiple label="Top 3 Characters"></v-select>
            </v-col>
            <v-col cols="3" v-show="erbsPlayerStat">
              <v-text-field
                readonly
                label="Player ID"
                :value="erbsPlayer.playerId"
                hint="Internal Player ID"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { LOWER_THIRD_MODES } from '../data/overlayManifest'
import { GAME_SETTINGS } from '../data/supportedGames'
import { ACTION, MUTATION } from '../store/actions'

export default {
  name: 'motion-graphics',
  computed: {
    lowerThird() {
      return this.$store.state.graphics.lowerThird
    },
    visible() {
      return this.lowerThird.visible
    },
    status() {
      return this.lowerThird.status
    },
    casterInfo() {
      return this.lowerThird.activeMode === LOWER_THIRD_MODES.CASTER_INFO
    },
    erbsPlayerStat() {
      return this.lowerThird.activeMode === LOWER_THIRD_MODES.ERBS_PLAYER_STATS
    },
    erbsPlayer() {
      return this.lowerThird.modeData[LOWER_THIRD_MODES.ERBS_PLAYER_STATS]
    },
    modes() {
      const supported =
        GAME_SETTINGS[this.$store.state.app.game].SUPPORTED_LT_MODES
      return Object.keys(supported)
    },
  },
  methods: {
    hide() {
      this.$store.commit(MUTATION.SET_LT_PROP, {
        key: 'visible',
        value: false,
      })
      this.$store.dispatch(ACTION.UPDATE_GRAPHICS)
    },
    update(key, value) {
      this.$store.commit(MUTATION.SET_LT_PROP, { key, value })
    },
    showOrUpdate() {
      if (!this.visible) {
        this.$store.commit(MUTATION.SET_LT_PROP, {
          key: 'visible',
          value: true,
        })
      }

      this.$store.dispatch(ACTION.UPDATE_GRAPHICS)
    },
    updateErbsPlayer(key, value) {
      this.$store.commit(MUTATION.SET_LT_MODE_DATA, {
        mode: LOWER_THIRD_MODES.ERBS_PLAYER_STATS,
        key,
        value,
      })
    },
  },
}
</script>

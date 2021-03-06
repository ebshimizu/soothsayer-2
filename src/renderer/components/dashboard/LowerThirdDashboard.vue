<template>
  <v-card>
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
        <v-col cols="2" v-show="erbsPlayerStat">
          <v-combobox
            label="Player Name"
            :items="$store.getters.playerPoolItems"
            :value="erbsPlayer.playerName"
            @input="(v) => updateErbsPlayer('playerName', v)"
          ></v-combobox
        ></v-col>
        <v-col cols="2" v-show="erbsPlayerStat">
          <v-select
            label="Season"
            v-model="season"
            :items="seasons"
            :disabled="noApiKey"
          ></v-select>
        </v-col>
        <v-col cols="2" v-show="erbsPlayerStat">
          <v-select
            label="Squad Size"
            v-model="squadSize"
            :items="squadSizes"
            :disabled="noApiKey"
          ></v-select>
        </v-col>
        <v-col cols="2" v-show="erbsPlayerStat">
          <v-text-field
            label="Player Twitter"
            prepend-icon="mdi-twitter"
            :value="erbsPlayer.playerTwitter"
            @input="(v) => updateErbsPlayer('playerTwitter', v)"
          ></v-text-field>
        </v-col>
        <v-col cols="2" v-show="erbsPlayerStat">
          <v-text-field
            label="Player Twitch"
            prepend-icon="mdi-twitch"
            :value="erbsPlayer.playerTwitch"
            @input="(v) => updateErbsPlayer('playerTwitch', v)"
          ></v-text-field>
        </v-col>
        <v-col cols="2" v-show="erbsPlayerStat" class="my-auto">
          <v-btn
            block
            color="primary"
            :disabled="noApiKey"
            @click="loadFromApi"
            >{{ $store.state.app.erbsApiKey ? 'API Load' : 'No Key' }}</v-btn
          >
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { LOWER_THIRD_MODES } from '../../data/overlayManifest'
import { GAME_SETTINGS } from '../../data/supportedGames'
import { ACTION, MUTATION } from '../../store/actions'
import {
  getPlayerStats,
  SEASONS,
  SQUAD_SIZES,
} from '../../data/gameConfig/erbs/api'

export default {
  name: 'lower-third-dashboard',
  data() {
    return {
      season: 1,
      squadSize: 1,
      status: '',
    }
  },
  computed: {
    seasons() {
      return Object.entries(SEASONS).map(([text, value]) => {
        return { text, value }
      })
    },
    squadSizes() {
      return Object.entries(SQUAD_SIZES).map(([text, value]) => {
        return { text, value }
      })
    },
    noApiKey() {
      return this.$store.state.app.erbsApiKey === ''
    },
    lowerThird() {
      return this.$store.state.graphics.lowerThird
    },
    visible() {
      return this.lowerThird.visible
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
    async loadFromApi() {
      this.status = 'Loading from ERBS API...'

      const data = await getPlayerStats(
        this.erbsPlayer.playerName,
        this.season,
        this.squadSize,
        this.$store.state.app.erbsApiKey,
        this.setStatus.bind(this),
      )

      if (data) {
        Object.entries(data).forEach(([key, value]) => {
          this.updateErbsPlayer(key, value)
        })

        this.status = 'Data Loaded from API.'
      }
    },
    setStatus(msg, error = false) {
      this.status = msg
    },
  },
}
</script>

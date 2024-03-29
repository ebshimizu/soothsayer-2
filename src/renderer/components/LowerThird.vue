<template>
  <v-row dense v-show="$store.getters.componentVisible('lower-third')">
    <v-col cols="12">
      <ticker-items></ticker-items>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-card-title>Lower Third</v-card-title>
        <v-card-subtitle :class="{ error }">{{ status }}</v-card-subtitle>
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
                :items="playerSelect"
                :value="erbsPlayer.playerName"
                @input="(v) => updateErbsPlayer('playerName', v)"
                @change="(v) => checkForExistingPlayer(v)"
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
                :disabled="noApiKey || apiLoading"
                :loading="apiLoading"
                @click="loadFromApi"
                >{{
                  $store.state.app.erbsApiKey ? 'Load From API' : 'No API Key'
                }}</v-btn
              >
            </v-col>
            <v-col cols="2" v-if="!dashboard" v-show="erbsPlayerStat">
              <v-text-field
                label="Win Rate"
                :value="erbsPlayer.winRate"
                type="number"
                @input="(v) => updateErbsPlayer('winRate', v)"
              ></v-text-field>
            </v-col>
            <v-col cols="2" v-if="!dashboard" v-show="erbsPlayerStat">
              <v-text-field
                label="Top 3 Rate"
                :value="erbsPlayer.top3"
                type="number"
                @input="(v) => updateErbsPlayer('top3', v)"
              ></v-text-field>
            </v-col>
            <v-col cols="2" v-if="!dashboard" v-show="erbsPlayerStat">
              <v-text-field
                label="Average Kills"
                :value="erbsPlayer.avgKills"
                type="number"
                @input="(v) => updateErbsPlayer('avgKills', v)"
              ></v-text-field>
            </v-col>
            <v-col cols="2" v-if="!dashboard" v-show="erbsPlayerStat">
              <v-text-field
                label="Avg. Hunts"
                type="number"
                :value="erbsPlayer.avgHunts"
                @input="(v) => updateErbsPlayer('avgHunts', v)"
              ></v-text-field>
            </v-col>
            <v-col cols="4" v-if="!dashboard" v-show="erbsPlayerStat">
              <v-autocomplete
                multiple
                label="Top 3 Characters"
                hint="Select up to three characters"
                :items="characters"
                :value="erbsPlayer.characters"
                chips
                deletable-chips
                small-chips
                :rules="characterRules"
                @input="(v) => updateErbsPlayer('characters', v)"
              >
              </v-autocomplete>
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
import {
  getPlayerStats,
  SEASONS,
  SQUAD_SIZES,
} from '../data/gameConfig/erbs/api'
import characters from '../data/gameConfig/erbs/characters'
import TickerItems from './TickerItems.vue'
import { defaultLowerThirdData } from '../store/defaults'

export default {
  name: 'lower-third',
  components: { TickerItems },
  props: {
    dashboard: Boolean,
  },
  data() {
    return {
      season: 1,
      squadSize: 1,
      status: '',
      error: false,
      apiLoading: false,
      playerSelect: [],
    }
  },
  watch: {
    players(val) {
      this.playerSelect = val.map((p) => p.name)
    },
  },
  beforeMount() {
    this.playerSelect = Object.values(this.$store.state.show.playerPool).map(
      (p) => p.name,
    )
  },
  computed: {
    seasons() {
      return Object.entries(SEASONS).map(([text, value]) => {
        return { text, value }
      })
    },
    players() {
      return Object.values(this.$store.state.show.playerPool)
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
    characters() {
      return Object.values(characters).map((c) => {
        return {
          text: c.name,
          value: c.ltImgSrc,
        }
      })
    },
    characterRules() {
      return [
        (v) => {
          if (v.length > 3) return 'Too many characters selected'
          return true
        },
      ]
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
    checkForExistingPlayer(name) {
      // search by name, it's all we got
      // first match, case-sensitive
      const player = Object.values(this.$store.state.show.playerPool).find(
        (p) => p.name === name,
      )

      if (player) {
        this.updateErbsPlayer('playerTwitter', player.twitter)
        this.updateErbsPlayer('playerTwitch', player.twitch)
      }
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
      this.apiLoading = true

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
      } else {
        this.resetErbsPlayer()
      }

      this.apiLoading = false
    },
    setStatus(msg, error = false) {
      this.status = msg
      this.error = error
    },
    resetErbsPlayer() {
      const defaults = defaultLowerThirdData()
      const modeData = defaults.modeData[LOWER_THIRD_MODES.ERBS_PLAYER_STATS]
      delete modeData.playerName
      delete modeData.playerTwitter
      delete modeData.playerTwitch

      Object.entries(modeData).forEach(([key, value]) => {
        this.updateErbsPlayer(key, value)
      })
    },
  },
}
</script>

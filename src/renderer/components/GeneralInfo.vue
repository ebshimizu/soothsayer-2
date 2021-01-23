<template>
  <v-row dense v-show="$store.getters.componentVisible('general-info')">
    <v-col cols="12">
      <v-card outlined>
        <v-card-title>Caster Info</v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col cols="3">
              <v-select
                label="Caster Count"
                v-model="casterCount"
                :items="casterConfigs"
                item-text="name"
                item-value="value"
              ></v-select>
            </v-col>
            <v-col cols="3">
              <v-select
                label="Frame Variant"
                v-model="frameVariant"
                :items="frameVariants"
              >
              </v-select>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Event Logo"
                clearable
                append-outer-icon="mdi-folder-open"
                hint="Paste remote file URL or Load from Local File"
                @click:append-outer="loadEventLogo"
                v-model="eventLogo"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row v-for="(caster, index) in casters" :key="index">
            <v-col cols="7">
              <v-text-field
                :value="caster.name"
                :label="`Caster ${index + 1} Name`"
                @input="(v) => update(index, 'name', v)"
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                :value="caster.social"
                :label="`Caster ${index + 1} Social`"
                @input="(v) => update(index, 'social', v)"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-select
                label="Text Size"
                :value="caster.textSize"
                @input="(v) => update(index, 'textSize', v)"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card outlined>
        <v-card-title>Uncategorized</v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col>
              <v-text-field
                label="Tournament Name"
                :value="$store.state.show.tournamentName"
                @input="(v) => updateShowParam('tournamentName', v)"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="Event Name"
                :value="$store.state.show.eventName"
                @input="(v) => updateShowParam('eventName', v)"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-menu
                v-model="datePicker"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="date"
                    label="Tournament Day"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="date"
                  @input="datePicker = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col>
              <v-menu
                ref="menu"
                v-model="timePicker"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="time"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="time"
                    label="Tournament Time"
                    prepend-icon="mdi-clock-time-four-outline"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="timePicker"
                  v-model="time"
                  full-width
                  @click:minute="$refs.menu.save(time)"
                ></v-time-picker>
              </v-menu>
            </v-col>
            <v-col cols="12">
              <v-combobox
                label="Sponsor Logo"
                clearable
                append-outer-icon="mdi-folder-open"
                hint="Paste remote file URL, select a preset, or load from local file"
                @click:append-outer="loadSponsorLogo"
                v-model="sponsorLogo"
                :items="defaultSponsors"
              ></v-combobox>
            </v-col>
            <v-col cols="12">
              <v-textarea
                label="Notepad"
                :value="$store.state.show.notepad"
                @input="(v) => updateShowParam('notepad', v)"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import _ from 'lodash'
import { MUTATION } from '../store/actions'
import {
  CASTER_CONFIGS,
  FRAME_VARIANTS,
  SPONSOR_LOGOS,
} from '../data/appDefaults'
import { browseAndLoadLocalFile } from './util'

export default {
  name: 'general-info',
  created() {
    this.update = _.debounce(this.debouncedUpdate, 100)
  },
  data() {
    return {
      casters: this.$store.state.show.casters,
      casterConfigs: CASTER_CONFIGS,
      frameVariants: FRAME_VARIANTS,
      datePicker: false,
      timePicker: false,
      defaultSponsors: SPONSOR_LOGOS,
    }
  },
  computed: {
    casterCount: {
      get() {
        return this.$store.state.show.casterCount
      },
      set(value) {
        this.$store.commit(MUTATION.CHANGE_CASTER_LENGTH, value)
      },
    },
    frameVariant: {
      get() {
        return this.$store.state.show.frameVariant
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SHOW_PROP, {
          key: 'frameVariant',
          value,
        })
      },
    },
    eventLogo: {
      get() {
        return this.$store.state.show.eventLogo
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SHOW_PROP, {
          key: 'eventLogo',
          value,
        })
      },
    },
    date: {
      get() {
        return this.$store.state.show.date
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SHOW_PROP, {
          key: 'date',
          value,
        })
      },
    },
    time: {
      get() {
        return this.$store.state.show.time
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SHOW_PROP, {
          key: 'time',
          value,
        })
      },
    },
    sponsorLogo: {
      get() {
        return this.$store.state.show.sponsorLogo
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SHOW_PROP, {
          key: 'sponsorLogo',
          value,
        })
      },
    },
  },
  methods: {
    debouncedUpdate(index, key, value) {
      // send local to store
      this.$store.commit(MUTATION.SET_CASTER_DATA, { index, key, value })
    },
    loadEventLogo() {
      browseAndLoadLocalFile('eventLogo', this.$store)
    },
    loadSponsorLogo() {
      browseAndLoadLocalFile('sponsorLogo', this.$store)
    },
    updateShowParam(key, value) {
      this.$store.commit(MUTATION.SET_SHOW_PROP, {
        key,
        value,
      })
    },
  },
}
</script>

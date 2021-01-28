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
      <note-pad></note-pad>
    </v-col>
    <v-col cols="12">
      <v-card outlined>
        <v-card-title>Uncategorized</v-card-title>
        <v-card-text>
          <v-row dense>
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
import NotePad from './NotePad.vue'

export default {
  name: 'general-info',
  components: { NotePad },
  created() {
    this.update = _.debounce(this.debouncedUpdate, 100)
  },
  data() {
    return {
      casters: this.$store.state.show.casters,
      casterConfigs: CASTER_CONFIGS,
      frameVariants: FRAME_VARIANTS,
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

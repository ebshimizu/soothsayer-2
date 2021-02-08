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
            <v-col cols="9">
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
            <v-col cols="12">
              <v-card>
                <v-card-title>Caster {{ index + 1 }} Info</v-card-title>
                <v-card-text>
                  <v-row dense>
                    <v-col cols="4">
                      <v-text-field
                        :value="caster.name"
                        :label="`Caster ${index + 1} Name`"
                        @input="(v) => update(index, 'name', v)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="2">
                      <v-text-field
                        :value="caster.socialTwitch"
                        label="Twitch"
                        prepend-icon="mdi-twitch"
                        @input="(v) => update(index, 'socialTwitch', v)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="2">
                      <v-text-field
                        :value="caster.socialTwitter"
                        label="Twitter"
                        prepend-icon="mdi-twitter"
                        @input="(v) => update(index, 'socialTwitter', v)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="2">
                      <v-text-field
                        :value="caster.socialYoutube"
                        label="YouTube"
                        prepend-icon="mdi-youtube"
                        @input="(v) => update(index, 'socialYoutube', v)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="2">
                      <v-text-field
                        :value="caster.socialInsta"
                        label="Instagram"
                        prepend-icon="mdi-instagram"
                        @input="(v) => update(index, 'socialInsta', v)"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text> </v-card
            ></v-col>
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
} from '../data/appDefaults'
import { browseAndLoadLocalFile } from './util'
import NotePad from './NotePad.vue'
import SponsorLogos from './SponsorLogos.vue'

export default {
  name: 'general-info',
  components: { NotePad, SponsorLogos },
  created() {
    this.update = _.debounce(this.debouncedUpdate, 100)
  },
  data() {
    return {
      casters: this.$store.state.show.casters,
      casterConfigs: CASTER_CONFIGS,
      frameVariants: FRAME_VARIANTS,
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
    updateShowParam(key, value) {
      this.$store.commit(MUTATION.SET_SHOW_PROP, {
        key,
        value,
      })
    },
  },
}
</script>

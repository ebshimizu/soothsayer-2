<template>
  <v-row dense v-show="$store.getters.componentVisible('general-info')">
    <v-col cols="12">
      <v-card>
        <v-card-title>Primary Caster Info</v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col cols="4">
              <v-text-field
                :value="caster.name"
                :label="`Caster Name`"
                @input="(v) => update('name', v)"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                :value="caster.socialTwitch"
                label="Twitch"
                prepend-icon="mdi-twitch"
                @input="(v) => update('socialTwitch', v)"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                :value="caster.socialTwitter"
                label="Twitter"
                prepend-icon="mdi-twitter"
                @input="(v) => update('socialTwitter', v)"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                :value="caster.socialYoutube"
                label="YouTube"
                prepend-icon="mdi-youtube"
                @input="(v) => update('socialYoutube', v)"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                :value="caster.socialInsta"
                label="Instagram"
                prepend-icon="mdi-instagram"
                @input="(v) => update('socialInsta', v)"
              ></v-text-field>
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
import { FRAME_VARIANTS } from '../data/appDefaults'
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
      frameVariants: FRAME_VARIANTS,
    }
  },
  computed: {
    caster() {
      return this.$store.state.show.casterOne
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
    debouncedUpdate(key, value) {
      // send local to store
      this.$store.commit(MUTATION.SET_CASTER_DATA, {
        caster: 'casterOne',
        key,
        value,
      })
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

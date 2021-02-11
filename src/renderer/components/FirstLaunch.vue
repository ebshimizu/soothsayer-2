<template>
  <v-dialog v-model="firstLaunch" max-width="800" persistent>
    <v-stepper v-model="step" vertical>
      <v-stepper-step :complete="step > 1" editable step="1">
        Welcome to Soothsayer
      </v-stepper-step>
      <v-stepper-content step="1">
        <p>
          This setup dialog will help get you set up with your first cast. You
          can come back and run this setup dialog again at any time from the
          Application Settings page.
        </p>
        <v-btn color="primary" @click="step = 2">Continue</v-btn>
      </v-stepper-content>
      <v-stepper-step :complete="step > 2" step="2" editable>
        Who are you?
      </v-stepper-step>
      <v-stepper-content step="2">
        <p>
          Tell us about yourself. This information can be changed on the User
          Information page.
        </p>
        <v-row>
          <v-col cols="6">
            <v-text-field
              label="Name"
              :value="this.$store.state.show.casterOne.name"
              @input="(v) => updateCaster('name', v)"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            Social Media
            <v-row dense no-gutters>
              <v-col cols="6">
                <v-checkbox
                  v-model="twitch"
                  label="TWITCH"
                  class="shrink mr-2"
                ></v-checkbox></v-col
              ><v-col cols="6"
                ><v-text-field
                  label="Twitch"
                  v-show="twitch"
                  :value="this.$store.state.show.casterOne.socialTwitch"
                  @input="(v) => updateCaster('socialTwitch', v)"
                ></v-text-field
              ></v-col>
              <v-col cols="6">
                <v-checkbox
                  v-model="twitter"
                  label="TWITTER"
                  class="shrink mr-2"
                ></v-checkbox></v-col
              ><v-col cols="6"
                ><v-text-field
                  label="Twitter"
                  v-show="twitter"
                  :value="this.$store.state.show.casterOne.socialTwitter"
                  @input="(v) => updateCaster('socialTwitter', v)"
                ></v-text-field
              ></v-col>
              <v-col cols="6">
                <v-checkbox
                  v-model="youtube"
                  label="YOUTUBE"
                  class="shrink mr-2"
                ></v-checkbox></v-col
              ><v-col cols="6"
                ><v-text-field
                  label="YouTube"
                  v-show="youtube"
                  :value="this.$store.state.show.casterOne.socialYoutube"
                  @input="(v) => updateCaster('socialYoutube', v)"
                ></v-text-field
              ></v-col>
              <v-col cols="6">
                <v-checkbox
                  v-model="insta"
                  label="INSTAGRAM"
                  class="shrink mr-2"
                ></v-checkbox></v-col
              ><v-col cols="6"
                ><v-text-field
                  label="Instagram"
                  v-show="insta"
                  :value="this.$store.state.show.casterOne.socialInsta"
                  @input="(v) => updateCaster('socialInsta', v)"
                ></v-text-field
              ></v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-btn color="primary" @click="step = 3">Continue</v-btn>
      </v-stepper-content>
      <v-stepper-step :complete="step > 3" step="3" editable>
        What are you casting?
      </v-stepper-step>
      <v-stepper-content step="3">
        <p>
          Soothsayer displays a set of features tailored to the game you're
          casting. You can change this at any time in the Application Settings
          page.
        </p>
        <v-select
          v-model="game"
          :items="games"
          label="Selected Game Configuration"
        ></v-select>
        <v-btn color="primary" @click="step = 4">Continue</v-btn>
      </v-stepper-content>
      <v-stepper-step :complete="step > 4" step="4" editable>
        What theme do you want to use?
      </v-stepper-step>
      <v-stepper-content step="4">
        <p>
          You can either install themes from the Soothsayer Theme Registry, or
          you can download the themes manually and place them in your theme
          folder. If needed, you can change the location of your theme folder in
          the Application Settings.
        </p>
        <theme-selector></theme-selector>
        <v-btn color="primary" @click="finish">Finish</v-btn>
      </v-stepper-content>
    </v-stepper>
    <v-btn outlined color="yellow darken-2" class="later" @click="finish"
      >Later</v-btn
    >
  </v-dialog>
</template>

<script>
import { MUTATION } from '../store/actions'
import ThemeSelector from './ThemeSelector.vue'

export default {
  components: { ThemeSelector },
  name: 'first-launch',
  data() {
    return {
      step: 1,
      twitch: false,
      twitter: false,
      youtube: false,
      insta: false,
    }
  },
  computed: {
    firstLaunch() {
      return false || this.$store.state.app.firstLaunch
    },
    games() {
      return this.$store.getters.supportedGames
    },
    game: {
      get() {
        return this.$store.state.app.game
      },
      set(value) {
        this.update('game', value)
      },
    },
  },
  methods: {
    updateShowParam(key, value) {
      this.$store.commit(MUTATION.SET_SHOW_PROP, {
        key,
        value,
      })
    },
    updateCaster(key, value) {
      this.$store.commit(MUTATION.SET_CASTER_DATA, {
        caster: 'casterOne',
        key,
        value,
      })
    },
    finish() {
      this.step = 5
      this.$store.commit(MUTATION.SET_APP_PROP, {
        key: 'firstLaunch',
        value: false,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.later {
  float: right;
  right: 12px;
  bottom: 12px;
  width: 115px;
}
</style>

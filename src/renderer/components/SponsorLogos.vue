<template>
  <v-card outlined>
    <v-card-title>Sponsor Logos</v-card-title>
    <v-card-subtitle
      >These logos will display in a slideshow-like format in some
      themes</v-card-subtitle
    >
    <v-card-text>
      <v-row dense>
        <v-col cols="4">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" v-bind="attrs" v-on="on" block>
                Add Default Logo
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in defaultLogos"
                :key="index"
                @click="addLogo(item[1])"
              >
                <v-list-item-title>{{ item[0] }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
        <v-col cols="4">
          <v-dialog v-model="urlDialog" persistent max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark v-bind="attrs" v-on="on" block>
                Add from URL
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Add Logo from URL</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="logoUrl"
                        hint="Paste your URL here"
                        label="Logo URL"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="urlDialog = false">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="addLogoFromDialog">
                  Add
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
        <v-col cols="4">
          <v-btn block color="primary" @click="browseLocal"
            >Add from Local File</v-btn
          >
        </v-col>
        <v-col cols="12">
          <h2 class="mt-2">Active Logos</h2>
          <v-list>
            <v-list-item v-for="item in logos" :key="item">
              <v-list-item-content>
                <v-list-item-title>{{ item }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon>
                  <v-icon color="red" @click="deleteLogo(item)"
                    >mdi-delete</v-icon
                  >
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { GAME_SETTINGS } from '../data/supportedGames'
import { MUTATION } from '../store/actions'
import { browseAndLoadLocalSponsorFile } from './util'

export default {
  name: 'sponsor-logos',
  data() {
    return {
      logoUrl: '',
      urlDialog: false,
    }
  },
  computed: {
    logos() {
      return this.$store.state.show.sponsorLogos
    },
    defaultLogos() {
      return Object.entries(
        GAME_SETTINGS[this.$store.state.app.game].SPONSOR_LOGOS,
      )
    },
  },
  methods: {
    addLogo(url) {
      this.$store.commit(MUTATION.ADD_SPONSOR_IMAGE, url)
    },
    addLogoFromDialog() {
      this.$store.commit(MUTATION.ADD_SPONSOR_IMAGE, this.logoUrl)
      this.urlDialog = false
    },
    deleteLogo(key) {
      this.$store.commit(MUTATION.REMOVE_SPONSOR_IMAGE, key)
    },
    browseLocal() {
      browseAndLoadLocalSponsorFile(this.$store)
    },
  },
}
</script>

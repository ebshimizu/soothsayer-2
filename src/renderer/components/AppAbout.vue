<template>
  <v-row dense>
    <v-col cols="12">
      <v-card>
        <v-card-title>Soothsayer v{{ $store.state.version }}</v-card-title>
        <v-card-text>
          <p>
            Soothsayer is available on
            <a
              @click="openExternal('https://github.com/ebshimizu/soothsayer-2')"
              >GitHub</a
            >
            under the MIT License.
          </p>
          <p>
            Soothsayer was created by Falindrith
            <v-icon
              color="cyan lighten-2"
              @click="openExternal('https://twitter.com/falindrith')"
              >mdi-twitter</v-icon
            >
            with design assistance from Crow
            <v-icon
              color="cyan lighten-2"
              @click="openExternal('https://twitter.com/watch_crow')"
              >mdi-twitter</v-icon
            >
          </p>
          <p>
            Need additional support? Join the
            <a @click="openExternal('https://discord.gg/wzU3YtaT4t')"
              >Soothsayer Discord <v-icon>mdi-discord</v-icon></a
            >
          </p>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { shell } from 'electron'

export default {
  name: 'app-about',
  methods: {
    openExternal(url) {
      shell.openExternal(url)
    },
  },
}
</script>

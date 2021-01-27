<template>
  <v-row dense v-show="$store.getters.componentVisible('white-board')">
    <v-col cols="auto">tools here </v-col>
    <v-col>
      <canvas
        id="whiteboard-canvas"
        ref="canvas"
        :width="width"
        :height="height"
      ></canvas>
    </v-col>
  </v-row>
</template>

<script>
import { GAME_SETTINGS, WHITEBOARD_IMAGES } from '../data/supportedGames'

const fabric = require('fabric').fabric

export default {
  name: 'white-board',
  mounted() {
    this.reset()
  },
  watch: {
    // proxy for when game changes
    background: () => {
      this.reset()
    },
  },
  computed: {
    settings() {
      return GAME_SETTINGS[this.$store.state.app.game].WHITEBOARD_SETTINGS
    },
    width() {
      return this.settings.width
    },
    height() {
      return this.settings.height
    },
    background() {
      return this.settings.background
    },
  },
  methods: {
    reset() {
      this.canvas = new fabric.Canvas(this.$refs.canvas)
      this.canvas.setBackgroundImage(
        WHITEBOARD_IMAGES[this.background],
        this.canvas.renderAll.bind(this.canvas),
        {
          left: this.settings.originOffset * this.settings.width,
          top: this.settings.originOffset * this.settings.height,
          originX: 'left',
          originY: 'top',
        },
      )
    },
  },
}
</script>

<style scoped>
#whiteboard-canvas {
  border: 1px solid white;
}
</style>

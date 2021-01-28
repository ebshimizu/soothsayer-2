<template>
  <div v-show="$store.getters.componentVisible('white-board')">
    <v-toolbar class="mb-2">
      <v-btn-toggle v-model="drawingTool" dense group>
        <v-btn :value="'select'"><v-icon>mdi-cursor-default</v-icon></v-btn>
        <v-btn :value="'free'"><v-icon>mdi-pencil</v-icon></v-btn>
      </v-btn-toggle>
      <v-avatar
        class="clickable mx-1"
        size="24"
        v-for="stamp in stamps"
        :key="stamp"
        @click="placeStamp(stamp)"
      >
        <img :src="getStamp(stamp)" />
      </v-avatar>
      <v-spacer></v-spacer>
      Selection
      <v-btn @click="deleteSelected">
        <v-icon>mdi-eraser</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-overflow-btn
        v-model="strokeWidth"
        label="Stroke Width"
        :items="strokeOptions"
        suffix="px"
        hide-details
        class="pa-0"
      ></v-overflow-btn>
      <v-menu
        v-model="colorPicker"
        :close-on-content-click="false"
        :nudge-width="200"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn :color="color" dark v-bind="attrs" v-on="on" class="mx-2">
          </v-btn>
        </template>

        <v-color-picker v-model="color"></v-color-picker>
      </v-menu>
      <v-btn color="red darken-4" @click="reset"> Clear All </v-btn>
    </v-toolbar>
    <v-row dense>
      <v-col cols="12">
        <div class="canvas-window">
          <canvas
            id="whiteboard-canvas"
            ref="canvas"
            :width="width"
            :height="height"
            tabindex="1"
          ></canvas>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import fs from 'fs-extra'
import path from 'path'
import { MUTATION } from '../store/actions'
import { GAME_SETTINGS, WHITEBOARD_IMAGES } from '../data/supportedGames'

export default {
  name: 'white-board',
  data() {
    return {
      drawingToolInternal: 'select',
      colorInternal: '#FFFFFF',
      strokeWidthInternal: 2,
      strokeOptions: [2, 5, 10, 20],
      colorPicker: false,
    }
  },
  mounted() {
    this.canvas = new fabric.Canvas(this.$refs.canvas)
    this.canvas.on('mouse:up', this.updoot)
    this.canvas.freeDrawingBrush.color = this.color
    this.canvas.freeDrawingBrush.width = this.strokeWidth

    // load
    if (this.$store.state.whiteboardData) {
      this.canvas.loadFromJSON(this.$store.state.whiteboardData, () => {
        this.updoot()
      })
    } else {
      this.reset()
    }
  },
  watch: {
    // proxy for when game changes
    background: () => {
      this.reset()
    },
  },
  computed: {
    color: {
      get() {
        return this.colorInternal
      },
      set(value) {
        this.colorInternal = value
        this.canvas.freeDrawingBrush.color = value
      },
    },
    strokeWidth: {
      get() {
        return this.strokeWidthInternal
      },
      set(value) {
        this.canvas.freeDrawingBrush.width = value
      },
    },
    drawingTool: {
      get() {
        return this.drawingToolInternal
      },
      set(value) {
        this.drawingToolInternal = value

        if (value === 'free') {
          this.canvas.isDrawingMode = true
        } else {
          this.canvas.isDrawingMode = false
        }
      },
    },
    settings() {
      return GAME_SETTINGS[this.$store.state.app.game].WHITEBOARD_SETTINGS
    },
    stamps() {
      return this.settings.stamps
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
      this.canvas.clear()
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
      setTimeout(this.updoot, 250)
    },
    deleteSelected() {
      const selected = this.canvas.getActiveObjects()
      if (selected) {
        this.canvas.remove(...selected)
        this.canvas.discardActiveObject().renderAll()
      }
    },
    getStamp(img) {
      return WHITEBOARD_IMAGES[img]
    },
    placeStamp(img) {
      const i = new Image()
      i.src = WHITEBOARD_IMAGES[img]
      const canvasImg = new fabric.Image(i, {
        left: this.width / 2,
        top: this.width / 2,
      })
      this.canvas.add(canvasImg)
    },
    updoot(opt) {
      // save that canvas
      const data = this.canvas.toDataURL()
      const base64Data = data.replace(/^data:image\/png;base64,/, '')
      fs.writeFile(
        path.join(this.$store.state.localFiles, 'img', 'whiteboard.png'),
        base64Data,
        'base64',
        function (err) {
          // yeah like i don't really care about the error lol
          if (err) console.log(err)
        },
      )

      this.$store.commit(MUTATION.SAVE_CANVAS, JSON.stringify(this.canvas))
      this.canvas.renderAll()
    },
  },
}
</script>

<style scoped>
#whiteboard-canvas {
  border: 1px solid white;
}

.canvas-window {
  overflow: auto;
  width: 100%;
  height: 100%;
  overflow-x: auto;
}

.clickable {
  cursor: pointer;
}
</style>

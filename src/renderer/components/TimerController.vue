<template>
  <v-card>
    <v-card-title>Timer</v-card-title>
    <v-card-subtitle>Displays a countdown timer</v-card-subtitle>
    <v-card-text>
      <v-row dense>
        <v-col cols="1" class="mx-auto my-auto text-center">
          <h2>{{ remaining }}</h2>
        </v-col>
        <v-col class="my-auto">
          <v-btn color="green" @click="start">
            <v-icon>{{ playOrPauseIcon }}</v-icon> {{ playOrPause }}
          </v-btn>
          <v-btn color="red" @click="stop">
            <v-icon>mdi-stop</v-icon> Stop
          </v-btn>
          <v-btn @click="visible = !visible">
            {{ visible ? 'Visible' : 'Hidden' }}
          </v-btn>
        </v-col>
        <v-col cols="2">
          <v-text-field :label="$t('label.label')" v-model="label" />
        </v-col>
        <v-col cols="1">
          <v-text-field
            label="Minutes"
            v-model.number="minutes"
            :disabled="running"
            type="number"
            min="0"
          ></v-text-field>
        </v-col>
        <v-col cols="1">
          <v-text-field
            label="Seconds"
            v-model.number="seconds"
            :disabled="running"
            type="number"
            min="0"
            max="59"
          ></v-text-field>
        </v-col>
        <v-col class="my-auto" cols="2">
          <v-btn :disabled="running" block @click="reset">
            <v-icon>mdi-refresh</v-icon> Reset
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { ACTION, MUTATION } from '../store/actions'
import moment from 'moment'

export default {
  name: 'timer-controller',
  data() {
    return {
      remaining: '0:00',
    }
  },
  beforeMount() {
    // start updating the timer constantly
    this.timerId = setInterval(this.updateRemaining, 1000)
  },
  computed: {
    minutes: {
      get() {
        return this.$store.state.show.timer.minutes
      },
      set(value) {
        this.$store.commit(MUTATION.SET_TIMER_PROP, { key: 'minutes', value })
      },
    },
    seconds: {
      get() {
        return this.$store.state.show.timer.seconds
      },
      set(value) {
        this.$store.commit(MUTATION.SET_TIMER_PROP, { key: 'seconds', value })
      },
    },
    visible: {
      get() {
        return this.$store.state.show.timer.visible
      },
      set(value) {
        this.$store.commit(MUTATION.SET_TIMER_PROP, { key: 'visible', value })
        this.$store.dispatch(ACTION.UPDATE)
      },
    },
    label: {
      get() {
        return this.$store.state.show.timerLabel
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SHOW_PROP, { key: 'timerLabel', value })
      },
    },
    running() {
      return this.$store.state.show.timer.isPlaying
    },
    paused() {
      return this.$store.state.show.timer.isPaused
    },
    playOrPause() {
      if (!this.paused && this.running) {
        return 'Pause'
      } else if (this.paused && this.running) {
        return 'Resume'
      } else {
        // start
        return 'Start'
      }
    },
    playOrPauseIcon() {
      if (!this.paused && this.running) {
        return 'mdi-pause'
      } else if (this.paused && this.running) {
        return 'mdi-play'
      } else {
        // start
        return 'mdi-play'
      }
    },
  },
  methods: {
    start() {
      if (!this.paused && this.running) {
        this.$store.dispatch(ACTION.PAUSE_TIMER)
      } else if (this.paused && this.running) {
        this.$store.dispatch(ACTION.RESUME_TIMER)
      } else {
        // start
        this.$store.dispatch(ACTION.START_TIMER)
      }

      // do one last update real quick
      this.updateRemaining()
    },
    stop() {
      this.$store.dispatch(ACTION.STOP_TIMER)
    },
    reset() {
      this.minutes = 0
      this.seconds = 0
    },
    updateRemaining() {
      // actually compute the timer
      if (!this.running) {
        this.remaining = '0:00'
        return
      }

      // if it's paused, skip updates (should cache last value)
      if (this.paused) {
        return
      }

      // check diff b/t now and end. End is offset by pause duration.
      const now = moment()
      const end = moment(this.$store.state.show.timer.endsAt)
      const adjustedEnd = end.add(
        this.$store.state.show.timer.pauseDuration,
        'ms',
      )

      const diff = adjustedEnd.diff(now)

      if (diff <= 0) {
        // actually tell the system to stop
        this.$store.commit(MUTATION.SET_TIMER_PROP, {
          key: 'isPlaying',
          value: false,
        })
        this.remaining = '0:00'
        return
      }

      // format
      const s = Math.floor(diff / 1000)

      this.remaining = `${Math.floor(s / 60)}:${String(s % 60).padStart(
        2,
        '0',
      )}`
    },
  },
}
</script>

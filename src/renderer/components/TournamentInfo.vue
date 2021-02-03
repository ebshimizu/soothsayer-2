<template>
  <v-row dense v-show="$store.getters.componentVisible('tournament-info')">
    <v-col cols="12">
      <v-card outlined>
        <v-card-title>Tournament Information</v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col>
              <v-text-field
                label="Tournament Name"
                :value="$store.state.show.tournamentName"
                @input="(v) => updateShowParam('tournamentName', v)"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card outlined>
        <v-card-title>Event Information</v-card-title>
        <v-card-subtitle
          >A tournament is often made up of multiple events (like Day 1, Group Stage,
          Playoffs, etc.). List these events here. The overlays will list events
          in chronological order. Some themes will not display all upcoming
          events.</v-card-subtitle
        >
        <v-card-text>
          <v-row dense>
            <v-col cols="12" v-for="(event, idx) in events" :key="event.id">
              <v-row dense>
                <v-col cols="4">
                  <v-text-field
                    :value="event.name"
                    @input="(v) => updateEvent(event.id, 'name', v, idx)"
                    label="Event Name"
                    placeholder="Group Stage, Playoffs, Day 1..."
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-menu
                    v-model="eventMenus[idx].datePicker"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="event.date"
                        label="Event Day"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      :value="event.date"
                      @input="
                        (v) => {
                          updateEvent(event.id, 'date', v, idx)
                          eventMenus[idx].datePicker = false
                        }
                      "
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="3">
                  <v-menu
                    ref="menu"
                    v-model="eventMenus[idx].timePicker"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="event.time"
                        label="Event Time"
                        prepend-icon="mdi-clock-time-four-outline"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="eventMenus[idx].timePicker"
                      :value="event.time"
                      full-width
                      @click:minute="eventMenus[idx].timePicker = false"
                      @input="
                        (time) => {
                          updateEvent(event.id, 'time', time, idx)
                        }
                      "
                    ></v-time-picker>
                  </v-menu>
                </v-col>
                <v-col cols="2" class="my-auto">
                  <v-btn color="red" block @click="deleteEvent(event.id)">
                    Delete
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-btn color="green" block @click="addEvent">Add Event</v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { MUTATION } from '../store/actions'
import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'tournament-info',
  data() {
    return {
      datePicker: false,
      timePicker: false,
      eventMenus: [],
    }
  },
  watch: {
    events: function (newEvents, oldEvents) {
      if (newEvents.length !== oldEvents.length) {
        this.eventMenus = this.events.map(() => {
          return {
            datePicker: false,
            timePicker: false,
          }
        })
      }
    },
  },
  beforeMount() {
    this.eventMenus = this.events.map(() => {
      return {
        datePicker: false,
        timePicker: false,
      }
    })
  },
  computed: {
    events() {
      return this.$store.getters.tournamentSchedule
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
  },
  methods: {
    addEvent() {
      this.$store.commit(MUTATION.ADD_TOURNAMENT_SCHEDULE_ITEM, uuidv4())
    },
    updateEvent(id, key, value, idx) {
      this.$store.commit(MUTATION.SET_TOURNAMENT_SCHEDULE_PROP, {
        id,
        key,
        value,
      })
    },
    deleteEvent(id) {
      this.$store.commit(MUTATION.DELETE_TOURNAMENT_SCHEDULE_ITEM, id)
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

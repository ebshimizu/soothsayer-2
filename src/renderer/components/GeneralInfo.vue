<template>
  <v-row dense>
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
          <v-row v-for="(caster, index) in castersReadOnly" :key="index">
            <v-col cols="7">
              <v-text-field
                v-model="caster.name"
                :label="`Caster ${index + 1} Name`"
                @input="(v) => update(index, 'name', v)"
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                v-model="caster.social"
                :label="`Caster ${index + 1} Social`"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-select label="Text Size" v-model="caster.textSize"></v-select>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import _ from 'lodash';
import { MUTATION } from '../store/actions';
import { CASTER_CONFIGS, FRAME_VARIANTS } from '../data/appDefaults';
import { browseAndLoadLocalFile } from './util';

export default {
  name: 'general-info',
  created() {
    this.update = _.debounce(this.debouncedUpdate, 100);
  },
  data() {
    return {
      casters: this.$store.state.show.casters,
      casterConfigs: CASTER_CONFIGS,
      frameVariants: FRAME_VARIANTS,
    };
  },
  computed: {
    casterCount: {
      get() {
        return this.$store.state.show.casterCount;
      },
      set(value) {
        this.$store.commit(MUTATION.CHANGE_CASTER_LENGTH, value);
      },
    },
    frameVariant: {
      get() {
        return this.$store.state.show.frameVariant;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SHOW_PROP, {
          key: 'frameVariant',
          value,
        });
      },
    },
    eventLogo: {
      get() {
        return this.$store.state.show.eventLogo;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SHOW_PROP, {
          key: 'eventLogo',
          value,
        });
      },
    },
    castersReadOnly() {
      return this.$store.state.show.casters.map((c) => {
        return { name: c.name, social: c.social, textSize: c.textSize };
      });
    },
  },
  methods: {
    debouncedUpdate(index, key, value) {
      // send local to store
      this.$store.commit(MUTATION.SET_CASTER_DATA, { index, key, value });
    },
    loadEventLogo() {
      browseAndLoadLocalFile('eventLogo', this.$store);
    },
  },
};
</script>

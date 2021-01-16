<template>
  <v-row dense>
    <v-col cols="12">
      <v-card outlined>
        <v-card-title>Caster Info</v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col cols="3">
              <v-select v-model="casterCount" :items="casterConfigs"></v-select>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { MUTATION } from '../store/actions';
export default {
  name: 'general-info',
  data() {
    return {
      casters: this.$store.getters.casters,
      casterConfigs: [
        { name: '1', value: 1 },
        { name: '2', value: 2 },
        { name: '3', value: 3 },
      ],
    };
  },
  computed: {
    casterCount: {
      get() {
        return this.$store.state.show.casterCount;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_CASTER_COUNT, value);
      },
    },
  },
};
</script>

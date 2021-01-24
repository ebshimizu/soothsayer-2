<template>
  <v-row dense>
    <v-col cols="12">
      <timer-controller></timer-controller>
    </v-col>
  </v-row>
</template>

<script>
import TimerController from './TimerController'

export default {
  name: 'app-dashboard',
  components: { TimerController },
}
</script>

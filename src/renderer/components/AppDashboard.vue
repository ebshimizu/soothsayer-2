<template>
  <v-row dense>
    <v-col cols="12">
      <timer-controller></timer-controller>
    </v-col>
    <v-col cols="12">
      <lower-third :dashboard="true"></lower-third>
    </v-col>
  </v-row>
</template>

<script>
import TimerController from './TimerController'
import LowerThird from './LowerThird'

export default {
  name: 'app-dashboard',
  components: { TimerController, LowerThird },
}
</script>

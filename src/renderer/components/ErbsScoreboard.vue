<template>
  <v-col cols="12">
    <div
      class="d-flex justify-center align-center align-content-center flex-column"
    >
      <span class="mb-2">Scoreboard Mode</span>
      <v-btn-toggle rounded mandatory>
        <v-btn value="solo" class="pl-4">
          <v-icon left>mdi-account</v-icon>
          <span class="hidden-sm-and-down">Solo</span>
        </v-btn>
        <v-btn value="team" class="pr-4">
          <span class="hidden-sm-and-down">Duos+</span>
          <v-icon right>mdi-account-group</v-icon>
        </v-btn>
      </v-btn-toggle>
    </div>
    <v-row dense class="mt-2">
      <v-col cols="6">
        <v-card outlined>
          <v-card-title>Computed Scoreboard</v-card-title>
          <v-card-subtitle>{{
            $t('scoreboard.erbs.computed')
          }}</v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card outlined>
          <v-card-title>Score Entry</v-card-title>
          <v-card-subtitle>{{ $t('scoreboard.erbs.entry') }}</v-card-subtitle>
          <v-card-text>
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header>Round 1</v-expansion-panel-header>
                <v-expansion-panel-content>
                  there's gonna be a table here
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
export default {
  name: 'erbs-scoreboard',
  props: ['players', 'teams'],
  computed: {},
}
</script>

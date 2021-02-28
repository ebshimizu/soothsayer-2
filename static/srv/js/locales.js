// put allll the i18n data in this one file for the overlays
// I don't have a bundler for this and don't want to complicate overlay load, so this is how it's gotta be
const messages = {
  // en is the fallback locale
  en: {
    identify: 'This is a {name} overlay',
    lowerThird: {
      kills: 'Kills',
      winRate: 'Win Rate',
      top3: 'Top 3',
      hunts: 'Hunts',
    },
  },
}

window.messages = messages
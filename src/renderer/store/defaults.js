import { v4 as uuidv4 } from 'uuid'
import { LOWER_THIRD_MODES, TICKER_TYPES } from '../data/overlayManifest'

const defaultLowerThirdData = () => {
  return {
    activeMode: LOWER_THIRD_MODES.CASTER_INFO,
    loading: false,
    status: '',
    ready: true,
    visible: false,
    lastChangeAt: Date.now(),
    // caster info actually pulls from everywhere else
    // but put it here just to make sure it's not null if called
    modeData: {
      [LOWER_THIRD_MODES.CASTER_INFO]: {},
      [LOWER_THIRD_MODES.ERBS_PLAYER_STATS]: {
        playerName: '',
        playerId: 0,
        playerTwitter: '',
        playerTwitch: '',
        kda: 0,
        winRate: 0,
        top3: 0,
        avgKills: 0,
        characters: [],
      },
    },
  }
}

const defaultShowData = () => {
  return {
    theme: '',
    themeOverrides: {},
    casters: [
      {
        name: '',
        social: '',
        textSize: 'medium',
      },
    ],
    casterCount: 1,
    frameVariant: 1,
    eventLogo: '',
    tournamentName: '',
    sponsorLogos: {},
    notepad: '',
    notepadTitle: '',
    schedule: {},
    mapImage: '',
    playerPool: '',
    timer: {
      minutes: 0,
      seconds: 0,
      pauseDuration: 0,
      endsAt: null,
      pausedAt: null,
      isPlaying: false,
      isPaused: false,
      visible: true,
    },
    tickerItems: {},
  }
}

const defaultTickerItem = () => {
  return {
    type: TICKER_TYPES.TEXT,
    text: '',
  }
}

const defaultGraphicsData = () => {
  return {
    lowerThird: defaultLowerThirdData(),
  }
}

const scheduleItem = () => {
  return {
    date: new Date().toISOString().substr(0, 10),
    time: '12:00',
    name: '',
    id: uuidv4(),
  }
}

export {
  defaultShowData,
  defaultLowerThirdData,
  defaultGraphicsData,
  defaultTickerItem,
  scheduleItem,
}

import { v4 as uuidv4 } from 'uuid'
import { LOWER_THIRD_MODES, TICKER_TYPES } from '../data/overlayManifest'

const defaultErbsScoreData = () => {
  return {
    mode: 'solo',
    points: {
      rank: [
        { rank: 1, points: 16 },
        { rank: 2, points: 12 },
        { rank: 3, points: 10 },
        { rank: 5, points: 8 },
        { rank: 8, points: 5 },
        { rank: 12, points: 3 },
        { rank: 16, points: 1 },
        { rank: 18, points: 0 },
      ],
      kill: 3,
    },
    rounds: {
      round1: {
        solo: {},
        team: {},
      },
      round2: {
        solo: {},
        team: {},
      },
      round3: {
        solo: {},
        team: {},
      },
      round4: {
        solo: {},
        team: {},
      },
      round5: {
        solo: {},
        team: {},
      },
    },
  }
}

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
        avgHunts: 0,
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
    casterOne: {
      name: '',
      socialTwitch: '',
      socialTwitter: '',
      socialYoutube: '',
      socialInsta: '',
    },
    casterTwo: {
      name: '',
      socialTwitch: '',
      socialTwitter: '',
      socialYoutube: '',
      socialInsta: '',
    },
    frameVariant: 1,
    eventLogo: '',
    tournamentName: '',
    sponsorLogos: {},
    notepad: '',
    notepadTitle: '',
    schedule: {},
    mapImage: '',
    playerPool: {},
    teams: {},
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
    overlaySettings: {},
    erbsStandings: defaultErbsScoreData(),
    scoreboardDisplayMode: 'cycle',
    scoreboardDisplayTime: 10,
    scoreboardDisplayCount: 6,
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

const defaultPlayerItem = () => {
  return {
    id: uuidv4(),
    name: '',
    twitter: '',
    twitch: '',
  }
}

const defaultTeamItem = () => {
  return {
    id: uuidv4(),
    name: '',
    players: [], // this is a list of ids
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
  defaultPlayerItem,
  defaultTeamItem,
  defaultErbsScoreData,
  scheduleItem,
}

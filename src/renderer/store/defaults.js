import { v4 as uuidv4 } from 'uuid'

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
    sponsorLogo: '',
    notepad: '',
    schedule: {},
    mapImage: '',
    lowerThirdVisible: false,
    playerPool: [],
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

export { defaultShowData, scheduleItem }

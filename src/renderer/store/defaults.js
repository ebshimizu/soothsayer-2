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
    eventName: '',
    sponsorLogo: '',
    notepad: '',
    date: (new Date()).toISOString().substr(0, 10),
    time: '12:00',
    schedule: {},
    mapImage: '',
    lowerThirdVisible: false,
    playerPool: [],
  }
}

export { defaultShowData }
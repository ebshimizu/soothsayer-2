const socket = io('http://localhost:3005/')

// no reason to have a util file really
function getTheme(state) {
  if (state && state.theme && state.themeOverrides) {
    // get page name
    const page = window.location.pathname.split('/')[1]

    if (page in state.themeOverrides) {
      return state.themeOverrides[page]
    }

    return state.theme
  }

  return 'default'
}

// https://stackoverflow.com/questions/6229197/how-to-know-if-two-arrays-have-the-same-values
const containsAll = (arr1, arr2) =>
  arr2.every((arr2Item) => arr1.includes(arr2Item))
const sameMembers = (arr1, arr2) =>
  containsAll(arr1, arr2) && containsAll(arr2, arr1)

// this is for hots I'm just gonna leave it here in case i need it later
// const mapClassList =
// 'doom boe dragon blackheart mines shrines garden tomb warhead cursed volskaya sky braxis hanamura alterac'

// individual overlays should stick required props into this object, then initialize the app
const app = {
  el: '#app',
  beforeCreate() {
    socket.on('requestID', () => {
      console.log('Connected')
      this.socketId = socket.id
      socket.emit('reportID', {
        id: window.overlayId,
        page: window.location.pathname.split('/')[1],
      })
    })

    socket.on('update', (state) => {
      console.log('State updated')
      this.state = state
      this.whiteboard = `url('/whiteboard.png?${Date.now()}')`
    })

    socket.on('identify', () => {
      // set ident item to on
      this.identify = true
      setTimeout(() => {
        this.identify = false
      }, 5000)
    })
  },
  beforeMount() {
    // update timer
    this.timerId = setInterval(this.updateRemaining, 500)
  },
  data() {
    return {
      state: {},
      identify: false,
      timer: '0:00',
      socketId: null,
      whiteboard: "url('/whiteboard.png')",
    }
  },
  computed: {
    theme() {
      // check overrides at some point
      return getTheme(this.state)
    },
    casterOneName() {
      return this.getCaster(0)?.name
    },
    casterOneSocial() {
      return this.getCaster(0)?.social
    },
    casterOneTextSize() {
      return this.getCaster(0)?.textSize
    },
    eventLogo() {
      if (this.state?.eventLogo) {
        return {
          backgroundImage: `url('${this.state?.eventLogo}'`,
        }
      } else {
        return {}
      }
    },
    overlayName() {
      return window.overlayId
    },
    tournamentName() {
      return this.state?.tournamentName
    },
    eventName() {
      return this.state?.eventName
    },
    currentEvent() {
      return this.schedule.length > 0 ? this.schedule[0] : {}
    },
    upcomingEvents() {
      return this.schedule.length > 1 ? this.schedule.slice(1) : []
    },
    schedule() {
      const schedule = this.state?.schedule ?? {}

      // format
      const formatted = Object.values(schedule).map((event) => {
        const time = moment(`${event.date}T${event.time}`)

        return {
          ...event,
          timeObj: time,
          eventDow: time.format('dddd'),
          eventMonth: time.format('MMMM'),
          eventDay: time.format('DDDo'),
          eventTime: time.format('h:mm a'),
        }
      })

      // sort oldest to newest
      formatted.sort((a, b) => a.timeObj.toDate() - b.timeObj.toDate())

      // filter
      const now = new Date()
      return formatted.filter((e, idx) => {
        // events that already happened (e.timeObj < now) and have another event in front
        // of them that has already happened
        // (formatted[idx + 1].timeObj < now) get removed
        if (idx < formatted.length - 1) {
          return !(
            e.timeObj.toDate() < now &&
            formatted[idx + 1].timeObj.toDate() < now
          )
        }

        // keep the last object
        return true
      })
    },
    running() {
      return this.state.timer?.isPlaying ?? false
    },
    paused() {
      return this.state.timer?.isPaused ?? false
    },
    timerVisible() {
      return this.state.timer?.visible ?? false
    },
  },
  methods: {
    getCaster(index) {
      if (this.state.casters) {
        return this.state.casters.length > index
          ? this.state.casters[index]
          : {}
      }
    },
    updateRemaining() {
      // actually compute the timer
      if (!this.running) {
        this.timer = '0:00'
        return
      }

      // if it's paused, skip updates (should cache last value)
      if (this.paused) {
        return
      }

      // check diff b/t now and end. End is offset by pause duration.
      const now = moment()
      const end = moment(this.state.timer.endsAt)
      const adjustedEnd = end.add(this.state.timer.pauseDuration, 'ms')

      const diff = adjustedEnd.diff(now)

      if (diff <= 0) {
        this.timer = '0:00'
        return
      }

      // format
      const s = Math.floor(diff / 1000)

      this.timer = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
    },
  },
}

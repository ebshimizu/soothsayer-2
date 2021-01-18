const socket = io('http://localhost:3005/');

// individual overlays should stick required props into this object, then initialize the app
const app = {
  el: '#app',
  beforeCreate() {
    socket.on('requestID', () => {
      console.log('Connected');
      socket.emit('reportID', {
        id: window.overlayId,
        page: window.location.pathname.split('/')[1],
      });
    });

    socket.on('update', (state) => {
      console.log('State updated');
      this.state = state;
    });

    socket.on('identify', () => {
      // set ident item to on
      this.identify = true;
      setTimeout(() => {
        this.identify = false;
      }, 3000);
    });
  },
  data() {
    return {
      state: {},
      identify: false,
    };
  },
  computed: {
    theme() {
      // check overrides at some point
      return getTheme(this.state);
    },
    casterOneName() {
      return this.getCaster(0)?.name;
    },
    casterOneSocial() {
      return this.getCaster(0)?.social;
    },
    casterOneTextSize() {
      return this.getCaster(0)?.textSize;
    },
    eventLogo() {
      if (this.state?.eventLogo) {
        return {
          backgroundImage: `url('${this.state?.eventLogo}'`,
        };
      } else {
        return {};
      }
    },
    overlayName() {
      return window.overlayId;
    },
  },
  methods: {
    getCaster(index) {
      if (this.state.casters) {
        return this.state.casters.length > index
          ? this.state.casters[index]
          : {};
      }
    },
  },
};

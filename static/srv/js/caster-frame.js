const socket = io('http://localhost:3005/');

const app = new Vue({
  el: '#app',
  beforeCreate() {
    socket.on('requestID', () => {
      socket.emit('reportID', this.id);
    });

    socket.on('update', (state) => {
      this.state = state;
    });
  },
  data() {
    return {
      id: 'Caster Frame',
      state: {},
      test: 'test',
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
});

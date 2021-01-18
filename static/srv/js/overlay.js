const socket = io('http://localhost:3005/');

// no reason to have a util file really
function getTheme(state) {
  if (state && state.theme && state.themeOverrides) {
    // get page name
    const page = window.location.pathname.split('/')[1];

    if (page in state.themeOverrides) {
      return state.themeOverrides[page];
    }

    return state.theme;
  }

  return 'default';
}

// https://stackoverflow.com/questions/6229197/how-to-know-if-two-arrays-have-the-same-values
const containsAll = (arr1, arr2) =>
  arr2.every((arr2Item) => arr1.includes(arr2Item));
const sameMembers = (arr1, arr2) =>
  containsAll(arr1, arr2) && containsAll(arr2, arr1);

const mapClassList =
  'doom boe dragon blackheart mines shrines garden tomb warhead cursed volskaya sky braxis hanamura alterac';

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

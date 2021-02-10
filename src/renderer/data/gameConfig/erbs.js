import { LOWER_THIRD_MODES, OVERLAY_FILES } from '../overlayManifest'

const COMPONENT_VISIBLE = {
  'general-info': true,
  'tournament-info': true,
  'white-board': true,
  'lower-third': true,
  'note-pad': true,
  'event-schedule': true,
}

const MENU_VISIBLE = {
  general: true,
  tournament: true,
  whiteboard: true,
  lowerThird: true,
  schedule: true,
  notepad: true,
  playersTeams: true,
  coCaster: false,
}

const OVERLAY_SUPPORT = {
  [OVERLAY_FILES.casterSingleFrame]: true,
  [OVERLAY_FILES.standby]: true,
  [OVERLAY_FILES.whiteboard]: true,
}

const WHITEBOARD_SETTINGS = {
  width: 810 * 1.1,
  height: 888 * 1.1,
  originOffset: 0.05,
  background: 'erbs-map-map.png',
  stamps: [
    'erbs-map_1.png',
    'erbs-map_2.png',
    'erbs-map_3.png',
    'erbs-map_4.png',
    'erbs-map_5.png',
    'erbs-map_6.png',
  ],
}

const SUPPORTED_LT_MODES = {
  [LOWER_THIRD_MODES.CASTER_INFO]: true,
  [LOWER_THIRD_MODES.ERBS_PLAYER_STATS]: true,
}

const SPONSOR_LOGOS = {
  'Nimble Neuron (with Background)': '/img/erbs-nimble-neuron-with-bg.png',
}

export default {
  COMPONENT_VISIBLE,
  MENU_VISIBLE,
  OVERLAY_SUPPORT,
  WHITEBOARD_SETTINGS,
  SUPPORTED_LT_MODES,
  SPONSOR_LOGOS,
}

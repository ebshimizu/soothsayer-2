import { OVERLAY_FILES } from '../overlayManifest'

const COMPONENT_VISIBLE = {
  'general-info': true,
  'tournament-info': true,
  'white-board': true,
}

const MENU_VISIBLE = {
  general: true,
  tournament: true,
  whiteboard: true,
}

const OVERLAY_SUPPORT = {
  [OVERLAY_FILES.casterSingleFrame]: true,
  [OVERLAY_FILES.standby]: true,
}

const WHITEBOARD_SETTINGS = {
  width: 810 * 1.1,
  height: 888 * 1.1,
  originOffset: 0.05,
  background: 'erbs-map-map.png',
}

export default { COMPONENT_VISIBLE, MENU_VISIBLE, OVERLAY_SUPPORT, WHITEBOARD_SETTINGS }

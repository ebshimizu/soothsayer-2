import { OVERLAY_FILES } from '../overlayManifest'

const COMPONENT_VISIBLE = {
  'general-info': true,
}

const MENU_VISIBLE = {
  general: true,
}

const OVERLAY_SUPPORT = {
  [OVERLAY_FILES.casterSingleFrame]: true,
  [OVERLAY_FILES.standby]: true,
}

export default { COMPONENT_VISIBLE, MENU_VISIBLE, OVERLAY_SUPPORT }

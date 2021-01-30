const OVERLAY_FILES = {
  casterSingleFrame: 'caster-single-frame.html',
  standby: 'standby.html',
  whiteboard: 'whiteboard.html',
  lowerThird: 'lower-third.html',
}

const OVERLAY_MANIFEST = {
  [OVERLAY_FILES.casterSingleFrame]: {
    name: 'Caster Frame - Single',
    width: 1920,
    height: 1080,
  },
  [OVERLAY_FILES.standby]: {
    name: 'Standby',
    width: 1920,
    height: 1080,
  },
  [OVERLAY_FILES.whiteboard]: {
    name: 'Whiteboard',
    width: 1920,
    height: 1080,
  },
  [OVERLAY_FILES.lowerThird]: {
    name: 'Lower Third',
    width: 1920,
    height: 1080,
  },
}

const LOWER_THIRD_MODES = {
  CASTER_INFO: 'Caster Info',
  ERBS_PLAYER_STATS: 'ERBS: Player Stats',
}

export { OVERLAY_MANIFEST, OVERLAY_FILES, LOWER_THIRD_MODES }

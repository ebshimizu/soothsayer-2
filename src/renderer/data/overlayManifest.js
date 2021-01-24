const OVERLAY_FILES = {
  casterSingleFrame: 'caster-single-frame.html',
  standby: 'standby.html',
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
}

export { OVERLAY_MANIFEST, OVERLAY_FILES }

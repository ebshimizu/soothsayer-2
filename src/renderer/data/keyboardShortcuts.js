import { ACTION } from '../store/actions'

// defaults for the shortcuts are stored in main
const KEYBOARD_SHORTCUTS = {
  update: ACTION.UPDATE,
  toggleLowerThird: ACTION.TOGGLE_LOWER_THIRD,
}

const SHORTCUT_NAMES = {
  update: 'Update Overlays',
  toggleLowerThird: 'Toggle Lower Third',
}

export { KEYBOARD_SHORTCUTS, SHORTCUT_NAMES }

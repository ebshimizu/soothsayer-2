const MUTATION = {
  REGISTER_OVERLAY: 'Register Overlay',
  UNREGISTER_OVERLAY: 'Unregister Overlay',
  SET_VERSION: 'Set Version',
  CHANGE_CASTER_LENGTH: 'Change Number of Casters',
  SET_CASTER_DATA: 'Set Caster Data',
  SET_SHOW_PROP: 'Set Show Property',
  SET_LOCAL_FILES: 'Set Local File Path',
  SET_LOCAL_IMG: 'Set and Cache Local Image Property',
  LOG: 'Log Message',
  LOAD_STATE: 'Load Local State',
  SET_APP_PROP: 'Set Application Property',
  UPDATE_THEME_DATA: 'Update Theme Data',
  UPDATE_KEYBINDS: 'Update Keybinds',
  SET_TIMER_PROP: 'Set Timer Property',
  ADD_TOURNAMENT_SCHEDULE_ITEM: 'Add Tournament Schedule Item',
  DELETE_TOURNAMENT_SCHEDULE_ITEM: 'Delete Tournament Schedule Item',
  SET_TOURNAMENT_SCHEDULE_PROP: 'Set Tournament Schedule Prop',
  DELETE_TOURNAMENT_SCHEDULE: 'Delete All Tournament Schedule Items',
}

const ACTION = {
  INIT_OVERLAY: 'Register and Init Overlay',
  DISCONNECT_OVERLAY: 'Overlay Disconnected',
  UPDATE: 'Update All Overlays',
  LOAD_STATE: 'Load Local State',
  SET_THEME: 'Set Overlay Theme',
  START_TIMER: 'Start Timer',
  STOP_TIMER: 'Stop Timer',
  PAUSE_TIMER: 'Pause Timer',
  RESUME_TIMER: 'Resume Timer',
}

export { MUTATION, ACTION }

const MUTATION = {
  REGISTER_OVERLAY: 'Register Overlay',
  UNREGISTER_OVERLAY: 'Unregister Overlay',
  SET_VERSION: 'Set Version',
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
  SAVE_CANVAS: 'Save Canvas',
  SET_LT_PROP: 'Set Lower Third Prop',
  SET_LT_MODE_DATA: 'Set Lower Third Mode Data',
  SET_ALL_LT_MODE_DATA: 'Replace Lower Third Mode Data',
  RESET_LT: 'Reset Lower Third',
  ADD_SPONSOR_IMAGE: 'Add Sponsor Image',
  REMOVE_SPONSOR_IMAGE: 'Remove Sponsor Image',
  ADD_LOCAL_SPONSOR_IMAGE: 'Add Local Sponsor Image',
  ADD_TICKER_ITEM: 'Add Ticker Item',
  DELETE_TICKER_ITEM: 'Delete Ticker Item',
  SET_TICKER_ITEM_PROP: 'Set Ticker Item Prop',
  RESET_SHOW_DATA: 'Reset Show Data',
  SET_OVERLAY_SETTING: 'Set Overlay Setting',
  NEW_PLAYER: 'Add Player',
  SET_PLAYER: 'Set Player',
  UPDATE_PLAYER: 'Update Player Field',
  DELETE_PLAYER: 'Delete Player',
  NEW_TEAM: 'Add Team',
  DELETE_TEAM: 'Delete Team',
  UPDATE_TEAM: 'Update Team Prop',
  PREPARE_CAST_PROFILE: 'Prepare Cast Profile Load',
  ERBS_SET_SCOREBOARD_PROP: 'ERBS: Set Scoreboard Prop',
  ERBS_SET_SCOREBOARD_POINTS: 'ERBS: Set Scoreboard Points Value',
  ERBS_SET_ALL_ROUND_DATA: 'ERBS: Set All Round Data',
  ERBS_SET_SCOREBOARD_RANK_DATA: 'ERBS: Change Scoreboard Rank Keys',
  ERBS_SET_ROUND_DATA: 'ERBS: Set Round Data',
  ERBS_RESET_SCOREBOARD_ROUND: 'ERBS: Reset Scoreboard for Round',
  ERBS_RESET_SCOREBOARD_POINTS: 'ERBS: Restore Default Scoring Method',
  ERBS_RESET_ALL_ROUNDS: 'ERBS: Reset All Rounds',
}

const ACTION = {
  INIT_OVERLAY: 'Register and Init Overlay',
  DISCONNECT_OVERLAY: 'Overlay Disconnected',
  UPDATE: 'Update All Overlays',
  UPDATE_GRAPHICS: 'Update Graphics',
  UPDATE_LOCALE: 'Update Locale',
  LOAD_STATE: 'Load Local State',
  SET_THEME: 'Set Overlay Theme',
  START_TIMER: 'Start Timer',
  STOP_TIMER: 'Stop Timer',
  PAUSE_TIMER: 'Pause Timer',
  RESUME_TIMER: 'Resume Timer',
  DELETE_SETTINGS_CACHE: 'Delete Settings Cache',
  SET_OVERLAY_SETTING: 'Set Overlay Setting and Notify',
  TOGGLE_LOWER_THIRD: 'Toggle Lower Third',
}

export { MUTATION, ACTION }

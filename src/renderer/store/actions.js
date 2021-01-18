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
  UPDATE_THEME_DATA: 'Update Theme Data'
};

const ACTION = {
  INIT_OVERLAY: 'Register and Init Overlay',
  DISCONNECT_OVERLAY: 'Overlay Disconnected',
  UPDATE: 'Update All Overlays',
  LOAD_STATE: 'Load Local State',
};

export { MUTATION, ACTION };

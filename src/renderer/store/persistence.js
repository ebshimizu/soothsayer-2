import { ipcRenderer } from 'electron';
import { MUTATION } from './actions';

export const Persistence = (store) => {
  store.subscribe((mutation, state) => {
    // do not snapshot after a load
    if (mutation.type !== MUTATION.LOAD_STATE) {
      ipcRenderer.send('snapshot', state);
    }
  });
  // the app is constantly snapshotting when data is modified so this shouldn't be needed
  // store.subscribeAction((action, state) => {
  //   if (action.type === ACTION.UPDATE) {
  //     ipcRenderer.send('snapshot', state);
  //   }
  // })
};
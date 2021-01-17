import { ipcRenderer } from 'electron';
import { MUTATION } from '../store/actions';

// there's always one
function browseAndLoadLocalFile(stateProp, store) {
  ipcRenderer.invoke('open-file').then((file) => {
    if (file) {
      // do the load
      store.commit(MUTATION.SET_LOCAL_IMG, { key: stateProp, src: file.filePaths[0] });
    }
  });
}

export { browseAndLoadLocalFile };

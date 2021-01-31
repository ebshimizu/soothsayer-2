import { ipcRenderer } from 'electron'
import { MUTATION } from '../store/actions'

// there's always one
function browseAndLoadLocalFile(stateProp, store) {
  ipcRenderer.invoke('open-file').then((file) => {
    if (file && file.filePaths[0]) {
      // do the load
      store.commit(MUTATION.SET_LOCAL_IMG, {
        key: stateProp,
        src: file.filePaths[0],
      })
    }
  })
}

function browseAndLoadLocalSponsorFile(store) {
  ipcRenderer.invoke('open-file').then((file) => {
    if (file && file.filePaths[0]) {
      // do the load
      store.commit(MUTATION.ADD_LOCAL_SPONSOR_IMAGE, file.filePaths[0])
    }
  })
}

export { browseAndLoadLocalFile, browseAndLoadLocalSponsorFile }

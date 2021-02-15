// inject props into app as needed, mostly we just need to make sure the
// id is set properly

// all overlays should override this
window.overlayId = 'Lobby'

// app is defined further up the page, inject your props then init the app
const vueApp = new Vue(app)

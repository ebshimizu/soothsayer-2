// inject props into app as needed, mostly we just need to make sure the
// id is set properly

// all overlays should override this
window.overlayId = 'ERBS Scoreboard'

// cycle function
// this is for the ERBS formatted scoreboard
app.methods.rotateScoreboard = function () {
  // turn it off
  this.scoreboardVisible = false
  setTimeout(() => {
    // turn it back on
    this.scoreboardPage += 1
    if (
      this.scoreboardPage * this.scoreboardDisplayCount >
      this.state.erbsComputedScoreboard.length
    ) {
      this.scoreboardPage = 0
    }
    this.scoreboardVisible = true
  }, 500)
}

// app is defined further up the page, inject your props then init the app
const vueApp = new Vue(app)

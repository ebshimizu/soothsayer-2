// inject props into app as needed, mostly we just need to make sure the
// id is set properly
// lower third injects update logic for, well, the lower third.
// as this is somewhat involved, the logic should only run where it matters

// I've defined watch in the base object
// there's a lot of linter yelling happening here lol
app.watch.lowerThirdModified = function (newTime, oldTime) {
  // check if state exists first whoops
  if (this.state && newTime !== oldTime) {
    // ok so here's the update plan
    // first, there's two visibility levels happening here:
    // - the overall container visibility in state.lowerThirdVisible (used by other overlays to adjust their layouts)
    // - the container's internal visibility state used to hide data transitions
    // this function specifically controls the internal visibility
    // - implementation note: there may be some double animations happening here at some point that will need to
    //   be checked, but let's just handle this first

    // if the data is different
    // set the changing data flag
    console.log('updating lt data')
    this.lowerThirdChangingData = true
    // wait half a second
    setTimeout(() => {
      this.lowerThird = Object.assign({}, this.state.lowerThird)
      // unset the changing data flag
      console.log('update complete')
      this.lowerThirdChangingData = false
    }, 600)

    // i think that's actually it lol
  }
}

// all overlays should override this
window.overlayId = 'Lower Third'

// app is defined further up the page, inject your props then init the app
const vueApp = new Vue(app)

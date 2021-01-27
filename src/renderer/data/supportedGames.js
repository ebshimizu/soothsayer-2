import ERBS from './gameConfig/erbs'

// list of supported games and their associated keys
const GAME = {
  ERBS: 'ERBS',
}

const GAME_STRING = {
  [GAME.ERBS]: 'Eternal Return: Black Survival',
}

const GAME_SETTINGS = {
  [GAME.ERBS]: ERBS,
}

function importAll(r) {
  const images = {}
  r.keys().map((item) => {
    images[item.replace('./', '')] = r(item)
  })
  return images
}

const WHITEBOARD_IMAGES = importAll(
  require.context('../assets/whiteboard', false, /\.(png|jpe?g|svg)$/),
)

export { GAME, GAME_STRING, GAME_SETTINGS, WHITEBOARD_IMAGES }

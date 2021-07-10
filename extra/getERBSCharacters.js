const apiKey = require('./erbsAPIKey.json').key
const fetch = require('node-fetch')
const slugify = require('slugify')
const fs = require('fs-extra')

const apiPrefix = 'https://open-api.bser.io/v1'

// ping the character data point
async function main() {
  // quick debug
  const sresp = await fetch(`${apiPrefix}/data/Season`, {
    method: 'get',
    headers: {
      'x-api-key': apiKey,
      accept: 'application/json',
    },
  })

  const seasonData = await sresp.json()
  console.log(seasonData)

  const resp = await fetch(`${apiPrefix}/data/Character`, {
    method: 'get',
    headers: {
      'x-api-Key': apiKey,
      accept: 'application/json',
    },
  })

  const chData = await resp.json()

  if (chData.code !== 200) {
    console.log(`Unable to read character data, code ${chData.code}`)
    return
  }

  // convert to needed format
  const writeTo = '../src/renderer/data/gameConfig/erbs/characters.json'
  const characters = {}

  for (const c of chData.data) {
    characters[c.code] = {
      code: c.code,
      name: c.name,
      classname: slugify(c.name),
      ltImgSrc: `/img/erbs/sm-portrait/${c.code}-${slugify(c.name)}.png`,
    }
  }

  fs.writeFileSync(writeTo, JSON.stringify(characters, null, 2))
}

;(async () => {
  try {
    await main()
  } catch (e) {
    console.log(e)
  }
})()

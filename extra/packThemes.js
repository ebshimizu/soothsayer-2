const fs = require('fs-extra')
const AdmZip = require('adm-zip')
const path = require('path')
const { zip } = require('lodash')

// relative to base soothsayer 2 dir (local to dev's machine)
const dir = '../soothsayer-2-themes'

// get all the valid themes
// weow stealing from my own code (not bothering to put this file in babel so copy past to avoid imports)
console.log(`Reading themes from ${dir}`)

const themes = {}
const files = fs.readdirSync(dir)
fs.emptyDirSync('./docs/themes')

// see which files are folders that contain a theme.json file
for (const file of files) {
  const themeFilePath = path.join(dir, file, 'theme.json')
  const themeFolderPath = path.join(dir, file)

  console.log(`Reading theme manifest from ${themeFilePath}`)
  if (fs.existsSync(themeFilePath)) {
    // attempt to read
    try {
      const themeData = fs.readFileSync(themeFilePath)
      const themeDataParsed = JSON.parse(themeData)

      // themes keyed by folder name
      console.log(
        `Packing ${themeDataParsed.name} v${themeDataParsed.version} from ${themeFilePath}.`,
      )

      // create a zip of the folder
      const themeZip = new AdmZip()
      themeZip.addLocalFolder(themeFolderPath)
      themeZip.writeZip(path.join('./docs/themes/', `${file}.zip`))
      themes[file] = {
        name: themeDataParsed.name,
        version: themeDataParsed.version,
        url: `https://ebshimizu.github.io/soothsayer-2/themes/${file}.zip`,
      }
    } catch (e) {
      console.log(e)
    }
  } else {
    console.log('Manifest not found, skipping...')
  }
}

fs.writeFileSync('./docs/themes.json', JSON.stringify(themes, null, 2))

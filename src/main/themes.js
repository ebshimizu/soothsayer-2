import fs from 'fs-extra';
import path from 'path';

function scanForThemes(dir) {
  try {
    console.log(`Reading themes from ${dir}`);

    const themes = {};
    const files = fs.readdirSync(dir);

    // see which files are folders that contain a theme.json file
    for (const file of files) {
      const themeFilePath = path.join(dir, file, 'theme.json');

      console.log(`Reading theme manifest from ${themeFilePath}`);
      if (fs.existsSync(themeFilePath)) {
        // attempt to read
        try {
          const themeData = fs.readFileSync(themeFilePath);
          const themeDataParsed = JSON.parse(themeData);

          // themes keyed by folder name
          console.log(
            `Loaded ${themeDataParsed.name} v${themeDataParsed.version} from ${themeFilePath}.`
          );
          themes[file] = themeDataParsed;
        } catch (e) {
          console.log(`Could not read theme data from ${themeFilePath}.`);
        }
      } else {
        console.log('Manifest not found, skipping...');
      }
    }

    return themes;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

export { scanForThemes };

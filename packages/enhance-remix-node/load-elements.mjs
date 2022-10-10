import * as fs from "fs";
import * as path from "path";

export default async function loadElements(
  rootDir = process.cwd(),
  appDir = "app",
  elementsDir = "elements"
) {
  appDir = path.resolve(rootDir, appDir);
  elementsDir = path.resolve(appDir, elementsDir);

  let elements = {};

  if (fs.existsSync(elementsDir)) {
    let elementFiles = fs.readdirSync(elementsDir);
    for (let file of elementFiles) {
      let elementFile = path.resolve(elementsDir, file);
      let stat = fs.statSync(elementFile);
      if (
        !stat.isFile() &&
        !elementFileExtensions.some((ext) => elementFile.endsWith(ext))
      ) {
        continue;
      }

      let elementModule = await import(elementFile);
      elements[createElementName(elementFile)] = elementModule.default;
    }
  }

  return elements;
}

function createElementName(elementFile) {
  let name = path.basename(elementFile, path.extname(elementFile));
  return name;
}

const elementFileExtensions = [".mjs", ".js"];

const fs = require("fs");
const mkdirp = require("mkdirp-classic");

const {
  loadSpreadsheet,
  localesPath,
  ns,
  lngs,
  sheetId,
  columnKeyToHeader,
  NOT_AVAILABLE_CELL,
} = require("./index");

async function fetchTranslationsFromSheetToJson(doc) {
  const sheet = doc.sheetsById[sheetId];
  if (!sheet) {
    return {};
  }

  const lngsMap = {};
  const rows = await sheet.getRows();
  rows.forEach((row) => {
    const key = row.get(columnKeyToHeader.key);
    lngs.forEach((lng) => {
      const translation = row.get(columnKeyToHeader[lng]);
      // NOT_AVAILABLE_CELL("_N/A") means no related language
      if (translation === NOT_AVAILABLE_CELL) {
        return;
      }

      if (!lngsMap[lng]) {
        lngsMap[lng] = {};
      }

      lngsMap[lng][key] = translation || ""; // prevent to remove undefined value like ({"key": undefined})
    });
  });
  return lngsMap;
}

function checkAndMakeLocaleDir(dirPath, subDirs) {
  return new Promise((resolve) => {
    subDirs.forEach((subDir, index) => {
      mkdirp(`${dirPath}/${subDir}`, (err) => {
        if (err) {
          throw err;
        }

        if (index === subDirs.length - 1) {
          resolve();
        }
      });
    });
  });
}

async function updateJsonFromSheet() {
  await checkAndMakeLocaleDir(localesPath, lngs);

  const doc = await loadSpreadsheet();
  const lngsMap = await fetchTranslationsFromSheetToJson(doc);

  fs.readdir(localesPath, (error, lngs) => {
    if (error) {
      throw error;
    }

    lngs.forEach((lng) => {
      const localeJsonFilePath = `${localesPath}/${lng}/${ns}.json`;

      const jsonString = (JSON.stringify(lngsMap[lng], null, 2) || "").concat(
        "\n"
      );

      fs.writeFile(localeJsonFilePath, jsonString, "utf8", (err) => {
        if (err) {
          throw err;
        }
      });
    });
  });
  console.log("download done");
}

updateJsonFromSheet();

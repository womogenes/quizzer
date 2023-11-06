import { typograph, shuffle } from './utils.js';

const GAPI_KEY = 'AIzaSyAPWmkmeWMtLA-4wHtoP0i7Yc-kd4dPD3g';
let spreadsheetID = '1OkgNmZRkt4BtyH2_9BDyZt5ywdGUmu8obHlHYqXDVYU';

// References:
// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/get
// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets#Spreadsheet
export const fetchSheetList = async (spreadsheetID) => {
  let apiURL = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}?alt=json&key=${GAPI_KEY}`;
  const res = await (await fetch(apiURL)).json();

  return Promise.all(
    res.sheets.map(async (sheet) => {
      let apiURL = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}/values/${sheet.properties.title}!A2:H2?alt=json&key=${GAPI_KEY}`;
      let row = await (await fetch(apiURL)).json();
      return {
        sheetName: sheet.properties.title,
        name: sheet.properties.title,
        spreadsheetID,
        imageURL: row.values?.[0][7],
      };
    }),
  );
};

export const fetchSpreadsheet = async (spreadsheetID, sheetName) => {
  let apiURL = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}/values/${sheetName}?alt=json&key=${GAPI_KEY}`;

  // Map each row of the spreadsheet to the format we want
  const questions = await (await fetch(apiURL)).json();
  return questions.values.slice(1).map((row) => {
    const answer = row[6];
    const question = row[0];
    const options = row.slice(1, 6).map((op) => op.trim());
    const imageURL = row[7];

    return {
      imageURL,
      question: typograph(question),
      options: shuffle(options),
      answer: options['ABCDE'.indexOf(answer)],
    };
  });
};

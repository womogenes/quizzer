const GAPI_KEY = 'AIzaSyAPWmkmeWMtLA-4wHtoP0i7Yc-kd4dPD3g';

const fetchSpreadsheet = async (sheetName) => {
  let spreadsheetID = '1H8dBZey-oR43booZnmC-I0bCg4xUdgF3WT9-WKqeDjU';
  let apiURL = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}/values/${sheetName}?alt=json&key=${GAPI_KEY}`;

  // Map each row of the spreadsheet to the format we want
  const questions = await (await fetch(apiURL)).json();
  return questions.values.slice(1).map((row) => {
    const imageURL = row[0];
    const question = row[1];
    const options = row.slice(2, 7);
    const answer = row[7];
    return [imageURL, question, options, answer];
  });
};

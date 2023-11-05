const GAPI_KEY = 'AIzaSyAPWmkmeWMtLA-4wHtoP0i7Yc-kd4dPD3g';

const fetchSpreadsheet = async (sheetName) => {
  let spreadsheetID = '1OkgNmZRkt4BtyH2_9BDyZt5ywdGUmu8obHlHYqXDVYU';
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

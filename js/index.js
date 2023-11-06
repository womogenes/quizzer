import { fetchSheetList } from './data.js';

let spreadsheetID = '1OkgNmZRkt4BtyH2_9BDyZt5ywdGUmu8obHlHYqXDVYU';
let sheetNames = await fetchSheetList(spreadsheetID);
console.log(sheetNames);

import { fetchSheetList } from './data.js';

window.addEventListener('alpine:init', () => {
  Alpine.store('quizzes', []);
});

window.addEventListener('alpine:init', async () => {
  console.log('Alpine initialized.');

  let spreadsheetID = '1OkgNmZRkt4BtyH2_9BDyZt5ywdGUmu8obHlHYqXDVYU';
  let quizList = await fetchSheetList(spreadsheetID);
  console.log(quizList);

  // Some caching system can probably be cooked up later
  Alpine.store('quizzes', quizList);
});

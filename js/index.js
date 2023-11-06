import { fetchSheetList } from './data.js';

window.addEventListener('alpine:init', () => {
  Alpine.store('quizzes', []);
});

window.addEventListener('alpine:init', async () => {
  console.log('Alpine initialized.');

  let spreadsheetID = '1OkgNmZRkt4BtyH2_9BDyZt5ywdGUmu8obHlHYqXDVYU';
  // let quizList = await fetchSheetList(spreadsheetID);
  let quizList = [
    {
      sheetName: 'FOOD',
      name: 'FOOD',
      spreadsheetID: '1OkgNmZRkt4BtyH2_9BDyZt5ywdGUmu8obHlHYqXDVYU',
      imageURL:
        'https://media.istockphoto.com/id/1053854126/photo/all-you-can-eat-sushi.jpg?s=612x612&w=0&k=20&c=qqPJBYcxR0fgmzIFj_k2V6Mbo12hBBCucs1i5HcGYA0=',
    },
    {
      sheetName: 'PLACES',
      name: 'PLACES',
      spreadsheetID: '1OkgNmZRkt4BtyH2_9BDyZt5ywdGUmu8obHlHYqXDVYU',
      imageURL:
        'https://s3.amazonaws.com/cms.ipressroom.com/401/files/202306/APA-aerial19_054_FINAL.jpg',
    },
    {
      sheetName: 'AAPI FIGURES',
      name: 'AAPI FIGURES',
      spreadsheetID: '1OkgNmZRkt4BtyH2_9BDyZt5ywdGUmu8obHlHYqXDVYU',
      imageURL:
        'https://images.newscientist.com/wp-content/uploads/2019/06/05113158/50546367.jpg',
    },
    {
      sheetName: 'AAPI STATS',
      name: 'AAPI STATS',
      spreadsheetID: '1OkgNmZRkt4BtyH2_9BDyZt5ywdGUmu8obHlHYqXDVYU',
      imageURL:
        'https://img.freepik.com/premium-vector/pie-chart-low-poly-gray-abstract-mash-line-point-pie-chart-white-background_201274-265.jpg',
    },
  ];
  console.log(quizList);

  // Some caching system can probably be cooked up later
  Alpine.store('quizzes', quizList);
});

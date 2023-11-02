const $ = document.querySelector.bind(document);

const questions = [
  [
    'https://picsum.photos/1920/1080',
    'What is the answer to this question?',
    ['A', 'B', 'C', 'D', 'E'],
    2,
  ],
];

document.addEventListener('alpine:init', () => {
  console.log('Alpine initialized.');

  const curIdx = 0;

  const loadQuestion = (questionArr) => {
    const [imageURL, question, options, answer] = questionArr;

    // Load the ith question
    Alpine.store('curQues', {
      imageURL,
      question,
      options,
      answer,
    });
    console.log(Alpine.store('curQues'));
  };

  window.answer = (index) => {
    Alpine.store(
      'answerStatus',
      index === Alpine.store('curQues').answer ? 'correct' : 'incorrect',
    );
    $('#options-grid').style.pointerEvents = 'none';
    $('#options-grid').style.opacity = 0.5;
  };

  loadQuestion(questions[curIdx]);
});

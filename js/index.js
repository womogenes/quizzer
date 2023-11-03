const $ = document.querySelector.bind(document);

document.addEventListener('alpine:init', () => {
  console.log('Alpine initialized.');

  Alpine.store('curIdx', 0);
  Alpine.store('questions', questions);

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
    $('#options-grid').style.opacity = 0.8;

    window.setTimeout(() => {
      $('#options-grid').style.pointerEvents = 'auto';
      $('#options-grid').style.opacity = 1;
      Alpine.store('answerStatus', 'answering');
      Alpine.store('curIdx', Alpine.store('curIdx') + 1);
      loadQuestion(questions[Alpine.store('curIdx')]);
    }, 1000);
  };

  loadQuestion(questions[Alpine.store('curIdx')]);
});

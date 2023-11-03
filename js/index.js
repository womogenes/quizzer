const $ = document.querySelector.bind(document);

const typograph = (str) => {
  const runReplacements = (content, replacements) => {
    for (let [og, repl] of replacements) {
      content = content.replace(og, repl);
    }
    return content;
  };
  const replacements = [
    [/(?<=[a-zA-Z])"([,.])(?!\.)/g, (_, p1) => `${p1}"`], // Put periods, commas *inside* quotes
    [/"([^"]+)?"/g, (_, p1) => `“${p1}”`],
  ];
  return runReplacements(str, replacements);
};

document.addEventListener('alpine:init', () => {
  Alpine.store('curIdx', 0);
  Alpine.store('curQues', {});
  Alpine.store('chosenOption', -1);
  Alpine.store('quizLoaded', false);
  Alpine.store('answerHistory', []);
  Alpine.store('answerStatus', 'answering');
});

document.addEventListener('alpine:init', async () => {
  console.log('Alpine initialized.');

  console.log('Loading quiz questions...');
  const questions = await fetchSpreadsheet('Questions');
  Alpine.store('questions', questions);
  Alpine.store('quizLoaded', true);

  const loadQuestion = (questionArr) => {
    const [imageURL, question, options, answer] = questionArr;

    // Load the ith question
    Alpine.store('curQues', {
      imageURL,
      question: typograph(question),
      options,
      answer: parseInt(answer),
    });
  };

  window.answer = (index) => {
    const isCorrect = index === Alpine.store('curQues').answer;
    Alpine.store('answerStatus', isCorrect ? 'correct' : 'incorrect');
    Alpine.store('answerHistory', [
      ...Alpine.store('answerHistory'),
      isCorrect,
    ]);
    Alpine.store('chosenOption', index);
    $('#options-grid').style.pointerEvents = 'none';
    $('#options-grid').style.opacity = 0.8;

    // window.setTimeout(nextQuestion, 2000);
  };

  window.nextQuestion = () => {
    $('#options-grid').style.pointerEvents = 'auto';
    $('#options-grid').style.opacity = 1.0;
    $('#image').src = '';
    Alpine.store('answerStatus', 'answering');
    Alpine.store('curIdx', (Alpine.store('curIdx') + 1) % questions.length);
    loadQuestion(questions[Alpine.store('curIdx')]);
  };

  window.addEventListener('keyup', () => {
    if (Alpine.store('answerStatus') === 'answering') return;
    window.setTimeout(nextQuestion, 10);
  });
  window.addEventListener('touchend', () => {
    if (Alpine.store('answerStatus') === 'answering') return;
    nextQuestion();
  });

  loadQuestion(questions[Alpine.store('curIdx')]);
});

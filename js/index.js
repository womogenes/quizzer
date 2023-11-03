const $ = document.querySelector.bind(document);

const typograph = (str) => {
  const runReplacements = (content, replacements) => {
    for (let [og, repl] of replacements) {
      content = content.replace(og, repl);
    }
    return content;
  };
  const replacements = [[/"([^"]+)?"/g, (_, p1) => `“${p1}”`]];
  return runReplacements(str, replacements);
};

document.addEventListener('alpine:init', () => {
  Alpine.store('curQues', {});
  Alpine.store('quizLoaded', false);
  console.log('woah!');
});

document.addEventListener('alpine:init', async () => {
  console.log('Alpine initialized.');

  console.log('Loading quiz questions...');
  const questions = await fetchSpreadsheet('Questions');
  console.log(questions);

  Alpine.store('curIdx', 0);
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
    Alpine.store(
      'answerStatus',
      index === Alpine.store('curQues').answer ? 'correct' : 'incorrect',
    );
    Alpine.store('chosenOption', index);
    $('#options-grid').style.pointerEvents = 'none';
    $('#options-grid').style.opacity = 0.9;

    window.setTimeout(() => {
      $('#options-grid').style.pointerEvents = 'auto';
      $('#options-grid').style.opacity = 1.0;
      $('#image').src = '';
      Alpine.store('answerStatus', 'answering');
      Alpine.store('curIdx', (Alpine.store('curIdx') + 1) % questions.length);
      loadQuestion(questions[Alpine.store('curIdx')]);
    }, 2000);
  };

  loadQuestion(questions[Alpine.store('curIdx')]);
});

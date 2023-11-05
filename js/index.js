const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

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
  window.questions = await fetchSpreadsheet('AAPI FIGURES');
  Alpine.store('questions', questions);
  Alpine.store('quizLoaded', true);

  const loadQuestion = (index) => {
    Alpine.store('curQues', questions[index]);
  };

  window.answer = (option) => {
    if (Alpine.store('answerStatus').endsWith('correct')) return;
    const isCorrect = option === Alpine.store('curQues').answer;
    Alpine.store('answerStatus', isCorrect ? 'correct' : 'incorrect');
    Alpine.store('answerHistory', [
      ...Alpine.store('answerHistory'),
      isCorrect,
    ]);
    Alpine.store('chosenOption', option);
    $$('.option').forEach((el) => el.classList.toggle('transition-all'));
    $('#options-grid').style.pointerEvents = 'none';
    $('#options-grid').style.opacity = 0.8;

    // Indicate that pressing entier is ok now
    shouldMove = 1;
  };

  window.nextQuestion = () => {
    // Disallow moving on if not in the correct state
    if (!Alpine.store('answerStatus').endsWith('correct')) return;

    // Are we done?
    if (Alpine.store('curIdx') === questions.length - 1) {
      console.log('user finished');
      Alpine.store('quizComplete', true);
      return;
    }

    // Hide text first
    Alpine.store('answerStatus', 'transitioning');

    // Change question
    window.setTimeout(() => {
      $('#options-grid').style.pointerEvents = 'auto';
      $('#options-grid').style.opacity = 1.0;
      Alpine.store('curIdx', (Alpine.store('curIdx') + 1) % questions.length);

      Alpine.store('answerStatus', 'answering');
      loadQuestion(Alpine.store('curIdx'));

      // Prefetch next image too
      new Image().src =
        questions[(Alpine.store('curIdx') + 1) % questions.length].imageURL;
    }, 0);
  };

  // Variable to catch edge case of whether quesiton should advance on pressing "enter"
  // Because if user presses "enter" while answer selected, this will trigger answer()
  //   and then immediately nextQuestion() but we need to block it the first time
  let shouldMove = 0;

  window.addEventListener('keyup', (e) => {
    console.log(e.key, shouldMove);
    if (e.key === 'Enter' && shouldMove === 1) {
      shouldMove = 2;
      return;
    }
    if (shouldMove !== 2) return;
    nextQuestion();
    shouldMove = 0;
  });
  window.addEventListener('mouseup', nextQuestion);

  loadQuestion(Alpine.store('curIdx'));
});

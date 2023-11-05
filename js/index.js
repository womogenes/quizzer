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
    [/'([^"]+)?'/g, (_, p1) => `‘${p1}’`],
  ];
  return runReplacements(str, replacements);
};

let state;

document.addEventListener('alpine:init', () => {
  Alpine.store('state', {
    curIdx: 0,
    curQues: {},
    chosenOption: -1,
    quizLoaded: false,
    answerHistory: [],
    answerStatus: 'answering',
    showEndScreen: Alpine.$persist(false).as('endScreen'),
  });
  state = Alpine.store('state');
});

document.addEventListener('alpine:init', async () => {
  console.log('Alpine initialized.');

  console.log('Loading quiz questions...');
  window.questions = await fetchSpreadsheet('AAPI FIGURES');
  questions = shuffle(questions).slice(0, 1);
  state.questions = questions;
  state.quizLoaded = true;

  window.answer = (option) => {
    if (state.answerStatus.endsWith('correct')) return;
    if (state.quizComplete) return;

    const isCorrect = option === state.curQues.answer;
    state.answerStatus = isCorrect ? 'correct' : 'incorrect';
    state.answerHistory = [...state.answerHistory, isCorrect];

    state.chosenOption = option;
    $$('.option').forEach((el) => el.classList.toggle('transition-all'));
    $('#options-grid').style.pointerEvents = 'none';
    $('#options-grid').style.opacity = 0.8;

    // Indicate that pressing enter is ok now
    shouldMove = 1;

    // Are we done?
    if (state.answerHistory.length === questions.length) {
      console.log('user finished');
      state.quizComplete = true;
      return;
    }
  };

  window.nextQuestion = () => {
    // Disallow moving on if not in the correct state
    if (!state.answerStatus.endsWith('correct')) return;
    if (state.quizComplete) {
      // Show the screen?
      state.showEndScreen = true;
      return;
    }

    // Hide text first
    state.answerStatus = transitioning;

    // Change question
    window.setTimeout(() => {
      $('#options-grid').style.pointerEvents = 'auto';
      $('#options-grid').style.opacity = 1.0;
      state.curIdx = (state.curIdx + 1) % questions.length;

      state.answerStatus = 'answering';
      state.curQues = questions[state.curIdx];

      // Prefetch next image too
      new Image().src =
        questions[(state.curIdx + 1) % questions.length].imageURL;
    }, 500);
  };

  // Variable to catch edge case of whether quesiton should advance on pressing "enter"
  // Because if user presses "enter" while answer selected, this will trigger answer()
  //   and then immediately nextQuestion() but we need to block it the first time
  let shouldMove = 0;

  window.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' && shouldMove === 1) {
      shouldMove = 2;
      return;
    }
    if (shouldMove !== 2) return;
    nextQuestion();
    shouldMove = 0;
  });
  window.addEventListener('mouseup', nextQuestion);

  state.curQues = questions[state.curIdx];
});

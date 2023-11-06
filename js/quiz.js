import { shuffle } from './utils.js';
import { fetchSpreadsheet } from './data.js';

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

let state;

// Check the parameters and redirect
let quizParams = Object.fromEntries(new URL(document.location).searchParams);
console.log(quizParams);

document.addEventListener('alpine:init', () => {
  Alpine.store('state', {
    questions: null,
    quizLoaded: false,
    curIdx: 0,
    curQues: {},
    chosenOption: -1,
    answerHistory: [],
    answerStatus: 'answering',
    showEndScreen: false,
    quizParams,
  });
  state = Alpine.store('state');
});

const waitUntilTime = (callback, time) => {
  // Wait until `time` seconds after page load to run `callback`
  window.setTimeout(
    callback,
    Math.max(0, time * 1000 - (new Date() - pageLoadTimestamp)),
  );
};

let pageLoadTimestamp = new Date();

document.addEventListener('alpine:init', async () => {
  console.log('Alpine initialized.');

  try {
    window.questions = await fetchSpreadsheet(
      quizParams.spreadsheetID,
      quizParams.sheetName,
    );
    questions = shuffle(questions).slice(0, 10);
    waitUntilTime(() => {
      state.questions = questions;
      state.quizLoaded = true;
    }, 2);
  } catch {
    state.questions = [];
    state.quizLoaded = true;
    return;
  }
  window.answer = (option) => {
    $('.option').focus();
    document.activeElement.blur();
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
    state.answerStatus = 'transitioning';

    // Change question
    window.setTimeout(() => {
      $('#image').src = '';
      $('#options-grid').style.pointerEvents = 'auto';
      $('#options-grid').style.opacity = 1.0;
      state.curIdx = (state.curIdx + 1) % questions.length;

      state.answerStatus = 'answering';
      state.curQues = questions[state.curIdx];

      // Prefetch next image too
      if (state.curIdx < state.questions.length - 1)
        new Image().src = questions[state.curIdx + 1].imageURL;
    }, 500);
  };

  // Variable to catch edge case of whether quesiton should advance on pressing "enter"
  // Because if user presses "enter" while answer selected, this will trigger answer()
  //   and then immediately nextQuestion() but we need to block it the first time
  let shouldMove = 0;

  window.addEventListener('keyup', (e) => {
    if (
      state.answerStatus === 'answering' &&
      'abcde'.includes(e.key.toLowerCase())
    ) {
      answer(
        state.questions[state.curIdx].options[
          'abcde'.indexOf(e.key.toLowerCase())
        ],
      );
      return;
    }

    // Next question?
    if (shouldMove === 1) {
      shouldMove = 2;
      if (e.key === 'Enter') return;
    }
    if (shouldMove !== 2) return;
    nextQuestion();
    shouldMove = 0;
  });
  window.addEventListener('mouseup', nextQuestion);

  state.curQues = questions[state.curIdx];
});

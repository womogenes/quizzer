// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;
  let copy = [...array];

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [copy[currentIndex], copy[randomIndex]] = [
      copy[randomIndex],
      copy[currentIndex],
    ];
  }

  return copy;
};

export const typograph = (str) => {
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

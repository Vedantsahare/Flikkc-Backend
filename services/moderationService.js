const bannedWords = [
  "spam",
  "scam",
  "hack",
  "abuse"
];

export const checkToxicity = (text) => {

  const lower = text.toLowerCase();

  for (const word of bannedWords) {

    if (lower.includes(word)) {
      return true;
    }

  }

  return false;

};

export const detectSpam = (text) => {

  if (text.length > 500) {
    return true;
  }

  const repeated = /(.)\1{5,}/;

  return repeated.test(text);

};
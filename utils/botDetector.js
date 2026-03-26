export function detectBotBehavior(actions) {

  if (!actions || actions.length < 2) {
    return false;
  }

  if (actions.length > 20) {
    return true;
  }

  const intervals = [];

  for (let i = 1; i < actions.length; i++) {
    intervals.push(actions[i] - actions[i - 1]);
  }

  const avg =
    intervals.reduce((a, b) => a + b, 0) / intervals.length;

  if (avg < 1000) {
    return true;
  }

  return false;

}
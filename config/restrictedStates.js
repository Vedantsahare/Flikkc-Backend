export const RESTRICTED_STATES = [
  "Telangana",
  "Andhra Pradesh",
  "Assam",
  "Odisha",
  "Nagaland",
  "Sikkim"
];

const NORMALIZED_STATES = RESTRICTED_STATES.map(s => s.toLowerCase());

export const isStateRestricted = (state) => {
  if (!state) return false;
  return NORMALIZED_STATES.includes(state.toLowerCase());
};
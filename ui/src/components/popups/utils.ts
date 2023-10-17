const alphaNumericOrSpaceRegex = /^[A-Za-z0-9 ]+$/i;

export const isValidName = (name: string) =>
  Boolean(name.trim() && name?.match(alphaNumericOrSpaceRegex));

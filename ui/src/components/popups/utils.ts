export const handleEnterKeyPress = (
  keyCode: number,
  handleEnter: () => void
) => {
  const ENTER_KEY_CODE = 13;
  if (keyCode === ENTER_KEY_CODE) {
    handleEnter();
  }
};

// Allow only alphanumeric and only single spaces
const alphaNumericOrSpaceRegex = /^[a-zA-Z\d]+(?: [a-zA-Z\d]+)*$/i;

export const isValidName = (name: string, prohibitedNames?: string[]) => {
  // Ignore leading and trailing spaces
  const matchName = name.trim();

  const isAllowedCharactersOnly = Boolean(
    matchName?.match(alphaNumericOrSpaceRegex)
  );

  if (prohibitedNames) {
    const prohibitedNameMatches =
      prohibitedNames.filter(
        (prohibitedName) =>
          prohibitedName.toLowerCase() === matchName.toLowerCase()
      ).length > 0;
    return isAllowedCharactersOnly && !prohibitedNameMatches;
  }
  return isAllowedCharactersOnly;
};

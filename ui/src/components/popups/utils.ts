export const handleEnterKeyPress = (
  keyCode: number,
  handleEnter: () => void
) => {
  const ENTER_KEY_CODE = 13;
  if (keyCode === ENTER_KEY_CODE) {
    handleEnter();
  }
};

const alphaNumericOrSpaceRegex = /^[A-Za-z0-9 ]+$/i;

export const isValidName = (name: string, prohibitedNames?: string[]) => {
  const isAllowedCharactersOnly = Boolean(
    name.trim() && name?.match(alphaNumericOrSpaceRegex)
  );

  if (prohibitedNames) {
    const prohibitedNameMatches =
      prohibitedNames.filter(
        (prohibitedName) => prohibitedName.toLowerCase() === name.toLowerCase()
      ).length > 0;
    return isAllowedCharactersOnly && !prohibitedNameMatches;
  }
  return isAllowedCharactersOnly;
};

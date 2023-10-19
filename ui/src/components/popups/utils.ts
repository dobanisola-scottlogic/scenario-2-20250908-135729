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

export const isValidName = (name: string) =>
  Boolean(name.trim() && name?.match(alphaNumericOrSpaceRegex));

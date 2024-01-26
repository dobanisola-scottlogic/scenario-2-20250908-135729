import { handleEnterKeyPress, isValidName } from './utils';

describe('handleEnterKeyPress', () => {
  const mockFunction = vi.fn();

  it('should not call handleEnter function when key press is not key code 13', () => {
    handleEnterKeyPress(14, mockFunction);
    expect(mockFunction).not.toHaveBeenCalled();
  });

  it('should call handleEnter function when key press is key code 13 for enter key code', () => {
    handleEnterKeyPress(13, mockFunction);
    expect(mockFunction).toHaveBeenCalled();
  });
});

describe('isValidName', () => {
  it('should return true when the names are acceptable - numbers and single spaces are allowed', () => {
    expect(isValidName('Valid')).toEqual(true);
    expect(isValidName('Valid Name')).toEqual(true);
    expect(isValidName('Valid3')).toEqual(true);
  });

  it('should return false when the name contain multiple spaces', () => {
    expect(isValidName('Contains  Multiple   Spaces')).toEqual(false);
    expect(isValidName(' Contains leading space')).toEqual(true);
    expect(isValidName('Contains trailing space ')).toEqual(true);
  });

  it('should return false when the names contain special characters', () => {
    expect(isValidName('Cont@insSpecialChar!')).toEqual(false);
  });

  it('should return false when the name is a prohibited word', () => {
    expect(isValidName('prohibited', ['prohibited'])).toEqual(false);
  });
});

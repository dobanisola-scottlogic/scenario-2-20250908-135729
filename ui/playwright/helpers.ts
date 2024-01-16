const sixRandomCharacters = Math.random().toString(36).substring(2, 7);

export const initialURL = './ui/';
export const invalidCharacterErrors = [
  { errorReason: 'only empty spaces', invalidName: ' ' },
  { errorReason: 'invalid characters', invalidName: 'myHackathon!' },
  { errorReason: 'multiple spaces', invalidName: 'my  Hackathon' },
];
export function generateUniqueName(uniqueName: string) {
  return uniqueName + sixRandomCharacters;
}

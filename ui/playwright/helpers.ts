export class HackathonHelpers {
  readonly invalidCharacterErrors: {
    errorReason: string;
    invalidName: string;
  }[];
  readonly generateRandomString: string;

  constructor() {
    this.invalidCharacterErrors = [
      { errorReason: 'only empty spaces', invalidName: ' ' },
      { errorReason: 'invalid characters', invalidName: 'myHackathon!' },
      { errorReason: 'multiple spaces', invalidName: 'my  Hackathon' },
    ];
    this.generateRandomString = Math.random().toString(36).substring(2, 7);
  }
}

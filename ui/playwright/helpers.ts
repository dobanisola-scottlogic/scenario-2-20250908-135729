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

export const tableValues: {
  hackathonName: string;
  teamName: string;
  firstBotNumber: number;
  secondBotNumber: number;
  gameName: string;
  map: string;
  bot: string;
}[] = [
  {
    hackathonName: generateUniqueName('aTableSortHackathon'),
    teamName: generateUniqueName('aTableSortTeam'),
    firstBotNumber: 2,
    secondBotNumber: 3,
    gameName: 'Milestone1Bot vs Milestone2Bot',
    map: 'Easy',
    bot: 'Milestone1Bot',
  },
  {
    hackathonName: generateUniqueName('bTableSortHackathon'),
    teamName: generateUniqueName('bTableSortTeam'),
    firstBotNumber: 1,
    secondBotNumber: 2,
    gameName: 'Milestone2Bot vs Milestone3Bot',
    map: 'LargeMedium',
    bot: 'Milestone3Bot',
  },
  {
    hackathonName: generateUniqueName('cTableSortHackathon'),
    teamName: generateUniqueName('cTableSortTeam'),
    firstBotNumber: 3,
    secondBotNumber: 4,
    gameName: 'Milestone3Bot vs Milestone4Bot',
    map: 'ThreeStar',
    bot: 'Milestone5Bot',
  },
];

export const hackathonSortColumns: {
  columnHeader: string;
  firstValue: string;
  secondValue: string;
  thirdValue: string;
}[] = [
  {
    columnHeader: 'Name',
    firstValue: tableValues[0].hackathonName,
    secondValue: tableValues[1].hackathonName,
    thirdValue: tableValues[2].hackathonName,
  },
  {
    columnHeader: 'Map',
    firstValue: tableValues[0].map,
    secondValue: tableValues[1].map,
    thirdValue: tableValues[2].map,
  },
  {
    columnHeader: 'Bot',
    firstValue: tableValues[0].bot,
    secondValue: tableValues[1].bot,
    thirdValue: tableValues[2].bot,
  },
];

export const gameSortColumns: {
  columnHeader: string;
  firstValue: string;
  secondValue: string;
  thirdValue: string;
}[] = [
  {
    columnHeader: 'Teams',
    firstValue: tableValues[0].gameName,
    secondValue: tableValues[1].gameName,
    thirdValue: tableValues[2].gameName,
  },
  {
    columnHeader: 'Map',
    firstValue: tableValues[0].map,
    secondValue: tableValues[1].map,
    thirdValue: tableValues[2].map,
  },
  {
    columnHeader: 'Start Time',
    firstValue: tableValues[1].gameName,
    secondValue: tableValues[0].gameName,
    thirdValue: tableValues[2].gameName,
  },
];

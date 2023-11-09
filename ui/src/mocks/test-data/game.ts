import { Arena } from '../../interfaces/Arena';
import { CutoffCondition } from '../../interfaces/CutoffCondition';
import { GameResult } from '../../interfaces/GameResult';
import { testHackathonId } from './hackathon';

export const testArena: Arena = {
  height: 64,
  name: 'Easy',
  outOfBoundPositions: [
    { x: 109, y: 63 },
    { x: 127, y: 23 },
    { x: 102, y: 63 },
  ],
  width: 128,
};

export const testGameResultBody: GameResult = {
  cutoffCondition: CutoffCondition.LONE_SURVIVOR,
  game: {
    arena: testArena,
    gameTime: Date.parse('13 Oct 2023 09:12:34'),
    hackathonId: testHackathonId.valid,
    map: testArena,
    teams: [
      {
        botId: 10,
        teamId: null,
        teamName: 'com.scottlogic.hackathon.bots.Milestone1Bot',
      },
      {
        botId: 9,
        teamId: null,
        teamName: 'com.scottlogic.hackathon.bots.Milestone2Bot',
      },
    ],
  },
  id: '59A17EC8-D5AB-48DC-9800-FDCF6DC86F7D',
};

import { GameResult } from '~/interfaces/GameResult';

import { ParsedGameConstants } from './ParsedGameConstants';
import { ParsedGameDelta } from './ParsedGameDelta';
import { ParsedGameState } from './ParsedGameState';

export class ParsedGameResult {
  private constructor(
    public readonly constants: ParsedGameConstants,
    public readonly deltas: ParsedGameDelta[],
    public readonly states: ParsedGameState[]
  ) {}

  public static parse = (gameResult: GameResult): ParsedGameResult => {
    const constants = ParsedGameConstants.parse(gameResult);
    const deltas = ParsedGameDelta.parseMany(gameResult);
    const states = ParsedGameState.parseMany(gameResult);

    return new ParsedGameResult(constants, deltas, states);
  };
}

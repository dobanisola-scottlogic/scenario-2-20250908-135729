import { Alert } from '@mui/material';
import { useEffect, useState } from 'react';
import { commonStyles } from '~/components/commonStyles';
import { HackathonPhaserGame } from '~/components/game/HackathonPhaserGame';
import { ParsedGameResult } from '~/components/game/ParsedGameResult';
import { Cell } from '~/interfaces/Cell';
import { GameResult } from '~/interfaces/GameResult';

interface GamePlaybackProps {
  gameResult: GameResult;
  height: number;
  width: number;
}

const gameElementId = 'phaser-game';

// Declare game variable outside of the component to ensure it is rendered once:
let game: HackathonPhaserGame | null = null;

const GamePlayback = ({ gameResult, height, width }: GamePlaybackProps) => {
  const [formError, setFormError] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Only create a new game if one doesn't already exist:
    if (!game) {
      try {
        const gameData: ParsedGameResult = ParsedGameResult.parse(gameResult);

        game = new HackathonPhaserGame(gameData, gameElementId);
      } catch (error) {
        setFormError(`Error creating game: ${error as string}`);
      }
    }
  }, [gameResult]);

  return (
    <div
      style={{
        minHeight: height * Cell.CellHeight,
        minWidth: width * Cell.CellWidth,
        textAlign: 'center',
      }}
    >
      {formError && (
        <Alert severity='error' sx={commonStyles.alertStyle}>
          {formError}
        </Alert>
      )}
      <div id={gameElementId} />
    </div>
  );
};

export default GamePlayback;

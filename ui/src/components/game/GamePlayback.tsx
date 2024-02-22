import { Alert } from '@mui/material';
import { useEffect, useState } from 'react';
import { commonStyles } from '~/components/commonStyles';
import { GameEndState } from '~/components/game/GameEndState';
import GameOverPanel from '~/components/game/GameOverPanel';
import GamePlaybackSpeedControl from '~/components/game/GamePlaybackSpeedControl';
import { HackathonPhaserGame } from '~/components/game/HackathonPhaserGame';
import { ParsedGameResult } from '~/components/game/ParsedGameResult';
import { ParsedGameState } from '~/components/game/ParsedGameState';
import { GamePlaybackSpeedMultiplier } from '~/enums/GamePlaybackSpeedMultiplier';
import { Cell } from '~/interfaces/Cell';
import { GameResult } from '~/interfaces/GameResult';

interface GamePlaybackProps {
  gameResult: GameResult;
  height: number;
  width: number;
  setGameState: React.Dispatch<
    React.SetStateAction<ParsedGameState | undefined>
  >;
}

const gameElementId = 'phaser-game';

// Declare game variable outside of the component to ensure it is rendered once:
let game: HackathonPhaserGame | null = null;

const GamePlayback = ({
  gameResult,
  height,
  width,
  setGameState,
}: GamePlaybackProps) => {
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const [gameEndState, setGameEndState] = useState<GameEndState>();

  const [gamePlaybackSpeedMultiplier, setGamePlaybackSpeedMultiplier] =
    useState<GamePlaybackSpeedMultiplier>(GamePlaybackSpeedMultiplier.Times1);

  const [isPaused, setIsPaused] = useState<boolean>(false);

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Phaser doesn't 'react' to changes in state hooks so we need to manage changes with useEffect:
    if (game) {
      game.setPaused(isPaused);
    }
  }, [isPaused]);

  useEffect(() => {
    // Phaser doesn't 'react' to changes in state hooks so we need to manage changes with useEffect:
    if (game) {
      game.setGamePlaybackSpeedMultiplier(gamePlaybackSpeedMultiplier);
    }
  }, [gamePlaybackSpeedMultiplier]);

  useEffect(() => {
    // Only create a new game if one doesn't already exist:
    if (!game) {
      try {
        const gameData: ParsedGameResult = ParsedGameResult.parse(gameResult);

        game = new HackathonPhaserGame(
          gameData,
          gameElementId,
          setGameState,
          setGameEndState
        );
      } catch (error) {
        setFormError(`Error creating game: ${error as string}`);
      }
    }
  }, [gamePlaybackSpeedMultiplier, gameResult, isPaused, setGameState]);

  return (
    <div>
      {formError && (
        <Alert severity='error' sx={commonStyles.alertStyle}>
          {formError}
        </Alert>
      )}

      <div
        id={gameElementId}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          height: height * Cell.CellHeight,
          position: 'relative',
          width: width * Cell.CellWidth,
          margin: '0 auto',
        }}
      >
        {!gameEndState && (
          <GamePlaybackSpeedControl
            gamePlaybackSpeedMultiplier={gamePlaybackSpeedMultiplier}
            isPaused={isPaused}
            isHovered={isHovered}
            setGamePlaybackSpeedMultiplier={setGamePlaybackSpeedMultiplier}
            setIsPaused={setIsPaused}
          ></GamePlaybackSpeedControl>
        )}

        <GameOverPanel
          gameEndState={gameEndState}
          width={width * Cell.CellWidth}
        />
      </div>
    </div>
  );
};

export default GamePlayback;

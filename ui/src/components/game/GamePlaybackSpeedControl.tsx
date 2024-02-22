import { Pause, PlayArrow } from '@mui/icons-material';
import { Button } from '@mui/material';
import { GamePlaybackSpeedMultiplier, GamePlaybackSpeedMultiplierUtils } from '~/enums/GamePlaybackSpeedMultiplier';

interface GamePlaybackSpeedControlProps {
  gamePlaybackSpeedMultiplier: GamePlaybackSpeedMultiplier;
  isPaused: boolean;
  isHovered: boolean;
  setGamePlaybackSpeedMultiplier: React.Dispatch<
    React.SetStateAction<GamePlaybackSpeedMultiplier>
  >;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
}

const GamePlaybackSpeedControl = ({
  gamePlaybackSpeedMultiplier,
  isPaused,
  isHovered,
  setGamePlaybackSpeedMultiplier,
  setIsPaused,
}: GamePlaybackSpeedControlProps) => {
  const multipliers = GamePlaybackSpeedMultiplierUtils.getAllValuesAscending();

  return (
    <div
      style={{
        backgroundColor: 'rgba(200, 200, 200, 0.95)',
        borderRadius: 15,
        bottom: 40,
        left: '50%',
        marginLeft: 'auto',
        marginRight: 'auto',
        opacity: isHovered ? 1 : 0,
        padding: 20,
        position: 'absolute',
        textAlign: 'center',
        transform: 'translateX(-50%)',
        transition: 'opacity 0.3s ease',
      }}
    >
      <ul
        style={{
          listStyleType: 'none',
          margin: 0,
          padding: 10,
          display: 'flex',
        }}
      >
        <li>
          <Button
            variant='contained'
            color={isPaused ? 'success' : 'error'}
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? <PlayArrow /> : <Pause />}
          </Button>
        </li>
        {multipliers.map((multiplier: GamePlaybackSpeedMultiplier) => (
          <li key={multiplier} style={{ marginLeft: 2, marginRight: 2 }}>
            <Button
              variant={
                multiplier === gamePlaybackSpeedMultiplier
                  ? 'contained'
                  : 'outlined'
              }
              onClick={() => setGamePlaybackSpeedMultiplier(multiplier)}
            >
              {`x${multiplier}`}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GamePlaybackSpeedControl;

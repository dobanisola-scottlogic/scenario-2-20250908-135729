import { act, fireEvent, screen, waitFor } from '@testing-library/react';

import { renderWithRouterAndProvider } from '../../utils/test-utils';
import PlayerSelect from './PlayerSelect';

const mockFunction = () => null;
const hackathonId = 'hackathon1';

const renderComponent = (
  includeTeams = true,
  isOptional = false,
  playerNumber = 1
) => {
  renderWithRouterAndProvider(
    <PlayerSelect
      hackathonId={hackathonId}
      includeTeams={includeTeams}
      isOptional={isOptional}
      playerName={''}
      playerNumber={playerNumber}
      setPlayerName={mockFunction}
    />
  );
};

describe('PlayerSelect', () => {
  it('should render the PlayerSelect component label correctly when player number is 1', () => {
    renderComponent(false, false, 1);

    expect(screen.getByTestId('player-1')).toBeInTheDocument();
  });

  it('should render the PlayerSelect component label correctly when player number is 2', () => {
    renderComponent(false, false, 2);

    expect(screen.getByTestId('player-2')).toBeInTheDocument();
  });

  it('should render the PlayerSelect component label correctly when isOptional is true', () => {
    renderComponent(false, true, 1);

    expect(
      screen.getByLabelText('Select player 1 (Optional)')
    ).toBeInTheDocument();
  });

  it('should render the PlayerSelect component including with just the milestone bots when include teams is false', async () => {
    renderComponent(false, false, 1);

    const dropdownButton = screen.getByRole('button', {
      name: /select player 1/i,
    });

    act(() => {
      fireEvent.mouseDown(dropdownButton);
    });

    await waitFor(() => {
      // Displays the milestones:
      expect(
        screen.getByRole('option', { name: 'Milestones' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('option', { name: 'Milestone1Bot' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('option', { name: 'Milestone2Bot' })
      ).toBeInTheDocument();

      // Does not display the teams:
      expect(
        screen.queryByRole('option', { name: /team/i })
      ).not.toBeInTheDocument();
    });
  });

  it('should render the PlayerSelect component including with the milestone bots and the teams when include teams is true', async () => {
    renderComponent(true, false, 1);

    const dropdownButton = screen.getByRole('button', {
      name: /select player 1/i,
    });

    act(() => {
      fireEvent.mouseDown(dropdownButton);
    });

    await waitFor(() => {
      // Displays the teams:
      expect(screen.getByRole('option', { name: 'Teams' })).toBeInTheDocument();

      expect(
        screen.getByRole('option', { name: 'Team 1' })
      ).toBeInTheDocument();

      // Displays the milestones:
      expect(
        screen.getByRole('option', { name: 'Milestones' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('option', { name: 'Milestone1Bot' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('option', { name: 'Milestone2Bot' })
      ).toBeInTheDocument();
    });
  });
});

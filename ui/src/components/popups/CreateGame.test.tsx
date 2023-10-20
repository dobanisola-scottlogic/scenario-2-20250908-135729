import '@testing-library/jest-dom';

import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  postGameBadRequestResponseHandler,
  postGameInternalServerErrorResponseHandler,
} from '../../mocks/handlers';
import { server } from '../../mocks/server';
import { renderWithRouterAndProvider } from '../../utils/test-utils';
import CreateGame from './CreateGame';

const hackathonId = 'Hackathon1';

const selectAndVerifyDropDownValue = async (
  selectLabelRegExp: RegExp,
  optionText: string,
  testId: string
) => {
  fireEvent.mouseDown(
    screen.getByRole('button', {
      name: selectLabelRegExp,
    })
  );

  const listboxPlayer1 = within(
    screen.getByRole('listbox', { name: selectLabelRegExp })
  );

  await userEvent.click(
    await listboxPlayer1.findByRole('option', {
      name: optionText,
    })
  );

  expect(screen.getByTestId(testId)).toHaveTextContent(optionText);
};

const selectTwoTeamsAndMap = async () => {
  const addANewGameButton = screen.getByRole('button', {
    name: 'Add a new game',
  });

  expect(addANewGameButton).toHaveAttribute('disabled');

  await selectAndVerifyDropDownValue(
    /select player 1/i,
    'Milestone1Bot',
    'player-1'
  );

  // Button should still be disabled:
  expect(addANewGameButton).toHaveAttribute('disabled');

  await selectAndVerifyDropDownValue(
    /select player 2/i,
    'Milestone2Bot',
    'player-2'
  );

  // Button should still be disabled:
  expect(addANewGameButton).toHaveAttribute('disabled');

  await selectAndVerifyDropDownValue(/select map/i, 'Easy', 'game-map');

  // Button should now be enabled:
  expect(addANewGameButton).not.toHaveAttribute('disabled');
};

describe('Add A New Game popup Component', () => {
  const mockFunction = () => null;

  describe('When the popup is opened', () => {
    it('renders the Add A New Game popup', () => {
      renderWithRouterAndProvider(
        <CreateGame isOpen hackathonId={hackathonId} setIsOpen={mockFunction} />
      );

      expect(screen.getAllByText('Add a new game')).toHaveLength(2);

      expect(
        screen.getByRole('button', { name: 'Cancel' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Add a new game' })
      ).toBeInTheDocument();

      const player1Input = screen.getByRole('button', {
        name: /select player 1/i,
      });

      expect(player1Input).toBeInTheDocument();

      const player2Input = screen.getByRole('button', {
        name: /select player 2/i,
      });

      expect(player2Input).toBeInTheDocument();

      const player3Input = screen.getByRole('button', {
        name: /select player 3/i,
      });

      expect(player3Input).toBeInTheDocument();

      const player4Input = screen.getByRole('button', {
        name: /select player 4/i,
      });

      expect(player4Input).toBeInTheDocument();

      const mapInput = screen.getByRole('button', {
        name: /select map/i,
      });

      expect(mapInput).toBeInTheDocument();
    });

    it('disables the add game button until two players and a map are selected', async () => {
      renderWithRouterAndProvider(
        <CreateGame isOpen hackathonId={hackathonId} setIsOpen={mockFunction} />
      );

      await selectTwoTeamsAndMap();
    });
  });

  describe('When the Add A New Game button is pressed', () => {
    it('calls the create game function successfully', async () => {
      const { store } = renderWithRouterAndProvider(
        <CreateGame isOpen hackathonId={hackathonId} setIsOpen={mockFunction} />
      );

      const addANewGameButton = screen.getByRole('button', {
        name: 'Add a new game',
      });

      await selectTwoTeamsAndMap();

      act(() => {
        fireEvent.click(addANewGameButton);
      });

      await waitFor(() => {
        const reduxState = store.getState();

        expect(reduxState.snackbar.isOpen).toBeTruthy();

        expect(reduxState.snackbar.message).toEqual(
          'Game created successfully!'
        );
      });
    });

    it('displays an error when the create game function returns unsuccessfully with a bad request', async () => {
      server.use(postGameBadRequestResponseHandler);

      renderWithRouterAndProvider(
        <CreateGame isOpen hackathonId={hackathonId} setIsOpen={mockFunction} />
      );

      const addANewGameButton = screen.getByRole('button', {
        name: 'Add a new game',
      });

      await selectTwoTeamsAndMap();

      act(() => {
        fireEvent.click(addANewGameButton);
      });

      await waitFor(async () => {
        const alert = await screen.findByRole('alert');

        expect(alert.textContent).toContain(
          'Error creating game - bad request'
        );
      });
    });

    it('displays an error when the create game function returns unsuccessfully with an internal server error', async () => {
      server.use(postGameInternalServerErrorResponseHandler);

      renderWithRouterAndProvider(
        <CreateGame isOpen hackathonId={hackathonId} setIsOpen={mockFunction} />
      );

      const addANewGameButton = screen.getByRole('button', {
        name: 'Add a new game',
      });

      await selectTwoTeamsAndMap();

      act(() => {
        fireEvent.click(addANewGameButton);
      });

      await waitFor(async () => {
        const alert = await screen.findByRole('alert');

        expect(alert.textContent).toContain(
          'Error creating game - internal server error'
        );
      });
    });
  });
});

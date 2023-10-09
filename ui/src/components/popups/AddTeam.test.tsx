import '@testing-library/jest-dom';

import { fireEvent, screen, waitFor } from '@testing-library/react';

import {
  postTeamBadRequestResponseHandler,
  postTeamInternalServerErrorResponseHandler,
} from '../../mocks/handlers';
import { server } from '../../mocks/server';
import { renderWithRouterAndProvider } from '../../utils/test-utils';
import AddTeam from './AddTeam';

describe('Add Team Popup Component', () => {
  const mockFunction = () => null;

  describe('When the Add Team popup is opened', () => {
    it('renders the Add Team popup', () => {
      renderWithRouterAndProvider(
        <AddTeam isOpen id="test-id" setIsOpen={mockFunction} />
      );

      expect(screen.getByText('Add a new team')).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Cancel' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Add team' })
      ).toBeInTheDocument();
    });

    it('disables the Add Team button until a name and password is entered', () => {
      renderWithRouterAndProvider(
        <AddTeam isOpen id="test-id" setIsOpen={mockFunction} />
      );

      expect(screen.getByText('Add a new team')).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Cancel' })
      ).toBeInTheDocument();

      expect(screen.getByRole('button', { name: 'Add team' })).toBeDisabled();

      const nameInput = screen.getByLabelText('Team name');

      fireEvent.change(nameInput, { target: { value: 'Team1' } });

      expect(screen.getByRole('button', { name: 'Add team' })).toBeDisabled();

      const passwordInput = screen.getByLabelText('Team password');

      fireEvent.change(passwordInput, { target: { value: 'Pa$$w0rd' } });

      expect(
        screen.getByRole('button', { name: 'Add team' })
      ).not.toHaveAttribute('disabled');
    });
  });

  describe('When the Add button is pressed', () => {
    it('calls the Add Team function successfully', async () => {
      const { store } = renderWithRouterAndProvider(
        <AddTeam isOpen id="test-id" setIsOpen={mockFunction} />
      );

      fireEvent.change(screen.getByLabelText('Team name'), {
        target: { value: 'Team1' },
      });

      fireEvent.change(screen.getByLabelText('Team password'), {
        target: { value: 'Pa$$w0rd' },
      });

      fireEvent.click(screen.getByRole('button', { name: 'Add team' }));

      await waitFor(() => {
        const reduxState = store.getState();

        expect(reduxState.snackbar.isOpen).toBeTruthy();

        expect(reduxState.snackbar.message).toEqual('Team added successfully!');
      });
    });

    it('displays an error when the Add Team function returns unsuccessfully with a bad request', async () => {
      server.use(postTeamBadRequestResponseHandler);

      renderWithRouterAndProvider(
        <AddTeam isOpen id="test-id" setIsOpen={mockFunction} />
      );

      fireEvent.change(screen.getByLabelText('Team name'), {
        target: { value: 'Team1' },
      });

      fireEvent.change(screen.getByLabelText('Team password'), {
        target: { value: 'Pa$$w0rd' },
      });

      fireEvent.click(screen.getByRole('button', { name: 'Add team' }));

      const alert = await screen.findByRole('alert');

      expect(alert.textContent).toContain('Error adding team - bad request');
    });

    it('displays an error when the Add Team function returns unsuccessfully with an internal server error', async () => {
      server.use(postTeamInternalServerErrorResponseHandler);

      renderWithRouterAndProvider(
        <AddTeam isOpen id="test-id" setIsOpen={mockFunction} />
      );

      fireEvent.change(screen.getByLabelText('Team name'), {
        target: { value: 'Team1' },
      });

      fireEvent.change(screen.getByLabelText('Team password'), {
        target: { value: 'Pa$$w0rd' },
      });

      fireEvent.click(screen.getByRole('button', { name: 'Add team' }));

      const alert = await screen.findByRole('alert');

      expect(alert.textContent).toContain(
        'Error adding team - internal server error'
      );
    });
  });
});

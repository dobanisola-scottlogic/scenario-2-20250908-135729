import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  getTeamErrorResponseHandler,
  postTeamBadRequestResponseHandler,
  postTeamInternalServerErrorResponseHandler,
  putTeamBadRequestResponseHandler,
  putTeamInternalServerErrorResponseHandler,
} from '~/mocks/handlers/team';
import { server } from '~/mocks/server';
import { testHackathonId } from '~/mocks/test-data/hackathon';
import { testTeamBody, testTeamId } from '~/mocks/test-data/team';
import { renderWithRouterAndProvider } from '~/utils/test-utils';
import CreateUpdateTeam, { teamNameErrorMsg } from './CreateUpdateTeam';

describe('CreateUpdateTeam Popup Component', () => {
  const mockFunction = () => null;
  const hackathonId = testHackathonId.valid;
  const teamId = testTeamId.valid;
  const teamName = testTeamBody.name;
  const teamPassword = testTeamBody.password;

  describe('When the Add Team popup is opened', () => {
    it('renders the Add Team popup', () => {
      renderWithRouterAndProvider(
        <CreateUpdateTeam
          isOpen
          hackathonId={hackathonId}
          setIsOpen={mockFunction}
        />
      );

      expect(screen.getByText('Add a new team')).toBeInTheDocument();

      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      const submitButton = screen.getByRole('button', { name: 'Add team' });
      const togglePasswordButton = screen.getByRole('button', {
        name: 'toggle password visibility',
      });

      expect(cancelButton).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
      expect(togglePasswordButton).toBeInTheDocument();
    });

    it('disables the Add Team button until a name and password is entered', () => {
      renderWithRouterAndProvider(
        <CreateUpdateTeam
          isOpen
          hackathonId={hackathonId}
          setIsOpen={mockFunction}
        />
      );

      expect(screen.getByText('Add a new team')).toBeInTheDocument();

      const nameInput = screen.getByRole('textbox', { name: 'Name' });
      const passwordInput = screen.getByTestId('password-input'); // when password visibility is off input type is password & role is not textbox so get by id
      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      const submitButton = screen.getByRole('button', { name: 'Add team' });

      expect(cancelButton).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toBeDisabled();

      fireEvent.change(nameInput, { target: { value: teamName } });

      expect(submitButton).toBeDisabled();

      fireEvent.change(passwordInput, { target: { value: teamPassword } });

      expect(submitButton).not.toHaveAttribute('disabled');
    });

    it('disables the add hackathon button if a symbol or special character is entered', () => {
      renderWithRouterAndProvider(
        <CreateUpdateTeam
          isOpen
          hackathonId={hackathonId}
          setIsOpen={mockFunction}
        />
      );

      expect(screen.getByText('Add a new team')).toBeInTheDocument();

      const nameInput = screen.getByRole('textbox', { name: 'Name' });
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByRole('button', { name: 'Add team' });

      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toBeDisabled();

      fireEvent.change(nameInput, { target: { value: 'Team#3' } });
      fireEvent.change(passwordInput, { target: { value: teamPassword } });

      expect(submitButton).toBeDisabled();
      expect(screen.getByText(teamNameErrorMsg)).toBeInTheDocument();
    });

    it('disables the add hackathon button if the name "admin" is entered', () => {
      renderWithRouterAndProvider(
        <CreateUpdateTeam
          isOpen
          hackathonId={hackathonId}
          setIsOpen={mockFunction}
        />
      );

      expect(screen.getByText('Add a new team')).toBeInTheDocument();

      const nameInput = screen.getByRole('textbox', { name: 'Name' });
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByRole('button', { name: 'Add team' });

      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toBeDisabled();

      fireEvent.change(nameInput, { target: { value: 'admin' } });
      fireEvent.change(passwordInput, { target: { value: teamPassword } });

      expect(submitButton).toBeDisabled();
      expect(screen.getByText(teamNameErrorMsg)).toBeInTheDocument();
    });

    it('disables the add hackathon button if multiple spaces are entered', () => {
      renderWithRouterAndProvider(
        <CreateUpdateTeam
          isOpen
          hackathonId={hackathonId}
          setIsOpen={mockFunction}
        />
      );

      expect(screen.getByText('Add a new team')).toBeInTheDocument();

      const nameInput = screen.getByRole('textbox', { name: 'Name' });
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByRole('button', { name: 'Add team' });

      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toBeDisabled();

      fireEvent.change(nameInput, {
        target: { value: 'Has  multiple  spaces' },
      });
      fireEvent.change(passwordInput, { target: { value: teamPassword } });

      expect(submitButton).toBeDisabled();
      expect(screen.getByText(teamNameErrorMsg)).toBeInTheDocument();

      fireEvent.change(nameInput, { target: { value: 'Has single spaces' } });

      expect(submitButton).not.toBeDisabled();
    });

    it('does not allow more than 255 characters to be entered for the team name', async () => {
      renderWithRouterAndProvider(
        <CreateUpdateTeam
          hackathonId={hackathonId}
          isOpen
          setIsOpen={mockFunction}
        />
      );

      const user = userEvent.setup({ delay: null });
      const twoSixtyCharString = 'a'.repeat(260);

      expect(screen.getByText('Add a new team')).toBeInTheDocument();

      const nameInput: HTMLInputElement = screen.getByRole('textbox', {
        name: 'Name',
      });

      await user.type(nameInput, twoSixtyCharString);
      expect(nameInput.value).toHaveLength(255);
    });
  });

  describe('When the Add button is pressed', () => {
    it('calls the Add Team function successfully', async () => {
      const { store } = renderWithRouterAndProvider(
        <CreateUpdateTeam
          isOpen
          hackathonId={hackathonId}
          setIsOpen={mockFunction}
        />
      );

      const nameInput = screen.getByRole('textbox', { name: 'Name' });
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByRole('button', { name: 'Add team' });

      fireEvent.change(nameInput, { target: { value: teamName } });
      fireEvent.change(passwordInput, { target: { value: teamPassword } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const reduxState = store.getState();

        expect(reduxState.snackbar.isOpen).toBeTruthy();

        expect(reduxState.snackbar.message).toEqual('Team added successfully!');
      });
    });

    it('displays an error when the Add Team function returns unsuccessfully with a bad request', async () => {
      server.use(postTeamBadRequestResponseHandler);

      renderWithRouterAndProvider(
        <CreateUpdateTeam
          isOpen
          hackathonId={hackathonId}
          setIsOpen={mockFunction}
        />
      );

      const nameInput = screen.getByRole('textbox', { name: 'Name' });
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByRole('button', { name: 'Add team' });

      fireEvent.change(nameInput, { target: { value: teamName } });
      fireEvent.change(passwordInput, { target: { value: teamPassword } });
      fireEvent.click(submitButton);

      await waitFor(async () => {
        const alert = await screen.findByRole('alert');

        expect(alert.textContent).toContain(
          'Error adding team - Bad request error message'
        );
      });
    });

    it('displays an error when the Add Team function returns unsuccessfully with an internal server error', async () => {
      server.use(postTeamInternalServerErrorResponseHandler);

      renderWithRouterAndProvider(
        <CreateUpdateTeam
          isOpen
          hackathonId={hackathonId}
          setIsOpen={mockFunction}
        />
      );

      const nameInput = screen.getByRole('textbox', { name: 'Name' });
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByRole('button', { name: 'Add team' });

      fireEvent.change(nameInput, { target: { value: teamName } });
      fireEvent.change(passwordInput, { target: { value: teamPassword } });
      fireEvent.click(submitButton);

      await waitFor(async () => {
        const alert = await screen.findByRole('alert');

        expect(alert.textContent).toContain(
          'Error adding team - internal server error'
        );
      });
    });
  });

  describe('When the Edit Team popup is opened', () => {
    it('renders the Edit Team popup', () => {
      renderWithRouterAndProvider(
        <CreateUpdateTeam
          isOpen
          hackathonId={hackathonId}
          id={teamId}
          setIsOpen={mockFunction}
        />
      );

      expect(screen.getByText('Edit team')).toBeInTheDocument();

      const nameInput = screen.getByRole('textbox', { name: 'Name' });
      const passwordInput = screen.getByTestId('password-input');
      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      const submitButton = screen.getByRole('button', { name: 'Update team' });

      expect(nameInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(cancelButton).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
    });

    it('displays an error when the team fails to fetch', async () => {
      server.use(getTeamErrorResponseHandler);

      renderWithRouterAndProvider(
        <CreateUpdateTeam
          isOpen
          hackathonId={hackathonId}
          id={testTeamId.networkError}
          setIsOpen={mockFunction}
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText('Error fetching team')).toBeInTheDocument();
      });
    });

    it('disables the Update team button until a name and password is entered', async () => {
      renderWithRouterAndProvider(
        <CreateUpdateTeam
          isOpen
          hackathonId={hackathonId}
          id={teamId}
          setIsOpen={mockFunction}
        />
      );

      expect(screen.getByText('Edit team')).toBeInTheDocument();

      const nameInput = screen.getByRole('textbox', { name: 'Name' });
      const passwordInput = screen.getByTestId('password-input');
      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      const submitButton = screen.getByRole('button', { name: 'Update team' });

      fireEvent.change(nameInput, { target: { value: '' } });
      fireEvent.change(passwordInput, { target: { value: '' } });

      expect(cancelButton).toBeInTheDocument();
      expect(submitButton).toBeDisabled();

      fireEvent.change(nameInput, { target: { value: teamName } });

      expect(cancelButton).not.toBeDisabled();
      expect(submitButton).toBeDisabled();

      fireEvent.change(passwordInput, { target: { value: teamPassword } });

      await waitFor(() => {
        expect(cancelButton).not.toBeDisabled();
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('When the Update team button is pressed', () => {
    it('calls the Update team function successfully', async () => {
      const { store } = renderWithRouterAndProvider(
        <CreateUpdateTeam
          isOpen
          hackathonId={hackathonId}
          id={teamId}
          setIsOpen={mockFunction}
        />
      );

      const nameInput = screen.getByRole('textbox', { name: 'Name' });
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByRole('button', { name: 'Update team' });

      fireEvent.change(nameInput, { target: { value: teamName } });
      fireEvent.change(passwordInput, { target: { value: teamPassword } });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        const reduxState = store.getState();

        expect(reduxState.snackbar.isOpen).toBeTruthy();
        expect(reduxState.snackbar.message).toEqual(
          'Team updated successfully!'
        );
      });
    });

    it('displays an error when the Edit Team function returns unsuccessfully with a bad request', async () => {
      server.use(putTeamBadRequestResponseHandler);

      renderWithRouterAndProvider(
        <CreateUpdateTeam
          isOpen
          hackathonId={hackathonId}
          id={teamId}
          setIsOpen={mockFunction}
        />
      );

      const nameInput = screen.getByRole('textbox', { name: 'Name' });
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByRole('button', { name: 'Update team' });

      fireEvent.change(nameInput, { target: { value: teamName } });
      fireEvent.change(passwordInput, { target: { value: teamPassword } });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(async () => {
        const alert = await screen.findByRole('alert');

        expect(alert.textContent).toContain(
          'Error updating team - bad request'
        );
      });
    });

    it('displays an error when the Edit Team function returns unsuccessfully with an internal server error', async () => {
      server.use(putTeamInternalServerErrorResponseHandler);

      renderWithRouterAndProvider(
        <CreateUpdateTeam
          isOpen
          hackathonId={hackathonId}
          id={teamId}
          setIsOpen={mockFunction}
        />
      );

      const nameInput = screen.getByRole('textbox', { name: 'Name' });
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByRole('button', { name: 'Update team' });

      fireEvent.change(nameInput, { target: { value: teamName } });
      fireEvent.change(passwordInput, { target: { value: teamPassword } });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(async () => {
        const alert = await screen.findByRole('alert');

        expect(alert.textContent).toContain(
          'Error updating team - internal server error'
        );
      });
    });
  });
});

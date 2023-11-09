import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { testTeamId } from '../../mocks/test-data/team';
import { renderWithRouterAndProvider } from '../../utils/test-utils';
import DeleteTeam from './DeleteTeam';

describe('Delete Team Popup Component', () => {
  const mockFunction = () => null;

  describe('When the delete team popup is opened', () => {
    it('renders the delete team popup', () => {
      renderWithRouterAndProvider(
        <DeleteTeam isOpen id={testTeamId.valid} setIsOpen={mockFunction} />
      );

      expect(
        screen.getByText('Are you sure you want to delete the team?')
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Cancel' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Delete team' })
      ).toBeInTheDocument();
    });
  });

  describe('When the delete button is pressed', () => {
    it('calls the delete team function successfully', async () => {
      const { store } = renderWithRouterAndProvider(
        <DeleteTeam isOpen id={testTeamId.valid} setIsOpen={mockFunction} />
      );

      fireEvent.click(screen.getByRole('button', { name: 'Delete team' }));

      await waitFor(() => {
        const reduxState = store.getState();
        expect(reduxState.snackbar.message).toEqual(
          'Team deleted successfully!'
        );
        expect(reduxState.snackbar.isOpen).toBeTruthy();
      });
    });

    it('displays an error when the delete team function returns unsuccessfully with a bad request', async () => {
      renderWithRouterAndProvider(
        <DeleteTeam
          isOpen
          id={testTeamId.badRequest}
          setIsOpen={mockFunction}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: 'Delete team' }));

      const alert = await screen.findByRole('alert');
      expect(alert.textContent).toContain('Error deleting team - bad request');
    });

    it('displays an error when the delete team function returns unsuccessfully with an internal server error', async () => {
      renderWithRouterAndProvider(
        <DeleteTeam
          isOpen
          id={testTeamId.networkError}
          setIsOpen={mockFunction}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: 'Delete team' }));

      const alert = await screen.findByRole('alert');
      expect(alert.textContent).toContain(
        'Error deleting team - internal server error'
      );
    });
  });
});

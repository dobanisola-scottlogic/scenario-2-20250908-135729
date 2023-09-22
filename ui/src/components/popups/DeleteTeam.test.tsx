import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import DeleteTeam from './DeleteTeam';

describe('Delete Team Popup Component', () => {
  const mockFunction = () => null;

  describe('When the delete team popup is opened', () => {
    it('renders the delete team popup', () => {
      renderWithProviders(
        <DeleteTeam isOpen id="test-id" setIsOpen={mockFunction} />
      );

      expect(
        screen.getByText('Are you sure you want to delete the team?')
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'CANCEL' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'DELETE TEAM' })
      ).toBeInTheDocument();
    });
  });

  describe('When the delete button is pressed', () => {
    it('calls the delete team function successfully', async () => {
      renderWithProviders(
        <DeleteTeam isOpen id="test-id" setIsOpen={mockFunction} />
      );

      fireEvent.click(screen.getByRole('button', { name: 'DELETE TEAM' }));

      // Displays success message
      const successMessage = await screen.findByText(
        'Team deleted successfully!'
      );
      expect(successMessage).toBeInTheDocument();
    });

    it('displays an error when the delete team function returns unsuccessfully with a bad request', async () => {
      renderWithProviders(
        <DeleteTeam isOpen id="400" setIsOpen={mockFunction} />
      );

      fireEvent.click(screen.getByRole('button', { name: 'DELETE TEAM' }));

      const alert = await screen.findByRole('alert');
      expect(alert.textContent).toContain('Error deleting team - bad request');
    });

    it('displays an error when the delete team function returns unsuccessfully with an internal server error', async () => {
      renderWithProviders(
        <DeleteTeam isOpen id="500" setIsOpen={mockFunction} />
      );

      fireEvent.click(screen.getByRole('button', { name: 'DELETE TEAM' }));

      const alert = await screen.findByRole('alert');
      expect(alert.textContent).toContain(
        'Error deleting team - internal server error'
      );
    });
  });
});

import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import DeleteHackathon from './DeleteHackathon';

describe('Delete Hackathon Popup Component', () => {
  const mockFunction = () => null;

  describe('When the delete Hackathon popup is opened', () => {
    it('renders the delete hackathon popup', () => {
      renderWithProviders(
        <DeleteHackathon isOpen id="test-id" setIsOpen={mockFunction} />
      );

      expect(
        screen.getByText('Are you sure you want to delete the hackathon?')
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'CANCEL' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'DELETE HACKATHON' })
      ).toBeInTheDocument();
    });
  });

  describe('When the delete button is pressed', () => {
    it('calls the delete hackathon function successfully', async () => {
      renderWithProviders(
        <DeleteHackathon isOpen id="test-id" setIsOpen={mockFunction} />
      );

      fireEvent.click(screen.getByRole('button', { name: 'DELETE HACKATHON' }));

      // Displays success message
      const successMessage = await screen.findByText(
        'Hackathon deleted successfully!'
      );
      expect(successMessage).toBeInTheDocument();
    });

    it('displays an error when the delete hackathon function returns unsuccessfully with a bad request', async () => {
      renderWithProviders(
        <DeleteHackathon isOpen id="400" setIsOpen={mockFunction} />
      );

      fireEvent.click(screen.getByRole('button', { name: 'DELETE HACKATHON' }));

      const alert = await screen.findByRole('alert');
      expect(alert.textContent).toContain(
        'Error deleting hackathon - bad request'
      );
    });

    it('displays an error when the delete hackathon function returns unsuccessfully with an internal server error', async () => {
      renderWithProviders(
        <DeleteHackathon isOpen id="500" setIsOpen={mockFunction} />
      );

      fireEvent.click(screen.getByRole('button', { name: 'DELETE HACKATHON' }));

      const alert = await screen.findByRole('alert');
      expect(alert.textContent).toContain(
        'Error deleting hackathon - internal server error'
      );
    });
  });
});

import {
    fireEvent,
    screen,
    waitForElementToBeRemoved,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import DeleteHackathon from './DeleteHackathon';
import { renderWithProviders } from '../../utils/test-utils';
  
describe('Delete Hackathon Popup Component', () => {
    const mockFunction = () => null;
  
    describe('When the delete Hackathon popup is opened', () => {
      it('renders the delete hackathon popup', () => {
        renderWithProviders(
          <DeleteHackathon
            isOpen
            hackathonId="test-id"
            setIsOpen={mockFunction}
          />
        );
  
        expect(screen.getByText('Are you sure you want to delete the hackathon?')).toBeInTheDocument();

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
          <DeleteHackathon
            isOpen
            hackathonId="test-id"
            setIsOpen={mockFunction}
          />
        );
  
        fireEvent.click(
          screen.getByRole('button', { name: 'DELETE HACKATHON' })
        );
  
        await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));
  
        // Displays success message
        expect(screen.getByText( "Hackathon deleted successfully!")).toBeInTheDocument();
      });
  
      it('displays an error when the delete hackathon function returns unsuccessfully with an internal server error', async () => {
        renderWithProviders(
          <DeleteHackathon
            isOpen
            hackathonId="400"
            setIsOpen={mockFunction}
          />
        );
  
        fireEvent.click(
          screen.getByRole('button', { name: 'DELETE HACKATHON' })
        );
  
        await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));
  
        const alert = await screen.findByRole('alert');
        expect(alert.textContent).toContain(
          'Error deleting hackathon - bad request'
        );
      });
  
      it('displays an error when the delete hackathon function returns unsuccessfully with an internal server error', async () => {
        renderWithProviders(
          <DeleteHackathon
            isOpen
            hackathonId="500"
            setIsOpen={mockFunction}
          />
        );
    
        fireEvent.click(
        screen.getByRole('button', { name: 'DELETE HACKATHON' })
        );

        await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

        const alert = await screen.findByRole('alert');
        expect(alert.textContent).toContain(
        'Error deleting hackathon - internal server error'
        );
      });
    });
});
  
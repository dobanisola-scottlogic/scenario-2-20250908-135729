import '@testing-library/jest-dom';
import {
  fireEvent,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import CreateHackathon from './CreateHackathon';

describe('Create Hackathon Popup Component', () => {
  const mockFunction = () => null;

  describe('When the create Hackathon popup is opened', () => {
    it('renders the create hackathon popup', () => {
      renderWithProviders(
        <CreateHackathon
          createHackathonOpen
          setCreateHackathonOpen={mockFunction}
        />
      );

      expect(screen.getByText('Add a new hackathon')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'CANCEL' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'ADD A NEW HACKATHON' })
      ).toBeInTheDocument();
    });

    it('disables the add hackathon button until a name is entered', () => {
      renderWithProviders(
        <CreateHackathon
          createHackathonOpen
          setCreateHackathonOpen={mockFunction}
        />
      );

      expect(screen.getByText('Add a new hackathon')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'ADD A NEW HACKATHON' })
      ).toHaveAttribute('disabled');

      const textInput = screen.getByRole('textbox', { name: 'Hackathon name' });
      fireEvent.change(textInput, { target: { value: 'Test Hackathon' } });

      expect(
        screen.getByRole('button', { name: 'ADD A NEW HACKATHON' })
      ).not.toHaveAttribute('disabled');
    });
  });

  describe('When the create button is pressed', () => {
    it('calls the create hackathon function successfully', async () => {
      renderWithProviders(
        <CreateHackathon
          createHackathonOpen
          setCreateHackathonOpen={mockFunction}
        />
      );

      const textInput = screen.getByRole('textbox', { name: 'Hackathon name' });
      fireEvent.change(textInput, { target: { value: 'Test Hackathon' } });

      fireEvent.click(
        screen.getByRole('button', { name: 'ADD A NEW HACKATHON' })
      );

      await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

      // Displays success message
      expect(
        screen.getByText("Hackathon 'Test Hackathon' created successfully!")
      ).toBeInTheDocument();
    });

    it('displays an error when the create hackathon function returns unsuccessfully with an internal server error', async () => {
      renderWithProviders(
        <CreateHackathon
          createHackathonOpen
          setCreateHackathonOpen={mockFunction}
        />
      );

      const textInput = screen.getByRole('textbox', { name: 'Hackathon name' });
      fireEvent.change(textInput, { target: { value: 'Error Hackathon' } });

      fireEvent.click(
        screen.getByRole('button', { name: 'ADD A NEW HACKATHON' })
      );

      await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

      const alert = await screen.findByRole('alert');
      expect(alert.textContent).toContain(
        'Error creating hackathon - internal server error'
      );
    });

    it('displays an error when the create hackathon function returns unsuccessfully with a bad request error', async () => {
      renderWithProviders(
        <CreateHackathon
          createHackathonOpen
          setCreateHackathonOpen={mockFunction}
        />
      );

      const textInput = screen.getByRole('textbox', { name: 'Hackathon name' });
      fireEvent.change(textInput, {
        target: { value: 'Bad Request Hackathon' },
      });
      fireEvent.click(
        screen.getByRole('button', { name: 'ADD A NEW HACKATHON' })
      );

      await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

      const alert = await screen.findByRole('alert');
      expect(alert.textContent).toContain(
        'Error creating hackathon - bad request'
      );
    });
  });
});

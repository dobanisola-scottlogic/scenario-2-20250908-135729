import '@testing-library/jest-dom';

import { fireEvent, screen, waitFor } from '@testing-library/react';

import {
  testHackathonBody,
  testHackathonId,
  testHackathonName,
} from '../../mocks/test-data/hackathon';
import { removeMilestoneBotPrefix } from '../../utils/milestone-utils';
import { renderWithRouterAndProvider } from '../../utils/test-utils';
import CreateUpdateHackathon from './CreateUpdateHackathon';

describe('Create Update Hackathon Popup Component', () => {
  const mockFunction = () => null;
  const hackathonName = testHackathonBody.name;
  const hackathonMilestoneBot = removeMilestoneBotPrefix(
    testHackathonBody.currentMilestoneClassName
  );
  const hackathonMap = testHackathonBody.currentMilestoneMap;

  describe('Create Hackathon', () => {
    describe('When the create Hackathon popup is opened', () => {
      it('renders the create hackathon popup', () => {
        renderWithRouterAndProvider(
          <CreateUpdateHackathon isOpen setIsOpen={mockFunction} />
        );

        expect(screen.getAllByText('Add a new hackathon')).toHaveLength(2);
        expect(
          screen.getByRole('button', { name: 'Cancel' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: 'Add a new hackathon' })
        ).toBeInTheDocument();
      });

      it('disables the add hackathon button until a name is entered', () => {
        renderWithRouterAndProvider(
          <CreateUpdateHackathon isOpen setIsOpen={mockFunction} />
        );

        expect(screen.getAllByText('Add a new hackathon')).toHaveLength(2);
        expect(
          screen.getByRole('button', { name: 'Add a new hackathon' })
        ).toHaveAttribute('disabled');

        const textInput = screen.getByRole('textbox', {
          name: 'Hackathon name',
        });
        fireEvent.change(textInput, {
          target: { value: testHackathonName.valid },
        });

        expect(
          screen.getByRole('button', { name: 'Add a new hackathon' })
        ).not.toHaveAttribute('disabled');
      });

      it('disables the add hackathon button if a symbol or special character is entered', () => {
        renderWithRouterAndProvider(
          <CreateUpdateHackathon isOpen setIsOpen={mockFunction} />
        );

        expect(screen.getAllByText('Add a new hackathon')).toHaveLength(2);

        const textInput = screen.getByRole('textbox', {
          name: 'Hackathon name',
        });
        fireEvent.change(textInput, { target: { value: 'Test! #3' } });

        expect(
          screen.getByRole('button', { name: 'Add a new hackathon' })
        ).toHaveAttribute('disabled');
        expect(
          screen.getByText(
            'Hackathon name must not be empty or include special characters'
          )
        ).toBeInTheDocument();
      });
    });

    describe('When the create button is pressed', () => {
      it('calls the create hackathon function successfully', async () => {
        const { store } = renderWithRouterAndProvider(
          <CreateUpdateHackathon isOpen setIsOpen={mockFunction} />
        );

        const textInput = screen.getByRole('textbox', {
          name: 'Hackathon name',
        });
        fireEvent.change(textInput, {
          target: { value: testHackathonName.valid },
        });

        fireEvent.click(
          screen.getByRole('button', { name: 'Add a new hackathon' })
        );

        await waitFor(() => {
          const reduxState = store.getState();
          expect(reduxState.snackbar.message).toEqual(
            'Hackathon created successfully!'
          );
          expect(reduxState.snackbar.isOpen).toBeTruthy();
        });
      });

      it('displays an error when the create hackathon function returns unsuccessfully with an internal server error', async () => {
        renderWithRouterAndProvider(
          <CreateUpdateHackathon isOpen setIsOpen={mockFunction} />
        );

        const textInput = screen.getByRole('textbox', {
          name: 'Hackathon name',
        });
        fireEvent.change(textInput, {
          target: { value: testHackathonName.networkError },
        });

        fireEvent.click(
          screen.getByRole('button', { name: 'Add a new hackathon' })
        );

        const alert = await screen.findByRole('alert');
        expect(alert.textContent).toContain(
          'Error creating hackathon - internal server error'
        );
      });

      it('displays an error when the create hackathon function returns unsuccessfully with a bad request error', async () => {
        renderWithRouterAndProvider(
          <CreateUpdateHackathon isOpen setIsOpen={mockFunction} />
        );

        const textInput = screen.getByRole('textbox', {
          name: 'Hackathon name',
        });
        fireEvent.change(textInput, {
          target: { value: testHackathonName.badRequest },
        });
        fireEvent.click(
          screen.getByRole('button', { name: 'Add a new hackathon' })
        );

        const alert = await screen.findByRole('alert');
        expect(alert.textContent).toContain(
          'Error creating hackathon - bad request'
        );
      });
    });
  });

  describe('Update Hackathon', () => {
    it('renders the update hackathon popup', () => {
      renderWithRouterAndProvider(
        <CreateUpdateHackathon
          id={testHackathonId.valid}
          isOpen
          setIsOpen={mockFunction}
        />
      );

      expect(screen.getByText('Edit hackathon')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Cancel' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Update hackathon' })
      ).toBeInTheDocument();
    });

    it('renders the update hackathon popup with the correct data', async () => {
      renderWithRouterAndProvider(
        <CreateUpdateHackathon
          id={testHackathonId.valid}
          isOpen
          setIsOpen={mockFunction}
        />
      );

      // Wait for get hackathon load to complete
      await waitFor(() =>
        expect(
          screen.getByRole('button', { name: 'Update hackathon' })
        ).not.toBeDisabled()
      );

      // Loads the correct data
      expect(screen.getByLabelText('Hackathon name')).toHaveValue(
        hackathonName
      );
      expect(screen.getByTestId('current-milestone-bot')).toHaveTextContent(
        hackathonMilestoneBot
      );
      expect(screen.getByTestId('game-map')).toHaveTextContent(hackathonMap);

      const milestoneBotInput = screen.getByRole('button', {
        name: hackathonMilestoneBot,
      });
      fireEvent.mouseDown(milestoneBotInput);

      // Displays the correct milestone bot options loaded from mocks
      expect(
        screen.getByTestId('current-milestone-bot-option-0')
      ).toHaveTextContent('Milestone1Bot');
      expect(
        screen.getByTestId('current-milestone-bot-option-1')
      ).toHaveTextContent('Milestone2Bot');
    });

    describe('When the edit button is pressed', () => {
      it('calls the edit hackathon function successfully', async () => {
        const { store } = renderWithRouterAndProvider(
          <CreateUpdateHackathon
            id={testHackathonId.valid}
            isOpen
            setIsOpen={mockFunction}
          />
        );

        // Wait for get hackathon load to complete
        await waitFor(() =>
          expect(
            screen.getByRole('button', { name: 'Update hackathon' })
          ).not.toBeDisabled()
        );

        fireEvent.click(
          screen.getByRole('button', { name: 'Update hackathon' })
        );

        await waitFor(() => {
          const reduxState = store.getState();
          expect(reduxState.snackbar.message).toEqual(
            'Hackathon updated successfully!'
          );
          expect(reduxState.snackbar.isOpen).toBeTruthy();
        });
      });

      it('disables update when the hackathon does not load correctly or is not found', async () => {
        renderWithRouterAndProvider(
          <CreateUpdateHackathon
            id={testHackathonId.notFound}
            isOpen
            setIsOpen={mockFunction}
          />
        );

        expect(screen.getByText('Edit hackathon')).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: 'Update hackathon' })
        ).toHaveAttribute('disabled');

        const alert = await screen.findByRole('alert');
        expect(alert.textContent).toContain('No hackathon data found');
      });
    });
  });
});

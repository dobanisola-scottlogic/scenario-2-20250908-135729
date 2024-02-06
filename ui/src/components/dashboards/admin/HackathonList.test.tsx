import { fireEvent, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { renderWithRouterAndProvider } from '~/utils/test-utils';
import HackathonList from './HackathonList';

describe('HackathonList', () => {
  beforeEach(() => {
    renderWithRouterAndProvider(<HackathonList />, {
      preloadedState: {
        snackbar: { isOpen: true, message: 'Hackathon created successfully!' },
      },
    });
  });

  it('should render the HackathonList component correctly', () => {
    expect(
      screen.getByRole('button', { name: 'Add a new hackathon' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('List of hackathons')).toBeInTheDocument();
  });

  it('should open the create hackathon popup on clicking add a new hackathon', () => {
    fireEvent.click(
      screen.getByRole('button', { name: 'Add a new hackathon' })
    );
    expect(
      screen.getByRole('textbox', { name: 'Hackathon name' })
    ).toBeInTheDocument();
  });

  it('should render and close the success snackbar correctly', async () => {
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Hackathon created successfully!'
    );

    // Test close snackbar
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    await waitForElementToBeRemoved(screen.queryByRole('alert')).then(() => {
      expect(screen.queryByRole('alert')).toBeNull();
    })
  });
});

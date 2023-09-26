import { fireEvent, screen } from '@testing-library/react';
import { renderWithRouterAndProvider } from '../../../utils/test-utils';
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
    expect(screen.getByLabelText('hackathon table')).toBeInTheDocument();
  });

  it('should open the create hackathon popup on clicking add a new hackathon', () => {
    fireEvent.click(
      screen.getByRole('button', { name: 'Add a new hackathon' })
    );
    expect(
      screen.getByRole('textbox', { name: 'Hackathon name' })
    ).toBeInTheDocument();
  });

  it('should render the success snackbar correctly', () => {
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Hackathon created successfully!'
    );
  });
});

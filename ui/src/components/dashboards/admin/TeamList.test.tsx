import { fireEvent, screen } from '@testing-library/react';

import { renderWithRouterAndProvider } from '../../../utils/test-utils';
import TeamList from './TeamList';

describe('TeamList', () => {
  beforeEach(() => {
    renderWithRouterAndProvider(<TeamList hackathonId="test-id" />, {
      preloadedState: {
        snackbar: { isOpen: true, message: 'Team created successfully!' },
      },
    });
  });

  it('should render the TeamList component correctly', () => {
    expect(
      screen.getByRole('button', { name: 'Add a new team' })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText('List of hackathon teams')
    ).toBeInTheDocument();
  });

  it('should open the create team popup on clicking add a new Team', () => {
    fireEvent.click(screen.getByRole('button', { name: 'Add a new team' }));
    expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument();
  });

  it('should render the success snackbar correctly', () => {
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Team created successfully!'
    );
  });
});

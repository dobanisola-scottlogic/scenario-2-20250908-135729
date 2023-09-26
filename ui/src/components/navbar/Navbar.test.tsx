import { fireEvent, screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { UserRole } from '../../enums/UserRole';
import { renderWithRouterAndProvider } from '../../utils/test-utils';
import Navbar from './Navbar';

describe('Navbar', () => {
  it('should render the Navbar component correctly when the user is not logged in', () => {
    renderWithRouterAndProvider(<Navbar />);

    expect(screen.getAllByRole('banner')[1]).toHaveTextContent('Hackathon');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should render the Navbar component correctly when the user is logged in', () => {
    renderWithRouterAndProvider(<Navbar />, {
      preloadedState: {
        auth: { name: 'admin', role: UserRole.ADMIN, credentials: '' },
      },
    });

    expect(screen.getAllByRole('banner')[1]).toHaveTextContent('Hackathon');
    expect(screen.getByRole('button', { name: 'admin' })).toBeInTheDocument();
  });

  it('should navigate back to the / page when the navbar title is clicked', () => {
    renderWithRouterAndProvider(
      <Routes>
        <Route path="/" element={<div data-testid="landing-page" />} />
        <Route path="/test-path" element={<Navbar />} />
      </Routes>,
      { initialEntries: ['/test-path'] }
    );

    fireEvent.click(screen.getByText('Hackathon'));
    expect(screen.getByTestId('landing-page')).toBeInTheDocument();
  });
});

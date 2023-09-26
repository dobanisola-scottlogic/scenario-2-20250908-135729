import { fireEvent, screen } from '@testing-library/react';
import { UserRole } from '../../enums/UserRole';
import { renderWithRouterAndProvider } from '../../utils/test-utils';
import NavbarMenu from './NavbarMenu';

describe('NavbarMenu', () => {
  beforeEach(() => {
    renderWithRouterAndProvider(<NavbarMenu />, {
      preloadedState: {
        auth: { name: 'admin', role: UserRole.ADMIN, credentials: '' },
      },
    });
  });

  it('should render the NavbarMenu component correctly', () => {
    expect(screen.getByRole('button', { name: 'admin' })).toBeInTheDocument();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('should open the dropdown menu when the button is clicked', () => {
    fireEvent.click(screen.getByRole('button', { name: 'admin' }));

    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('should close the dropdown menu and clear the team name on logout', () => {
    fireEvent.click(screen.getByRole('button', { name: 'admin' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Logout' }));

    expect(
      screen.queryByRole('button', { name: 'admin' })
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});

import { fireEvent, screen } from '@testing-library/react';
import { renderWithRouterAndProvider } from '../../utils/test-utils';
import KebabMenu from './KebabMenu';

const mockOptions = [{ name: 'Test Item', onClick: () => null }];

describe('HackathonMenu', () => {
  beforeEach(() => {
    renderWithRouterAndProvider(<KebabMenu options={mockOptions} />);
  });

  it('should render the HackathonMenu component correctly', () => {
    expect(screen.getByRole('button', { name: 'more' })).toBeInTheDocument();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('should open the dropdown menu when the button is clicked', () => {
    fireEvent.click(screen.getByRole('button', { name: 'more' }));

    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(
      screen.getByRole('menuitem', { name: 'Test Item' })
    ).toBeInTheDocument();
  });
});

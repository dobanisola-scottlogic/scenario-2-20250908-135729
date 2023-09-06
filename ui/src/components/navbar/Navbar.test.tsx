import { screen } from '@testing-library/react';
import Navbar from './Navbar';
import { renderWithProviders } from '../../utils/test-utils';

describe('Navbar', () => {
  it('should render the Navbar component correctly', () => {
    renderWithProviders(<Navbar />);

    expect(screen.getAllByRole('banner')[1]).toHaveTextContent('Hackathon');
  });
});

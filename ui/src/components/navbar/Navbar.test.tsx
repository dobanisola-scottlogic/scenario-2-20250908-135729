import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import Navbar from './Navbar';

describe('Navbar', () => {
  it('should render the Navbar component correctly', () => {
    renderWithProviders(<Navbar />);

    expect(screen.getAllByRole('banner')[1]).toHaveTextContent('Hackathon');
  });
});

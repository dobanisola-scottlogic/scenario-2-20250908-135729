import { act, fireEvent, screen, waitFor } from '@testing-library/react';

import { renderWithRouterAndProvider } from '../../utils/test-utils';
import MapSelect from './MapSelect';

const mockFunction = () => null;

describe('MapSelect', () => {
  beforeEach(() => {
    renderWithRouterAndProvider(
      <MapSelect labelText={'Map'} mapName={''} setMapName={mockFunction} />
    );
  });

  it('should render the component correctly', () => {
    expect(
      screen.getByRole('button', {
        name: /map/i,
      })
    ).toBeInTheDocument();
  });

  it('should contain the correct options', async () => {
    const dropdownButton = screen.getByRole('button', {
      name: /map/i,
    });

    act(() => {
      fireEvent.mouseDown(dropdownButton);
    });

    await waitFor(() => {
      expect(
        screen.getByRole('option', { name: 'Very Easy' })
      ).toBeInTheDocument();

      expect(screen.getByRole('option', { name: 'Easy' })).toBeInTheDocument();

      expect(
        screen.getByRole('option', { name: 'Medium' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('option', { name: 'Large Medium' })
      ).toBeInTheDocument();

      expect(screen.getByRole('option', { name: 'Hard' })).toBeInTheDocument();

      expect(
        screen.getByRole('option', { name: 'Three Star' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('option', { name: 'Three Straight' })
      ).toBeInTheDocument();
    });
  });
});

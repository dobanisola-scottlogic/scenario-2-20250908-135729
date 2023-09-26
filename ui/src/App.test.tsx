import { screen } from '@testing-library/react';
import App from './App';
import { renderWithRouterAndProvider } from './utils/test-utils';

describe('App', () => {
  it('renders the App correctly', () => {
    renderWithRouterAndProvider(<App />);

    expect(screen.getAllByRole('banner')[1]).toHaveTextContent('Hackathon');
    // only test Login screen here, as the rest of the components are tested in Routing.test.tsx
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
  });
});

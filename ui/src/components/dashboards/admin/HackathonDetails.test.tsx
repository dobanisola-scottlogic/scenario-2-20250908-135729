import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { renderWithRouterAndProvider } from '../../../utils/test-utils';
import HackathonDetails from './HackathonDetails';

describe('HackathonDetails', () => {
  beforeEach(() => {
    renderWithRouterAndProvider(
      <Routes>
        <Route path='/:id' element={<HackathonDetails />}></Route>
      </Routes>,
      { initialEntries: ['/test-id'] }
    );
  });

  it('should render the hackathon details of the hackathon with ID specified in the url path', () => {
    expect(screen.getByText('test-id')).toBeInTheDocument();
  });
});

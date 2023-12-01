import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import {
  testHackathonBody,
  testHackathonId,
} from '~/mocks/test-data/hackathon';
import { removeMilestoneBotPrefix } from '~/utils/milestone-utils';
import { renderWithRouterAndProvider } from '~/utils/test-utils';
import HackathonDetails from './HackathonDetails';

describe('HackathonDetails', () => {
  const hackathonName = testHackathonBody.name;
  const hackathonMap = testHackathonBody.currentMilestoneMap;
  const hackathonMilestoneBot = removeMilestoneBotPrefix(
    testHackathonBody.currentMilestoneClassName
  );

  it('should render the hackathon details of the hackathon with ID specified in the url path', async () => {
    renderWithRouterAndProvider(
      <Routes>
        <Route path='/:id' element={<HackathonDetails />}></Route>
      </Routes>,
      {
        initialEntries: [`/${testHackathonId.valid}`],
      }
    );

    expect(
      await screen.findByRole('link', { name: 'Hackathons' })
    ).toBeInTheDocument();
    expect(await screen.findByText(hackathonName)).toBeInTheDocument();
    expect(screen.getByText('Current Milestone:')).toBeInTheDocument();
    expect(
      await screen.findByText(
        `Map: ${hackathonMap} - Bot: ${hackathonMilestoneBot}`,
        { exact: false }
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add a new team' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add a new game' })
    ).toBeInTheDocument();
  });

  it('should render the success snackbar correctly', () => {
    renderWithRouterAndProvider(
      <Routes>
        <Route path='/:id' element={<HackathonDetails />}></Route>
      </Routes>,
      {
        initialEntries: [`/${testHackathonId.valid}`],
        preloadedState: {
          snackbar: { isOpen: true, message: 'Team created successfully!' },
        },
      }
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Team created successfully!'
    );
  });

  it('should show correct error message for non-existent hackathon', async () => {
    renderWithRouterAndProvider(
      <Routes>
        <Route path='/:id' element={<HackathonDetails />}></Route>
      </Routes>,
      {
        initialEntries: [`/${testHackathonId.notFound}`],
      }
    );

    expect(
      await screen.findByText(
        'This hackathon does not exist. Please create a new hackathon.'
      )
    ).toBeInTheDocument();
  });

  it('should show correct error message for fetch error', async () => {
    renderWithRouterAndProvider(
      <Routes>
        <Route path='/:id' element={<HackathonDetails />}></Route>
      </Routes>,
      {
        initialEntries: [`/${testHackathonId.networkError}`],
      }
    );

    expect(
      await screen.findByText(
        'Failed to fetch hackathon. Please try again later.'
      )
    ).toBeInTheDocument();
  });
});

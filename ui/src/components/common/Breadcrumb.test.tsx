import { screen } from '@testing-library/react';
import { BreadcrumbLevel } from '~/enums/BreadcrumbLevel';
import { testHackathonBody } from '~/mocks/test-data/hackathon';
import { renderWithRouterAndProvider } from '~/utils/test-utils';
import Breadcrumb from './Breadcrumb';

const mockProps = {
  breadcrumbLevel: BreadcrumbLevel.HACKATHON,
  hackathon: {
    ...testHackathonBody,
    games: null,
    teams: null,
    readableCurrentMilestoneClassName: 'Milestone1Bot',
  },
  gameTitle: undefined,
};

describe('Breadcrumb', () => {
  it('should render the breadcrumb component with the hackathon top level and hackathon name at hackathon level', () => {
    renderWithRouterAndProvider(
      <Breadcrumb
        breadcrumbLevel={mockProps.breadcrumbLevel}
        hackathon={mockProps.hackathon}
      />
    );
    expect(
      screen.getByRole('link', { name: 'Hackathons' })
    ).toBeInTheDocument();

    const hackathonBreadcrumb = screen.getByTestId('hackathonBreadcrumb');
    expect(hackathonBreadcrumb.textContent).toContain('Test Hackathon');
    expect(hackathonBreadcrumb.textContent).toContain('Current Milestone:');
    expect(hackathonBreadcrumb.textContent).toContain(
      'Map: Easy - Bot: Milestone1Bot'
    );
  });

  it('should render the breadcrumb component with the hackathon top level, hackathon name and game name at game level', () => {
    renderWithRouterAndProvider(
      <Breadcrumb
        breadcrumbLevel={BreadcrumbLevel.GAME}
        hackathon={mockProps.hackathon}
        gameTitle='Milestone1Bot vs Milestone2Bot'
      />
    );
    expect(
      screen.getByRole('link', { name: 'Hackathons' })
    ).toBeInTheDocument();
    const gameBreadcrumb = screen.getByTestId('gameBreadcrumb');
    expect(gameBreadcrumb.textContent).toContain(
      'Milestone1Bot vs Milestone2Bot'
    );
  });
});

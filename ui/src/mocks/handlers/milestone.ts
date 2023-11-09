import { HttpResponse, http } from 'msw';
import { baseUrl } from '../../api/api';
import { Milestone } from '../../interfaces/Milestone';

const getMilestonesResponse: Milestone[] = [
  {
    id: 'a7d63a7f-0a67-4abf-9eaa-74fc5c52aed4',
    milestoneClassName: 'com.scottlogic.hackathon.bots.Milestone1Bot',
    readableMilestoneClassName: 'Milestone1Bot',
    timeStamp: 1697106871827,
  },
  {
    id: '559cd7d4-d601-4a45-949e-e8babd10aafa',
    milestoneClassName: 'com.scottlogic.hackathon.bots.Milestone2Bot',
    readableMilestoneClassName: 'Milestone2Bot',
    timeStamp: 1697106871827,
  },
];

export const handlers = [
  http.get(baseUrl + '/milestone', () => {
    return HttpResponse.json(getMilestonesResponse);
  }),
];

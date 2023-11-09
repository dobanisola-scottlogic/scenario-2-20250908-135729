import { handlers as gameHandlers } from './game';
import { handlers as hackathonHandlers } from './hackathon';
import { handlers as loginHandlers } from './login';
import { handlers as milestoneHandlers } from './milestone';
import { handlers as teamHandlers } from './team';

export const handlers = [
  ...loginHandlers,
  ...hackathonHandlers,
  ...gameHandlers,
  ...teamHandlers,
  ...milestoneHandlers,
];

import '@testing-library/jest-dom';

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { api } from '~/api/api';
import { server } from '~/mocks/server';
import store from '~/store';

beforeAll(() => {
  // We need to mock our GamePlayback component since there is not support for mocking the canvas that the actual component creates.
  vi.mock('~/components/game/GamePlayback', () => ({
    default: () => {
      return 'Playback placeholder';
    },
  }));

  // Mock the chart component since there is not support for mocking the SVG that the actual component creates.
  vi.mock('~/components/charts/CollectablesChart', () => ({
    default: () => {
      return 'Collectables chart placeholder';
    },
  }));

  server.listen();
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  store.dispatch(api.util.resetApiState());
});

afterAll(() => server.close());

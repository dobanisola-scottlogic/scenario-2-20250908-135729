import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { api } from './src/api/api';
import { server } from './src/mocks/server';
import store from './src/store';

beforeAll(() => server.listen());

afterEach(() => {
  cleanup();
  server.resetHandlers();
  store.dispatch(api.util.resetApiState());
});

afterAll(() => server.close());

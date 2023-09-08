import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import store from './src/store';
import { api } from './src/api/api';
import { server } from './src/mocks/server';

beforeAll(() => server.listen());

afterEach(() => {
  cleanup();
  server.resetHandlers();
  store.dispatch(api.util.resetApiState());
});

afterAll(() => server.close());

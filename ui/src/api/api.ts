import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { useAppSelector } from '../hooks';
import { selectCredentials } from '../components/login/authSlice';
import store, { RootState } from '../store';
import { ThunkDispatch } from 'redux-thunk';

// const prepareCredentials = async () => {
//   const credentials = useAppSelector(selectCredentials);
//   return credentials;
// };

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: async (headers, { getState }) => {
      const credentials = (getState() as RootState).auth.credentials;
      headers.set('Authorization', `Basic ${credentials}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<any, any>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: {
          Authorization: 'Basic ' + credentials,
        },
      }),
    }),
  }),
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useLoginMutation } = api;

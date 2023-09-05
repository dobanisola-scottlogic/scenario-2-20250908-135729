import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { GetMilestoneResponse, Hackathon } from '../interfaces/HackathonResponse';
import { LoginResponse } from '../interfaces/LoginResponse';

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const credentials: string = (getState() as RootState).auth.credentials;
      if (credentials) {
        headers.set('Authorization', `Basic ${credentials}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, void>({
      query: () => ({
        url: '/login',
        method: 'POST',
      }),
    }),
    getMilestones: builder.mutation<GetMilestoneResponse, void>({
      query: () => ({
        url: '/milestone',
        method: 'GET'
      }),
    }),
    createHackathon: builder.mutation<Hackathon, void>({
      query: ({name}) => ({
        url: '/hackathon',
        method: 'POST',
        body: {name}
      }),
    })
  }),
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useCreateHackathonMutation, useGetMilestonesMutation, useLoginMutation } = api;

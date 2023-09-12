import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { HackathonResponse } from '../interfaces/HackathonResponse';
import { GetMilestoneResponse } from '../interfaces/MilestonesResponse';
import { LoginResponse } from '../interfaces/LoginResponse';

enum RequestType {
  POST = 'POST'
}

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const credentials: string | null = (getState() as RootState).auth
        .credentials;
      if (credentials) {
        headers.set('Authorization', `Basic ${credentials}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Hackathon'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, void>({
      query: () => ({
        url: '/login',
        method: RequestType.POST,
      }),
    }),
    getMilestones: builder.query<GetMilestoneResponse, void>({
      query: () => ({
        url: '/milestone'
      }),
    }),
    createHackathon: builder.mutation<HackathonResponse, string>({
      query: ({name}: {name: string}) => ({
        url: '/hackathon',
        method: RequestType.POST,
        body: {name}
      }),
      invalidatesTags: ['Hackathon']
    })
  }),
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useCreateHackathonMutation, useGetMilestonesQuery, useLoginMutation } = api;

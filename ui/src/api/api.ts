import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HackathonResponse } from '../interfaces/HackathonResponse';
import { LoginResponse } from '../interfaces/LoginResponse';
import { GetMilestoneResponse } from '../interfaces/MilestonesResponse';
import { RootState } from '../store';

enum RequestType {
  DELETE = 'DELETE',
  POST = 'POST',
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
        url: '/milestone',
      }),
    }),
    createHackathon: builder.mutation<HackathonResponse, string>({
      query: (name) => ({
        url: '/hackathon',
        method: RequestType.POST,
        body: { name },
      }),
      invalidatesTags: ['Hackathon'],
    }),
    deleteHackathon: builder.mutation<void, string>({
      query: (id) => ({
        url: `/hackathon/${id}`,
        method: RequestType.DELETE,
      }),
      invalidatesTags: ['Hackathon'],
    }),
  }),
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
  useCreateHackathonMutation,
  useDeleteHackathonMutation,
  useGetMilestonesQuery,
  useLoginMutation,
} = api;

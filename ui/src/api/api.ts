import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Hackathon } from '../interfaces/Hackathon';
import { LoginResponse } from '../interfaces/LoginResponse';
import { Milestone } from '../interfaces/Milestone';
import { RootState } from '../store';

enum RequestType {
  DELETE = 'DELETE',
  POST = 'POST',
  PUT = 'PUT',
}

const removeMilestoneBotPrefix = (milestoneBotClassName: string) => {
  return milestoneBotClassName.replace('com.scottlogic.hackathon.bots.', '');
};

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
  tagTypes: ['Hackathon', 'Team'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, void>({
      query: () => ({
        url: '/login',
        method: RequestType.POST,
      }),
    }),
    getHackathon: builder.query<Hackathon, string>({
      query: (id) => ({
        url: `/hackathon/${id}`,
      }),
      providesTags: ['Hackathon'],
    }),
    getMilestones: builder.query<Milestone[], void>({
      query: () => ({
        url: '/milestone',
      }),
      transformResponse: (response: Milestone[]) => {
        return response.map((milestone) => ({
          ...milestone,
          readableMilestoneClassName: removeMilestoneBotPrefix(
            milestone.milestoneClassName
          ),
        }));
      },
    }),
    createHackathon: builder.mutation<Hackathon, string>({
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
    updateHackathon: builder.mutation<
      Hackathon,
      { id: string; milestoneClassName: string; milestoneMap: string }
    >({
      query: ({ id, milestoneClassName, milestoneMap }) => ({
        url: `/hackathon/${id}`,
        method: RequestType.PUT,
        body: { milestoneClassName, milestoneMap },
      }),
      invalidatesTags: ['Hackathon'],
    }),
    deleteTeam: builder.mutation<void, string>({
      query: (id) => ({
        url: `/team/${id}`,
        method: RequestType.DELETE,
      }),
      invalidatesTags: ['Team'],
    }),
    getHackathons: builder.query<Hackathon[], void>({
      query: () => ({
        url: '/hackathon',
      }),
      transformResponse: (response: Hackathon[]) => {
        return response.map((hackathon) => ({
          ...hackathon,
          readableCurrentMilestoneClassName: removeMilestoneBotPrefix(
            hackathon.currentMilestoneClassName
          ),
        }));
      },
      providesTags: ['Hackathon'],
    }),
  }),
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
  useCreateHackathonMutation,
  useDeleteHackathonMutation,
  useUpdateHackathonMutation,
  useGetHackathonQuery,
  useGetMilestonesQuery,
  useDeleteTeamMutation,
  useLoginMutation,
  useGetHackathonsQuery,
} = api;

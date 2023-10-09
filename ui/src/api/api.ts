import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { CreateTeamRequest } from '../interfaces/CreateTeamRequest';
import { Hackathon } from '../interfaces/Hackathon';
import { LoginResponse } from '../interfaces/LoginResponse';
import { Milestone } from '../interfaces/Milestone';
import { RootState } from '../store';
import { Team } from './../interfaces/Team';

enum RequestType {
  DELETE = 'DELETE',
  GET = 'GET',
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
        method: RequestType.GET,
      }),
      providesTags: ['Hackathon'],
    }),
    getMilestones: builder.query<Milestone[], void>({
      query: () => ({
        url: '/milestone',
        method: RequestType.GET,
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
    createTeam: builder.mutation<Team, CreateTeamRequest>({
      query: (createTeamRequest) => ({
        url: '/team',
        method: RequestType.POST,
        body: createTeamRequest,
      }),
      invalidatesTags: ['Team'],
    }),
    getTeam: builder.query<Team, string>({
      query: (id) => ({
        url: `/team/${id}`,
        method: RequestType.GET,
      }),
      providesTags: ['Team'],
    }),
    getHackathonTeams: builder.query<Team[], string>({
      query: (hackathonId) => ({
        url: '/team',
        method: RequestType.GET,
        params: { hackathonId: hackathonId },
      }),
      providesTags: ['Team'],
    }),
    deleteTeam: builder.mutation<boolean, string>({
      query: (id) => ({
        url: `/team/${id}`,
        method: RequestType.DELETE,
      }),
      invalidatesTags: ['Team'],
    }),
    updateTeam: builder.mutation<Team, Team>({
      query: (team) => ({
        url: `/team/${team.id}`,
        method: RequestType.PUT,
        body: team,
      }),
      invalidatesTags: ['Team'],
    }),
    getHackathons: builder.query<Hackathon[], void>({
      query: () => ({
        url: '/hackathon',
        method: RequestType.GET,
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
  useCreateTeamMutation,
  useDeleteHackathonMutation,
  useDeleteTeamMutation,
  useGetHackathonQuery,
  useGetHackathonTeamsQuery,
  useGetHackathonsQuery,
  useGetMilestonesQuery,
  useGetTeamQuery,
  useLoginMutation,
  useUpdateHackathonMutation,
  useUpdateTeamMutation,
} = api;

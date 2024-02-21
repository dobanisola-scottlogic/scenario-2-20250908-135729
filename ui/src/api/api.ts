import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { UserRole } from '~/enums/UserRole';
import { CreateGameRequest } from '~/interfaces/CreateGameRequest';
import { CreateTeamRequest } from '~/interfaces/CreateTeamRequest';
import { GameResult } from '~/interfaces/GameResult';
import { Hackathon } from '~/interfaces/Hackathon';
import { LoginResponse } from '~/interfaces/LoginResponse';
import { Milestone } from '~/interfaces/Milestone';
import { Team } from '~/interfaces/Team';
import { TeamInformationResponse } from '~/interfaces/TeamInformationResponse';
import { logout } from '~/slices/authSlice';
import { RootState } from '~/store';
import { getGameTitle } from '~/utils/game-utils';
import { removeMilestoneBotPrefix } from '~/utils/milestone-utils';

export const baseUrl = import.meta.env.VITE_API_BASE_URL;

enum RequestType {
  DELETE = 'DELETE',
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
}

const baseQuery = fetchBaseQuery({
  baseUrl: baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const credentials: string | null = (getState() as RootState).auth
      .credentials;
    if (credentials) {
      headers.set('Authorization', `Basic ${credentials}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 401) {
    // If we already have a role, we must have been logged in
    const role: UserRole | null = (api.getState() as RootState).auth.role;
    if (role) {
      // Force logout
      api.dispatch(logout());
    }
  }
  return result;
};

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Game', 'Hackathon', 'Team', 'TeamInformation'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, void>({
      query: () => ({
        url: '/login',
        method: RequestType.POST,
        // HAC-245 / HAC-266 This fix should not be needed when the backend is fixed - standardise to response.json
        responseHandler: (response) =>
          response.status === 200 ? response.json() : response.text(),
      }),
      invalidatesTags: ['Hackathon', 'Team', 'Game', 'TeamInformation'],
    }),
    getHackathon: builder.query<Hackathon | undefined, string>({
      query: (id) => ({
        url: `/hackathon/${id}`,
        method: RequestType.GET,
      }),
      transformResponse: (response: Hackathon | undefined) => {
        if (response) {
          return {
            ...response,
            readableCurrentMilestoneClassName: removeMilestoneBotPrefix(
              response.currentMilestoneClassName
            ),
          };
        }
      },
      providesTags: ['Hackathon'],
    }),
    getHackathonForTeamUser: builder.query<Hackathon, void>({
      query: () => ({
        url: '/hackathon/team',
        method: RequestType.GET,
      }),
      transformResponse: (response: Hackathon) => ({
        ...response,
        readableCurrentMilestoneClassName: removeMilestoneBotPrefix(
          response.currentMilestoneClassName
        ),
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
    getTeamInformation: builder.query<TeamInformationResponse, void>({
      query: () => ({
        url: '/team/info',
        method: RequestType.GET,
      }),
      providesTags: ['TeamInformation'],
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
        if (!response?.length) {
          return [];
        }

        return response.map((hackathon) => ({
          ...hackathon,
          readableCurrentMilestoneClassName: removeMilestoneBotPrefix(
            hackathon.currentMilestoneClassName
          ),
        }));
      },
      providesTags: ['Hackathon'],
    }),
    createGame: builder.mutation<GameResult, CreateGameRequest>({
      query: (createTeamRequest) => ({
        url: '/game',
        method: RequestType.POST,
        body: createTeamRequest,
      }),
      invalidatesTags: ['Game'],
    }),
    getHackathonGames: builder.query<GameResult[], string>({
      query: (hackathonId) => ({
        url: '/game',
        method: RequestType.GET,
        params: { hackathonId: hackathonId },
      }),
      transformResponse: (response: GameResult[]) => {
        return response.map((result) => {
          const { teams } = result.game;
          return {
            ...result,
            game: {
              ...result.game,
              title: getGameTitle(teams),
            },
          };
        });
      },
      providesTags: ['Game'],
    }),
    getHackathonGame: builder.query<GameResult, string>({
      query: (id) => ({
        url: `/game/${id}`,
        method: RequestType.GET,
      }),
      providesTags: ['Game'],
    }),
    getBotConnectionStatus: builder.query<string, string>({
      query: (teamName) => ({
        method: RequestType.GET,
        params: { teamName: teamName },
        // HAC-245 This fix should not be needed when the backend is fixed - standardise to response.json
        responseHandler: (response) =>
          response.status === 200 ? response.text() : response.json(),
        url: '/remotebot/connectedState',
      }),
    }),
    connectBot: builder.mutation<void, string>({
      query: (teamName) => ({
        body: teamName,
        headers: {
          'content-type': 'text/plain',
        },
        method: RequestType.POST,
        responseHandler: 'text',
        url: '/remotebot/connect',
      }),
    }),
    disconnectBot: builder.mutation<void, string>({
      query: (teamName) => ({
        body: teamName,
        headers: {
          'content-type': 'text/plain',
        },
        method: RequestType.POST,
        responseHandler: 'text',
        url: '/remotebot/disconnect',
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        // API call takes a very long time to respond!
        try {
          await queryFulfilled;
        } catch {
          // Ignore response to treat as fire and forget
        }
      },
    }),
  }),
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
  useConnectBotMutation,
  useCreateGameMutation,
  useCreateHackathonMutation,
  useCreateTeamMutation,
  useDeleteHackathonMutation,
  useDeleteTeamMutation,
  useDisconnectBotMutation,
  useGetBotConnectionStatusQuery,
  useGetHackathonForTeamUserQuery,
  useGetHackathonGamesQuery,
  useGetHackathonGameQuery,
  useGetHackathonQuery,
  useGetHackathonTeamsQuery,
  useGetHackathonsQuery,
  useGetMilestonesQuery,
  useGetTeamQuery,
  useGetTeamInformationQuery,
  useLoginMutation,
  useUpdateHackathonMutation,
  useUpdateTeamMutation,
} = api;

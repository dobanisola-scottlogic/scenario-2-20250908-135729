import { createSlice } from '@reduxjs/toolkit';
import { api } from '../api/api';
import { CreateHackathonServiceResponse } from '../interfaces/HackathonResponse';
import { Milestone } from '../interfaces/MilestonesResponse';
import type { RootState } from '../store';

interface HackathonState {
  milestones: Milestone[];
  hackathons: CreateHackathonServiceResponse[];
}

const initialState: HackathonState = {
  milestones: [],
  hackathons: []
};

export const hackathonSlice = createSlice({
  name: 'hackathon',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addMatcher(
        api.endpoints.createHackathon.matchFulfilled,
      (state, { payload }) => {
        state.hackathons.push(payload);
      }
    );
  },
});

export const selectHackathon = (state: RootState) => state.hackathon;
export const selectHackathons = (state: RootState) => selectHackathon(state).hackathons;

export default hackathonSlice.reducer;

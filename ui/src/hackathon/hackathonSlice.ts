import { createSlice } from '@reduxjs/toolkit';
import { api } from '../api/api';
import { Hackathon, Milestone } from '../interfaces/HackathonResponse';
import type { RootState } from '../store';

interface HackathonState {
  milestones: Array<Milestone>;
  hackathons: Array<Hackathon>;
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
        api.endpoints.getMilestones.matchFulfilled,
      (state, { payload }) => {
        state.milestones = payload;
      }
    );
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
export const selectMilestones = (state: RootState) => selectHackathon(state).milestones;

export default hackathonSlice.reducer;

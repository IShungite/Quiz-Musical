import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Track } from "../models/Tracks";

export enum TrackStatus {
  None,
  Loading,
  Finished,
  Error,
}

interface TrackState {
  currentTrack?: Track;
  status: TrackStatus;
  errorMessage?: string;
}

const initialTrack: TrackState = {
  status: TrackStatus.None,
};

const trackSlice = createSlice({
  name: "track",
  initialState: initialTrack,
  reducers: {
    clearState: (state) => {
      state.status = TrackStatus.None;
    },
    setCurrentTrack: (state, { payload }: PayloadAction<Track>) => {
      state.currentTrack = payload;
    },
  },
});

export const { clearState, setCurrentTrack } = trackSlice.actions;
export default trackSlice.reducer;

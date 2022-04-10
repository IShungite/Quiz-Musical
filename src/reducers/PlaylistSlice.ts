import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Playlist } from "../models/Playlist";
import deezerApi from "../utility/deezerApi";

export enum PlaylistStatus {
  None,
  Loading,
  Finished,
  Error,
}

interface PlaylistState {
  playlists: Playlist[];
  status: PlaylistStatus;
  errorMessage?: string;
}

const initialPlaylist: PlaylistState = {
  playlists: [],
  status: PlaylistStatus.None,
};

export const getPlaylists = createAsyncThunk<Playlist[], string, { rejectValue: string }>("playlist/getAll", async (searchTerm, thunkAPI) => {
  try {
    const playlists = await deezerApi.searchPlaylists(searchTerm);
    return playlists;
  } catch (err) {
    const error = err as Error;
    return thunkAPI.rejectWithValue(error.message);
  }
});

const playlistSlice = createSlice({
  name: "playlist",
  initialState: initialPlaylist,
  reducers: {
    clearState: (state) => {
      state.status = PlaylistStatus.None;
      state.playlists = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPlaylists.pending, (state) => {
        state.status = PlaylistStatus.Loading;
      })
      .addCase(getPlaylists.fulfilled, (state, { payload }) => {
        state.status = PlaylistStatus.Finished;
        state.playlists = [...payload];
      })
      .addCase(getPlaylists.rejected, (state, { payload }) => {
        state.status = PlaylistStatus.Error;

        state.errorMessage = payload;
      });
  },
});

export const { clearState } = playlistSlice.actions;
export default playlistSlice.reducer;

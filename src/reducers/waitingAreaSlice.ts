import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CreateGameDto, Game, Player } from "../models/Game";
import gameApi from "../utility/gameApi";

export enum WaitingAreaStatus {
  None,
  Loading,
  Finished,
  Error,
}

interface waitingAreaState {
  game?: Game;
  status: WaitingAreaStatus;
  errorMessage?: string;
  currentPlayer: Player;
}

const initialWaitingArea: waitingAreaState = {
  status: WaitingAreaStatus.None,
  currentPlayer: {
    id: 1,
    name: "Shun",
  },
};

export const createGame = createAsyncThunk<Game, CreateGameDto, { rejectValue: string }>(
  "waitingArea/createGame",
  async (createGameDto, thunkAPI) => {
    try {
      console.log("create game");
      const game = await gameApi.createGame(createGameDto);
      console.log(game);
      return game;
    } catch (err) {
      const error = err as Error;
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const waitingAreaSlice = createSlice({
  name: "waitingArea",
  initialState: initialWaitingArea,
  reducers: {
    clearState: (state) => {
      state.status = WaitingAreaStatus.None;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createGame.pending, (state) => {
        state.status = WaitingAreaStatus.Loading;
      })
      .addCase(createGame.fulfilled, (state, { payload }) => {
        state.status = WaitingAreaStatus.Finished;
        state.game = payload;
      })
      .addCase(createGame.rejected, (state, { payload }) => {
        state.status = WaitingAreaStatus.Error;

        state.errorMessage = payload;
      });
  },
});

export const { clearState } = waitingAreaSlice.actions;
export default waitingAreaSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CreateGameDto, IGame, Player } from "../models/Game";
import gameApi from "../utility/gameApi";

export enum WaitingAreaStatus {
  None,
  Loading,
  Finished,
  Error,
}

interface WaitingAreaState {
  game?: IGame;
  status: WaitingAreaStatus;
  errorMessage?: string;
  currentPlayer: Player;
}

const initialWaitingArea: WaitingAreaState = {
  status: WaitingAreaStatus.None,
  currentPlayer: {
    id: 1,
    name: "Shun",
  },
};

export const createGame = createAsyncThunk<IGame, CreateGameDto, { rejectValue: string }>(
  "waitingArea/createGame",
  async (createGameDto, thunkAPI) => {
    try {
      const game = await gameApi.createGame(createGameDto);
      return game;
    } catch (err) {
      const error = err as Error;
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const nextQuestion = createAsyncThunk<IGame, string, { rejectValue: string }>("waitingArea/nextQuestion", async (gameId, thunkAPI) => {
  try {
    console.log({ gameId });
    const game = await gameApi.nextQuestion(gameId);
    return game;
  } catch (err) {
    const error = err as Error;
    return thunkAPI.rejectWithValue(error.message);
  }
});

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
        state.game = { ...payload };
        console.log("game fulfilled", payload);
      })
      .addCase(createGame.rejected, (state, { payload }) => {
        state.status = WaitingAreaStatus.Error;

        state.errorMessage = payload;
      })
      .addCase(nextQuestion.pending, (state) => {
        state.status = WaitingAreaStatus.Loading;
      })
      .addCase(nextQuestion.fulfilled, (state, { payload }) => {
        state.status = WaitingAreaStatus.Finished;
        state.game = { ...payload };
        console.log("next question game", payload);
      })
      .addCase(nextQuestion.rejected, (state, { payload }) => {
        state.status = WaitingAreaStatus.Error;

        state.errorMessage = payload;
      });
  },
});

export const { clearState } = waitingAreaSlice.actions;
export default waitingAreaSlice.reducer;

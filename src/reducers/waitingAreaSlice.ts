import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CreateAnswerDto } from "../models/Answer";
import { CreateGameDto, IGame } from "../models/Game";
import { CreatePlayerDto, IPlayer } from "../models/Player";
import gameApi from "../utility/gameApi";

export enum WaitingAreaStatus {
  None,
  Loading,
  Finished,
  Error,
}

interface WaitingAreaState {
  game?: IGame;
  createGameStatus: WaitingAreaStatus;
  createPlayerStatus: WaitingAreaStatus;
  joinGameStatus: WaitingAreaStatus;
  startGameStatus: WaitingAreaStatus;
  sendAnswerStatus: WaitingAreaStatus;
  nextQuestionStatus: WaitingAreaStatus;
  errorMessage?: string;
  currentPlayer?: IPlayer;
}

const initialWaitingArea: WaitingAreaState = {
  createGameStatus: WaitingAreaStatus.None,
  createPlayerStatus: WaitingAreaStatus.None,
  joinGameStatus: WaitingAreaStatus.None,
  startGameStatus: WaitingAreaStatus.None,
  nextQuestionStatus: WaitingAreaStatus.None,
  sendAnswerStatus: WaitingAreaStatus.None,
  // currentPlayer: {
  //   _id: "dza1dz5adza",
  //   name: "Shun",
  //   hasAnswered: false,
  //   score: 0,
  // },
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

export const startGame = createAsyncThunk<void, string, { rejectValue: string }>("waitingArea/startGame", async (gameId, thunkAPI) => {
  try {
    await gameApi.startGame(gameId);
    return;
  } catch (err) {
    const error = err as Error;
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const nextQuestion = createAsyncThunk<IGame, string, { rejectValue: string }>("waitingArea/nextQuestion", async (gameId, thunkAPI) => {
  try {
    const game = await gameApi.nextQuestion(gameId);
    return game;
  } catch (err) {
    const error = err as Error;
    return thunkAPI.rejectWithValue(error.message);
  }
});
export const sendAnswer = createAsyncThunk<void, { gameId: string; createAnswerDto: CreateAnswerDto }, { rejectValue: string }>(
  "waitingArea/sendAnswer",
  async ({ gameId, createAnswerDto }, thunkAPI) => {
    try {
      await gameApi.sendAnswer(gameId, createAnswerDto);
    } catch (err) {
      const error = err as Error;
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const joinGame = createAsyncThunk<void, { gameId: string; playerId: string }, { rejectValue: string }>(
  "waitingArea/joinGame",
  async ({ gameId, playerId }, thunkAPI) => {
    try {
      await gameApi.joinGame(gameId, playerId);
    } catch (err) {
      const error = err as Error;
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const createPlayer = createAsyncThunk<IPlayer, CreatePlayerDto, { rejectValue: string }>(
  "waitingArea/createPlayer",
  async (createPlayerDto, thunkAPI) => {
    try {
      const player = await gameApi.createPlayer(createPlayerDto);
      return player;
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
      state.createGameStatus = WaitingAreaStatus.None;
      state.startGameStatus = WaitingAreaStatus.None;
      state.joinGameStatus = WaitingAreaStatus.None;
      state.createPlayerStatus = WaitingAreaStatus.None;
      state.nextQuestionStatus = WaitingAreaStatus.None;
    },
    resetCreateGameStatus: (state) => {
      state.createGameStatus = WaitingAreaStatus.None;
    },
    resetStartGameStatus: (state) => {
      state.startGameStatus = WaitingAreaStatus.None;
    },
    resetJoinGameStatus: (state) => {
      state.joinGameStatus = WaitingAreaStatus.None;
    },
    resetCreatePlayerStatus: (state) => {
      state.createPlayerStatus = WaitingAreaStatus.None;
    },
    resetNextQuestion: (state) => {
      state.nextQuestionStatus = WaitingAreaStatus.None;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createGame.pending, (state) => {
        state.createGameStatus = WaitingAreaStatus.Loading;
      })
      .addCase(createGame.fulfilled, (state, { payload }) => {
        state.createGameStatus = WaitingAreaStatus.Finished;
        state.game = { ...payload };
        console.log("game fulfilled", payload);
      })
      .addCase(createGame.rejected, (state, { payload }) => {
        state.createGameStatus = WaitingAreaStatus.Error;

        state.errorMessage = payload;
      })
      .addCase(startGame.pending, (state) => {
        state.startGameStatus = WaitingAreaStatus.Loading;
      })
      .addCase(startGame.fulfilled, (state) => {
        state.startGameStatus = WaitingAreaStatus.Finished;
      })
      .addCase(startGame.rejected, (state, { payload }) => {
        state.startGameStatus = WaitingAreaStatus.Error;

        state.errorMessage = payload;
      })

      .addCase(createPlayer.pending, (state) => {
        state.createPlayerStatus = WaitingAreaStatus.Loading;
      })
      .addCase(createPlayer.fulfilled, (state, { payload }) => {
        state.createPlayerStatus = WaitingAreaStatus.Finished;

        state.currentPlayer = { ...payload };
      })
      .addCase(createPlayer.rejected, (state, { payload }) => {
        state.createPlayerStatus = WaitingAreaStatus.Error;

        state.errorMessage = payload;
      })

      .addCase(joinGame.pending, (state) => {
        state.joinGameStatus = WaitingAreaStatus.Loading;
      })
      .addCase(joinGame.fulfilled, (state) => {
        state.joinGameStatus = WaitingAreaStatus.Finished;
      })
      .addCase(joinGame.rejected, (state, { payload }) => {
        state.joinGameStatus = WaitingAreaStatus.Error;

        state.errorMessage = payload;
      })

      .addCase(nextQuestion.pending, (state) => {
        state.nextQuestionStatus = WaitingAreaStatus.Loading;
      })
      .addCase(nextQuestion.fulfilled, (state, { payload }) => {
        state.nextQuestionStatus = WaitingAreaStatus.Finished;
        state.game = { ...payload };
        console.log("next question game", payload);
      })
      .addCase(nextQuestion.rejected, (state, { payload }) => {
        state.nextQuestionStatus = WaitingAreaStatus.Error;

        state.errorMessage = payload;
      })

      .addCase(sendAnswer.pending, (state) => {
        state.sendAnswerStatus = WaitingAreaStatus.Loading;
      })
      .addCase(sendAnswer.fulfilled, (state) => {
        state.sendAnswerStatus = WaitingAreaStatus.Finished;
      })
      .addCase(sendAnswer.rejected, (state, { payload }) => {
        state.sendAnswerStatus = WaitingAreaStatus.Error;

        state.errorMessage = payload;
      });
  },
});

export const { clearState, resetCreateGameStatus, resetStartGameStatus, resetJoinGameStatus, resetCreatePlayerStatus, resetNextQuestion } =
  waitingAreaSlice.actions;
export default waitingAreaSlice.reducer;

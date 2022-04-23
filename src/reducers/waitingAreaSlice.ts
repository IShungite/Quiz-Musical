import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CreateAnswerDto } from "../models/Answer";
import { FetchStatus } from "../models/FetchStatus";
import { CreateGameDto, IGame, UpdateGameDto } from "../models/Game";
import { CreatePlayerDto, IPlayer } from "../models/Player";
import gameApi from "../utility/gameApi";

interface WaitingAreaState {
  game?: IGame;
  players: IPlayer[];
  goodAnswer?: string;
  createGameStatus: FetchStatus;
  createPlayerStatus: FetchStatus;
  joinGameStatus: FetchStatus;
  startGameStatus: FetchStatus;
  sendAnswerStatus: FetchStatus;
  nextQuestionStatus: FetchStatus;
  errorMessage?: string;
  currentPlayer?: IPlayer;
  answerSelected?: string;
}

const initialWaitingArea: WaitingAreaState = {
  players: [],
  createGameStatus: FetchStatus.None,
  createPlayerStatus: FetchStatus.None,
  joinGameStatus: FetchStatus.None,
  startGameStatus: FetchStatus.None,
  nextQuestionStatus: FetchStatus.None,
  sendAnswerStatus: FetchStatus.None,
};

export const createGame = createAsyncThunk<IGame, CreateGameDto, { rejectValue: string }>(
  "waitingArea/createGame",
  async (createGameDto, thunkAPI) => {
    try {
      return await gameApi.createGame(createGameDto);
    } catch (err) {
      const error = err as Error;
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getPlayers = createAsyncThunk<IPlayer[], string, { rejectValue: string }>("waitingArea/getPlayers", async (gameId, thunkAPI) => {
  try {
    return await gameApi.getPlayers(gameId);
  } catch (err) {
    const error = err as Error;
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const startGame = createAsyncThunk<void, { gameId: string; updateGameDto: UpdateGameDto }, { rejectValue: string }>(
  "waitingArea/startGame",
  async ({ gameId, updateGameDto }, thunkAPI) => {
    try {
      await gameApi.startGame(gameId, updateGameDto);
    } catch (err) {
      const error = err as Error;
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const nextQuestion = createAsyncThunk<void, string, { rejectValue: string }>("waitingArea/nextQuestion", async (gameId, thunkAPI) => {
  try {
    await gameApi.nextQuestion(gameId);
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

export const joinGame = createAsyncThunk<IGame, { gameId: string; playerId: string }, { rejectValue: string }>(
  "waitingArea/joinGame",
  async ({ gameId, playerId }, thunkAPI) => {
    try {
      return await gameApi.joinGame(gameId, playerId);
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
      return await gameApi.createPlayer(createPlayerDto);
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
    updateCurrentGameLocal: (state, { payload }: PayloadAction<IGame>) => {
      state.game = payload;
    },
    updateCurrentPlayersLocal: (state, { payload }: PayloadAction<IPlayer[]>) => {
      state.players = payload;
    },
    addCurrentPlayerLocal: (state, { payload }: PayloadAction<IPlayer>) => {
      state.players = [...state.players, payload];
    },
    removeCurrentPlayerLocal: (state, { payload }: PayloadAction<string>) => {
      state.players = state.players.filter((player) => player._id !== payload);
    },
    setAnswerSelected: (state, { payload }: PayloadAction<string | undefined>) => {
      state.answerSelected = payload;
    },
    clearAll: (state) => {
      state.game = undefined;
      state.players = [];
      state.answerSelected = undefined;
      state.createGameStatus = FetchStatus.None;
      state.startGameStatus = FetchStatus.None;
      state.joinGameStatus = FetchStatus.None;
      state.nextQuestionStatus = FetchStatus.None;
      state.sendAnswerStatus = FetchStatus.None;
    },
    resetCreateGameStatus: (state) => {
      state.createGameStatus = FetchStatus.None;
    },
    resetCreatePlayerStatus: (state) => {
      state.createPlayerStatus = FetchStatus.None;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createGame.pending, (state) => {
        state.createGameStatus = FetchStatus.Loading;
      })
      .addCase(createGame.fulfilled, (state, { payload }) => {
        state.createGameStatus = FetchStatus.Finished;
        state.game = { ...payload };
      })
      .addCase(createGame.rejected, (state, { payload }) => {
        state.createGameStatus = FetchStatus.Error;

        state.errorMessage = payload;
      })
      .addCase(startGame.pending, (state) => {
        state.startGameStatus = FetchStatus.Loading;
      })
      .addCase(startGame.fulfilled, (state) => {
        state.startGameStatus = FetchStatus.Finished;
      })
      .addCase(startGame.rejected, (state, { payload }) => {
        state.startGameStatus = FetchStatus.Error;

        state.errorMessage = payload;
      })

      .addCase(createPlayer.pending, (state) => {
        state.createPlayerStatus = FetchStatus.Loading;
      })
      .addCase(createPlayer.fulfilled, (state, { payload }) => {
        state.createPlayerStatus = FetchStatus.Finished;

        state.currentPlayer = { ...payload };
      })
      .addCase(createPlayer.rejected, (state, { payload }) => {
        state.createPlayerStatus = FetchStatus.Error;

        state.errorMessage = payload;
      })

      .addCase(joinGame.pending, (state) => {
        state.joinGameStatus = FetchStatus.Loading;
      })
      .addCase(joinGame.fulfilled, (state, { payload }) => {
        state.joinGameStatus = FetchStatus.Finished;

        state.game = { ...payload };
      })
      .addCase(joinGame.rejected, (state, { payload }) => {
        state.joinGameStatus = FetchStatus.Error;

        state.errorMessage = payload;
      })

      .addCase(nextQuestion.pending, (state) => {
        state.nextQuestionStatus = FetchStatus.Loading;
      })
      .addCase(nextQuestion.fulfilled, (state) => {
        state.nextQuestionStatus = FetchStatus.Finished;
      })
      .addCase(nextQuestion.rejected, (state, { payload }) => {
        state.nextQuestionStatus = FetchStatus.Error;

        state.errorMessage = payload;
      })

      .addCase(sendAnswer.pending, (state) => {
        state.sendAnswerStatus = FetchStatus.Loading;
      })
      .addCase(sendAnswer.fulfilled, (state) => {
        state.sendAnswerStatus = FetchStatus.Finished;
      })
      .addCase(sendAnswer.rejected, (state, { payload }) => {
        state.sendAnswerStatus = FetchStatus.Error;

        state.errorMessage = payload;
      })

      .addCase(getPlayers.fulfilled, (state, { payload }) => {
        state.players = payload;
      });
  },
});

export const {
  updateCurrentGameLocal,
  updateCurrentPlayersLocal,
  addCurrentPlayerLocal,
  removeCurrentPlayerLocal,
  resetCreateGameStatus,
  setAnswerSelected,
  clearAll,
  resetCreatePlayerStatus,
} = waitingAreaSlice.actions;
export default waitingAreaSlice.reducer;

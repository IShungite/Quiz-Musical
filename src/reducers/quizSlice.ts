import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CreateAnswerDto } from "../models/Answer";
import { FetchStatus } from "../models/FetchStatus";
import { CreateGameDto, IGame, JoinGameDto, UpdateGameDto } from "../models/Game";
import { CreatePlayerDto, IPlayer } from "../models/Player";
import gameApi from "../utility/gameApi";

interface QuizState {
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

const initialQuizState: QuizState = {
  players: [],
  createGameStatus: FetchStatus.None,
  createPlayerStatus: FetchStatus.None,
  joinGameStatus: FetchStatus.None,
  startGameStatus: FetchStatus.None,
  nextQuestionStatus: FetchStatus.None,
  sendAnswerStatus: FetchStatus.None,
};

export const createGame = createAsyncThunk<IGame, CreateGameDto, { rejectValue: string }>("quiz/createGame", async (createGameDto, thunkAPI) => {
  try {
    return await gameApi.createGame(createGameDto);
  } catch (err) {
    const error = err as Error;
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const getPlayers = createAsyncThunk<IPlayer[], string, { rejectValue: string }>("quiz/getPlayers", async (gameId, thunkAPI) => {
  try {
    return await gameApi.getPlayers(gameId);
  } catch (err) {
    const error = err as Error;
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const startGame = createAsyncThunk<void, { gameId: string; updateGameDto: UpdateGameDto }, { rejectValue: string }>(
  "quiz/startGame",
  async ({ gameId, updateGameDto }, thunkAPI) => {
    try {
      await gameApi.startGame(gameId, updateGameDto);
    } catch (err) {
      const error = err as Error;
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const nextQuestion = createAsyncThunk<void, string, { rejectValue: string }>("quiz/nextQuestion", async (gameId, thunkAPI) => {
  try {
    await gameApi.nextQuestion(gameId);
  } catch (err) {
    const error = err as Error;
    return thunkAPI.rejectWithValue(error.message);
  }
});
export const sendAnswer = createAsyncThunk<void, { gameId: string; createAnswerDto: CreateAnswerDto }, { rejectValue: string }>(
  "quiz/sendAnswer",
  async ({ gameId, createAnswerDto }, thunkAPI) => {
    try {
      await gameApi.sendAnswer(gameId, createAnswerDto);
    } catch (err) {
      const error = err as Error;
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const joinGame = createAsyncThunk<IGame, JoinGameDto, { rejectValue: string }>("quiz/joinGame", async (joinGameDto, thunkAPI) => {
  try {
    return await gameApi.joinGame(joinGameDto);
  } catch (err) {
    const error = err as Error;
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const createPlayer = createAsyncThunk<IPlayer, CreatePlayerDto, { rejectValue: string }>(
  "quiz/createPlayer",
  async (createPlayerDto, thunkAPI) => {
    try {
      return await gameApi.createPlayer(createPlayerDto);
    } catch (err) {
      const error = err as Error;
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const leaveGame = createAsyncThunk<string, { gameId: string; playerId: string }, { rejectValue: string }>(
  "quiz/leaveGame",
  async ({ gameId, playerId }, thunkAPI) => {
    try {
      await gameApi.leaveGame(gameId, playerId);
      return playerId;
    } catch (err) {
      const error = err as Error;
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const quizSlice = createSlice({
  name: "quiz",
  initialState: initialQuizState,
  reducers: {
    updateGameLocal: (state, { payload }: PayloadAction<IGame>) => {
      state.game = payload;
    },
    updatePlayersLocal: (state, { payload }: PayloadAction<IPlayer[]>) => {
      state.players = payload;
    },
    addPlayerLocal: (state, { payload }: PayloadAction<IPlayer>) => {
      state.players = [...state.players, payload];
    },
    removePlayerLocal: (state, { payload }: PayloadAction<string>) => {
      state.players = state.players.filter((player) => player._id !== payload);
    },
    setAnswerSelected: (state, { payload }: PayloadAction<string | undefined>) => {
      state.answerSelected = payload;
    },
    clearAll: (state) => {
      state.game = undefined;
      state.players = [];
      state.answerSelected = undefined;
      state.startGameStatus = FetchStatus.None;
      state.nextQuestionStatus = FetchStatus.None;
      state.sendAnswerStatus = FetchStatus.None;
    },
    resetCreateGameStatus: (state) => {
      state.createGameStatus = FetchStatus.None;
    },
    resetCreatePlayerStatus: (state) => {
      state.createPlayerStatus = FetchStatus.None;
    },
    resetJoinGameStatus: (state) => {
      state.joinGameStatus = FetchStatus.None;
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
      })

      .addCase(leaveGame.fulfilled, (state, { payload }) => {
        state.players = state.players.filter((player) => player._id !== payload);
      });
  },
});

export const {
  updateGameLocal,
  updatePlayersLocal,
  addPlayerLocal,
  removePlayerLocal,
  resetCreateGameStatus,
  resetJoinGameStatus,
  setAnswerSelected,
  clearAll,
  resetCreatePlayerStatus,
} = quizSlice.actions;
export default quizSlice.reducer;

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CreateGameDto, Game, Player } from "../models/Game";
import gameApi from "../utility/gameApi";

export enum WaitingAreaStatus {
  None,
  Loading,
  Finished,
  Error,
}

interface quizState {
  track: string;
  questionNb: number;
  answerSuggestions: string[];
}

const initialQuiz: quizState = {
  track: "",
  questionNb: 0,
  answerSuggestions: [],
};

const quizSlice = createSlice({
  name: "quiz",
  initialState: initialQuiz,
  reducers: {
    setCurrentTrack: (state, { payload }: PayloadAction<string>) => {
      state.track = payload;
      state.questionNb = state.questionNb + 1;
    },
    reset: (state) => {
      state.track = "";
      state.questionNb = 0;
      state.answerSuggestions = [];
    },
  },
});

export const { setCurrentTrack } = quizSlice.actions;
export default quizSlice.reducer;

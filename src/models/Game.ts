import mongoose from "mongoose";

export interface IGameBase {
  mode: GameMode;
  playlistId: number;
  playersId: string[];
  status: GameStatus;
  ownerId: string;
  maxQuestions: number;
  currentTrackPreview: string;
  currentQuestionNb: number;
  currentAnswerSuggestions: string[];
}

export interface IGame extends IGameBase {
  _id: string;
}

export interface CreateGameDto {
  playlistId: number;
  mode: GameMode;
  ownerId: string;
}

export enum GameMode {
  FindTheArtist = "Find the Artist",
  FindTheSong = "Find the Song",
}

export enum GameStatus {
  Draft = "draft",
  Started = "started",
  Finished = "finished",
}

const GameSchema = new mongoose.Schema({
  mode: {
    type: String,
    required: true,
  },
  playlistId: {
    type: String,
    required: true,
  },
  playersId: {
    type: Array,
    default: [],
  },
  status: {
    type: String,
    default: "draft",
  },
  ownerId: {
    type: String,
    required: true,
  },
  maxQuestions: {
    type: Number,
    default: 15,
  },
  currentTrackPreview: {
    type: String,
    default: "",
  },
  currentQuestionNb: {
    type: Number,
    default: 0,
  },
  currentAnswerSuggestions: {
    type: Array,
    default: [],
  },
});

interface IGameDocument extends IGameBase, mongoose.Document {}

mongoose.models = {};

const Game: mongoose.Model<IGameDocument> = mongoose.models.Game || mongoose.model("Game", GameSchema);

export default Game;

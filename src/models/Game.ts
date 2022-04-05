import mongoose from "mongoose";

export interface IGameBase {
  mode: GameMode;
  playlistId: number;
  players: Player[];
  status: GameStatus;
  owner: Player;
  currentTrackId: string;
  currentQuestionNb: number;
  currentAnswerSuggestions: string[];
}

export interface IGame extends IGameBase {
  _id: string;
}

export interface CreateGameDto {
  playlistId: number;
  mode: GameMode;
  owner: Player;
}

export interface Player {
  id: number;
  name: string;
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
  players: {
    type: Array,
    default: [],
  },
  status: {
    type: String,
    default: "draft",
  },
  owner: {
    type: Object,
    required: true,
  },
  currentTrackId: {
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

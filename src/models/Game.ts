import mongoose from "mongoose";

export interface IGameBase {
  mode: GameMode;
  playlistId: number;
  totalPlaylistTracks: number;
  playersId: string[];
  status: GameStatus;
  ownerId: string;
  maxTracks: number;
  maxSuggestions: number;
  playedTracksId: number[];
  currentTrackPreview: string;
  currentTrackNb: number;
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

export interface UpdateGameDto {
  maxTracks: number;
  maxSuggestions: number;
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
  totalPlaylistTracks: {
    type: Number,
    required: true,
  },
  playersId: {
    type: Array,
    default: [],
  },
  status: {
    type: String,
    enum: GameStatus,
    default: GameStatus.Draft,
  },
  ownerId: {
    type: String,
    required: true,
  },
  maxTracks: {
    type: Number,
    default: 15,
  },
  maxSuggestions: {
    type: Number,
    default: 6,
  },
  playedTracksId: {
    type: Array,
    default: [],
  },
  currentTrackPreview: {
    type: String,
    default: "",
  },
  currentTrackNb: {
    type: Number,
    default: 0,
  },
  currentAnswerSuggestions: {
    type: Array,
    default: [],
  },
});

interface IGameDocument extends IGameBase, mongoose.Document {}

const Game: mongoose.Model<IGameDocument> = mongoose.models?.Game || mongoose.model("Game", GameSchema);

export default Game;

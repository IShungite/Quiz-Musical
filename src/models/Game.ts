export interface Game {
  id: string;
  mode: GameMode;
  playlistId: number;
  players: Player[];
  status: GameStatus;
  owner: Player;
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

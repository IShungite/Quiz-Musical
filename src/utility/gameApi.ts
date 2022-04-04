import { CreateGameDto, Game } from "../models/Game";

const createGame = async (createGameDto: CreateGameDto): Promise<Game> => {
  const response = await fetch("/api/game", { body: JSON.stringify(createGameDto), method: "POST" });

  const game: Game = (await response.json()).data;

  return game;
};

const gameApi = {
  createGame,
};

export default gameApi;

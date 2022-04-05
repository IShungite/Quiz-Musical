import { CreateGameDto, IGame } from "../models/Game";

const createGame = async (createGameDto: CreateGameDto): Promise<IGame> => {
  try {
    const response = await fetch("/api/game", { body: JSON.stringify(createGameDto), method: "POST" });

    const game: IGame = (await response.json()).data;

    return game;
  } catch (error) {
    const err = error as Error;
    console.log(err);
    throw new Error(err.message);
  }
};

const nextQuestion = async (gameId: string): Promise<IGame> => {
  try {
    const response = await fetch(`/api/game/${gameId}/next-question`, { method: "GET" });

    const game: IGame = (await response.json()).data;

    return game;
  } catch (error) {
    const err = error as Error;
    console.log(err);
    throw new Error(err.message);
  }
};

const gameApi = {
  createGame,
  nextQuestion,
};

export default gameApi;

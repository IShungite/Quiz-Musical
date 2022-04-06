import { CreateAnswerDto } from "../models/Answer";
import { CreateGameDto, IGame } from "../models/Game";
import { CreatePlayerDto, IPlayer } from "../models/Player";

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
const startGame = async (gameId: string): Promise<void> => {
  try {
    await fetch(`/api/game/${gameId}/start`);
    return;
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

const sendAnswer = async (gameId: string, createAnswerDto: CreateAnswerDto): Promise<void> => {
  try {
    await fetch(`/api/game/${gameId}/answer`, { body: JSON.stringify(createAnswerDto), method: "POST" });
  } catch (error) {
    const err = error as Error;
    console.log(err);
    throw new Error(err.message);
  }
};
const createPlayer = async (createPlayerDto: CreatePlayerDto): Promise<IPlayer> => {
  try {
    const response = await fetch(`/api/player`, { body: JSON.stringify(createPlayerDto), method: "POST" });

    const player: IPlayer = (await response.json()).data;
    return player;
  } catch (error) {
    const err = error as Error;
    console.log(err);
    throw new Error(err.message);
  }
};

const joinGame = async (gameId: string, playerId: string): Promise<void> => {
  try {
    await fetch(`/api/game/${gameId}/join`, { body: playerId, method: "POST" });
  } catch (error) {
    const err = error as Error;
    console.log(err);
    throw new Error(err.message);
  }
};

const gameApi = {
  createGame,
  nextQuestion,
  startGame,
  sendAnswer,
  joinGame,
  createPlayer,
};

export default gameApi;

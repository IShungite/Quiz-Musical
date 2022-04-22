import { CreateAnswerDto } from "../models/Answer";
import { CreateGameDto, IGame, UpdateGameDto } from "../models/Game";
import { CreatePlayerDto, IPlayer } from "../models/Player";
import { serverUrl } from "./config";
import { tryFetch } from "./utility";

const createGame = async (createGameDto: CreateGameDto): Promise<IGame> => {
  return tryFetch<IGame>(`${serverUrl}/api/game`, { body: JSON.stringify(createGameDto), method: "POST" });
};

const startGame = async (gameId: string, updateGameDto: UpdateGameDto): Promise<IGame> => {
  return tryFetch<IGame>(`${serverUrl}/api/game/${gameId}/start`, { body: JSON.stringify(updateGameDto), method: "PATCH" });
};

const nextQuestion = async (gameId: string): Promise<IGame> => {
  return tryFetch<IGame>(`${serverUrl}/api/game/${gameId}/next-question`);
};

const sendAnswer = async (gameId: string, createAnswerDto: CreateAnswerDto): Promise<string> => {
  return tryFetch<string>(`${serverUrl}/api/game/${gameId}/answer`, { body: JSON.stringify(createAnswerDto), method: "POST" });
};

const createPlayer = async (createPlayerDto: CreatePlayerDto): Promise<IPlayer> => {
  return tryFetch<IPlayer>(`${serverUrl}/api/player`, { body: JSON.stringify(createPlayerDto), method: "POST" });
};

const joinGame = async (gameId: string, playerId: string): Promise<IGame> => {
  return tryFetch<IGame>(`${serverUrl}/api/game/${gameId}/join`, { body: playerId, method: "POST" });
};

const getPlayers = async (gameId: string): Promise<IPlayer[]> => {
  return tryFetch<IPlayer[]>(`${serverUrl}/api/game/${gameId}/players`);
};

const gameApi = {
  createGame,
  nextQuestion,
  startGame,
  sendAnswer,
  joinGame,
  createPlayer,
  getPlayers,
};

export default gameApi;

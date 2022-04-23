import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../../middleware/mongodb";
import { CreateAnswerDto } from "../../../../models/Answer";
import Game, { GameStatus } from "../../../../models/Game";
import GameAnswer from "../../../../models/GameAnswer";
import Player from "../../../../models/Player";
import { pusher } from "../../pusher";

type AnswerResponseType = {
  data?: string;
  message?: string;
};

export const checkIfAllPlayersAnswered = async (gameId: string) => {
  const players = await Player.find({ gameId }).exec();
  for (const player of players) {
    if (player.answer === "") return [false, players];
  }

  return [true, players];
};

const handler = async (req: NextApiRequest, res: NextApiResponse<AnswerResponseType>) => {
  const { query, body } = req;

  if (typeof query.id !== "string") {
    return res.status(404).json({ message: "Wrong game id" });
  }

  const game = await Game.findById(query.id).exec();
  if (!game) {
    return res.status(404).json({ message: "Game not found" });
  }

  if (game.status !== GameStatus.Started) {
    return res.status(400).json({ message: "Game not started" });
  }

  const { playerId, answer }: CreateAnswerDto = JSON.parse(body);

  if (!game.playersId.includes(playerId)) {
    return res.status(400).json({ message: "You are not in this game" });
  }

  const currentPlayer = await Player.findById(playerId).exec();

  if (!currentPlayer) {
    return res.status(404).json({ message: "Player not found" });
  }

  if (currentPlayer.answer !== "") {
    return res.status(400).json({ message: "You already send the answer" });
  }

  const gameAnswer = await GameAnswer.findOne({ gameId: query.id }).exec();

  if (!gameAnswer) {
    return res.status(404).json({ message: "Game answer not found" });
  }

  const isAnswerGood = gameAnswer.answer === answer;

  await Player.findByIdAndUpdate(playerId, { answer, score: isAnswerGood ? currentPlayer.score + 1 : currentPlayer.score }, { new: true }).exec();

  const [allPlayersAnswered, players] = await checkIfAllPlayersAnswered(query.id);

  if (allPlayersAnswered) {
    await pusher.trigger(`quiz_room_${query.id}`, "show-good-answer", {
      goodAnswer: gameAnswer.answer,
      playersUpdated: players,
    });

    return res.status(200).json({});
  }

  return res.status(200).json({ message: "Waiting for other players" });
};

export default connectDB(handler);

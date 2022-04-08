import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../../middleware/mongodb";
import { CreateAnswerDto } from "../../../../models/Answer";
import Game, { GameStatus } from "../../../../models/Game";
import GameAnswer from "../../../../models/GameAnswer";
import Player from "../../../../models/Player";

type AnswerResponseType = {
  data?: boolean;
  message?: string;
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

  const player = await Player.findById(playerId).exec();

  if (!player) {
    return res.status(404).json({ message: "Player not found" });
  }

  if (player.hasAnswered) {
    return res.status(400).json({ message: "You already send the answer" });
  }

  const gameAnswer = await GameAnswer.findOne({ gameId: query.id }).exec();

  if (!gameAnswer) {
    return res.status(404).json({ message: "Game answer not found" });
  }

  if (gameAnswer.answer === answer) {
    await Player.findByIdAndUpdate(playerId, { hasAnswered: true, score: player.score + 1 }, { new: true }).exec();
    return res.status(200).json({ data: true });
  }

  await Player.findByIdAndUpdate(playerId, { hasAnswered: true }, { new: true }).exec();
  res.status(200).json({ data: false });
};

export default connectDB(handler);

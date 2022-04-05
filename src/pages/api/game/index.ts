import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../middleware/mongodb";
import Game, { CreateGameDto, GameStatus, IGame } from "../../../models/Game";

export type GameResponseType = {
  data?: IGame;
  message?: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<GameResponseType>) => {
  const { method, body } = req;

  if (method !== "POST") {
    return res.status(400).json({ message: "Method allowed: POST" });
  }

  const { ownerId, mode, playlistId }: CreateGameDto = JSON.parse(body);

  const game = await Game.create({
    mode,
    playlistId,
    playersId: [ownerId],
    status: GameStatus.Draft,
    ownerId,
    currentQuestionNb: 0,
    currentAnswerSuggestions: [],
  });

  res.status(200).json({ data: game });
};

export default connectDB(handler);

import { NextApiRequest, NextApiResponse } from "next";
import { GameResponseType } from "..";
import connectDB from "../../../../middleware/mongodb";
import Game, { GameStatus } from "../../../../models/Game";

const handler = async (req: NextApiRequest, res: NextApiResponse<GameResponseType>) => {
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

  res.status(200).end();
};

export default connectDB(handler);

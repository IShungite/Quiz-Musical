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

  if (game.status !== GameStatus.Draft) {
    return res.status(400).json({ message: "Can't modify a started game" });
  }

  const { ownerId, ...updatedGameParams } = body;

  if (game.ownerId !== ownerId) {
    return res.status(400).json({ message: "Only the owner can modify the game" });
  }

  const gameUpdated = await Game.findByIdAndUpdate(query.id, updatedGameParams, { new: true }).exec();

  if (!gameUpdated) {
    return res.status(404).json({ message: "Game not updated" });
  }

  res.status(200).json({ data: gameUpdated });
};

export default connectDB(handler);

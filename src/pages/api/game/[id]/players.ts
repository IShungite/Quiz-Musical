import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../../middleware/mongodb";
import Game from "../../../../models/Game";
import Player, { IPlayer } from "../../../../models/Player";

type Response = {
  data?: any;
  message?: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  const { query } = req;

  if (typeof query.id !== "string") {
    return res.status(404).json({ message: "Wrong game id" });
  }

  const game = await Game.findById(query.id).exec();
  if (!game) {
    return res.status(404).json({ message: "Game not found" });
  }

  const requests = game.playersId.map((playerId) => Player.findById(playerId).exec());

  const players = await Promise.all(requests);

  res.status(200).json({ data: players });
};

export default connectDB(handler);

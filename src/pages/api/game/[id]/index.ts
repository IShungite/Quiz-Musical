import { NextApiRequest, NextApiResponse } from "next";
import { GameResponseType } from "..";
import connectDB from "../../../../middleware/mongodb";
import Game from "../../../../models/Game";

const handler = async (req: NextApiRequest, res: NextApiResponse<GameResponseType>) => {
  const { query } = req;

  if (typeof query.id !== "string") {
    return res.status(404).json({ message: "Wrong game id" });
  }

  console.log("get game: ", query.id);

  const game = await Game.findById(query.id).exec();
  if (!game) {
    return res.status(404).json({ message: "Game not found" });
  }

  res.status(200).json({ data: game });
};

export default connectDB(handler);

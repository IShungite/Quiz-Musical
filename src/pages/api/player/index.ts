import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../middleware/mongodb";
import Player, { CreatePlayerDto, IPlayer } from "../../../models/Player";

export type PlayerResponseType = {
  data?: IPlayer;
  message?: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<PlayerResponseType>) => {
  const { method, body } = req;

  if (method !== "POST") {
    return res.status(400).json({ message: "Method allowed: POST" });
  }

  const { name }: CreatePlayerDto = JSON.parse(body);

  const player = await Player.create({
    name,
  });

  res.status(200).json({ data: player });
};

export default connectDB(handler);

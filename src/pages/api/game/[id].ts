import { NextApiRequest, NextApiResponse } from "next";
import { GameResponseType, games } from ".";

export default function handler(req: NextApiRequest, res: NextApiResponse<GameResponseType>) {
  const {
    query: { id },
  } = req;

  const game = games.find((g) => g.id === id);
  if (!game) {
    return res.status(404).json({ message: "Game not found" });
  }

  res.status(200).json(game);
}

import { NextApiRequest, NextApiResponse } from "next";
import { GameResponseType } from "..";
import connectDB from "../../../../middleware/mongodb";
import Game, { GameStatus } from "../../../../models/Game";
import Player from "../../../../models/Player";

const handler = async (req: NextApiRequest, res: NextApiResponse<GameResponseType>) => {
  const { query } = req;

  if (typeof query.id !== "string") {
    return res.status(404).json({ message: "Wrong game id" });
  }

  const game = await Game.findById(query.id).exec();
  if (!game) {
    return res.status(404).json({ message: "Game not found" });
  }

  const gameUpdated = await Game.findByIdAndUpdate(
    query.id,
    {
      status: GameStatus.Started,
    },
    { new: true }
  ).exec();

  if (!gameUpdated) {
    return res.status(404).json({ message: "Game not started" });
  }

  const resetPlayerPromises = gameUpdated.playersId.map((playerId) =>
    Player.findByIdAndUpdate(playerId, { hasAnswered: false, score: 0 }, { new: true }).exec()
  );

  await Promise.all(resetPlayerPromises);

  await fetch(`http://localhost:3000/api/game/${query.id}/next-question`);

  res.status(200).end();
};

export default connectDB(handler);

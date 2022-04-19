import { NextApiRequest, NextApiResponse } from "next";
import { GameResponseType } from "..";
import connectDB from "../../../../middleware/mongodb";
import Game, { GameStatus } from "../../../../models/Game";
import Player from "../../../../models/Player";
import { serverUrl } from "../../../../utility/config";

const handler = async (req: NextApiRequest, res: NextApiResponse<GameResponseType>) => {
  const { query, body, method } = req;

  if (method !== "PATCH") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  if (typeof query.id !== "string") {
    return res.status(404).json({ message: "Wrong game id" });
  }

  const game = await Game.findById(query.id).exec();
  if (!game) {
    return res.status(404).json({ message: "Game not found" });
  }

  if (game.status !== GameStatus.Draft) {
    return res.status(400).json({ message: "Game already started" });
  }

  const updateGameDto = JSON.parse(body);
  // const { ownerId, ...updateGameDto } = body;

  // if (game.ownerId !== ownerId) {
  //   return res.status(400).json({ message: "Only the owner can modify the game" });
  // }

  const gameUpdated = await Game.findByIdAndUpdate(
    query.id,
    {
      ...updateGameDto,
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

  await fetch(`${serverUrl}/api/game/${query.id}/next-question`);

  res.status(200).json({ data: gameUpdated });
};

export default connectDB(handler);

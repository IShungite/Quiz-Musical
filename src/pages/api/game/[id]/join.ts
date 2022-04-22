import { NextApiRequest, NextApiResponse } from "next";
import { GameResponseType } from "..";
import connectDB from "../../../../middleware/mongodb";
import Game, { GameStatus } from "../../../../models/Game";
import Player from "../../../../models/Player";
import { pusher } from "../../pusher";

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
    return res.status(400).json({ message: "Too late, game started" });
  }

  const gameUpdated = await Game.findByIdAndUpdate(query.id, { playersId: [...game.playersId, body] }, { new: true }).exec();

  if (!gameUpdated) {
    return res.status(404).json({ message: "Game not updated" });
  }

  const player = await Player.findByIdAndUpdate(body, { gameId: query.id }).exec();

  await pusher.trigger(`quiz_room_${query.id}`, "player-join", {
    player,
  });

  console.log(`Trigger join on quiz_room_${query.id}`);

  res.status(200).json({ data: gameUpdated });
};

export default connectDB(handler);

import { NextApiRequest, NextApiResponse } from "next";
import { GameResponseType } from ".";
import connectDB from "../../../middleware/mongodb";
import Game, { GameStatus } from "../../../models/Game";
import Player from "../../../models/Player";
import { pusher } from "../pusher";

const handler = async (req: NextApiRequest, res: NextApiResponse<GameResponseType>) => {
  const { body, method } = req;

  if (method !== "POST") {
    return res.status(400).json({ message: "Method allowed: POST" });
  }

  const { joinCode, playerId } = JSON.parse(body);

  if (typeof joinCode !== "string") {
    return res.status(404).json({ message: "Wrong join code" });
  }

  const game = await Game.findOne({ joinCode: joinCode, status: GameStatus.Draft }).exec();

  if (!game) {
    return res.status(404).json({ message: "Game not found or already started" });
  }

  const gameUpdated = await Game.findByIdAndUpdate(game.id, { playersId: [...game.playersId, playerId] }, { new: true }).exec();

  if (!gameUpdated) {
    return res.status(404).json({ message: "Game not updated" });
  }

  const player = await Player.findByIdAndUpdate(playerId, { gameId: game.id }).exec();

  await pusher.trigger(`quiz_room_${game.id}`, "player-join", {
    player,
  });

  res.status(200).json({ data: gameUpdated });
};

export default connectDB(handler);

import { NextApiRequest, NextApiResponse } from "next";
import { GameResponseType } from "..";
import connectDB from "../../../../middleware/mongodb";
import Game, { GameStatus } from "../../../../models/Game";
import GameAnswer from "../../../../models/GameAnswer";
import Player from "../../../../models/Player";
import { pusher } from "../../pusher";
import { checkIfAllPlayersAnswered } from "./answer";

const handler = async (req: NextApiRequest, res: NextApiResponse<GameResponseType>) => {
  const { query, body } = req;

  if (typeof query.id !== "string") {
    return res.status(404).json({ message: "Wrong game id" });
  }

  const game = await Game.findById(query.id).exec();
  if (!game) {
    return res.status(404).json({ message: "Game not found" });
  }

  const player = await Player.findByIdAndUpdate(body, { gameId: null, score: 0, answer: "" }).exec();

  if (!player) {
    return res.status(404).json({ message: "Player not found" });
  }

  const playersId = game.playersId.filter((playerId) => playerId !== body);

  if (playersId.length === 0) {
    await Game.findByIdAndDelete(query.id).exec();
    return res.status(200).json({ message: "Game deleted" });
  }

  // Update the game with the new playersId
  await Game.findByIdAndUpdate(query.id, { playersId }, { new: true }).exec();

  // Send the event to the client
  await pusher.trigger(`quiz_room_${query.id}`, "player-leave", {
    playerId: body,
  });

  // if the game is started, check if all remaining players answered
  if (game.status === GameStatus.Started) {
    const [allPlayersAnswered, players] = await checkIfAllPlayersAnswered(query.id);

    if (allPlayersAnswered) {
      const gameAnswer = await GameAnswer.findOne({ gameId: query.id }).exec();

      if (!gameAnswer) {
        return res.status(404).json({ message: "Game answer not found" });
      }

      // all players answered, send the event to the client
      await pusher.trigger(`quiz_room_${query.id}`, "show-good-answer", {
        goodAnswer: gameAnswer.answer,
        playersUpdated: players,
      });
    }
  }

  res.status(200).json({});
};

export default connectDB(handler);

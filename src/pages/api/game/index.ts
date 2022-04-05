import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../middleware/mongodb";
import Game, { CreateGameDto, GameStatus, IGame } from "../../../models/Game";

export type GameResponseType = {
  data?: IGame;
  message?: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<GameResponseType>) => {
  const { method, body, query } = req;

  const { owner, mode, playlistId }: CreateGameDto = JSON.parse(body);

  switch (method) {
    case "POST":
      const game = await Game.create({
        mode,
        playlistId,
        players: [owner],
        status: GameStatus.Draft,
        owner,
        currentQuestionNb: 0,
        currentAnswerSuggestions: [],
      });

      res.status(200).json({ data: game });
      return;
    case "GET":
      if (typeof query.id === "string") {
        const game = await Game.findById(query.id).exec();
        if (game) {
          res.status(200).json({ data: game });
        } else {
          res.status(404).json({ message: "Game not found" });
        }
      }
      return;
    default:
      res.status(405).end();
  }
};

export default connectDB(handler);

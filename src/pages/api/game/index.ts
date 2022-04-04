import type { NextApiRequest, NextApiResponse } from "next";
import { CreateGameDto, Game, GameStatus } from "../../../models/Game";

export const games: Game[] = [];

export type GameResponseType = {
  data?: Game;
  message?: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<GameResponseType>) {
  const { method, body, query } = req;

  const { owner, mode, playlistId }: CreateGameDto = JSON.parse(body);

  switch (method) {
    case "POST":
      const game: Game = {
        id: Date.now().toString(),
        mode,
        playlistId,
        players: [owner],
        status: GameStatus.Draft,
        owner,
      };
      games.push(game);
      res.status(200).json({ data: game });
      return;
    case "GET":
      if (typeof query.id === "string") {
        const game = games.find((g) => g.id === query.id);
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
}

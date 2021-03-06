import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../middleware/mongodb";
import Game, { CreateGameDto, GameStatus, IGame } from "../../../models/Game";
import Player from "../../../models/Player";
import deezerApi from "../../../utility/deezerApi";

export type GameResponseType = {
  data?: IGame;
  message?: string;
};

const joinCodeLength = 6;

const generateJoinCode = (): string => {
  return Math.random()
    .toString(36)
    .substring(2, joinCodeLength + 2)
    .toUpperCase();
};

const handler = async (req: NextApiRequest, res: NextApiResponse<GameResponseType>) => {
  const { method, body } = req;

  if (method !== "POST") {
    return res.status(400).json({ message: "Method allowed: POST" });
  }

  const { ownerId, mode, playlistId }: CreateGameDto = JSON.parse(body);

  const tracks = await deezerApi.getPlaylistTracks(playlistId);

  const tracksWithPreview = tracks.filter((track) => track.preview !== "");

  const game = await Game.create({
    mode,
    playlistId,
    totalPlaylistTracks: tracksWithPreview.length,
    playersId: [ownerId],
    status: GameStatus.Draft,
    joinCode: generateJoinCode(),
    ownerId,
    currentTrackNb: 0,
    currentAnswerSuggestions: [],
  });

  await Player.findByIdAndUpdate(ownerId, { gameId: game._id }).exec();

  res.status(200).json({ data: game });
};

export default connectDB(handler);

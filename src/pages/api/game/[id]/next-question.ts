import { NextApiRequest, NextApiResponse } from "next";
import { GameResponseType } from "..";
import connectDB from "../../../../middleware/mongodb";
import Game from "../../../../models/Game";
import deezerApi from "../../../../utility/deezerApi";

const handler = async (req: NextApiRequest, res: NextApiResponse<GameResponseType>) => {
  const { query } = req;

  if (typeof query.id !== "string") {
    return res.status(404).json({ message: "Wrong game id" });
  }

  console.log("next question game id: ", query.id);

  const game = await Game.findById(query.id).exec();
  if (!game) {
    return res.status(404).json({ message: "Game not found" });
  }

  const tracks = await deezerApi.getPlaylistTracks(game.playlistId);

  const nextTrack = tracks[Math.floor(Math.random() * tracks.length)];

  // const gameUpdated = await Game.findByIdAndUpdate(
  //   query.id,
  //   {
  //     trackId: nextTrack.id,
  //     currentAnswerSuggestions: ["artiste 1", "artiste 2", "artiste 3", "artiste 4"],
  //     currentQuestionNb: game.currentQuestionNb + 1,
  //   },
  //   { new: true }
  // ).exec();

  // if (!gameUpdated) {
  //   return res.status(404).json({ message: "Game not updated" });
  // }

  // console.log({ gameUpdated });

  // res.status(200).json({ data: gameUpdated });

  res.status(200).send("test");
};

export default connectDB(handler);

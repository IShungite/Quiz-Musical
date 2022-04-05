import { NextApiRequest, NextApiResponse } from "next";
import { GameResponseType } from "..";
import connectDB from "../../../../middleware/mongodb";
import Game from "../../../../models/Game";
import deezerApi from "../../../../utility/deezerApi";
import { shuffle } from "../../../../utility/utility";

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

  const similarArtists = await deezerApi.getSimilarArtists(nextTrack.artist.id);

  const shuffledArtists = shuffle(similarArtists);

  const suggestedArtists = shuffledArtists.slice(0, 3);

  const currentAnswerSuggestions = suggestedArtists.map((artist) => artist.name);
  currentAnswerSuggestions.push(nextTrack.artist.name);

  const gameUpdated = await Game.findByIdAndUpdate(
    query.id,
    {
      currentTrackPreview: nextTrack.preview,
      currentAnswerSuggestions: shuffle(currentAnswerSuggestions),
      currentQuestionNb: game.currentQuestionNb + 1,
    },
    { new: true }
  ).exec();

  if (!gameUpdated) {
    return res.status(404).json({ message: "Game not updated" });
  }

  res.status(200).json({ data: gameUpdated });
};

export default connectDB(handler);

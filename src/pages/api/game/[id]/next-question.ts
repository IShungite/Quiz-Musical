import { NextApiRequest, NextApiResponse } from "next";
import { GameResponseType } from "..";
import connectDB from "../../../../middleware/mongodb";
import Game, { GameStatus } from "../../../../models/Game";
import GameAnswer from "../../../../models/GameAnswer";
import Player from "../../../../models/Player";
import deezerApi from "../../../../utility/deezerApi";
import { shuffle } from "../../../../utility/utility";

const handler = async (req: NextApiRequest, res: NextApiResponse<GameResponseType>) => {
  const { query } = req;

  if (typeof query.id !== "string") {
    return res.status(404).json({ message: "Wrong game id" });
  }

  const game = await Game.findById(query.id).exec();
  if (!game) {
    return res.status(404).json({ message: "Game not found" });
  }

  if (game.maxQuestions === game.currentQuestionNb) {
    const gameUpdated = await Game.findByIdAndUpdate(
      query.id,
      {
        status: GameStatus.Finished,
      },
      { new: true }
    ).exec();

    if (!gameUpdated) {
      return res.status(404).json({ message: "Game not updated" });
    }

    return res.status(200).json({ data: gameUpdated });
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

  await GameAnswer.findOneAndUpdate({ gameId: query.id }, { gameId: query.id, answer: nextTrack.artist.name }, { upsert: true, new: true }).exec();

  const resetPlayerPromises = gameUpdated.playersId.map((playerId) =>
    Player.findByIdAndUpdate(playerId, { hasAnswered: false }, { new: true }).exec()
  );

  await Promise.all(resetPlayerPromises);

  res.status(200).json({ data: gameUpdated });
};

export default connectDB(handler);

import { NextApiRequest, NextApiResponse } from "next";
import { GameResponseType } from "..";
import connectDB from "../../../../middleware/mongodb";
import Game, { GameStatus, IGame } from "../../../../models/Game";
import GameAnswer from "../../../../models/GameAnswer";
import Player from "../../../../models/Player";
import { Track } from "../../../../models/Tracks";
import deezerApi from "../../../../utility/deezerApi";
import { shuffle } from "../../../../utility/utility";
import { pusher } from "../../pusher";

/**
 * It gets the tracks of a playlist, shuffles them, and returns the first track that hasn't been played
 * yet
 * @param {IGame} game - IGame
 * @returns The next track to play
 */
const getNextTrack = async (game: IGame) => {
  const tracks = await deezerApi.getPlaylistTracks(game.playlistId);

  const tracksWithPreview = tracks.filter((track) => track.preview !== "");

  const shuffledTacks: Track[] = shuffle(tracksWithPreview);

  for (const track of shuffledTacks) {
    if (track.preview && !game.playedTracksId.includes(track.id)) {
      return track;
    }
  }

  return null;
};

/**
 * It takes a track and a number of similar artists to return, and returns a list of similar artists of the track
 * @param {Track} track - Track
 * @param {number} nbSimilarArtists - number
 * @returns An array of artists.
 */
const getSimilarArtists = async (track: Track, nbSimilarArtists: number) => {
  const similarArtists = await deezerApi.getSimilarArtists(track.artist.id);

  const shuffledArtists = shuffle(similarArtists);

  return shuffledArtists.slice(0, nbSimilarArtists - 1);
};

/**
 * Update the game status to finished and send the game updated to the client
 * @param {IGame} game - IGame
 * @param {NextApiResponse} res - NextApiResponse
 * @returns the response to the client
 */
const finishGame = async (game: IGame, res: NextApiResponse) => {
  const gameUpdated = await Game.findByIdAndUpdate(
    game._id,
    {
      status: GameStatus.Finished,
    },
    { new: true }
  ).exec();

  if (!gameUpdated) {
    return res.status(404).json({ message: "Game not updated" });
  }

  await pusher.trigger(`quiz_room_${game._id}`, "next-question", {
    game: gameUpdated,
  });

  return res.status(200).json({ data: gameUpdated });
};

const handler = async (req: NextApiRequest, res: NextApiResponse<GameResponseType>) => {
  const { query } = req;

  if (typeof query.id !== "string") {
    return res.status(404).json({ message: "Wrong game id" });
  }

  const game = await Game.findById(query.id).exec();
  if (!game) {
    return res.status(404).json({ message: "Game not found" });
  }

  if (game.maxTracks === game.currentTrackNb) {
    return finishGame(game, res);
  }

  const nextTrack = await getNextTrack(game);

  if (!nextTrack) {
    return finishGame(game, res);
  }

  const similarArtists = await getSimilarArtists(nextTrack, game.maxSuggestions);

  const currentAnswerSuggestions = similarArtists.map((artist) => artist.name);
  currentAnswerSuggestions.push(nextTrack.artist.name);

  const gameUpdated = await Game.findByIdAndUpdate(
    query.id,
    {
      currentTrackPreview: nextTrack.preview,
      currentAnswerSuggestions: shuffle(currentAnswerSuggestions),
      currentTrackNb: game.currentTrackNb + 1,
      playedTracksId: [...game.playedTracksId, nextTrack.id],
    },
    { new: true }
  ).exec();

  if (!gameUpdated) {
    return res.status(404).json({ message: "Game not updated" });
  }

  await GameAnswer.findOneAndUpdate({ gameId: query.id }, { gameId: query.id, answer: nextTrack.artist.name }, { upsert: true, new: true }).exec();

  const promisesResetPlayer = gameUpdated.playersId.map((playerId) => Player.findByIdAndUpdate(playerId, { answer: "" }, { new: true }).exec());

  await Promise.all(promisesResetPlayer);

  await pusher.trigger(`quiz_room_${query.id}`, "next-question", {
    game: gameUpdated,
  });

  res.status(200).json({ data: gameUpdated });
};

export default connectDB(handler);

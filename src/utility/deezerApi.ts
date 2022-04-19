import { Artist } from "../models/Artist";
import { Playlist } from "../models/Playlist";
import { Track } from "../models/Tracks";
import { serverUrl } from "./config";
import { tryFetch } from "./utility";

const searchPlaylists = async (searchTerm: string): Promise<Playlist[]> => {
  return tryFetch<Playlist[]>(`${serverUrl}/api/deezer/search/playlist/${searchTerm}`);
};

const getPlaylistTracks = async (playlistId: number): Promise<Track[]> => {
  return tryFetch<Track[]>(`${serverUrl}/api/deezer/playlist/${playlistId}/tracks`);
};

const getSimilarArtists = async (artistId: number): Promise<Artist[]> => {
  return tryFetch<Artist[]>(`${serverUrl}/api/deezer/artist/${artistId}/related`);
};

const deezerApi = {
  searchPlaylists,
  getPlaylistTracks,
  getSimilarArtists,
};

export default deezerApi;

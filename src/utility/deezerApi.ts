import { Artist } from "../models/Artist";
import { Playlist } from "../models/Playlist";
import { Track } from "../models/Tracks";
import { tryFetch } from "./utility";

// const baseUrl = "https://cors-anywhere.herokuapp.com/http://api.deezer.com/";
const baseUrl = "http://api.deezer.com/";

const searchPlaylists = async (searchTerm: string): Promise<Playlist[]> => {
  return tryFetch<Playlist[]>(`${baseUrl}search/playlist?limit=15&q=${searchTerm}`);
};

const getPlaylistTracks = async (playlistId: number): Promise<Track[]> => {
  return tryFetch<Track[]>(`${baseUrl}playlist/${playlistId}/tracks`);
};

const getSimilarArtists = async (artistId: number): Promise<Artist[]> => {
  return tryFetch<Artist[]>(`${baseUrl}artist/${artistId}/related`);
};

const deezerApi = {
  searchPlaylists,
  getPlaylistTracks,
  getSimilarArtists,
};

export default deezerApi;

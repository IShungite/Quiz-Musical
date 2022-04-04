import { Playlist } from "../models/Playlist";
import { Track } from "../models/Tracks";

const baseUrl = "https://cors-anywhere.herokuapp.com/api.deezer.com/";

const searchPlaylists = async (searchTerm: string): Promise<Playlist[]> => {
  const response = await fetch(`${baseUrl}search/playlist?limit=15&q=${searchTerm}`, {});
  const playlists = (await response.json()).data;

  console.log(playlists);
  return playlists;
};

const getPlaylistTracks = async (playlistId: number): Promise<Track[]> => {
  const response = await fetch(`${baseUrl}playlist/${playlistId}/tracks`, {});
  const tracks = (await response.json()).data;

  console.log(tracks);
  return tracks;
};

const deezerApi = {
  searchPlaylists,
  getPlaylistTracks,
};

export default deezerApi;

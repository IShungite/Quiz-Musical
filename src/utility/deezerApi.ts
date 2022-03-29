import { Playlist } from "../models/Playlist";
import { Track } from "../models/Tracks";

const baseUrl = "https://cors-anywhere.herokuapp.com/api.deezer.com/";

const searchPlaylists = async (searchTerm: string): Promise<Playlist[]> => {
  const response = await fetch(`${baseUrl}search/playlist?limit=15&q=${searchTerm}`, {}).then((res) => res.json());

  console.log(response.data);
  return response.data;
};

const getPlaylistTracks = async (playlistId: number): Promise<Track[]> => {
  const response = await fetch(`${baseUrl}playlist/${playlistId}/tracks`, {}).then((res) => res.json());

  console.log(response.data);
  return response.data;
};

const deezerApi = {
  searchPlaylists,
  getPlaylistTracks,
};

export default deezerApi;

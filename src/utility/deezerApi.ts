import { Playlist } from "../models/Playlist";
import { Track } from "../models/Tracks";

const baseUrl = "https://cors-anywhere.herokuapp.com/http://api.deezer.com/";

const headers = new Headers();
headers.append("Origin", "http://localhost:3000");

const searchPlaylists = async (searchTerm: string): Promise<Playlist[]> => {
  const response = await fetch(`${baseUrl}search/playlist?limit=15&q=${searchTerm}`, { headers: headers });
  const playlists = (await response.json()).data;

  return playlists;
};

const getPlaylistTracks = async (playlistId: number): Promise<Track[]> => {
  try {
    const response = await fetch(`${baseUrl}playlist/${playlistId}/tracks`, {
      headers: headers,
    });

    const tracks = (await response.json()).data;

    return tracks;
  } catch (error) {
    const err = error as Error;
    throw new Error(err.message);
  }
};

const deezerApi = {
  searchPlaylists,
  getPlaylistTracks,
};

export default deezerApi;

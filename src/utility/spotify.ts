import SpotifyWebApi from "spotify-web-api-node";
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from "./config";

const scopes = ["user-read-email", "streaming"].join(",");

const params = {
  scope: scopes,
};

const queryParamString = new URLSearchParams(params);

export const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParamString.toString()}`;

const spotifyApi = new SpotifyWebApi({
  clientId: SPOTIFY_CLIENT_ID,
  clientSecret: SPOTIFY_CLIENT_SECRET,
});

export default spotifyApi;

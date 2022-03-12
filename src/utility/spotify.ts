import SpotifyWebApi from "spotify-web-api-node";

const scopes = ["user-read-email", "streaming"].join(",");

const params = {
  scope: scopes,
};

const queryParamString = new URLSearchParams(params);

export const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParamString.toString()}`;

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_PUBLIC_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_PUBLIC_CLIENT_SECRET,
});

export default spotifyApi;

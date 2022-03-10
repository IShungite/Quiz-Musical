export const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_PUBLIC_CLIENT_ID != undefined ? process.env.SPOTIFY_PUBLIC_CLIENT_ID : "";
export const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_PUBLIC_CLIENT_SECRET != undefined ? process.env.SPOTIFY_PUBLIC_CLIENT_SECRET : "";

export enum RouteUrls {
  Home = "/",
  Login = "/login",
  Logout = "/logout",
}

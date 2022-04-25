import { NextApiRequest, NextApiResponse } from "next";
import { Playlist } from "../../../../../models/Playlist";
import { tryFetch } from "../../../../../utility/utility";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;

  if (typeof query.searchTerm !== "string") {
    return res.status(404).json({ message: "Wrong game id" });
  }

  const maxPlaylists = 20;

  const playlists = await tryFetch<Playlist[]>(`https://api.deezer.com/search/playlist?limit=${maxPlaylists}&q=${query.searchTerm}`);

  res.status(200).json({ data: playlists });
};

export default handler;

import { NextApiRequest, NextApiResponse } from "next";
import { Track } from "../../../../../models/Tracks";
import { tryFetch } from "../../../../../utility/utility";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;

  if (typeof query.id !== "string") {
    return res.status(404).json({ message: "Wrong game id" });
  }

  const tracks = await tryFetch<Track[]>(`https://api.deezer.com/playlist/${query.id}/tracks`);

  res.status(200).json({ data: tracks });
};

export default handler;

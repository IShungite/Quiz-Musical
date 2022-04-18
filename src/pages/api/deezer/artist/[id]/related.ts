import { NextApiRequest, NextApiResponse } from "next";
import { tryFetch } from "../../../../../utility/utility";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;

  if (typeof query.id !== "string") {
    return res.status(404).json({ message: "Wrong artist id" });
  }

  const artists = await tryFetch(`https://api.deezer.com/artist/${query.id}/related`);

  res.status(200).json({ data: artists });
};

export default handler;

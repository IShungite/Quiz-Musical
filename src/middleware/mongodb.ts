import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

const connectDB = (handler: (req: NextApiRequest, res: NextApiResponse) => void) => async (req: NextApiRequest, res: NextApiResponse) => {
  if (mongoose.connections[0].readyState) {
    // Use current db connection
    return handler(req, res);
  }
  // Use new db connection
  await mongoose.connect(process.env.MONGODB_URL);
  return handler(req, res);
};

export default connectDB;

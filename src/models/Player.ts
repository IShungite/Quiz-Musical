import mongoose from "mongoose";

export interface IPlayerBase {
  name: string;
  answer: string;
  score: number;
}

export interface IPlayer extends IPlayerBase {
  _id: string;
}

export interface CreatePlayerDto {
  name: string;
}

const PlayerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    default: "",
  },
  score: {
    type: Number,
    default: 0,
  },
});

interface IPlayerDocument extends IPlayerBase, mongoose.Document {}

const Player: mongoose.Model<IPlayerDocument> = mongoose.models?.Player || mongoose.model("Player", PlayerSchema);

export default Player;

import mongoose from "mongoose";

export interface IGameAnswerBase {
  gameId: string;
  answer: string;
}

export interface IGameAnswer extends IGameAnswerBase {
  _id: string;
}

export interface CreateGameAnswerDto {
  gameId: string;
  answer: string;
}

const GameAnswerSchema = new mongoose.Schema({
  gameId: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

interface IGameAnswerDocument extends IGameAnswerBase, mongoose.Document {}

mongoose.models = {};

const GameAnswer: mongoose.Model<IGameAnswerDocument> = mongoose.models.Game || mongoose.model("GameAnswer", GameAnswerSchema);

export default GameAnswer;

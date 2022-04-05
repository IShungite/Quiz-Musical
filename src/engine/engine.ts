import { Game } from "../models/Game";

export class Engine {
  MAX_ANSWER_SUGGESTIONS = 3;
  MAX_QUESTIONS = 5;

  game: Game;

  answerSuggestions: string[] = [];
  questionNumber = 0;
  currentTrackPreview = "";

  constructor(game: Game) {
    this.game = game;
  }

  getNextQuestion() {
    if (this.questionNumber >= this.MAX_QUESTIONS) {
      this.end();
      return null;
    }
  }

  end() {}
}

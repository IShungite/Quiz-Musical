import pusherJs from "pusher-js";
import React, { useEffect } from "react";
import { IGame } from "../models/Game";
import { IPlayer } from "../models/Player";
import { pusherAppkey } from "../utility/config";
import { useAppSelector } from "./reducer";

interface Props {
  onPlayerJoin: (player: IPlayer) => void;
  onPlayerLeave: (playerId: string) => void;
  onNextQuestion: (game: IGame) => void;
  onShowGoodAnswer: (goodAnswer: string, playersUpdated: IPlayer[]) => void;
  onUnsubscribe: (gameId: string) => void;
}

export default function usePusher({ onPlayerJoin, onPlayerLeave, onNextQuestion, onShowGoodAnswer, onUnsubscribe }: Props) {
  const { game } = useAppSelector((state) => state.quiz);

  const [isConnected, setIsConnected] = React.useState(false);

  useEffect(() => {
    if (!game?._id) return;

    pusherJs.logToConsole = false;

    const pusher = new pusherJs(pusherAppkey, {
      cluster: "eu",
    });

    console.log("init pusher on channel " + `quiz_room_${game._id}`);

    const channel = pusher.subscribe(`quiz_room_${game._id}`);

    channel.bind("player-join", function ({ player }: { player: IPlayer }) {
      console.log("player-join");
      onPlayerJoin(player);
    });

    channel.bind("player-leave", function ({ playerId }: { playerId: string }) {
      console.log("player-leave");

      onPlayerLeave(playerId);
    });

    channel.bind("next-question", function ({ gameUpdated }: { gameUpdated: IGame }) {
      console.log("next-question");

      onNextQuestion(gameUpdated);
    });

    channel.bind("show-good-answer", function ({ goodAnswer, playersUpdated }: { goodAnswer: string; playersUpdated: IPlayer[] }) {
      console.log("show-good-answer", goodAnswer);

      onShowGoodAnswer(goodAnswer, playersUpdated);
    });

    pusher.connection.bind("connected", function () {
      console.log("connected");
      setIsConnected(true);
    });

    return () => {
      console.log("unsubscribe pusher");
      pusher.unsubscribe(`quiz_room_${game._id}`);
      setIsConnected(false);
      onUnsubscribe(game._id);
    };
  }, [game?._id, onNextQuestion, onPlayerJoin, onPlayerLeave, onShowGoodAnswer, onUnsubscribe]);

  return {
    isConnected,
  };
}

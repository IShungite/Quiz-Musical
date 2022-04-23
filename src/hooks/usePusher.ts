import pusherJs from "pusher-js";
import React, { useEffect } from "react";
import { IGame } from "../models/Game";
import { IPlayer } from "../models/Player";
import { pusherAppkey } from "../utility/config";
import { useAppSelector } from "./reducer";

interface Props {
  onPlayerJoin: (player: IPlayer) => void;
  onPlayerLeave: (player: IPlayer) => void;
  onNextQuestion: (game: IGame) => void;
  onShowGoodAnswer: (goodAnswer: string, players: IPlayer[]) => void;
}

export default function usePusher({ onPlayerJoin, onPlayerLeave, onNextQuestion, onShowGoodAnswer }: Props) {
  const { game } = useAppSelector((state) => state.waitingArea);

  const [isConnected, setIsConnected] = React.useState(false);

  useEffect(() => {
    if (!game?._id) return;

    pusherJs.logToConsole = false;

    console.log("connect pusher");

    const pusher = new pusherJs(pusherAppkey, {
      cluster: "eu",
    });
    console.log("init pusher on channel " + `quiz_room_${game._id}`);

    const channel = pusher.subscribe(`quiz_room_${game._id}`);

    channel.bind("player-join", function ({ player }: { player: IPlayer }) {
      console.log("player-join");
      onPlayerJoin(player);
    });

    channel.bind("player-leave", function (data: IPlayer) {
      console.log("player-leave");

      onPlayerLeave(data);
    });

    channel.bind("next-question", function ({ game }: { game: IGame }) {
      console.log("next-question");

      onNextQuestion(game);
    });

    channel.bind("show-good-answer", function ({ goodAnswer, players }: { goodAnswer: string; players: IPlayer[] }) {
      console.log("show-good-answer", goodAnswer);

      onShowGoodAnswer(goodAnswer, players);
    });

    pusher.connection.bind("connected", function () {
      console.log("connected");
      setIsConnected(true);
    });

    return () => {
      console.log("unsubscribe pusher");
      pusher.unsubscribe(`quiz_room_${game._id}`);
      setIsConnected(false);
    };
  }, [game?._id, onNextQuestion, onPlayerJoin, onPlayerLeave, onShowGoodAnswer]);

  return {
    isConnected,
  };
}

import { Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import GameAnswer from "../../../components/GameAnswer/GameAnswer";
import GameDraft from "../../../components/GameDraft/GameDraft";
import GameEnded from "../../../components/GameEnded/GameEnded";
import GameFindMusic from "../../../components/GameFindMusic/GameFindMusic";
import { useAppDispatch, useAppSelector } from "../../../hooks/reducer";
import usePusher from "../../../hooks/usePusher";
import { GameStatus, IGame } from "../../../models/Game";
import { IPlayer } from "../../../models/Player";
import {
  addCurrentPlayerLocal,
  clearAll,
  getPlayers,
  removeCurrentPlayerLocal,
  setAnswerSelected,
  updateCurrentGameLocal,
  updateCurrentPlayersLocal,
} from "../../../reducers/waitingAreaSlice";
import { RouteUrls } from "../../../utility/config";
export default function Quiz() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { game, players } = useAppSelector((state) => state.waitingArea);

  const [goodAnswer, setGoodAnswer] = useState<string | undefined>(undefined);

  const onPlayerJoin = useCallback(
    (player: IPlayer) => {
      console.log("player joined", player);
      dispatch(addCurrentPlayerLocal(player));
    },
    [dispatch]
  );

  const onPlayerLeave = useCallback(
    (player: IPlayer) => {
      console.log("player leave", player._id);
      dispatch(removeCurrentPlayerLocal(player._id));
    },
    [dispatch]
  );

  const onStart = useCallback(() => {
    console.log("start");
  }, []);

  const onNextQuestion = useCallback(
    (newGame: IGame) => {
      setGoodAnswer(undefined);
      dispatch(setAnswerSelected(undefined));
      dispatch(updateCurrentGameLocal(newGame));
    },
    [dispatch]
  );

  const onShowGoodAnswer = useCallback(
    (answer: string, players: IPlayer[]) => {
      console.log("onShowGoodAnswer");
      setGoodAnswer(answer);
      dispatch(updateCurrentPlayersLocal(players));
    },
    [dispatch]
  );

  const { isConnected } = usePusher({ onPlayerJoin, onPlayerLeave, onStart, onNextQuestion, onShowGoodAnswer });

  useEffect(() => {
    if (isConnected && game && players.length === 0) {
      dispatch(getPlayers(game._id));
    }
  }, [dispatch, game, isConnected, players.length]);

  useEffect(() => {
    if (!game) router.push(RouteUrls.NewQuiz);
  }, [game, router]);

  useEffect(() => {
    return () => {
      dispatch(clearAll());
    };
  }, [dispatch]);

  if (players.length === 0) return <>Loading...</>;

  if (game?.status === GameStatus.Draft) return <GameDraft game={game} />;

  if (game?.status === GameStatus.Started) {
    if (goodAnswer) return <GameAnswer game={game} goodAnswer={goodAnswer} />;

    return <GameFindMusic game={game} />;
  }
  if (game?.status === GameStatus.Finished) return <GameEnded game={game} />;

  return <Typography>Loading...</Typography>;
}

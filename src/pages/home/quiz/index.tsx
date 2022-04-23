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
} from "../../../reducers/quizSlice";
import { RouteUrls } from "../../../utility/config";
export default function Quiz() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { game, players } = useAppSelector((state) => state.quiz);

  const [goodAnswer, setGoodAnswer] = useState<string | undefined>(undefined);

  const onPlayerJoin = useCallback(
    (player: IPlayer) => {
      dispatch(addCurrentPlayerLocal(player));
    },
    [dispatch]
  );

  const onPlayerLeave = useCallback(
    (player: IPlayer) => {
      dispatch(removeCurrentPlayerLocal(player._id));
    },
    [dispatch]
  );

  const onNextQuestion = useCallback(
    (gameUpdated: IGame) => {
      setGoodAnswer(undefined);
      console.log({ gameUpdated });
      dispatch(setAnswerSelected(undefined));
      dispatch(updateCurrentGameLocal(gameUpdated));
    },
    [dispatch]
  );

  const onShowGoodAnswer = useCallback(
    (answer: string, playersUpdated: IPlayer[]) => {
      console.log("onShowGoodAnswer");
      setGoodAnswer(answer);
      dispatch(updateCurrentPlayersLocal(playersUpdated));
    },
    [dispatch]
  );

  const { isConnected } = usePusher({ onPlayerJoin, onPlayerLeave, onNextQuestion, onShowGoodAnswer });

  useEffect(() => {
    if (isConnected && game && players.length === 0) {
      dispatch(getPlayers(game._id));
    }
  }, [dispatch, game, isConnected, players.length]);

  useEffect(() => {
    console.log(game);
    if (!game) router.push(RouteUrls.NewQuiz);
  }, [game, router]);

  useEffect(() => {
    return () => {
      dispatch(clearAll());
    };
  }, [dispatch]);

  if (players.length === 0 || !game) return <>Loading...</>;

  if (game.status === GameStatus.Draft) return <GameDraft game={game} />;

  if (game.status === GameStatus.Started) {
    if (goodAnswer) return <GameAnswer game={game} goodAnswer={goodAnswer} />;

    return <GameFindMusic game={game} />;
  }
  if (game.status === GameStatus.Finished) return <GameEnded game={game} />;

  return <Typography>Loading...</Typography>;
}

import { LoadingButton } from "@mui/lab";
import { Box, Grid, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import GameAnswer from "../../../components/GameAnswer/GameAnswer";
import GameEnded from "../../../components/GameEnded/GameEnded";
import GameTitle from "../../../components/GameTitle/GameTitle";
import PlayersScore from "../../../components/PlayersScore/PlayersScore";
import { useAppDispatch, useAppSelector } from "../../../hooks/reducer";
import useAudio from "../../../hooks/useAudio";
import { CreateAnswerDto } from "../../../models/Answer";
import { GameStatus, IGame } from "../../../models/Game";
import { IPlayer } from "../../../models/Player";
import { clearAll, resetNextQuestion, resetSendAnswerStatus, sendAnswer, WaitingAreaStatus } from "../../../reducers/waitingAreaSlice";
import { RouteUrls, serverUrl } from "../../../utility/config";
import { tryFetch } from "../../../utility/utility";

export default function Quiz({ game, players }: { game: IGame; players: IPlayer[] }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { stopAudio } = useAudio(game.currentTrackPreview);

  const { currentPlayer, sendAnswerStatus, nextQuestionStatus } = useAppSelector((state) => state.waitingArea);

  const [showGoodAnswer, setShowGoodAnswer] = useState(false);
  const [answerSelected, setAnswerSelected] = useState<string | undefined>(undefined);

  const onClick = (answer: string) => {
    if (!currentPlayer) return;

    const createAnswerDto: CreateAnswerDto = { answer, playerId: currentPlayer._id };
    dispatch(sendAnswer({ gameId: game._id, createAnswerDto }));
    setAnswerSelected(answer);
  };

  // Triggered after sending the answer
  useEffect(() => {
    if (sendAnswerStatus === WaitingAreaStatus.Finished) {
      dispatch(resetSendAnswerStatus());
      setShowGoodAnswer(true);
      router.replace(router.asPath); // reload props
      stopAudio();
    }
  }, [dispatch, game._id, router, sendAnswerStatus, stopAudio]);

  // Triggered after sending the next question
  useEffect(() => {
    if (nextQuestionStatus === WaitingAreaStatus.Finished) {
      dispatch(resetNextQuestion());
      setShowGoodAnswer(false);
      router.replace(router.asPath); // reload props
    }
  }, [dispatch, nextQuestionStatus, router]);

  // Triggered when component is unmounted
  useEffect(() => {
    return () => {
      dispatch(clearAll());
    };
  }, [dispatch]);

  // Triggered when component is mounted to check if there is a currentPlayer
  useEffect(() => {
    if (!currentPlayer) router.push(RouteUrls.NewQuiz);
  }, [currentPlayer, router]);

  if (game.status === GameStatus.Finished) return <GameEnded game={game} players={players} />;

  return (
    <>
      <GameTitle game={game} />

      <Grid container justifyContent="space-evenly" spacing={4}>
        <Grid item>
          {showGoodAnswer ? (
            <GameAnswer game={game} answerSelected={answerSelected ?? ""} />
          ) : (
            <Grid container alignItems="center" justifyContent="center" spacing={2}>
              {game.currentAnswerSuggestions.map((answer) => (
                <Grid item xs={12} sm={6} key={answer} textAlign="center">
                  <LoadingButton
                    loading={sendAnswerStatus === WaitingAreaStatus.Loading}
                    variant="outlined"
                    onClick={() => {
                      onClick(answer);
                    }}
                  >
                    {answer}
                  </LoadingButton>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
        <Grid item>
          <PlayersScore game={game} players={players} />
        </Grid>
      </Grid>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  const game = await tryFetch<IGame>(`${serverUrl}/api/game/${id}`);

  if (!game) {
    context.res.writeHead(400, { Location: RouteUrls.NewQuiz });
    context.res.end();

    return { props: {} };
  }

  const players = await tryFetch<IPlayer[]>(`${serverUrl}/api/game/${id}/players`);

  return {
    props: {
      game,
      players,
    },
  };
};

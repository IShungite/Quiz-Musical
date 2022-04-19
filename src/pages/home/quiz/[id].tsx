import { Box, Button, Grid, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import GameAnswer from "../../../components/GameAnswer/GameAnswer";
import GameEnded from "../../../components/GameEnded/GameEnded";
import PlayersScore from "../../../components/PlayersScore/PlayersScore";
import { useAppDispatch, useAppSelector } from "../../../hooks/reducer";
import useAudio from "../../../hooks/useAudio";
import { CreateAnswerDto } from "../../../models/Answer";
import { GameStatus, IGame } from "../../../models/Game";
import { IPlayer } from "../../../models/Player";
import { clearAll, resetNextQuestion, sendAnswer, WaitingAreaStatus } from "../../../reducers/waitingAreaSlice";
import { RouteUrls, serverUrl } from "../../../utility/config";
import { tryFetch } from "../../../utility/utility";

export default function Quiz({ game, players }: { game: IGame; players: IPlayer[] }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { stopAudio } = useAudio(game.currentTrackPreview);

  const { currentPlayer, sendAnswerStatus, nextQuestionStatus } = useAppSelector((state) => state.waitingArea);

  const [showGoodAnswer, setShowGoodAnswer] = useState(false);

  const onClick = (answer: string) => {
    if (!currentPlayer) return;

    const createAnswerDto: CreateAnswerDto = { answer, playerId: currentPlayer._id };
    dispatch(sendAnswer({ gameId: game._id, createAnswerDto }));
  };

  useEffect(() => {
    if (sendAnswerStatus === WaitingAreaStatus.Finished) {
      setShowGoodAnswer(true);
      stopAudio();
    }
  }, [dispatch, game._id, sendAnswerStatus, stopAudio]);

  useEffect(() => {
    if (nextQuestionStatus === WaitingAreaStatus.Finished) {
      dispatch(resetNextQuestion());
      setShowGoodAnswer(false);
      router.replace(router.asPath); // reload props
    }
  }, [dispatch, nextQuestionStatus, router]);

  useEffect(() => {
    return () => {
      dispatch(clearAll());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!currentPlayer) router.push(RouteUrls.NewQuiz);
  }, []);

  if (game.status === GameStatus.Finished) return <GameEnded game={game} players={players} />;

  if (showGoodAnswer) {
    return <GameAnswer game={game} />;
  }

  return (
    <>
      <Box textAlign="center" sx={{ mb: 5 }}>
        <Typography variant="h2">Quel est le nom de l&apos;artiste ?</Typography>
        <Typography variant="h4">
          {game.currentTrackNb}/{game.maxTracks}
        </Typography>
      </Box>

      <Grid container justifyContent="space-evenly" spacing={4}>
        <Grid item>
          <Grid container alignItems="center" justifyContent="center" spacing={2}>
            {game.currentAnswerSuggestions.map((answer) => (
              <Grid item xs={12} sm={6} key={answer} textAlign="center">
                <Button
                  variant="outlined"
                  onClick={() => {
                    onClick(answer);
                  }}
                >
                  {answer}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item>
          <PlayersScore players={players} />
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

import { Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/reducer";
import useAudio from "../../../hooks/useAudio";
import { CreateAnswerDto } from "../../../models/Answer";
import { IGame } from "../../../models/Game";
import { IPlayer } from "../../../models/Player";
import { clearState, nextQuestion, resetNextQuestion, sendAnswer, WaitingAreaStatus } from "../../../reducers/waitingAreaSlice";
import { RouteUrls } from "../../../utility/config";

export default function Quiz({ game, players }: { game: IGame; players: IPlayer[] }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { stopAudio } = useAudio(game.currentTrackPreview);

  const { currentPlayer, sendAnswerStatus, nextQuestionStatus } = useAppSelector((state) => state.waitingArea);

  const onClick = (answer: string) => {
    if (!currentPlayer) return;

    const createAnswerDto: CreateAnswerDto = { answer, playerId: currentPlayer._id };
    dispatch(sendAnswer({ gameId: game._id, createAnswerDto }));
  };

  useEffect(() => {
    if (sendAnswerStatus === WaitingAreaStatus.Finished) {
      dispatch(nextQuestion(game._id));
    }
  }, [dispatch, game._id, sendAnswerStatus]);

  useEffect(() => {
    if (nextQuestionStatus === WaitingAreaStatus.Finished) {
      dispatch(resetNextQuestion());
      stopAudio();
      router.replace(router.asPath);
    }
  }, [dispatch, nextQuestionStatus, router, stopAudio]);

  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, [dispatch]);

  if (!currentPlayer) {
    return router.push(RouteUrls.NewQuiz);
  }

  return (
    <>
      <Box textAlign="center" sx={{ mb: 5 }}>
        <Typography variant="h2">Quel est le nom de l&apos;artiste ?</Typography>
      </Box>

      <Grid container justifyContent="space-evenly">
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
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Rang</TableCell>
                  <TableCell align="left">Nom</TableCell>
                  <TableCell align="left">Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {players.map((player, i) => (
                  <TableRow key={player._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell align="left">{i + 1}</TableCell>
                    <TableCell align="left">{player.name}</TableCell>
                    <TableCell align="left">{player.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  const response = await fetch(`http://localhost:3000/api/game/${id}`);
  const game: IGame = (await response.json()).data;

  if (!game) {
    context.res.writeHead(400, { Location: RouteUrls.NewQuiz });
    context.res.end();

    return { props: {} };
  }

  const response2 = await fetch(`http://localhost:3000/api/game/${id}/players`);
  const players: IPlayer[] = (await response2.json()).data;

  return {
    props: {
      game,
      players,
    },
  };
};

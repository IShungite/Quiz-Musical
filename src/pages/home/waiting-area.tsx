import { Box, Button, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reducer";
import { clearState, nextQuestion, startGame, WaitingAreaStatus } from "../../reducers/waitingAreaSlice";
import { RouteUrls } from "../../utility/config";

export default function WaitingArea() {
  const { game, startGameStatus } = useAppSelector((state) => state.waitingArea);

  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (startGameStatus === WaitingAreaStatus.Finished && game) {
      console.log("redirecting to game");
      router.push(`${RouteUrls.Quiz}/${game._id}`);
      dispatch(clearState());
    }
  }, [router, startGameStatus]);

  if (!game) {
    router.push(RouteUrls.NewQuiz);
    return null;
  }

  const onClickPlay = () => {
    dispatch(startGame(game._id));
  };

  return (
    <>
      <Box textAlign="center">
        <Typography variant="h2">Salle d&apos;attente</Typography>
      </Box>

      <Typography variant="h4">Mode: {game.mode}</Typography>
      <Typography variant="h4">Joueurs</Typography>
      <Grid container>
        {game.playersId.map((playerId) => (
          <Grid item xs={12} sm={6} md={4} key={playerId}>
            - {playerId}
          </Grid>
        ))}
      </Grid>

      <Box textAlign="center">
        <Button variant="outlined" onClick={onClickPlay}>
          Jouer
        </Button>
      </Box>
    </>
  );
}

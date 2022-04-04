import { Box, Button, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { useAppSelector } from "../../hooks/reducer";
import { RouteUrls } from "../../utility/config";

export default function WaitingArea() {
  const { game } = useAppSelector((state) => state.waitingArea);

  const router = useRouter();

  if (!game) {
    router.push(RouteUrls.NewQuiz);
    return null;
  }

  return (
    <>
      <Box textAlign="center">
        <Typography variant="h2">Salle d&apos;attente</Typography>
      </Box>

      <Typography variant="h4">Mode: {game.mode}</Typography>
      <Typography variant="h4">Joueurs</Typography>
      <Grid container>
        {game.players.map((player) => (
          <Grid item xs={12} sm={6} md={4} key={player.id}>
            - {player.name}
          </Grid>
        ))}
      </Grid>

      <Box textAlign="center">
        <Button variant="outlined">Jouer</Button>
      </Box>
    </>
  );
}

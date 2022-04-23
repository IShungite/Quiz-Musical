import { Box, Typography } from "@mui/material";
import React from "react";
import { useAppSelector } from "../../hooks/reducer";
import { IGame } from "../../models/Game";
import PlayersScore from "../PlayersScore/PlayersScore";

export default function GameFinished({ game }: { game: IGame }) {
  const { players } = useAppSelector((state) => state.quiz);

  return (
    <>
      <Box textAlign="center" sx={{ mb: 5 }}>
        <Typography variant="h2">Partie terminée!</Typography>
      </Box>
      <PlayersScore game={game} players={players}></PlayersScore>
    </>
  );
}

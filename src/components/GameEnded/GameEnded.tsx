import { Box, Typography } from "@mui/material";
import React from "react";
import { IGame } from "../../models/Game";
import { IPlayer } from "../../models/Player";
import PlayersScore from "../PlayersScore/PlayersScore";

export default function GameEnded({ game, players }: { game: IGame; players: IPlayer[] }) {
  return (
    <>
      <Box textAlign="center" sx={{ mb: 5 }}>
        <Typography variant="h2">Partie terminée!</Typography>
      </Box>
      <PlayersScore players={players}></PlayersScore>
    </>
  );
}

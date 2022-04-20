import { Box, Typography } from "@mui/material";
import React from "react";
import { IGame } from "../../models/Game";

export default function GameTitle({ game }: { game: IGame }) {
  return (
    <Box textAlign="center" sx={{ mb: 5 }}>
      <Typography variant="h2">Quel est le nom de l&apos;artiste ?</Typography>
      <Typography variant="h4">
        {game.currentTrackNb}/{game.maxTracks}
      </Typography>
    </Box>
  );
}

import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import CreatePlayerDialog from "../../components/CreatePlayerDialog/CreatePlayerDialog";
import PlaylistsGrid from "../../components/PlaylistsGrid/PlaylistsGrid";
import SearchBar from "../../components/SearchBar/SearchBar";
import { useAppSelector } from "../../hooks/reducer";

export default function NewQuiz() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { currentPlayer } = useAppSelector((state) => state.quiz);

  useEffect(() => {
    if (!currentPlayer) {
      setDialogOpen(true);
    }
  }, [currentPlayer]);

  return (
    <>
      <Box textAlign="center">
        <Typography variant="h2">Chercher une playlist</Typography>
      </Box>
      <SearchBar />
      <PlaylistsGrid />
      <CreatePlayerDialog open={dialogOpen} setOpen={setDialogOpen} />
    </>
  );
}

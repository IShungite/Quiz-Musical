import { Box, Typography } from "@mui/material";
import React from "react";
import PlaylistsGrid from "../../components/PlaylistsGrid/PlaylistsGrid";
import SearchBar from "../../components/SearchBar/SearchBar";

export default function NewQuiz() {
  return (
    <>
      <Box textAlign="center">
        <Typography variant="h2">Search for a playlist</Typography>
      </Box>
      <SearchBar />
      <PlaylistsGrid />
    </>
  );
}

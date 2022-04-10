import { Grid } from "@mui/material";
import React from "react";
import { useAppSelector } from "../../hooks/reducer";
import MusicCard from "../MusicCard/MusicCard";

export default function PlaylistsGrid() {
  const { playlists } = useAppSelector((state) => state.playlist);

  return (
    <Grid container spacing={2} justifyContent="center">
      {playlists.map((playlist) => (
        <Grid item key={playlist.id}>
          <MusicCard playlist={playlist} />
        </Grid>
      ))}
    </Grid>
  );
}

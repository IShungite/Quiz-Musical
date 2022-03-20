import React from "react";
import { Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";
import { Playlist } from "../../models/Playlist";

type Props = {
  playlist: Playlist;
};

export default function MusicCard({ playlist }: Props) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia component="img" height="200" image={playlist.images[0].url} alt="green iguana" />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {playlist.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {playlist.description.includes("<a href") ? "Spotify playlist" : playlist.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

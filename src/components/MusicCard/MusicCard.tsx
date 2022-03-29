import React from "react";
import { Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";
import { Playlist } from "../../models/Playlist";
import deezerApi from "../../utility/deezerApi";

type Props = {
  playlist: Playlist;
};

export default function MusicCard({ playlist }: Props) {
  const playSong = () => {
    fetchTracks();
  };

  const fetchTracks = async () => {
    const tracks = await deezerApi.getPlaylistTracks(playlist.id);

    const audio = new Audio(tracks[0].preview);
    audio.play();
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea onClick={playSong}>
        <CardMedia component="img" height="200" image={playlist.picture} alt="green iguana" />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {playlist.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {playlist.user.name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

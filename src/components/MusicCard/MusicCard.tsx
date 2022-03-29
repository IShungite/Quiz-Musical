import React from "react";
import { Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";
import { Playlist } from "../../models/Playlist";
import useSpotify from "../../hooks/useSpotify";
import { Track } from "../../models/Tracks";

type Props = {
  playlist: Playlist;
};

export default function MusicCard({ playlist }: Props) {
  const spotifyApi = useSpotify();

  const playSong = () => {
    fetchTracks();

    // console.log(playlist);
    // spotifyApi.play({ uris: [playlist.uri] });

    // spotifyApi.play({ context_uri: playlist.uri });
  };

  const fetchTracks = async () => {
    const response = await fetch(playlist.tracks.href, {
      headers: {
        Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
      },
    }).then((res) => res.json());

    spotifyApi.play({ uris: response.items.map((item: Track) => item.track.uri) });
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea onClick={playSong}>
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
